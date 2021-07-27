import { BaseEntity, KeyValueEntity } from '@ait/core';
import { RESULT_STATUS, Utils } from '@ait/shared';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { WebsiteEntity } from './company-info.entity';



@ObjectType()
export class CompanyInfoResponse {
  @Field(() => [CompanyInfoResp], { nullable: true })
  data?: CompanyInfoResp[];

  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  status?: number = RESULT_STATUS.OK;

  @Field(() => Int, { nullable: true })
  numData?: number = 0;

  @Field(() => Int, { nullable: true })
  numError?: number = 0;

  constructor(status: number, result: CompanyInfoResp[], message: string) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = message;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = message;
        break;
      default:
        break;
    }
  }
}




@ObjectType()
export class CompanyInfoResp extends BaseEntity {
  @Field(() => KeyValueEntity, { nullable: true })
  occupation?: KeyValueEntity;

  @Field(() => Int, { nullable: true })
  no?: number;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  work?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  fax?: string;

  @Field(() => String, { nullable: true })
  name?: string;


  @Field(() => KeyValueEntity, { nullable: true })
  prefecture?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  name_pe?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  business?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  size?: KeyValueEntity;

  @Field(() => WebsiteEntity, { nullable: true })
  website?: WebsiteEntity;

  @Field(() => [String], { nullable: true })
  agreement_file?: string[];

  @Field(() => String, { nullable: true })
  representative?: string;

  @Field(() => String, { nullable: true })
  representative_katakana?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  representative_position?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  representative_email?: string;

  @Field(() => String, { nullable: true })
  representative_remark?: string;

  @Field(() => String, { nullable: true })
  acceptance_remark?: string;

  @Field(() => Boolean, { nullable: true })
  agreement?: boolean;
}
