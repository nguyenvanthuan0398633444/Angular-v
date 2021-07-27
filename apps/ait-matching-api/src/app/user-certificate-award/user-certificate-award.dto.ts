import { BaseDto, ConditionDto, KeyValueDto } from '@ait/core';
import { InputType, Field, OmitType, IntersectionType } from '@nestjs/graphql';

@InputType()
export class UserCertificateAwardDto extends BaseDto {
  @Field(() => [String], { nullable: true })
  certificate_no1?: string[];

  @Field(() => ConditionDto, { nullable: true })
  japanese_skill?: ConditionDto;

  @Field(() => [String], { nullable: true })
  japanese_skill_certificate?: string[];

  @Field(() => String, { nullable: true })
  qualification?: string;

  @Field(() => [String], { nullable: true })
  qualification_certificate?: string[];

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
}

@InputType()
export class SaveUserCertificateAwardDto extends OmitType(
  IntersectionType(UserCertificateAwardDto, BaseDto),
  [
    'japanese_skill',
    'certificate_no1',
    'japanese_skill_certificate',
    'qualification_certificate'
  ] as const
) {
  @Field(() => KeyValueDto, { nullable: true })
  japanese_skill?: KeyValueDto;

  @Field(() => [String], { nullable: true })
  certificate_no1?: string[];

  @Field(() => [String], { nullable: true })
  japanese_skill_certificate?: string[];

  @Field(() => [String], { nullable: true })
  qualification_certificate?: string[];
}