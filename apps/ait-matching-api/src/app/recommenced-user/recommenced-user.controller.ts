import { AitBaseService } from '@ait/core';
import { RequestModel, ResponseModel, RESULT_STATUS, RequestCoreModel, KEYS, BaseDto, isArrayFull, CompanyInfoDto, Utils, KeyValueDto, isEqual, SYSTEM_COMPANY } from '@ait/shared';
import { Body, Controller, Get, HttpService, Post } from '@nestjs/common';
import { LOG_TEMPLATE } from '../commons/consts';
import { CLASS, COLLECTIONS, EDGE_DIRECTION, OPERATOR } from '../commons/enums';
import { CommonUtils } from '../utils/utils';
import { BaseController } from '../base/base.controllers';


@Controller('recommenced-user')
export class RecommencedUserController extends BaseController {

  constructor(aitBaseService: AitBaseService, httpSerivce: HttpService) {
    super(aitBaseService, httpSerivce);
  }

  @Get('')
  hello() {
    return 'Hello from au-v';
  }

  @Post('search-company')
  async searchCompany(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(matching-company)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);

      const req = {
        view: 'v_sys_company',
        keyword: body.condition?.keyword,
        field: [
          `name.${body.lang}`
        ],
        condition: {},
        select_field: ['name', "_key"],
        limit: 20
      }
      let ret = [];

      const result = await this.searchOnView(req);
      if (result?.status === RESULT_STATUS.OK) {
        const data = result?.data?.data;
        if (data) {
          ret = data.map(d => ({ _key: d?._key, value: d?.name ? d?.name[body.lang] : null }))
        }
      }
      return new ResponseModel(RESULT_STATUS.OK, ret);

    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  /**
  *
  *
  * @private
  * @param {string} company
  * @param {*} reqConditon
  * @returns {Promise<any>}
  * @memberof MasterController
  * @author phuclq
  */
  private async getCodeNameMasterData(
    company: string,
    reqConditon: any
  ): Promise<any> {
    // initialize request core
    const req = new RequestCoreModel(COLLECTIONS.MASTER_DATA);
    const condition = {};
    condition[KEYS.COMPANY] = company;
    // get one or some projects with _key array
    if (reqConditon[KEYS.CLASS]) {
      if (isArrayFull(reqConditon[KEYS.CLASS])) {
        condition[KEYS.CLASS] = {
          value: reqConditon[KEYS.CLASS],
          operator: OPERATOR.IN
        };
      } else {
        condition[KEYS.CLASS] = reqConditon[KEYS.CLASS];
      }
    }
    // set condition parent_code
    if (reqConditon['parent_code']) {
      if (isArrayFull(reqConditon['parent_code'])) {
        condition['parent_code'] = {
          value: reqConditon['parent_code'],
          operator: OPERATOR.IN
        };
      } else {
        condition['parent_code'] = reqConditon['parent_code'];
      }
    }
    // set condition code
    if (reqConditon['code']) {
      if (isArrayFull(reqConditon['code'])) {
        condition['code'] = {
          value: reqConditon['code'],
          operator: OPERATOR.IN
        };
      } else {
        condition['code'] = reqConditon['code'];
      }
    }
    // sort data
    req.sort = {
      class: KEYS.ASC,
      sort_no: KEYS.ASC,
      parent_code: KEYS.ASC,
      code: KEYS.ASC
    };

    req.condition = condition;
    // call api
    // print request core api
    this.logger.log(this.LOG_TEMPLATE.REQUEST_CORE_MODEL);
    this.logger.log(JSON.stringify(req));

    const res = await this.get(req);
    if (res.status === RESULT_STATUS.OK) {
      // print response core api
      this.logger.log(this.LOG_TEMPLATE.RESPONSE_CORE_MODEL);
      this.logger.log(JSON.stringify(res.data));
      const ret = [];
      if (isArrayFull(res.data.data)) {
        res.data.data.forEach((item) => {
          let kv = {} as KeyValueDto;
          kv = CommonUtils.getKeyValue(item, this.lang);
          // set key
          kv._key = item[KEYS.CODE];
          kv.code = item[KEYS.CODE];
          kv.class = item[KEYS.CLASS];
          kv.parent_code = item['parent_code'];
          ret.push(kv);
        });
      }
      // print response data
      this.logger.log(this.LOG_TEMPLATE.RESPONSE_MODEL);
      this.logger.log(JSON.stringify(ret));
      return new ResponseModel(RESULT_STATUS.OK, ret);
    }
  }

  async getMasterDataByClass(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.log(this.LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      this.initialize(body);
      this.check.clearError();
      this.check.addError(
        await this.check.checkRequired(this.company, KEYS.COMPANY)
      );
      this.check.addError(await this.check.checkRequired(this.lang, KEYS.LANG));
      this.check.addError(
        await this.check.checkRequired(body.condition[KEYS.CLASS], KEYS.CLASS)
      );
      if (this.check.hasError()) {
        return new ResponseModel(RESULT_STATUS.ERROR, this.check.errors);
      }

      // call common function
      let result = await this.getCodeNameMasterData(
        this.company,
        body.condition
      );
      if (isEqual(result.numData, 0)) {
        result = await this.getCodeNameMasterData(
          SYSTEM_COMPANY,
          body.condition
        );
      }

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

  @Post('get-setting')
  async getUserSetting(
    @Body() body: RequestModel<BaseDto>
  ): Promise<ResponseModel> {
    try {
      // print request data
      this.logger.log(this.LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      // init common data
      this.initialize(body);

      // check validate
      this.check.clearError();

      this.check.addError(
        await this.check.checkRequired(body.condition?.user_id, KEYS.USER_ID)
      );

      if (this.check.hasError()) {
        return new ResponseModel(RESULT_STATUS.ERROR, this.check.errors);
      }

      // request condition
      const reqConditon = body.condition ? body.condition : {};

      // get master data
      const reqMaster = new RequestModel<any>();
      // reqMaster[KEYS.COMPANY] = this.company;
      reqMaster[KEYS.LANG] = this.lang;
      reqMaster.condition = {
        class: [
          CLASS.LANGUAGE,
          CLASS.SYSTEM_SETTING,
          CLASS.USER_SETTING,
          CLASS.TIMEZONE,
        ],
      };
      const resMaster = await this.getMasterDataByClass(
        reqMaster
      );

      const masterData = resMaster.data;

      // initialize request core
      const req = new RequestCoreModel(COLLECTIONS.USER_SETTING);
      req.condition = reqConditon;

      // get data with _key array
      if (reqConditon[KEYS.USER_ID]) {
        req.condition[KEYS.USER_ID] = reqConditon[KEYS.USER_ID];
      }

      // selected field
      const select_field = [];
      select_field.push('user_id');
      select_field.push('timezone');
      select_field.push('site_language');
      select_field.push('date_format_display');
      select_field.push('date_format_input');
      select_field.push('number_format');
      req.select_field = select_field;

      // call core api
      this.logger.log(this.LOG_TEMPLATE.REQUEST_CORE_MODEL);
      this.logger.log(JSON.stringify(req));
      const res = await this.get(req);

      // check core response
      if (res.status === RESULT_STATUS.OK) {
        this.logger.log(this.LOG_TEMPLATE.RESPONSE_CORE_MODEL);
        this.logger.log(JSON.stringify(res.data));

        const ret = [];
        if (isArrayFull(res.data.data)) {
          res.data.data.forEach((data) => {
            data.timezone = masterData.find(
              (item) =>
                data.timezone === item.code && item.class === CLASS.TIMEZONE
            );
            data.site_language = masterData.find(
              (item) =>
                data.site_language === item.code &&
                item.class === CLASS.LANGUAGE
            );
            data.date_format_display = masterData.find(
              (item) =>
                data.date_format_display === item.code &&
                item.class === CLASS.USER_SETTING
            );
            data.date_format_input = masterData.find(
              (item) =>
                data.date_format_input === item.code &&
                item.class === CLASS.USER_SETTING
            );
            data.number_format = masterData.find(
              (item) =>
                data.number_format === item.code &&
                item.class === CLASS.USER_SETTING
            );
            ret.push(data);
          });
        }

        const results = ret.map(m => ({
          ...m,
          date_format_display: {
            value: m?.date_format_display?.value,
            code: m?.date_format_display?.code
          },
          date_format_input: {
            value: m?.date_format_input?.value,
            code: m?.date_format_input?.code
          },
          number_format: {
            value: m?.number_format?.value,
            code: m?.number_format?.code
          },
          site_language: m?.site_language?.code,
          timezone: m?.timezone?.code,

        }))

        // return response
        const result = new ResponseModel(RESULT_STATUS.OK, results);
        this.logger.log(this.LOG_TEMPLATE.RESPONSE_MODEL);
        this.logger.log(JSON.stringify(result));
        return result;
      }
    } catch (error) {
      this.logger.error(this.LOG_TEMPLATE.EXCEPTION, error);
      return new ResponseModel(RESULT_STATUS.EXCEPTION, error);
    }
  }


  @Post('matching-company')
  async matchingCompany(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(matching-company)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);

      const { company_key, input_users } = body.condition;
      const req = {
        code: "MATCHING_COMPANY_USER",
        bind_vars: {
          company_key, required_matching_items: input_users
        }
      }

      const matchingResult = await this.matching(req);

      return new ResponseModel(RESULT_STATUS.OK, matchingResult.data.data);

    } catch (error) {
      // // // console.log(error);
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }


  @Post('remove-save-company-user')
  async removeSaveUserCompany(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(remove-save-company-user)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);
      const { data } = body;
      const { user_key, company_id } = data[0];
      const condition = {
        _from: COLLECTIONS.COMPANY + '/' + company_id,
        _to: COLLECTIONS.USER + '/' + user_key
      };

      const collection = COLLECTIONS.SAVE_COMPANY_USER;
      // // console.log(condition, collection);

      const removeLoveReaction = await this.removeEdge(condition, collection);
      console.log(removeLoveReaction, removeLoveReaction.data.data)

      return new ResponseModel(RESULT_STATUS.OK, removeLoveReaction.data.data);
    } catch (e) {
      // // console.log(e);
      return e;
    }
  }


  @Post('save-company-user')
  async saveCompanyUser(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(save-company-user)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      // this.check.clearError();

      // initialize common paramter from body data
      // this.initialize(body);
      // // // console.log(body);
      const { data, condition } = body;

      const { collection_to, collection_from } = condition || {};
      const from = collection_from ? collection_from : COLLECTIONS.COMPANY;
      const to = collection_to ? collection_to : COLLECTIONS.USER;
      // // console.log(body);
      const { user_key, company_id } = data[0];

      const req = new RequestCoreModel(COLLECTIONS.SAVE_COMPANY_USER);
      req[KEYS.DATA] = [
        {
          _from: from + '/' + company_id,
          _to: to + '/' + user_key,
          relationship: 'save_company_user',
          create_by: body.user_id,
          change_by: body.user_id,
          create_at: this.getUnixTime(),
          change_at: this.getUnixTime()
        }
      ];
      // // console.log(req);
      const saveLoveReaction = await this.save(req);
      // // console.log(saveLoveReaction.data.data);
      return new ResponseModel(RESULT_STATUS.OK, saveLoveReaction.data.data);
    } catch (error) {
      return error;
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


      const { list_ids, company_key } = body.condition;
      const req = {
        code: "GET_USER_DETAIL",
        bind_vars: {
          input_users: list_ids,
          input_company: company_key
        }
      }

      const result = await this.excuteFunction(req);

      const getObjectByLang = (obj) => ({ _key: obj?.code, value: obj?.name ? obj.name[this.lang] : null });
      console.log(result?.data)


      const data = result?.data ? (result.data?.data || []).map(m =>
      ({
        ...m,
        desired_occupation: m.desired_occupation ? getObjectByLang(m.desired_occupation) : null,
        dob: this.changeDate(m.dob),
        name: m?.name,
        gender: m.gender ? getObjectByLang(m.gender) : null,
        residence_status: m.residence_status ? getObjectByLang(m.residence_status) : null,
        work: m.work ? getObjectByLang(m.work) : null,
        prefecture: m.prefecture ? this.getDataMasterArray(m.prefecture, this.lang) : null,
        business: this.getDataMasterArray(m?.business, body.lang)
      })) : []
      return new ResponseModel(RESULT_STATUS.OK, data);

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
      const req = new RequestCoreModel(COLLECTIONS.SAVE_COMPANY_USER);
      const start_vertex_condition = {
      };
      start_vertex_condition[KEYS.COLLECTION] = COLLECTIONS.COMPANY
      start_vertex_condition[KEYS.KEY] = list_keys;
      req.start_vertex = start_vertex_condition;
      req.direction = EDGE_DIRECTION.OUTBOUND;
      req.select_field = {
        [KEYS.VERTEX]: [
          {
            user_profile: {
              attribute: "_key",
              ref_collection: "user_profile",
              ref_attribute: "user_id"
            }
          }
        ]
      }
      req.condition = condition;

      const result = await this.get(req);
      // // console.log(result)
      return new ResponseModel(RESULT_STATUS.OK, result.data.data);

    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  private changeDate(date: any): number {
    try {
      return date ? (new Date(date)).getTime() : null;
    } catch (error) {
      return null;
    }
  }

  @Post('get-company-profile')
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
      const req = new RequestCoreModel(COLLECTIONS.COMPANY);
      req.condition = {};

      // get data with _key array
      if (reqConditon[KEYS.KEY]) {
        if (isArrayFull(reqConditon[KEYS.KEY])) {
          req.condition[KEYS.KEY] = {
            value: reqConditon[KEYS.KEY],
            operator: OPERATOR.IN,
          };
        } else {
          req.condition[KEYS.KEY] = reqConditon[KEYS.KEY];
        }
      }
      if (reqConditon[KEYS.STATUS]) {
        req.condition[KEYS.STATUS] = reqConditon[KEYS.STATUS];
      }

      if (reqConditon[KEYS.NAME]) {
        req.condition[KEYS.NAME + '.' + this.lang] = reqConditon[KEYS.NAME];
      }

      const select_field = [];
      select_field.push('_key')
      select_field.push('name')
      select_field.push('address');
      select_field.push({
        occupation: {
          attribute: 'occupation',
          ref_attribute: 'code',
          ref_collection: COLLECTIONS.MASTER_DATA
        }
      })
      select_field.push({
        work: {
          attribute: 'work',
          ref_attribute: 'code',
          ref_collection: COLLECTIONS.MASTER_DATA
        }
      })
      select_field.push({
        business: {
          attribute: 'business',
          ref_attribute: 'code',
          ref_collection: COLLECTIONS.MASTER_DATA
        }
      })
      select_field.push('website');
      select_field.push('phone');

      select_field.push('fax');
      select_field.push({
        size: {
          attribute: 'size',
          ref_attribute: 'code',
          ref_collection: COLLECTIONS.MASTER_DATA
        }
      })
      select_field.push('representative');
      select_field.push('representative_katakana');
      select_field.push({
        representative_position: {
          attribute: 'representative_position',
          ref_attribute: 'code',
          ref_collection: COLLECTIONS.MASTER_DATA
        }
      });
      select_field.push('representative_email');

      select_field.push('acceptance_remark');
      select_field.push('agreement_file');
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
          res.data.data.forEach((item: CompanyInfoDto) => {

            const dto = {} as CompanyInfoDto;
            dto._key = item._key;
            dto.company = item.company;
            dto.name = item.name ? item.name[this.lang] : null;
            dto.address = item.address;
            dto.occupation = Utils.getKeyValue(item.occupation, this.lang);
            dto.work = Utils.getKeyValue(item.work, this.lang);
            dto.business = Utils.getKeyValue(item.business, this.lang);
            dto.website = item.website;
            dto.phone = item.phone;
            dto.fax = item.fax;
            dto.agreement_file = item.agreement_file;
            dto.size = Utils.getKeyValue(item.size, this.lang);
            dto.representative = item.representative;
            dto.representative_katakana = item.representative_katakana;
            dto.representative_position = Utils.getKeyValue(item.representative_position, this.lang);
            dto.representative_email = item.representative_email;
            dto.acceptance_remark = item.acceptance_remark;
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

  @Post('save-api-config')
  async saveInfoWebDB(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.log(LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      // init common data
      this.initialize(body);

      // check validate
      this.check.clearError();

      const req = new RequestCoreModel(COLLECTIONS.SYNC_API_CONFIG);
      const { data } = body;
      req[KEYS.DATA] = data.map(d => {
        const dto: any = {};
        this.setCommonInsert(dto);

        return { ...dto, ...d }
      });
      //
      const result = await this.save(req);
      // // console.log(result);
      return new ResponseModel(RESULT_STATUS.OK, result.data.data);


    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  @Post('remove-api-config')
  async removeInfoWebDB(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.log(LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      // init common data
      this.initialize(body);

      // check validate
      this.check.clearError();

      const req = new RequestCoreModel(COLLECTIONS.SYNC_API_CONFIG);
      const { data } = body;
      req[KEYS.CONDITION] = {
        _key: data[0]._key
      }
      const result = await this.remove(req);
      // // // console.log(result);
      return new ResponseModel(RESULT_STATUS.OK, result.data.data);


    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  @Post('enforcement-webdb')
  async enforcementWebDB(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.log(LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      // init common data
      this.initialize(body);

      // check validate
      this.check.clearError();

      const data = body.data[0];

      const req = { ...data };

      const res = await this.syncPe(req);
      return new ResponseModel(RESULT_STATUS.OK, res.data.data);
    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  @Post('get-info-config')
  async getInfoConfigWebDB(@Body() body: RequestModel<any>): Promise<any> {
    try {
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
      // const reqConditon = body.condition ? body.condition : {};

      // initialize request core
      const req = new RequestCoreModel(COLLECTIONS.SYNC_API_CONFIG);
      req.condition = {};

      const select_field = [];
      select_field.push('change_at');
      select_field.push('company');
      select_field.push('create_at');
      select_field.push({
        create_by: {
          attribute: 'create_by',
          ref_attribute: 'user_id',
          ref_collection: COLLECTIONS.USER_PROFILE
        }
      });
      select_field.push('name');
      select_field.push('api_url');
      select_field.push('http_method');
      select_field.push('api_key');
      select_field.push('params');
      select_field.push('_key');



      req.select_field = select_field;
      // sort data
      req.sort = {
        change_at: KEYS.DESC,
      };

      // call core api
      this.logger.log(LOG_TEMPLATE.REQUEST_CORE_MODEL);
      this.logger.log(JSON.stringify(req));
      const res = await this.get(req);
      // check core response
      if (res.status === RESULT_STATUS.OK) {
        this.logger.log(LOG_TEMPLATE.RESPONSE_CORE_MODEL);
        this.logger.log(JSON.stringify(res.data));

        const ret = [];
        if (isArrayFull(res.data.data)) {
          res.data.data.forEach(item => {
            ret.push(item);
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

  @Post('get-info-history')
  async getInfoWebDB(@Body() body: RequestModel<any>): Promise<any> {
    try {
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
      // const reqConditon = body.condition ? body.condition : {};

      // initialize request core
      const req = new RequestCoreModel(COLLECTIONS.SYNC_PE_HISTORY);
      req.condition = {};

      const select_field = [];
      select_field.push('_key');
      select_field.push('create_by');

      select_field.push('create_at');
      select_field.push('company');
      select_field.push('config_key');
      select_field.push('database');
      select_field.push('sequence');
      select_field.push('status');
      select_field.push('count');
      select_field.push('change_at');
      select_field.push('steps');
      req.select_field = select_field;
      // sort data
      req.sort = {
        change_at: KEYS.DESC,
      };

      // call core api
      this.logger.log(LOG_TEMPLATE.REQUEST_CORE_MODEL);
      this.logger.log(JSON.stringify(req));
      const res = await this.get(req);
      // check core response
      if (res.status === RESULT_STATUS.OK) {
        this.logger.log(LOG_TEMPLATE.RESPONSE_CORE_MODEL);
        this.logger.log(JSON.stringify(res.data));

        const ret = [];
        if (isArrayFull(res.data.data)) {
          res.data.data.forEach(item => {
            ret.push(item);
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

}
