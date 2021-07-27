/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends AitBaseService {
  created_list = [];
  avatar_url_list = new BehaviorSubject<any>(null);
  agreement_file_list = new BehaviorSubject<any>(null);
  resume_list = new BehaviorSubject<any>(null);

  collection = 'user_profile';
  findUserProfile = async (user_id: string) => {
    const conds: any = {
      condition: {
        user_id
      }
    }
    const attrs =
      ['country', 'gender', 'residence_status', 'prefecture', 'occupation', 'no3_exam_dept_pass', 'no3_exam_practice_pass', 'emp_type'];
    attrs.forEach((item) => {
      conds.condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code'
      }
    })
    return await this.query('findUserProfile', {
      collection: 'user_profile',
      ...conds
    }, {
      _key: true,
      name: true,
      name_kana: true,
      avatar_url: true,
      gender: {
        _key: true,
        value: true
      },
      dob: true,
      dob_jp: true,
      country: {
        _key: true,
        value: true
      },
      passport_number: true,
      residence_status: {
        _key: true,
        value: true
      },
      accepting_company: true,
      address: true,
      prefecture: {
        _key: true,
        value: true,
      },
      occupation: {
        _key: true,
        value: true,
      },
      immigration_date: true,
      employment_start_date: true,
      no2_permit_date: true,
      stay_period: true,
      no3_exam_dept_date: true,
      no3_exam_dept_pass: {
        _key: true,
        value: true,
      },
      no3_exam_practice_date: true,
      no3_exam_practice_pass: {
        _key: true,
        value: true,
      },
      no3_permit_date: true,
      resume: true,
      current_salary: true,
      training_remark: true,
      agreement_file: true,
      relation_pic: true,
      translate_pic: true,
      emp_type: {
        _key: true,
        value: true,
      }
    })
  }

  async saveUserProfile(data: any[]) {
    const returnField = { user_id: true };
    return await this.mutation('saveUserProfile', 'user_profile', data, returnField);
  }

  async saveUserInfo(data: any) {
    const returnFields = { user_id: true };
    return await this.mutation('saveUserInfo', 'user_profile', data, returnFields);
  }

  async createSysUser() {
    const rest: any = await this.apollo.mutate({
      mutation: gql`
      mutation {
        newSysUser (
          request: {
            collection: "sys_user",
            company: "${this.company}",
            lang: "${this.currentLang}",
            user_id: "${this.user_id}",
            data: [{}]
          }) {
            data {
              _key
            }
            message
            errors
            status
        }
    }
      `,
    }).toPromise();
    return rest?.data?.newSysUser;
  }

  async findByUserId(user_id: string) {
    return await this.query('findUserProfile', {
      collection: 'user_profile',
      condition: {
        user_id
      }
    }, {
      _key: true,
      user_id: true
    })
  }

  async remove(data: any[]) {
    const returnFields = { _key: true, user_id: true };
    return await this.mutation('removeUserProfile', this.collection, data, returnFields);
  }

  async removeAllByUserId(user_id: string) {
    const returnFields = { user_id: true };
    const data = { user_id };
    return await this.mutation('removeUserInfo', this.collection, [data], returnFields);
  }
}
