import { AitBaseService, AitCtxUser } from '@ait/core';
import { Resolver,  Mutation, Args } from '@nestjs/graphql';
import { SysUserEntity } from './sys-user.entity';
import { SysUserRequest } from './sys-user.request';
import { SysUserResponse } from './sys-user.response';

@Resolver()
export class SysUserResolver extends AitBaseService {
  @Mutation(() => SysUserResponse, { name: 'newSysUser' })
  newSysUser(
    @AitCtxUser() user: SysUserEntity,
    @Args('request', { type: () => SysUserRequest }) request: SysUserRequest
  ) {
    return this.save(request, user);
  }
}
