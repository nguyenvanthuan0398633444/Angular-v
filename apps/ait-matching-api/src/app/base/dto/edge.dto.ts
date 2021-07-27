import { BaseDto } from "@ait/core";

export interface EdgeBaseDto extends BaseDto {
  _from?: string;
  _to?: string;
}

export interface EdgeCondition  {
  _from?: string;
  _to?: string;
}
