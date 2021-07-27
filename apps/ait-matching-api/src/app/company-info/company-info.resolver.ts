/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Utils } from '@ait/shared';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { CompanyInfoRequest } from './company-info.request';
import { CompanyInfoResponse } from './company-info.response';

@Resolver()
export class CompanyInfoResolver extends AitBaseService {
  collection = 'CompanyInfo';

  @Query(() => CompanyInfoResponse, { name: 'findCompanyInfo' })
  findCompanyInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CompanyInfoRequest }) request: CompanyInfoRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => CompanyInfoResponse, { name: 'saveCompanyInfo' })
  saveCompanyInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CompanyInfoRequest }) request: CompanyInfoRequest
  ) {
    const data = request.data[0] as any;
    data.occupation = Utils.getKey(data.occupation);
    data.work = Utils.getKey(data.work);
    data.business = Utils.getKey(data.business);
    data.size = Utils.getKey(data.size);
    
    return this.save(request, user);
  }

  @Mutation(() => CompanyInfoResponse, { name: 'removeCompanyInfo' })
  removeCompanyInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CompanyInfoRequest }) request: CompanyInfoRequest
  ) {
    return this.remove(request, user);
  }
}
