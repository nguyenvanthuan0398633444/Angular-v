/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserCertificateAwardService extends AitBaseService {
  collection = 'user_certificate_award';
  findByUser = async (user_id: string) => {
    return await this.query('findUserCertificateAward', {
      collection: 'user_certificate_award',
      condition: {
        user_id,
        japanese_skill: {
          attribute: 'japanese_skill',
          ref_collection: 'sys_master_data',
          ref_attribute: 'code'
        },
      },
    }, {
      certificate_no1: true,
      japanese_skill: {
        _key: true,
        value: true,
      },
      japanese_skill_certificate: true,
      qualification: true,
      qualification_certificate: true,
    })
  }

  async find(user_id: string) {
    return await this.query('findUserCertificateAward', {
      collection: 'user_certificate_award',
      condition: {
        user_id,
        japanese_skill: {
          attribute: 'japanese_skill',
          ref_attribute: 'code',
        }
      }
    }, {
      _key: true,
      user_id: true,
      company: true,
      create_at: true,
      create_by: true,
      change_at: true,
      change_by: true,
      certificate_no1: true,
      japanese_skill: {
        _key: true,
        value: true,
      },
      japanese_skill_certificate: true,
      qualification: true,
      qualification_certificate: true,
    })
  }

  async save(data: any) {
    const returnField = { user_id: true, _key: true };
    const dataByUserId = await this.find(data.user_id);
    console.log(dataByUserId?.numData);
    dataByUserId?.numData > 0 && (data['_key'] = dataByUserId?.data[0]._key);
    return await this.mutation('saveUserCertificateAward', 'user_certificate_award', [data], returnField);
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
