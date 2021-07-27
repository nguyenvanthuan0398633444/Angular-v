/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, GqlAuthGuard, SysUser } from '@ait/core';
import { isObjectFull, RESULT_STATUS, Utils } from '@ait/shared';
import { UseGuards } from '@nestjs/common';
import { Resolver,  Mutation, Args } from '@nestjs/graphql';
import { UserInfoRequest } from './user-info.request';
import { UserInfoResponse } from './user-info.response';

@UseGuards(GqlAuthGuard)
@Resolver()
export class UserInfoResolver extends AitBaseService {
  @Mutation(() => UserInfoResponse, { name: 'saveUserInfo' })
  async saveUserInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserInfoRequest }) request: UserInfoRequest
  ) {
    const data = request.data[0];
    const userInfo = data['userInfo'];
    const userJobQuery = data['userJobQuery'];
    const userCertificate = data['userCertificate'];
    this.initialize(request, user);
    const dataSave = [];
      dataSave.push(this.getDataSaveUserInfo(userInfo));
      dataSave.push(this.getDataSaveUserJobQuery(userJobQuery));
      dataSave.push(this.getDataSaveUserCertificate(userCertificate));

    dataSave.map(item => {
      if (item._key) {
        this.setCommonUpdate(item);
      } else if (isObjectFull(item)) {
        this.setCommonInsert(item);
      }
    });

    const aqlStr = `
      let user_profile = (
        UPSERT {user_id: "${dataSave[0].user_id}"}
        INSERT ${JSON.stringify(dataSave[0])}
        UPDATE ${JSON.stringify(dataSave[0])} IN user_profile
        RETURN NEW
        )
        
        let user_job_query = (
        UPSERT {user_id: "${dataSave[1].user_id}"}
        INSERT ${JSON.stringify(dataSave[1])}
        UPDATE ${JSON.stringify(dataSave[1])} IN user_job_query
        RETURN NEW
        )
        
        let user_certificate_award = (
        UPSERT {user_id: "${dataSave[2].user_id}"}
        INSERT ${JSON.stringify(dataSave[2])}
        UPDATE ${JSON.stringify(dataSave[2])} IN user_certificate_award
        RETURN NEW
        )
        return user_profile[0]
    `;
    return await this.query(aqlStr);
  }

  @Mutation(() => UserInfoResponse, { name: 'removeUserInfo' })
  async removeUserInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserInfoRequest }) request: UserInfoRequest
  ) {
    const user_id = request.data[0].user_id;

    if (user_id) {
      const aqlStr = `
      let user_profile = (
      FOR data IN user_profile
      FILTER data.user_id == "${user_id}"
      UPDATE data WITH { del_flag: true } IN user_profile
      RETURN NEW
      )

      let user_job_query = (
      FOR data IN user_job_query
      FILTER data.user_id == "${user_id}"
      UPDATE data WITH { del_flag: true } IN user_job_query
      RETURN NEW
      )

      let user_certificate_award = (
      FOR data IN user_certificate_award
      FILTER data.user_id == "${user_id}"
      UPDATE data WITH { del_flag: true } IN user_certificate_award
      RETURN NEW
      )

      RETURN user_profile[0]
    `;
    return await this.query(aqlStr);
    } else {
      return new UserInfoResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }

  private getDataSaveUserInfo(data: any) {
    if (isObjectFull(data)) {
      data.emp_type = Utils.getKey(data.emp_type);
      data.gender = Utils.getKey(data.gender);
      data.country = Utils.getKey(data.country);
      data.residence_status = Utils.getKey(data.residence_status);
      data.occupation = Utils.getKey(data.occupation);
      data.no3_exam_dept_pass = Utils.getKey(data.no3_exam_dept_pass);
      data.no3_exam_practice_pass = Utils.getKey(data.no3_exam_practice_pass);
      return data;
    } else {
      return [];
    }
  }

  private getDataSaveUserJobQuery(data: any) {
    if (isObjectFull(data)) {
      data.residence_status = Utils.getKeys(data.residence_status);
      data.salary_type = Utils.getKey(data.salary_type);
      data.business = Utils.getKeys(data.business);
      data.desired_occupation = Utils.getKey(data.desired_occupation);
      data.prefecture = Utils.getKeys(data.prefecture);
      return data;
    } else {
      return [];
    }
  }

  private getDataSaveUserCertificate(data: any) {
    if (isObjectFull(data)) {
      data.japanese_skill = Utils.getKey(data.japanese_skill);
      return data;
    } else {
      return [];
    }
  }
}
