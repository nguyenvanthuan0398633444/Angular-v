/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { hasLength, RESULT_STATUS } from '@ait/shared';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SyncApiConfigEntity } from './sync-api-config.entity';
import { SyncApiConfigRequest } from './sync-api-config.request';
import { SyncApiConfigResponse } from './sync-api-config.response';

@Resolver()
export class SyncApiConfigResolver extends AitBaseService {

  @Query(() => SyncApiConfigResponse, { name: 'findSyncApiConfig' })
  async findSyncApiConfig(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SyncApiConfigRequest }) request: SyncApiConfigRequest
  ) {
    const result = await this.find(request, user);
    if (result.status === RESULT_STATUS.OK && hasLength(result.data)) {
      result.data.forEach((item: SyncApiConfigEntity) => {
        if (item.params) {
          item.params = JSON.stringify(item.params) as string;
        }
      })
    }
    return result;
  }

  @Mutation(() => SyncApiConfigResponse, { name: 'saveSyncApiConfig' })
  async saveSyncApiConfig(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SyncApiConfigRequest }) request: SyncApiConfigRequest
  ) {
    const data = request.data[0] as any;
    data.params && (data.params = JSON.parse(data.params));
    const result = await this.save(request, user);
    if (result.status === RESULT_STATUS.OK) {
      result.data.forEach((data: any) => data.params && (data.params = JSON.stringify(data.params)));
    }
    return result;
  }

  @Mutation(() => SyncApiConfigResponse, { name: 'removeSyncApiConfig' })
  removeSyncApiConfig(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SyncApiConfigRequest }) request: SyncApiConfigRequest
  ) {
    return this.remove(request, user);
  }
}
