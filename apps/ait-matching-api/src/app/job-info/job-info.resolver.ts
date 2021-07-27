import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { JobInfoRequest } from './job-info.request';
import { JobInfoResponse } from './job-info.response';

@Resolver()
export class JobInfoResolver extends AitBaseService {
  collection = 'JobInfo';

  @Query(() => JobInfoResponse, { name: 'findJobInfo' })
  async findJobInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => JobInfoRequest }) request: JobInfoRequest
  ) {
    const result = await this.find(request, user);
    return result;
  }

  private getMasterDataArray(data: string[], dataMaster: any[]): KeyValueDto[] {
    let res = [];
    if (data.length !== 0) {
      res = data.map(d => {
        const ret = dataMaster.find(f => f.code === d);
        return {
          _key: ret?._key,
          value: ret?.name
        }
      })
      return res
    }
    return res;
  }

  @Mutation(() => JobInfoResponse, { name: 'saveJobInfo' })
  saveJobInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => JobInfoRequest }) request: JobInfoRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => JobInfoResponse, { name: 'removeJobInfo' })
  removeJobInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => JobInfoRequest }) request: JobInfoRequest
  ) {
    return this.remove(request, user);
  }
}
