import { isObjectFull } from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class SyncPeHistoryService extends AitBaseService {
  collection = 'sync_pe_history';
  find_sync_pe_history = 'findSyncPeHistory';
  returnFields = {
    company: true,
    _key: true,
    config_key: true,
    database: true,
    record_per_time: true,
    steps: true,
    count: true,
    status: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
  };

  async getInfoHistory(rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = {
      create_by: {}
    };
    return await this.query(this.find_sync_pe_history, request, returnFields);
  } 

}
