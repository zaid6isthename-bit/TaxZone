import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomUUID } from 'crypto';

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    requestId: string;
    page?: number;
    limit?: number;
    total?: number;
  };
  error: null | { message: string; code: string };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    const requestId = randomUUID();
    return next.handle().pipe(
      map((data) => {
        const responseData = data?.data !== undefined ? data.data : data;
        const meta = data?.meta || { requestId };
        if (!meta.requestId) meta.requestId = requestId;

        return {
          success: true,
          data: responseData,
          meta,
          error: null,
        };
      }),
    );
  }
}
