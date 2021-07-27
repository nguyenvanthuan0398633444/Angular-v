import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommencedJobService extends AitBaseService {
  private searchUserUrl = environment.API_PATH.AUREOLEV.RECOMMENCED_JOB.SEARCH_USER;
  private getUserProfileUrl = environment.API_PATH.AUREOLEV.RECOMMENCED_JOB.GET_USER_PROFILE;
  private matchingUrl = environment.API_PATH.AUREOLEV.RECOMMENCED_JOB.MATCHING_USER;
  private urldetail = environment.API_PATH.AUREOLEV.RECOMMENCED_JOB.GET_DETAIL_MATCHING;
  private getTabSaveUrl = environment.API_PATH.AUREOLEV.RECOMMENCED_JOB.GET_TAB_SAVE;

  async searchUser(keyword: string) {
    return await this.post(this.searchUserUrl, { condition: { keyword } }).toPromise();
  }

  async getUserProfile(user_key: string | string[]) {
    return await this.post(this.getUserProfileUrl, { condition: { _key: user_key } }).toPromise();
  }

  async matchingUser(user_key: string, input_user?: string[]) {
    return await this.post(this.matchingUrl, { condition: { user_key, input_users: input_user || [] } }).toPromise();
  }

  async getDetailMatching(user_key: string, list_ids: string[]) {
    return await this.post(this.urldetail, { condition: { user_key, list_ids } }).toPromise();
  }

  async getDataTabSave(company_key: string) {
    return await this.post(this.getTabSaveUrl, { data: [{ list_keys: [company_key] }] }).toPromise();
  }
}
