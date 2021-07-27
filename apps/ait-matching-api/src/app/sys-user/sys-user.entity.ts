import { BaseEntity } from '@ait/core';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SysUserEntity extends BaseEntity {
  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
}
