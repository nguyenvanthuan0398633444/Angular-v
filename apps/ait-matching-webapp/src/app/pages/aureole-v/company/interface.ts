import { BaseDto, KeyValueDto } from '@ait/shared';

export class CompanyInfo {
  name: NameDto;
  address: string;
  business: KeyValueDto;
  occupation: KeyValueDto;
  work: KeyValueDto;
  website: WebsiteDto;
  phone: string;
  fax: string;
  size: KeyValueDto;
  representative: string;
  representative_katakana: string;
  representative_position: KeyValueDto;
  representative_email: string;
  acceptance_remark: string;
  agreement: string[];
  agreement_file: string;
  is_matching: boolean;
}

export interface JobInfoDto extends BaseDto  {
  business: KeyValueDto[],
  residence_status: KeyValueDto[],
  description: string,
  prefecture: KeyValueDto[],
  work_location: string,
  shift_1_from_hour: number,
  shift_1_to_hour: number,
  shift_1_from_minute: number,
  shift_1_to_minute: number,
  shift_2_from_hour: number,
  shift_2_to_hour: number,
  shift_2_from_minute: number,
  shift_2_to_minute: number,
  shift_3_from_hour: number,
  shift_3_to_hour: number,
  shift_3_from_minute: number,
  shift_3_to_minute: number,
  holiday: string,
  salary_type: KeyValueDto,
  desired_salary: number,
  salary: number,
  benefit: string,
  commission_amount: number,
  probationary_period: string,
  age: number,
  gender: KeyValueDto,
  accommodation: KeyValueDto,
  dormitory: KeyValueDto,
  search_evaluation: string,
  skills: string,
  japanese_skill: KeyValueDto,
  method: string,
  remark: string,
  status: KeyValueDto,
  company_key?: string;
  job_company?: string;
  experienced_occupation: KeyValueDto;
  desired_occupation: KeyValueDto;
  only_apply?: string[];
  only_experienced?: string[];
}

export class CompanyInfoErrorsMessage {
  name: string[];
  address: string[];
  website: string[];
  phone: string[];
  fax: string[];
  representative: string[];
  representative_katakana: string[];
  representative_position: string[];
  representative_email: string[];
  acceptance_remark: string[];
  agreement: string[];
}

export interface NameDto {
  en_US: string;
  ja_JP: string;
  vi_VN: string;
}

export interface WebsiteDto {
  name: string;
  url: string;
}
