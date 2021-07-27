import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Utils } from '@ait/shared';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserCertificateAwardRequest } from './user-certificate-award.request';
import { UserCertificateAwardResponse } from './user-certificate-award.response';

@Resolver()
export class UserCertificateAwardResolver extends AitBaseService {
  collection = 'user-certificate-award';

  @Query(() => UserCertificateAwardResponse, { name: 'findUserCertificateAward' })
  findUserCertificateAward(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserCertificateAwardRequest }) request: UserCertificateAwardRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => UserCertificateAwardResponse, { name: 'saveUserCertificateAward' })
  saveUserCertificateAward(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserCertificateAwardRequest }) request: UserCertificateAwardRequest
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = request.data[0] as any;
    data.japanese_skill = Utils.getKey(data.japanese_skill);
    return this.save(request, user);
  }

  @Mutation(() => UserCertificateAwardResponse, { name: 'removeUserCertificateAward' })
  removeUserCertificateAward(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserCertificateAwardRequest }) request: UserCertificateAwardRequest
  ) {
    return this.remove(request, user);
  }
}
