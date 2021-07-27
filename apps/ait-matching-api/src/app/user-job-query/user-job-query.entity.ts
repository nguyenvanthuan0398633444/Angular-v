import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class UserJobQueryEntity extends BaseEntity {
  @Field(() => [KeyValueEntity], { nullable: true })
  residence_status?: KeyValueEntity[];

  @Field(() => KeyValueEntity, { nullable: true })
  salary_type?: KeyValueEntity;

  @Field(() => Float, { nullable: true })
  desired_salary?: number;

  @Field(() => [KeyValueEntity], { nullable: true })
  business?: KeyValueEntity[];

  @Field(() => KeyValueEntity, { nullable: true })
  desired_occupation?: KeyValueEntity;

  @Field(() => [KeyValueEntity], { nullable: true })
  prefecture?: KeyValueEntity[];

  @Field(() => Float, { nullable: true })
  immigration_date?: number;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
}
