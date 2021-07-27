/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserJobQueryService extends AitBaseService {
  collection = 'user_job_query';
  findByUser = async (user_id: string) => {
    const conds: any = {
      user_id,
    };
    const specialKeys = ['desired_occupation', 'japanese_skill', 'salary_type'];
    specialKeys.forEach((item) => {
      conds[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code',
      };
    });
    return await this.query(
      'findUserJobSetting',
      {
        collection: 'user_job_query',
        condition: conds,
      },
      {
        _key: true,
        business: {
          _key: true,
          value: true,
        },
        desired_occupation: {
          _key: true,
          value: true,
        },
        immigration_date: true,
        residence_status: {
          _key: true,
          value: true,
        },
        japanese_skill: {
          _key: true,
          value: true,
        },
        prefecture: {
          _key: true,
          value: true,
        },
        remark: true,
        qualification: true,
        desired_salary: true,
        salary_type: {
          _key: true,
          value: true,
        },
      }
    );
  };

  async find(user_id: string) {
    return await this.query(
      'findUserJobQuery',
      {
        collection: 'user_job_query',
        condition: {
          user_id,
          residence_status: {
            attribute: 'residence_status',
            ref_attribute: 'code',
          },
          salary_type: {
            attribute: 'salary_type',
            ref_attribute: 'code',
          },
          business: {
            attribute: 'business',
            ref_attribute: 'code',
          },
          desired_occupation: {
            attribute: 'desired_occupation',
            ref_attribute: 'code',
          },
          prefecture: {
            attribute: 'prefecture',
            ref_attribute: 'code',
            ref_condition: {
              class: 'PREFECTURE',
            },
          },
        },
      },
      {
        _key: true,
        user_id: true,
        company: true,
        create_at: true,
        create_by: true,
        change_at: true,
        change_by: true,
        residence_status: {
          _key: true,
          value: true,
        },
        salary_type: {
          _key: true,
          value: true,
        },
        desired_salary: true,
        business: {
          _key: true,
          value: true,
        },
        desired_occupation: {
          _key: true,
          value: true,
        },
        prefecture: {
          _key: true,
          value: true,
        },
        immigration_date: true,
        remark: true,
        is_matching: true,
      }
    );
  }

  async save(data: any) {
    const returnField = { user_id: true, _key: true };
    const dataByUserId = await this.find(data.user_id);
    console.log(dataByUserId?.numData);
    dataByUserId?.numData > 0 && (data['_key'] = dataByUserId?.data[0]._key);
    return await this.mutation(
      'saveUserJobQuery',
      'user_job_query',
      [data],
      returnField
    );
  }

  async findByUserId(user_id: string) {
    return await this.query('findUserJobQuery', {
      collection: this.collection,
      condition: {
        user_id
      }
    }, {
      _key: true,
      user_id: true
    })
  }

  async remove(data: any) {
    const returnFields = { _key: true, user_id: true };
    return await this.mutation('removeUserJobQuery', this.collection, [data], returnFields);
  }
}
