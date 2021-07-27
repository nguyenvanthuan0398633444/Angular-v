import { BaseEntity, KeyValueEntity } from '@ait/core';
import { RESULT_STATUS, Utils } from '@ait/shared';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { UserJobSettingEntity } from './user-job-setting.entity';

@ObjectType()
export class UserJobSettingResponse {
  @Field(() => [UserJobSettingResp], { nullable: true })
  data?: UserJobSettingResp[];

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

  constructor(status: number, result: UserJobSettingResp[], message: string) {
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
export class UserJobSettingResp extends BaseEntity {
  @Field(() => [KeyValueEntity], { nullable: true })
  business?: KeyValueEntity[];

  @Field(() => KeyValueEntity, { nullable: true })
  desired_occupation?: KeyValueEntity;

  @Field(() => [KeyValueEntity], { nullable: true })
  residence_status?: KeyValueEntity[];

  @Field(() => KeyValueEntity, { nullable: true })
  japanese_skill?: KeyValueEntity;

  @Field(() => [KeyValueEntity], { nullable: true })
  prefecture?: KeyValueEntity[];

  @Field(() => Float, { nullable: true })
  immigration_date?: number;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  qualification?: string;

  @Field(() => Float, { nullable: true })
  desired_salary?: number;

  @Field(() => KeyValueEntity, { nullable: true })
  salary_type?: KeyValueEntity;
}
