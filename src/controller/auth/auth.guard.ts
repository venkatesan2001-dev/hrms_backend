import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DefaultMessage, ResponseStatus } from '../../constants';
import { AuthService } from './auth.service';
import { extractTokenFromHeader } from '../../utils/extract-token';
import { convertToUppercase } from '../../utils/querybuilder';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let verify_token: {};
    try {
      verify_token = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      const error_message = convertToUppercase(error.message);
      throw new HttpException(
        DefaultMessage[error_message],
        ResponseStatus.BAD_REQUEST,
      );
    }
    const data = await this.authService.findOne({ _id: verify_token['id'] });
    if (!data) {
      throw new HttpException(
        DefaultMessage.AUTHORIZATION_FAILED,
        ResponseStatus.FORBIDDEN,
      );
    }
    if (!data.status) {
      throw new HttpException(
        DefaultMessage.INACTIVE_USER,
        ResponseStatus.FORBIDDEN,
      );
    }
    const objData = data.toObject();
    delete objData.password;
    request['user'] = objData;
    return objData;
  }
}
