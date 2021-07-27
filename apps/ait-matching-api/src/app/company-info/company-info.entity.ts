import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Int, Field } from '@nestjs/graphql';

@ObjectType()
export class WebsiteEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  url?: string;
}
@ObjectType()
export class CompanyInfoEntity extends BaseEntity {
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

  @Field(() => String, { nullable: true })
  size?: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => [String], { nullable: true })
  agreement_file?: string[];

  @Field(() => Boolean, { nullable: true })
  agreement?: boolean;

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
}
