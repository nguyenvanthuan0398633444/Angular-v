import { AitBaseService, BaseDto } from '@ait/core';
import {
  RequestModel,
  ResponseModel,
  RESULT_STATUS,
  RequestCoreModel,
  Utils,
  isArrayFull,
  COLLECTIONS,
  KEYS,
} from '@ait/shared';
import { Body, Controller, HttpService, Post } from '@nestjs/common';
import { CLASS } from '../commons/enums';
import { BaseController } from '../base/base.controllers';

@Controller('user-profile')
export class JobsController extends BaseController {
  constructor(aitBaseService: AitBaseService, httpSerivce: HttpService) {
    super(aitBaseService, httpSerivce);
  }

  /**
 * Get user profile
 *
 * @param {RequestModel<BaseDto>} body
 * @returns {Promise<any>}
 * @memberof UserController
 */
  @Post('get')
  async getUserProfile(@Body() body: RequestModel<BaseDto>): Promise<any> {
    try {
      // print request data
      this.logger.log(this.LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));
      // initialize common paramter from body data
      this.initialize(body);

      // validate error
      this.check.clearError();
      this.check.addError(
        await this.check.checkRequired(body.condition?.user_id, KEYS.USER_ID)
      );

      // return to client if have error
      if (this.check.hasError()) {
        return new ResponseModel(RESULT_STATUS.ERROR, this.check.errors);
      }

      // find user profile
      const result = await this.getUserProfileData(body.condition);
      // print response data
      this.logger.log(this.LOG_TEMPLATE.RESPONSE_MODEL);
      this.logger.log(JSON.stringify(result));
      return result;
    } catch (error) {
      // print error
      this.logger.error(this.LOG_TEMPLATE.EXCEPTION, error);
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  /**
   *
   *
   * @private
   * @returns {Promise<any>}
   * @memberof UserController
   */
  private async getUserProfileData(reqConditon: any): Promise<any> {
    // get master data
    // initialize request core
    const req = new RequestCoreModel(COLLECTIONS.USER_PROFILE);

    // set condition
    const condition = {};
    condition[KEYS.USER_ID] = reqConditon[KEYS.USER_ID];
    req.condition = condition;
    const select_field = [];
    select_field.push(KEYS.KEY);
    select_field.push(KEYS.USER_ID);
    select_field.push('name');
    select_field.push('name_kana');
    select_field.push('avatar_url');
    select_field.push({
      gender: {
        attribute: 'gender',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA,
        ref_condition: {
          class: CLASS.GENDER
        }
      }
    });
    select_field.push('dob');
    select_field.push('dob_jp');
    select_field.push({
      country: {
        attribute: 'country',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA
      }
    });
    select_field.push('passport_number');
    select_field.push({
      residence_status: {
        attribute: 'residence_status',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA,
        ref_condition: {
          class: CLASS.RESIDENCE_STATUS
        }
      }
    });
    select_field.push('address');
    select_field.push('accepting_company');
    select_field.push({
      prefecture: {
        attribute: 'prefecture',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA,
        ref_condition: {
          class: CLASS.PREFECTURE
        }
      }
    });
    select_field.push({
      occupation: {
        attribute: 'occupation',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA
      }
    });
    select_field.push({
      work: {
        attribute: 'work',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA
      }
    });
    select_field.push('immigration_date');
    select_field.push('employment_start_date');
    select_field.push('no2_permit_date');
    select_field.push('stay_period');
    select_field.push('no3_exam_dept_date');
    select_field.push('no3_exam_dept_pass');
    select_field.push({
      no3_exam_dept_pass: {
        attribute: 'no3_exam_dept_pass',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA
      }
    });
    select_field.push('no3_exam_practice_date');
    select_field.push({
      no3_exam_practice_pass: {
        attribute: 'no3_exam_practice_pass',
        ref_attribute: 'code',
        ref_collection: COLLECTIONS.MASTER_DATA
      }
    });
    select_field.push('no3_permit_date');
    select_field.push('resume');

    select_field.push('current_salary');

    select_field.push('training_remark');

    select_field.push('agreement');

    select_field.push('agreement_file');

    req.select_field = select_field;
    // call api
    // print request core api
    this.logger.log(this.LOG_TEMPLATE.REQUEST_CORE_MODEL);
    this.logger.log(JSON.stringify(req));

    const res = await this.get(req);
    // // console.log('xxxxx',res)
    if (res.status === RESULT_STATUS.OK) {
      // print response core api
      this.logger.log(this.LOG_TEMPLATE.RESPONSE_CORE_MODEL);
      this.logger.log(JSON.stringify(res.data));

      const ret = {} as any;
      if (isArrayFull(res.data.data)) {
        const retData: any = res.data.data[0];
        ret._key = retData._key;
        ret.user_id = retData.user_id;
        ret.name = retData.name;
        ret.name_kana = retData.name_kana;
        ret.avatar_url = retData.avatar_url;
        ret.gender = Utils.getKeyValue(retData.gender, this.lang);
        ret.dob = retData.dob;
        ret.dob_jp = retData.dob_jp;
        ret.country = Utils.getKeyValue(retData.country, this.lang);
        ret.passport_number = retData.passport_number;
        ret.residence_status = Utils.getKeyValue(retData.residence_status, this.lang);
        ret.accepting_company = retData.accepting_company;
        ret.address = retData.address;
        ret.prefecture = Utils.getKeyValue(retData.prefecture, this.lang);
        ret.occupation = Utils.getKeyValue(retData.occupation, this.lang);
        ret.work = Utils.getKeyValue(retData.work, this.lang);
        ret.immigration_date = retData.immigration_date;
        ret.employment_start_date = retData.employment_start_date;
        ret.no2_permit_date = retData.no2_permit_date;
        ret.stay_period = retData.stay_period;
        ret.no3_exam_dept_date = retData.no3_exam_dept_date;
        ret.no3_exam_dept_pass = Utils.getKeyValue(retData.no3_exam_dept_pass, this.lang);
        ret.no3_exam_practice_date = retData.no3_exam_practice_date;
        ret.no3_exam_practice_pass = Utils.getKeyValue(retData.no3_exam_practice_pass, this.lang);
        ret.no3_permit_date = retData.no3_permit_date;
        ret.resume = retData.resume;
        ret.current_salary = retData.current_salary;
        ret.training_remark = retData.training_remark;
        ret.agreement = retData.agreement;
        ret.agreement_file = retData.agreement_file;
        ret.country = Utils.getKeyValue(retData.country, this.lang);

      }
      return new ResponseModel(RESULT_STATUS.OK, [ret]);
    }
  }


}
