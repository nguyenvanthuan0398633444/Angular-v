import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { KeyValueDto, RESULT_STATUS } from '@ait/shared';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserJobSettingRequest } from './user-job-setting.request';
import { UserJobSettingResponse } from './user-job-setting.response';

@Resolver()
export class UserJobSettingResolver extends AitBaseService {
  collection = 'UserJobSetting';

  @Query(() => UserJobSettingResponse, { name: 'findUserJobSetting' })
  async findUserJobSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest }) request: UserJobSettingRequest
  ) {

    let result = await this.find(request, user);
    //get master data by class
    const requestMasterData = {
      company: request.company,
      lang: request.lang,
      collection: 'sys_master_data',
      user_id: request.user_id,
      condition: {
        class:
        {
          operator: 'IN',
          value: ["JOB_BUSINESS", "JOB_PREFECTURE", "JOB_RESIDENCE_STATUS"],
          ref_collection: 'sys_master_data'
        }
      }
    }
    const rest_master_data = await this.find(requestMasterData, user);
    if (rest_master_data.status === RESULT_STATUS.OK) {
      const data = rest_master_data?.data;
      const job_b = data.filter(d => d.class === "JOB_BUSINESS");
      const job_p = data.filter(d => d.class === "JOB_PREFECTURE");
      const job_r = data.filter(d => d.class === "JOB_RESIDENCE_STATUS");
      const job_settings = result?.data[0]
      result = {
        ...result,
        data: [
          {
            ...result?.data[0],
            business: this.getMasterDataArray(job_settings?.business, job_b),
            residence_status: this.getMasterDataArray(job_settings?.residence_status, job_r),
            prefecture: this.getMasterDataArray(job_settings?.prefecture, job_p),
          }
        ]
      }
    }


    return result;
  }

  private getMasterDataArray(data: string[], dataMaster: any[]): KeyValueDto[] {
    let res = [];
    if (data?.length > 0) {
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

  @Mutation(() => UserJobSettingResponse, { name: 'saveUserJobSetting' })
  saveUserJobSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest }) request: UserJobSettingRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserJobSettingResponse, { name: 'removeUserJobSetting' })
  removeUserJobSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest }) request: UserJobSettingRequest
  ) {
    return this.remove(request, user);
  }
}
