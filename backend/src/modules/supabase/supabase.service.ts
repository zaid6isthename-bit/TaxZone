import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: ReturnType<typeof createClient>;

  onModuleInit() {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
  }

  get storage(): any {
    return this.client.storage;
  }

  get auth(): any {
    return this.client.auth;
  }

  get admin(): any {
    return this.client.auth.admin;
  }
}
