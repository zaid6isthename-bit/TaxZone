import { SupabaseClient } from '@supabase/supabase-js';

function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapKeysDeep(obj: any, fn: (k: string) => string): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(v => mapKeysDeep(v, fn));
  if (typeof obj !== 'object') return obj;
  const r: any = {};
  for (const [k, v] of Object.entries(obj)) r[fn(k)] = mapKeysDeep(v, fn);
  return r;
}

function toSnake(val: any): any {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) return val.map(toSnake);
  if (typeof val !== 'object') return val;
  const entries = Object.entries(val) as [string, any][];
  const r: any = {};
  for (const [k, v] of entries) {
    if (k === 'OR' || k === 'NOT' || k === 'AND') { r[k] = v.map(toSnake); continue; }
    if (k === '_count') continue;
    r[camelToSnake(k)] = v instanceof Date ? v.toISOString() : toSnake(v);
  }
  return r;
}

function buildSelect(include: any): string {
  if (!include) return '*';
  const parts: string[] = [];
  for (const [key, val] of Object.entries(include)) {
    if (key === '_count') continue;
    const rel = camelToSnake(key);
    if (typeof val === 'object' && val !== null) {
      const v = val as any;
      let inner: string;
      if (v.select) {
        const fields = Object.keys(v.select).map(f => {
          const fv = v.select[f];
          if (typeof fv === 'object' && fv !== null && fv.select) {
            const fk = camelToSnake(f);
            const subFields = Object.keys(fv.select).join(',');
            return `${fk}(${subFields})`;
          }
          return camelToSnake(f);
        });
        inner = fields.join(',');
      } else if (v.include) {
        inner = buildSelect(v.include).replace(/^\*,?/, '');
      } else {
        inner = '*';
      }
      parts.push(`${rel}(${inner})`);
    } else {
      parts.push(rel);
    }
  }
  return parts.length ? `*,${parts.join(',')}` : '*';
}

function applyFilters(q: any, where: any): any {
  if (!where) return q;
  for (const [k, v] of Object.entries(where)) {
    const col = camelToSnake(k);

    if (k === 'OR') {
      const clauses: string[] = [];
      for (const cond of v as any[]) {
        for (const [ck, cv] of Object.entries(cond)) {
          const cc = camelToSnake(ck);
          if (cv === null) clauses.push(`${cc}.is.null`);
          else if (typeof cv === 'object' && cv !== null && 'contains' in cv)
            clauses.push(`${cc}.ilike.*${cv['contains']}*`);
          else clauses.push(`${cc}.eq.${cv}`);
        }
      }
      q = q.or(clauses.join(','));
      continue;
    }

    if (v === null) { q = q.is(col, null); continue; }
    if (typeof v !== 'object') { q = q.eq(col, v); continue; }

    if ('not' in v && v['not'] === null) { q = q.not(col, 'is', null); continue; }
    if ('in' in v) { q = q.in(col, v['in']); continue; }
    if ('contains' in v) {
      q = (v as any).mode === 'insensitive' ? q.ilike(col, `%${v['contains']}%`) : q.like(col, `%${v['contains']}%`);
      continue;
    }
    if ('gte' in v) { q = q.gte(col, v['gte'] instanceof Date ? v['gte'].toISOString() : v['gte']); continue; }
    if ('gt' in v) { q = q.gt(col, v['gt'] instanceof Date ? v['gt'].toISOString() : v['gt']); continue; }
    if ('lte' in v) { q = q.lte(col, v['lte']); continue; }
    if ('lt' in v) { q = q.lt(col, v['lt']); continue; }
  }
  return q;
}

function applySort(q: any, orderBy: any): any {
  if (!orderBy) return q;
  const arr = Array.isArray(orderBy) ? orderBy : [orderBy];
  for (const o of arr) {
    const [k, dir] = Object.entries(o)[0];
    q = q.order(camelToSnake(k), { ascending: dir === 'asc' });
  }
  return q;
}

export class PrismaModel {
  constructor(private table: string, private db: SupabaseClient) {}
  get supabase() { return this.db; }

  async findUnique(opts: { where: any; include?: any }): Promise<any> {
    let q = this.db.from(this.table).select(buildSelect(opts.include));
    q = applyFilters(q, opts.where);
    const { data, error } = await q.single();
    if (error) { if ((error as any).code === 'PGRST116') return null; throw error; }
    return mapKeysDeep(data, snakeToCamel);
  }

  async findFirst(opts: { where?: any; include?: any; orderBy?: any }): Promise<any> {
    let q = this.db.from(this.table).select(buildSelect(opts.include)).limit(1).maybeSingle();
    q = applyFilters(q, opts.where);
    q = applySort(q, opts.orderBy);
    const { data, error } = await q;
    if (error) throw error;
    return data ? mapKeysDeep(data, snakeToCamel) : null;
  }

  async findMany(opts: { where?: any; include?: any; orderBy?: any; skip?: number; take?: number; select?: any }): Promise<any[]> {
    let q = this.db.from(this.table).select(buildSelect(opts.include));
    q = applyFilters(q, opts.where);
    q = applySort(q, opts.orderBy);
    if (opts.skip !== undefined && opts.take !== undefined)
      q = q.range(opts.skip, opts.skip + opts.take - 1);
    else if (opts.take !== undefined)
      q = q.limit(opts.take);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((r: any) => mapKeysDeep(r, snakeToCamel));
  }

  async create(opts: { data: any; include?: any }): Promise<any> {
    const { data, error } = await this.db.from(this.table)
      .insert(toSnake(opts.data))
      .select(buildSelect(opts.include))
      .single();
    if (error) throw error;
    return mapKeysDeep(data, snakeToCamel);
  }

  async update(opts: { where: any; data: any; include?: any }): Promise<any> {
    let q = this.db.from(this.table).update(toSnake(opts.data)).select(buildSelect(opts.include));
    q = applyFilters(q, opts.where);
    const { data, error } = await q.single();
    if (error) throw error;
    return mapKeysDeep(data, snakeToCamel);
  }

  async updateMany(opts: { where: any; data: any }): Promise<any> {
    let q = this.db.from(this.table).update(toSnake(opts.data));
    q = applyFilters(q, opts.where);
    const { error } = await q;
    if (error) throw error;
    return { count: 0 };
  }

  async count(opts: { where?: any }): Promise<number> {
    let q = this.db.from(this.table).select('*', { count: 'exact', head: true });
    q = applyFilters(q, opts.where);
    const { count, error } = await q;
    if (error) throw error;
    return count || 0;
  }

  async groupBy(opts: { by: string[]; where?: any; _count?: any }): Promise<any[]> {
    let q = this.db.from(this.table).select('*');
    q = applyFilters(q, opts.where);
    const { data, error } = await q;
    if (error) throw error;
    const groups: Record<string, any> = {};
    for (const row of data || []) {
      const key = opts.by.map(b => row[camelToSnake(b)]).join('|');
      if (!groups[key]) {
        const base: any = { _count: 0 };
        for (const b of opts.by) base[b] = row[camelToSnake(b)];
        groups[key] = base;
      }
      groups[key]._count++;
    }
    return Object.values(groups);
  }
}
