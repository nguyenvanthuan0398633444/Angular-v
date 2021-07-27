import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JobService extends AitBaseService {


  findJobByCompanys = async (listKeys: string[]) => {

    const condition = {
      job_company: {
        value: [
          ...listKeys
        ]
      }
    }
    const specialKeys = [
      'desired_occupation', 'dormitory', 'experienced_occupation', 'gender', 'japanese_skill', 'salary_type', 'status', 'accommodation '];

    const keyMasterArray = [
      {
        att: 'residence_status',
        class: 'JOB_RESIDENCE_STATUS'
      },
      {
        att: 'business',
        class: 'JOB_BUSINESS'
      },
      {
        att: 'prefecture',
        class: 'JOB_PREFECTURE'
      }
    ]
    keyMasterArray.forEach(item => {
      condition[item.att] = {
        attribute: item.att,
        ref_attribute: 'code',
        ref_condition: {
          class: item.class
        }
      }
    })

    specialKeys.forEach(item => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code'
      }
    })

    return await this.query('findJobInfo', {
      collection: 'biz_job',
      condition
    }, {
      _key: true,
      accommodation: {
        _key: true,
        value: true,
      },
      age: true,
      benefit: true,
      business: {
        _key: true,
        value: true,
      },
      commission_amount: true,
      description: true,
      desired_occupation: {
        _key: true,
        value: true,
      },
      dormitory: {
        _key: true,
        value: true,
      },
      experienced_occupation: {
        _key: true,
        value: true,
      },
      gender: {
        _key: true,
        value: true,
      },
      holiday: true,
      japanese_skill: {
        _key: true,
        value: true,
      },
      job_company: true,
      method: true,
      prefecture: {
        _key: true,
        value: true,
      },
      probationary_period: true,
      remark: true,
      residence_status: {
        _key: true,
        value: true,
      },
      salary: true,
      salary_type: {
        _key: true,
        value: true,
      },
      search_evaluation: true,
      shift_1_from_hour: true,
      shift_1_from_minute: true,
      shift_1_to_hour: true,
      shift_1_to_minute: true,
      shift_2_from_hour: true,
      shift_2_from_minute: true,
      shift_2_to_hour: true,
      shift_2_to_minute: true,
      shift_3_from_hour: true,
      shift_3_from_minute: true,
      shift_3_to_hour: true,
      shift_3_to_minute: true,
      skills: true,
      status: {
        _key: true,
        value: true,
      },
      work_location: true,
    })

  }

  findJobByKey = async (job_key: string) => {

    const condition = {
      _key: job_key
    }
    const specialKeys = [
      'desired_occupation', 'dormitory', 'experienced_occupation', 'gender', 'japanese_skill', 'salary_type', 'status', 'accommodation '];

    const keyMasterArray = [
      {
        att: 'residence_status',
        class: 'JOB_RESIDENCE_STATUS'
      },
      {
        att: 'business',
        class: 'JOB_BUSINESS'
      },
      {
        att: 'prefecture',
        class: 'JOB_PREFECTURE'
      }
    ]
    keyMasterArray.forEach(item => {
      condition[item.att] = {
        attribute: item.att,
        ref_attribute: 'code',
        ref_condition: {
          class: item.class
        }
      }
    })

    specialKeys.forEach(item => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code'
      }
    })

    return await this.query('findJobInfo', {
      collection: 'biz_job',
      condition
    }, {
      _key: true,
      accommodation: {
        _key: true,
        value: true,
      },
      age: true,
      benefit: true,
      business: {
        _key: true,
        value: true,
      },
      commission_amount: true,
      description: true,
      desired_occupation: {
        _key: true,
        value: true,
      },
      dormitory: {
        _key: true,
        value: true,
      },
      experienced_occupation: {
        _key: true,
        value: true,
      },
      gender: {
        _key: true,
        value: true,
      },
      holiday: true,
      japanese_skill: {
        _key: true,
        value: true,
      },
      job_company: true,
      method: true,
      prefecture: {
        _key: true,
        value: true,
      },
      probationary_period: true,
      remark: true,
      residence_status: {
        _key: true,
        value: true,
      },
      salary: true,
      salary_type: {
        _key: true,
        value: true,
      },
      search_evaluation: true,
      shift_1_from_hour: true,
      shift_1_from_minute: true,
      shift_1_to_hour: true,
      shift_1_to_minute: true,
      shift_2_from_hour: true,
      shift_2_from_minute: true,
      shift_2_to_hour: true,
      shift_2_to_minute: true,
      shift_3_from_hour: true,
      shift_3_from_minute: true,
      shift_3_to_hour: true,
      shift_3_to_minute: true,
      skills: true,
      status: {
        _key: true,
        value: true,
      },
      work_location: true,
      only_apply: true,
      only_experienced:true
    })
  }

  deleteJobInfo = async (job_key: string) => {
    return this.mutation('removeJobInfo', 'biz_job', [{ _key: job_key }], { _key: true });
  }


  saveJobInfo = async (data: any[]) => {
    return this.mutation('saveJobInfo', 'biz_job', data, { _key: true });
  }

}
