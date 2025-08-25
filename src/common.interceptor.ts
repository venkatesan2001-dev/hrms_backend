/* 
  https://docs.nestjs.com/interceptors#interceptors
*/
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CommonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(({ data = {}, message, success }) => ({
        success: success ? success : false,
        ...(message ? { message: message } : {}),
        ...data,
      })),
    );
  }
}
