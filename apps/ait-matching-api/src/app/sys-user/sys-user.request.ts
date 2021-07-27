import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SysUserDto } from './sys-user.dto';

@InputType()
export class SysUserRequest extends BaseRequest {
  @Field(() => SysUserDto, { nullable: true })
  condition: SysUserDto;

  @Field(() => [SysUserDto], { nullable: true })
  data: SysUserDto[];
}
