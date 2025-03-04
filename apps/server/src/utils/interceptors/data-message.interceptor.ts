import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class DataMessageInterceptor<T>
  implements NestInterceptor<T, { message: string; data: T }>
{
  constructor(private readonly message: string) {}

  intercept(_: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((data) => {
        return {
          message: this.message,
          data,
        };
      }),
    );
  }
}
