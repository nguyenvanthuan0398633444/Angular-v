export interface KeywordSearch {
  _key?: string;
  value?: string;
  dataAll?: any[];
  filterCondition?: any;
  user_id?: string;
}

export interface AureoleAppState {
  keywordsSearch: any,
  data_reload?: DataReload;
  isReloadApiConfig?:boolean;
  objectId_webdb?:any;
  isReloadDataFlag?:boolean;
}

export interface AppState {
  commonReducer: CommonReducer;
  themeReducer: ThemeReducer;
}

export interface CommonReducer {
  company: string;
  language: string;
  userInfo: UserInfo;
  captions: Caption;
  commonCaptions: Caption;
  isAppLoading: boolean;
  isAllowEditProfile: boolean;
  listPath: string[];
  masterData: any[];
  all_skills: any[];
  activities: any[];
  keywordsSearch: KeywordSearch;
  requestInfo: {
    module: string;
    page: string;
  };
  listSkillHistory: any[];
  user_permissions: string;
  user_setting?: any;
  user_id_temp?: string;
  dataNFM?: any[];
  isReloadDataFlag: boolean;
  data_reload: DataReload;
  app_loading: boolean;
  show_snackbar: any;
  isReloadApiConfig: boolean;
  objectId_webdb?: string;
  currencySymbol?: string;
  isRemmemberMe?: boolean;
}

export interface DataReload {
  secondCountDown?: number;
  currentValue?: number;
  counter?: number;
  isLoadingTable?: boolean;
}

export interface ThemeReducer {
  theme: string;
}


export interface UserAddress {
  country_region?: string;
  district?: string;
  floor_building?: string;
  postcode?: string;
  province_city?: string;
  street?: string;
  ward?: string;
}

export interface UserFile {
  detail?: string;
  name?: string;
}

export interface UserCourse {
  center?: string;
  certificate?: string;
  description?: string;
  files?: UserFile[];
  is_online?: boolean;
  name?: string;
  start_date?: {
    from?: string,
    to?: string
  };
}

export interface UserEducation {
  degree: string;
  description: string;
  field_of_study: string;
  files: UserFile[];
  grade: string;
  school: 'MASTER_DATA';
  start_date: {
    from: string,
    to: string
  };
}

export interface CertificateAward {
  certificate_number: string;
  description: string;
  files: UserFile[];
  issue_by: string;
  issue_date: {
    from: string,
    to: string
  };
  name: string;
}

export interface UserExperience {
  company: string;
  description: string;
  employee_type: any[];
  is_working: boolean;
  job_location: any[];
  start_data: {
    from: string,
    to: string
  };
  title: string;
}

export interface QuerrySetting {
  compamy?: string;
  description?: string;
  employee_type?: string[];
  locations?: string[];
  salary?: {
    from?: number,
    to?: number
  };
  skill?: string[];
  title?: string;
  valid_date?: {
    from?: string,
    to?: string
  };
}

export interface UserInfo {
  user_id?: string;
  email?: string;
  company?: string;
  user_profile?: {
    country_region?: any,
    date_of_birth?: string,
    district?: any,
    first_name?: string,
    floor_building?: any,
    gender?: any,
    industry?: any,
    introduce?: string,
    katakana?: string,
    last_name?: string,
    phone_number?: string,
    postcode?: any
    province_city?: any
    romaji?: string
    street?: any,
    title?: any,
    user_id?: string,
    ward?: any,
    company_working?: any;
    position?: string;
    department?: any;
  };
  username?: string;
}

export interface Caption {
  module: string;
  page?: string;
  data: DataCaption[];
}

export interface DataCaption {
  code: string;
  company: string;
  lang: string;
  module: string;
  name: string;
  page: string;
}

export interface KeywordSearch {
  _key?: string;
  value?: string;
  dataAll?: any[];
  filterCondition?: any;
  user_id?: string;
}
