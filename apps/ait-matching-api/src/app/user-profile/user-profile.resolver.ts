/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, GqlAuthGuard, SysUser } from '@ait/core';
import { Utils } from '@ait/shared';
import { UseGuards } from '@nestjs/common';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserProfileRequest } from './user-profile.request';
import { UserProfileResponse } from './user-profile.response';

@UseGuards(GqlAuthGuard)
@Resolver()
export class UserProfileResolver extends AitBaseService {
  collection = 'user-profile';

  @Query(() => UserProfileResponse, { name: 'findUserProfile' })
  async findUserProfile(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
    const result = await this.find(request, user);
    
    return result;
  }

  @Mutation(() => UserProfileResponse, { name: 'saveUserProfile' })
  saveUserProfile(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
    const data = request.data[0] as any;
    data.emp_type = Utils.getKey(data.emp_type);
    data.gender = Utils.getKey(data.gender);
    data.country = Utils.getKey(data.country);
    data.residence_status = Utils.getKey(data.residence_status);
    data.occupation = Utils.getKey(data.occupation);
    data.no3_exam_dept_pass = Utils.getKey(data.no3_exam_dept_pass);
    data.no3_exam_practice_pass = Utils.getKey(data.no3_exam_practice_pass);
    return this.save(request, user);
  }

  @Mutation(() => UserProfileResponse, { name: 'removeUserProfile' })
  removeUserProfile(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
    return this.remove(request, user);
  }
}
