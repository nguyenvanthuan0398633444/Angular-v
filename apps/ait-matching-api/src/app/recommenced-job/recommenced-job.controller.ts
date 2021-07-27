import { AitBaseService } from '@ait/core';
import { BaseDto, COLLECTIONS, isArrayFull, KEYS, OPERATOR, RequestCoreModel, RequestModel, ResponseModel, RESULT_STATUS, Utils } from '@ait/shared';
import { Body, Controller, HttpService, Post } from '@nestjs/common';
import { LOG_TEMPLATE } from '../commons/consts';
import { EDGE_DIRECTION } from '../commons/enums';
import { BaseController } from '../base/base.controllers';



@Controller('recommenced-job')
export class RecommencedJobController extends BaseController {

  constructor(aitBaseService: AitBaseService, httpSerivce: HttpService) {
    super(aitBaseService, httpSerivce);
  }

  @Post('search-user')
  async searchCompany(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(matching-user)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);

      const req = {
        view: 'v_user_profile',
        keyword: body.condition?.keyword,
        field: [
          "name_kana",
          "name"
        ],
        condition: {},
        select_field: ['name', "name_kana", "user_id"],
        limit: 20
      }
      let ret = [];

      const result = await this.searchOnView(req);
      if (result?.status === RESULT_STATUS.OK) {
        const data = result?.data?.data;
        if (data) {
          ret = data.map(d => ({ ...d, value: d?.name_kana ? d?.name_kana : d?.name, user_key: d?.user_id }))
        }
      }
      return new ResponseModel(RESULT_STATUS.OK, ret);

    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  @Post('get-user-profile')
  async getCompany(
    @Body() body: RequestModel<BaseDto>,
  ): Promise<ResponseModel> {
    try {
      // // // console.log('getProfile')
      // print request data
      this.logger.log(LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      // init common data
      this.initialize(body);

      // check validate
      this.check.clearError();

      // check lang
      this.check.addError(await this.check.checkRequired(this.lang));
      if (this.check.hasError()) {
        return new ResponseModel(RESULT_STATUS.ERROR, this.check.errors);
      }

      // request condition
      const reqConditon = body.condition ? body.condition : {};

      // initialize request core
      const req = new RequestCoreModel(COLLECTIONS.USER_PROFILE);
      req.condition = {};

      // get data with _key array
      if (reqConditon[KEYS.USER_ID]) {
        if (isArrayFull(reqConditon[KEYS.USER_ID])) {
          req.condition[KEYS.USER_ID] = {
            value: reqConditon[KEYS.USER_ID],
            operator: OPERATOR.IN,
          };
        } else {
          req.condition[KEYS.USER_ID] = reqConditon[KEYS.USER_ID];
        }
      }

      if (reqConditon[KEYS.KEY]) {
        req.condition[KEYS.KEY] = reqConditon[KEYS.KEY];
      }

      const select_field = [];
      select_field.push('_key')
      select_field.push('user_id')
      select_field.push('dob')
      select_field.push('address');
      select_field.push({
        gender: {
          attribute: 'gender',
          ref_attribute: 'code',
          ref_collection: COLLECTIONS.MASTER_DATA
        }
      })
      select_field.push({
        country: {
          attribute: 'country',
          ref_attribute: 'code',
          ref_collection: COLLECTIONS.MASTER_DATA
        }
      })

      select_field.push('passport_number');
      req.select_field = select_field;
      // sort data
      req.sort = {
        status: KEYS.DESC,
      };

      // call core api
      this.logger.log(LOG_TEMPLATE.REQUEST_CORE_MODEL);
      this.logger.log(JSON.stringify(req));
      const res = await this.get(req);
      // // // console.log(res)

      // check core response
      if (res.status === RESULT_STATUS.OK) {
        this.logger.log(LOG_TEMPLATE.RESPONSE_CORE_MODEL);
        this.logger.log(JSON.stringify(res.data));

        const ret = [];
        if (isArrayFull(res.data.data)) {
          res.data.data.forEach((item) => {

            const dto: any = {};
            dto.user_key = item?.user_id;
            dto.address = item?.address;
            dto.dob = item?.dob
            dto.gender = item.gender ? Utils.getKeyValue(item.gender, this.lang) : null;
            dto.country = item.country ? Utils.getKeyValue(item.country, this.lang) : null;
            dto.passport_number = item?.passport_number
            ret.push(dto);
          });
        }

        // return response
        const result = new ResponseModel(RESULT_STATUS.OK, ret);
        this.logger.log(LOG_TEMPLATE.RESPONSE_MODEL);
        this.logger.log(JSON.stringify(result));
        return result;
      }
    } catch (error) {
      this.logger.error(LOG_TEMPLATE.EXCEPTION, error);
      return new ResponseModel(RESULT_STATUS.EXCEPTION, error);
    }
  }

  @Post('matching-user')
  async matchingCompany(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(matching-user)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);

      const { user_key, input_users } = body.condition;
      const req = {
        code: "MATCHING_USER_JOB",
        bind_vars: {
          user_key, required_matching_items: input_users
        }
      }

      const macthingResult = await this.matching(req);
      // console.log(macthingResult);

      return new ResponseModel(RESULT_STATUS.OK, macthingResult.data.data);

    } catch (error) {
      // // // console.log(error);
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  @Post('get-detail')
  async getDetail(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(get-employees)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);


      const { list_ids, user_key } = body.condition;
      const req = {
        code: "GET_JOB_DETAIL",
        bind_vars: {
          input_jobs: list_ids, //biz job
          input_user: user_key
        }
      }

      const result = await this.excuteFunction(req);

      const getObjectByLang = (obj) => ({ _key: obj?.code, value: obj?.name ? obj.name[this.lang] : null })


      const data = result?.data ? (result.data?.data || []).map(m =>
      ({
        ...m,
        company_business: m.company_business ? getObjectByLang(m.company_business) : null,
        name: m?.name ? m?.name[this.lang] : null,
        job_business: m.job_business ? this.getDataMasterArray(m.job_business, this.lang) : null,
        residence_status: m.residence_status ? this.getDataMasterArray(m.residence_status, this.lang) : null,
        prefecture: m.prefecture ? this.getDataMasterArray(m.prefecture, this.lang) : null,
      })) : []
      return new ResponseModel(RESULT_STATUS.OK, data);;

    } catch (error) {
      // // // console.log(error);
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  private getDataMasterArray = (data: any[], lang: string) => {
    if (!data || data.length === 0) {
      return null;
    }
    const res = data.map(d => d.name ? { _key: d?._key, value: d.name[lang] } : null);
    return res.filter(x => !!x);
  }

  @Post('get-tab-save')
  async getTabSave(
    @Body() body: RequestModel<any>,
  ): Promise<ResponseModel> {
    try {
      // print request data
      this.logger.log(LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      // init common data
      this.initialize(body);

      // check validate
      this.check.clearError();
      const { data, condition } = body;
      const { list_keys } = data[0];

      const req = new RequestCoreModel(COLLECTIONS.SAVE_USER_JOB);
      req.condition = condition;
      req.start_vertex = {
        collection: 'sys_user',
        _key: list_keys
      }
      req.direction = EDGE_DIRECTION.OUTBOUND
      req.select_field = {
        vertex : ['_key','_id']
      }

      const result = await this.get(req);
      return new ResponseModel(RESULT_STATUS.OK, result.data.data);

    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  @Post('save-user-job')
  async saveCompanyUser(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(save-user-job)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      // this.check.clearError();

      // initialize common paramter from body data
      // this.initialize(body);
      // // // console.log(body);
      const { data, condition } = body;

      const { collection_to, collection_from } = condition || {};
      const from = collection_from ? collection_from : COLLECTIONS.JOB;
      const to = collection_to ? collection_to : COLLECTIONS.USER;
      // // console.log(body);
      const { user_key, job_id } = data[0];

      const req = new RequestCoreModel(COLLECTIONS.SAVE_USER_JOB);
      req[KEYS.DATA] = [
        {
          _to: from + '/' + job_id,
          _from: to + '/' + user_key,
          relationship: 'save_user_job',
          create_by: body.user_id,
          change_by: body.user_id,
          create_at: this.getUnixTime(),
          change_at: this.getUnixTime()
        }
      ];
      console.log(req);
      const saveLoveReaction = await this.save(req);
      console.log(saveLoveReaction);
      return new ResponseModel(RESULT_STATUS.OK, saveLoveReaction.data);
    } catch (error) {
      return error;
    }
  }

  @Post('remove-save-user-job')
  async removeSaveUserCompany(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(remove-save-user-job)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);
      const { data } = body;
      const { user_key, job_id } = data[0];
      const condition = {
        _from: COLLECTIONS.USER + '/' + user_key,
        _to: COLLECTIONS.JOB + '/' + job_id
      };

      const collection = COLLECTIONS.SAVE_USER_JOB;
      // // console.log(condition, collection);

      const removeLoveReaction = await this.removeEdge(condition, collection);

      return new ResponseModel(RESULT_STATUS.OK, removeLoveReaction.data.data);
    } catch (e) {
      // // console.log(e);
      return e;
    }
  }



}
