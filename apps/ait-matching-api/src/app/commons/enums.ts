export enum ACTION {
  GET = 'GET',
  SAVE = 'SAVE',
  REMOVE = 'REMOVE'
}

export enum OPERATOR {
  IN = 'IN',
  EQUAL = '=='
}

export enum CLASS {
  // SYSTEM
  SYSTEM_SETTING = 'SYSTEM_SETTING',
  USER_SETTING = 'USER_SETTING',
  TIMEZONE = 'TIMEZONE',
  GENDER = 'GENDER',
  LANGUAGE = 'LANGUAGE',
  LANGUAGE_PROFICIENCY = 'LANGUAGE_PROFICIENCY',
  ADDRESS = 'ADDRESS',
  EMPLOYEE_TYPE = 'EMPLOYEE_TYPE',
  EXPERIENCE_LEVEL = 'EXPERIENCE_LEVEL',

  // BIZ
  RESIDENCE_STATUS = 'RESIDENCE_STATUS',
  SKILL_CATEGORY = 'SKILL_CATEGORY',
  SKILL_SETTING = 'SKILL_SETTING',
  COMPANY_SIZE = 'COMPANY_SIZE',
  PREFECTURE = 'PREFECTURE',
  JP_CERTIFICATE = 'JP_CERTIFICATE',
  JOB_BUSINESS = 'JOB_BUSINESS',
  JOB_STATUS = 'JOB_STATUS',
  JOB_PREFECTURE = 'JOB_PREFECTURE',
  JOB_RESIDENCE_STATUS = 'JOB_RESIDENCE_STATUS',
  JOB_SALARY_TYPE = 'JOB_SALARY_TYPE',
  JOB_ACCOMMODATION_STATUS = 'JOB_ACCOMMODATION_STATUS',
  JOB_GENDER = 'JOB_GENDER',
  JOB_OCCUPATION = 'JOB_OCCUPATION'

}

export enum EDGE_DIRECTION {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  ANY = 'ANY'
}

export enum COLLECTIONS {
  // SYSTEM
  USER = 'sys_user', // collection
  COMPANY = 'sys_company', // collection
  MESSAGE = 'sys_message', // collection
  CLASS = 'sys_class', // collection
  MASTER_DATA = 'sys_master_data', // collection
  ROLE_GROUP = 'sys_role_group', // collection
  ROLE_PATH = 'sys_role_path', // collection
  PARTICIPATION = 'sys_participation', // collection
  FILE = 'sys_files', // collection
  IMPORT_DATA = 'sys_import_data',
  SYNC_PE_HISTORY = 'sync_pe_history', // collection
  SYNC_API_CONFIG = 'sync_api_config', //collection
  SYS_BINARY_DATA = 'sys_binary_data', // collection
  SYS_ROLE_GROUP = 'sys_role_group', //collection
  SYS_ROLE_PATH = 'sys_role_path', //collection

  // SKILL MATCHING
  // USER
  USER_SETTING = 'user_setting', // collection
  USER_CERTIFICATE_AWARD = 'user_certificate_award', // collection
  USER_COURSE = 'user_course', // collection
  USER_EDUCATION = 'user_education', // collection
  USER_EXPERIENCE = 'user_experience', // collection
  USER_LANGUAGE = 'user_language', // collection
  USER_PROFILE = 'user_profile', // collection

  USER_SKILL = 'user_skill', // edge
  USER_JOB_QUERY = 'user_job_query', // collection
  USER_JOB_SEARCH_HISTORY = 'user_job_search_history', // collection

  // MASTER
  CERTIFICATE_AWARD = 'm_certificate_award', // collection
  TRAINING_CENTER = 'm_training_center', // collection
  SCHOOL = 'm_school', // collection
  TITLE = 'm_title', // collection
  INDUSTRY = 'm_industry', // collection
  SKILL = 'm_skill', // collection

  // BUSINESS
  PROJECT = 'biz_project', // collection
  PROJECT_SKILL = 'biz_project_skill', // edge
  JOB = 'biz_job', // collection
  JOB_SKILL = 'biz_job_skill', // edge

  // NETWORK
  CONNECTION_USER_USER = 'connection_user_user',
  VIEW_USER_USER = 'view_user_user',
  VIEW_USER_COMPANY = 'view_user_company',
  LOVE_USER_COMPANY = 'love_user_company',
  LOVE_USER_JOB = 'love_user_job',
  USER_VIEW_JOB = 'user_view_job',
  SAVE_JOB_USER = 'save_job_user',
  SAVE_COMPANY_USER = 'save_company_user',

  // CONNECTION
  CONNECTION_USER_PROJECT = 'connection_user_project', // edge
  CONNECTION_USER_JOB = 'connection_user_job' // edge
}
