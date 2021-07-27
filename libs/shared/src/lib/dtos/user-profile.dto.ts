import { BaseDto } from "./base.dto";
import { KeyValueDto } from "./key-value.dto";

export interface UserProfileDto extends BaseDto {
  avatar_url_url:string;
  background_url: string;
  first_name: string;
  last_name: string;
  katakana: string;
  romaji: string;
  country_region: KeyValueDto; // sys_master_data
  postcode: string;
  province_city: KeyValueDto; // sys_master_data
  district: KeyValueDto; // sys_master_data
  ward: KeyValueDto; // sys_master_data
  street: string;
  floor_building: string;
  gender: KeyValueDto; // sys_master_data
  date_of_birth: number;
  phone_number: string;
  introduce: string;
  title: KeyValueDto; // m_title
  company_working: KeyValueDto; // sys_company
  industry: KeyValueDto; // m_industry
  name: string;
}


export interface UserProfileAureoleDto extends BaseDto {

  name?: string;
  name_kana?: string;
  avatar_url?: any;
  gender?: KeyValueDto;
  dob?: number;
  dob_jp?: number;
  country?: KeyValueDto;
  passport_number?: string;
  residence_status?: KeyValueDto;
  accepting_company?: string;
  address?: string;
  prefecture?: KeyValueDto;
  occupation?: KeyValueDto;
  work?: KeyValueDto;
  immigration_date?: number;
  employment_start_date?: number;
  no2_permit_date?: number;
  stay_period?: number;
  no3_exam_dept_date?: number;
  no3_exam_dept_pass?: KeyValueDto;
  no3_exam_practice_date?: number;
  no3_exam_practice_pass?: KeyValueDto;
  no3_permit_date?: number;
  resume?: any;
  current_salary?: number;
  training_remark?: string;
  agreement?: boolean;
  agreement_file?: any[];
  emp_type : KeyValueDto;
  relation_pic: string;
  translate_pic: string;
}
