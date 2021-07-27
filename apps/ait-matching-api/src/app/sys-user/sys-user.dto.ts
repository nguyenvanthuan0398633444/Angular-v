import { BaseDto } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SysUserDto extends BaseDto {
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  is_matching?: boolean;
}
