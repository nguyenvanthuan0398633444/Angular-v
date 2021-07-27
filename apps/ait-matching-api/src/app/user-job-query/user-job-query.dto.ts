import { BaseDto, ConditionDto, KeyValueDto } from '@ait/core';
import { InputType, Field, Float, OmitType, IntersectionType } from '@nestjs/graphql';

@InputType()
export class UserJobQueryDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  residence_status?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  salary_type?: ConditionDto;

  @Field(() => Float, { nullable: true })
  desired_salary?: number;

  @Field(() => ConditionDto, { nullable: true })
  business?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  desired_occupation?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  prefecture?: ConditionDto;

  @Field(() => Float, { nullable: true })
  immigration_date?: number;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
}


@InputType()
export class SaveUserJobQueryDto extends OmitType(
  IntersectionType(UserJobQueryDto, BaseDto),
  [
    'residence_status',
    'salary_type',
    'business',
    'desired_occupation',
    'prefecture',
  ] as const
) {
  @Field(() => [KeyValueDto], { nullable: true })
  residence_status?: KeyValueDto[];

  @Field(() => KeyValueDto, { nullable: true })
  salary_type?: KeyValueDto;

  @Field(() => [KeyValueDto], { nullable: true })
  business?: KeyValueDto[];

  @Field(() => KeyValueDto, { nullable: true })
  occupation?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  desired_occupation?: KeyValueDto;

  @Field(() => [KeyValueDto], { nullable: true })
  prefecture?: KeyValueDto[];
}
