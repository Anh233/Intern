import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Action } from '../enums/action.enum';

@Injectable()
export class ActionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const actions = this.reflector.get<Action[]>(
      'actions',
      context.getHandler(),
    );
    if (!actions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return actions.some((action) => user.permissions.includes(action));
  }
}
