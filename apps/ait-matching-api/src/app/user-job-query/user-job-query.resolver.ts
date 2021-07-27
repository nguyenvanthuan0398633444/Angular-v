import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Utils } from '@ait/shared';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserJobQueryRequest } from './user-job-query.request';
import { UserJobQueryResponse } from './user-job-query.response';

@Resolver()
export class UserJobQueryResolver extends AitBaseService {
  collection = 'user-job-query';

  @Query(() => UserJobQueryResponse, { name: 'findUserJobQuery' })
  findUserJobQuery(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobQueryRequest }) request: UserJobQueryRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => UserJobQueryResponse, { name: 'saveUserJobQuery' })
  saveUserJobQuery(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobQueryRequest }) request: UserJobQueryRequest
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = request.data[0] as any;
    data.residence_status = Utils.getKeys(data.residence_status);
    data.salary_type = Utils.getKey(data.salary_type);
    data.business = Utils.getKeys(data.business);
    data.desired_occupation = Utils.getKey(data.desired_occupation);
    data.prefecture = Utils.getKeys(data.prefecture);

    return this.save(request, user);
  }

  @Mutation(() => UserJobQueryResponse, { name: 'removeUserJobQuery' })
  removeUserJobQuery(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobQueryRequest }) request: UserJobQueryRequest
  ) {
    return this.remove(request, user);
  }
}
