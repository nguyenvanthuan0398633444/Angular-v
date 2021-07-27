import { Guid } from 'guid-typescript';
import { AitLogger } from '../utils/ait-logger.util';

import { AitCheckController } from './ait-check.controller';
import {  isNil, KEYS, RequestCoreModel, RequestModel } from '@ait/shared';
import { AitBaseService } from '@ait/core';

/**
 *
 *
 * @export
 * @class BaseController
 */
export class AitBaseController {
  protected readonly logger = new AitLogger(this.constructor.name);
  protected readonly check: AitCheckController;
  protected company: string;
  protected lang: string;
  protected user_id: string;

  protected LOG_TEMPLATE = {
    REQUEST_MODEL: 'REQUEST_MODEL',
    REQUEST_CORE_MODEL: 'REQUEST_CORE_MODEL',
    RESPONSE_CORE_MODEL: 'RESPONSE_CORE_MODEL',
    RESPONSE_MODEL: 'RESPONSE_MODEL',
    EXCEPTION: 'EXCEPTION',
    CORE_URL: 'CORE_URL'
  };

  constructor(private baseService: AitBaseService) {
    this.check = new AitCheckController();
  }

  async removeEdge(

    condition: any,

    collection: string

  ): Promise<any> {

    const req = new RequestCoreModel(collection);

    req[KEYS.CONDITION] = condition || {};

    return await this.remove(req);

  }

  /**
   *
   *
   * @param {RequestModel<any>} request
   * @returns {void}
   * @memberof BaseController
   */
  initialize(request: RequestModel<any>): void {
    if (isNil(request)) return;
    this.company = request.company;
    this.lang = request.lang;
    this.user_id = request.user_id;
    this.check.company = this.company;
    this.check.lang = this.lang;
  }

  /**
   *
   *
   * @param {any} dto
   * @memberof BaseController
   */
  protected setCommonInsert(dto: any): void {
    if (this.company) {
      dto[KEYS.COMPANY] = this.company;
    }
    dto[KEYS.DEL_FLAG] = false;
    dto[KEYS.CREATE_BY] = this.user_id;
    dto[KEYS.CHANGE_BY] = this.user_id;
    dto[KEYS.CREATE_AT] = this.getUnixTime();
    dto[KEYS.CHANGE_AT] = this.getUnixTime();
  }

  /**
   *
   *
   * @param {any} dto
   * @memberof BaseController
   */
  protected setCommonUpdate(dto: any): void {
    if (this.company) {
      dto[KEYS.COMPANY] = this.company;
    }
    dto[KEYS.CHANGE_BY] = this.user_id;
    dto[KEYS.CHANGE_AT] = this.getUnixTime();
  }

  protected getUnixTime() {
    return new Date().setHours(0, 0, 0, 0);
  }
  /**
   * Generate GUID
   *
   * @readonly
   * @type {string}
   * @memberof BaseService
   */
  get guid(): string {
    return Guid.create().toString();
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
   async find(req: RequestCoreModel): Promise<any> {
    return await this.baseService.find(req);
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
   async save(req: RequestCoreModel): Promise<any> {
    return await this.baseService.save(req);
  }
  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
  async remove(req: RequestCoreModel): Promise<any> {
    return await this.baseService.remove(req);
  }
}
