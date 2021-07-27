/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObjectFull } from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiConfig, Enforcement } from '../../pages/aureole-v/interface';

@Injectable({ providedIn: 'root' })
export class SyncApiConfigService extends AitBaseService {
  sys_key = new BehaviorSubject<string>('');
  collection = 'sync_api_config';
  find = 'findSyncApiConfig';
  save = 'saveSyncApiConfig';
  remove = 'removeSyncApiConfig';
  returnFields = {
    company: true,
    _key: true,
    name: true,
    api_url: true,
    http_method: true,
    api_key: true,
    database: true,
    params: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
  };

  private enforcementUrl = '/recommenced-user/enforcement-webdb';

  async getSyncApiConfig(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(this.find, request, returnFields);
  }

  async saveApiConfig(data: ApiConfig[], rf? : any) {
    const returnFields = rf ? rf : this.returnFields;
    return await this.mutation(this.save, this.collection, data, returnFields);
  }

  async removeApiConfig(_key: string) {
    const returnFields = { _key: true };
    const data = [{_key}];
    return await this.mutation(this.remove, this.collection, data, returnFields);
  }

  async enforcementWebDb(data: Enforcement[]) {
    return await this.post(this.enforcementUrl, { data }).toPromise();
  }

}
