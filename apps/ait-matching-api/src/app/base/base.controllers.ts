import { AitBaseController, AitBaseService } from "@ait/core";
import {  KEYS, RequestCoreMatching, RequestCoreModel } from "@ait/shared";
import { HttpService } from "@nestjs/common";
import { environment } from "../../environments/environment";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LOG_TEMPLATE } from "../commons/consts";
import { CommonUtils } from "../utils/utils";
import { EdgeCondition } from "./dto/edge.dto";

export class BaseController extends AitBaseController {
  protected company: string;
  protected lang: string;
  protected module: string;
  protected page: string;
  protected user_id: string;
  protected username: string;
  protected apiUrl: string;

  constructor(
    baseService: AitBaseService,
    private httpService: HttpService) {
    super(baseService);
    this.apiUrl = CommonUtils.join(
      environment.API_CORE.HOST + environment.API_CORE.MATCHING_ENGINE_PATH
    );
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
  async get(req: RequestCoreModel): Promise<any> {
    this.logger.log(LOG_TEMPLATE.CORE_URL);
    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.GET));
    return await this.httpService
      .post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.GET), req)
      .toPromise();
  }

  async removeEdge(
    condition: EdgeCondition,
    collection: string
  ): Promise<any> {
    const req = new RequestCoreModel(collection);
    req[KEYS.CONDITION] = condition || {};

    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.REMOVE));
    return await this.httpService
      .post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.REMOVE), req)
      .toPromise();

  }

  /**
  *
  *
  * @param {RequestCoreModel} req
  * @returns {Promise<any>}
  * @memberof BaseController
  */
  async syncPe(req: any): Promise<any> {
    this.logger.log(LOG_TEMPLATE.CORE_URL);
    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.AUREOLE_V));
    return await this.httpService
      .post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.AUREOLE_V), req)
      .toPromise();
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
  async excuteFunction(req: RequestCoreMatching): Promise<any> {
    this.logger.log(LOG_TEMPLATE.CORE_URL);
    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.EXCUTE_FUCTION));
    return await this.httpService
      .post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.EXCUTE_FUCTION), req)
      .toPromise();
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
  async matching(req: RequestCoreMatching): Promise<any> {
    this.logger.log(LOG_TEMPLATE.CORE_URL);
    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.MATCHING));
    return await this.httpService
      .post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.MATCHING), req)
      .toPromise();
  }


  async searchOnView(req: any): Promise<any> {
    return await this.httpService.post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.SEARCH), req).toPromise();
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
  async search(req: RequestCoreModel): Promise<any> {
    this.logger.log(LOG_TEMPLATE.CORE_URL);
    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.SEARCH));
    return await this.httpService
      .post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.SEARCH), req)
      .toPromise();
  }
}
