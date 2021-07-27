import { KeyValueDto } from '@ait/shared';

export class UserJobQuery {
    _key: string;
    user_id: string;
    residence_status: KeyValueDto[];
    salary_type: KeyValueDto;
    desired_salary: number;
    business: KeyValueDto[];
    desired_occupation: KeyValueDto;
    prefecture: KeyValueDto[];
    immigration_date: number;
    remark: string;
    is_matching: boolean;
  
    constructor(
      _key: string,
      user_id: string,
      residence_status: KeyValueDto[],
      salary_type: KeyValueDto,
      desired_salary: number,
      business: KeyValueDto[],
      desired_occupation: KeyValueDto,
      prefecture: KeyValueDto[],
      immigration_date: number,
      remark: string,
      is_matching: boolean,
    ) {
      this._key = _key;
      this.user_id = user_id;
      this.residence_status = residence_status;
      this.salary_type = salary_type;
      this.desired_salary = desired_salary;
      this.business = business;
      this.desired_occupation = desired_occupation;
      this.prefecture = prefecture;
      this.immigration_date = immigration_date;
      this.remark = remark;
      this.is_matching = is_matching;
    }
  }
  
  export class UserCertificateAward {
    _key: string;
    user_id: string;
    certificate_no1: string[];
    japanese_skill: KeyValueDto;
    japanese_skill_certificate: string[];
    qualification: string;
    qualification_certificate: string[];
    is_matching: boolean;
  
    constructor(
      _key: string,
      user_id: string,
      certificate_no1: string[],
      japanese_skill: KeyValueDto,
      japanese_skill_certificate: string[],
      qualification: string,
      qualification_certificate: string[],
      is_matching: boolean
    ) {
      this._key = _key;
      this.user_id = user_id;
      this.certificate_no1 = certificate_no1;
      this.japanese_skill = japanese_skill;
      this.japanese_skill_certificate = japanese_skill_certificate;
      this.qualification = qualification;
      this.qualification_certificate = qualification_certificate;
      this.is_matching = is_matching;
    }
  }