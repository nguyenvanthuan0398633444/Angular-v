import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompanyService extends AitBaseService {

  private getUrl = '/company/get';

  getCompany = async (listKeys: string[]) => {
    return this.post(this.getUrl, {
      condition: {
        _key: listKeys
      }
    }).toPromise();
  }


  getCompanys = async (name_pe: string | any) => {
    return this.post(this.getUrl, {
      condition: {
        name_pe
      }
    }).toPromise();
  }

  findCompanyByListKeys = async (list_keys: string[]) => {
    const condition: any = {
      _key: {
        value : list_keys
      }
    }

    const specialFields = ['occupation', 'work', 'prefecture', 'business', 'representative_position', 'size']

    specialFields.forEach(item => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code'
      }
    })
    return this.query('findCompanyInfo', {
      collection: 'sys_company',
      condition
    }, {
      _key: true,
      name: true,
      address: true,
      business: {
        _key: true,
        value: true,
      },
      work: {
        _key: true,
        value: true,
      },
      occupation: {
        _key: true,
        value: true,
      },
      website: {
        name: true,
        url: true,
      },
      phone: true,
      fax: true,
      size: {
        _key: true,
        value: true,
      },
      representative: true,
      representative_katakana: true,
      representative_position: {
        _key: true,
        value: true,
      },
      representative_email: true,
      acceptance_remark: true,

    })
  }


  findCompanyByName = async (name: string) => {
    const condition: any = {
      name
    }

    const specialFields = ['occupation', 'work', 'prefecture', 'business', 'representative_position', 'size']

    specialFields.forEach(item => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code'
      }
    })
    return this.query('findCompanyInfo', {
      collection: 'sys_company',
      condition
    }, {
      _key: true,
      name: true,
      address: true,
      business: {
        _key: true,
        value: true,
      },
      work: {
        _key: true,
        value: true,
      },
      occupation: {
        _key: true,
        value: true,
      },
      website: {
        name: true,
        url: true,
      },
      phone: true,
      fax: true,
      size: {
        _key: true,
        value: true,
      },
      representative: true,
      representative_katakana: true,
      representative_position: {
        _key: true,
        value: true,
      },
      representative_email: true,
      acceptance_remark: true,

    })
  }

  async save(data: any) {
    const returnField = { name: true, _key: true };
    return await this.mutation(
      'saveCompanyInfo',
      'sys_company',
      [data],
      returnField
    );
  }
}
