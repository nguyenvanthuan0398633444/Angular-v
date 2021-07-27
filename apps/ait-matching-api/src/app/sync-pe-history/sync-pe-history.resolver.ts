import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { SyncPeHistoryRequest } from './sync-pe-history.request';
import { SyncPeHistoryResponse } from './sync-pe-history.response';

@Resolver()
export class SyncPeHistoryResolver extends AitBaseService {
  collection = 'sync_pe_history';

  @Query(() => SyncPeHistoryResponse, { name: 'findSyncPeHistory' })
  findSyncPeHistory(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SyncPeHistoryRequest }) request: SyncPeHistoryRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => SyncPeHistoryResponse, { name: 'saveSyncPeHistory' })
  saveSyncPeHistory(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SyncPeHistoryRequest }) request: SyncPeHistoryRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => SyncPeHistoryResponse, { name: 'removeSyncPeHistory' })
  removeSyncPeHistory(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SyncPeHistoryRequest }) request: SyncPeHistoryRequest
  ) {
    return this.remove(request, user);
  }
}
