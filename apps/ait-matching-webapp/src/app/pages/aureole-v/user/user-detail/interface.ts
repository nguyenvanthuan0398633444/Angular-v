import { BaseDto, KeyValueDto } from '@ait/shared';

export interface CertificateInfoDto extends BaseDto {
  certificate_no1: string;
  japanese_skill: KeyValueDto;
  japanese_skill_certificate: string;
  qualification: string;
  qualification_certificate: string;
  user_id: string;
}

export interface UserJobSetting extends BaseDto {
  user_id: string;
  business: KeyValueDto[];
  desired_occupation: KeyValueDto;
  residence_status: KeyValueDto[];
  japanese_skill: KeyValueDto;
  prefecture: KeyValueDto[];
  immigration_date: number;
  remark: string;
  qualification: string;
  desired_salary: number;
  salary_type: KeyValueDto;
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
  emp_type: KeyValueDto;
  relation_pic: string;
  translate_pic: string;
}
