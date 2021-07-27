import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserCertificateAwardEntity extends BaseEntity {
  @Field(() => [String], { nullable: true })
  certificate_no1?: string[];

  @Field(() => KeyValueEntity, { nullable: true })
  japanese_skill?: KeyValueEntity;

  @Field(() => [String], { nullable: true })
  japanese_skill_certificate?: string[];

  @Field(() => String, { nullable: true })
  qualification?: string;

  @Field(() => [String], { nullable: true })
  qualification_certificate?: string[];
}
