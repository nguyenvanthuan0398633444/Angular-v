export const environment = {
  production: true,
  default :false,
  isMatching: true,
  COMMON: {
    COMPANY_DEFAULT: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
    LANG_DEFAULT: 'ja_JP',
    LOCALE_DEFAULT: 'ja-JP',
    VERSION: 'v1.2',
  },
  API_PATH: {
    BASE_REST_PREFIX: '/rest-api/v1',
    BASE_GRAPHQL_PREFIX: '/api/v1',
    AUREOLEV: {
      RECOMMENCED_USER: {
        MATCHING_COMPANY: '/recommenced-user/matching-company',
        GET_DETAIL_MATCHING: '/recommenced-user/get-detail',
        GET_COMPANY_PROFILE: '/recommenced-user/get-company-profile',
        GET_TAB_SAVE: '/recommenced-user/get-tab-save',
        SEARCH_COMPANY: '/recommenced-user/search-company',
        SAVE_COMPANY_USER: '/recommenced-user/save-company-user',
        REMOVE_SAVE_COMPANY_USER : '/recommenced-user/remove-save-company-user'
      },
      RECOMMENCED_JOB: {
        MATCHING_USER: '/recommenced-job/matching-user',
        GET_DETAIL_MATCHING: '/recommenced-job/get-detail',
        GET_USER_PROFILE: '/recommenced-job/get-user-profile',
        GET_TAB_SAVE: '/recommenced-job/get-tab-save',
        SEARCH_USER: '/recommenced-job/search-user',
        SAVE_USER_JOB: '/recommenced-job/save-user-job',
        REMOVE_SAVE_USER_JOB : '/recommenced-job/remove-save-user-job'
      }
    },
    COMPANY: {
      SAVE: '/company/save'
    }
  },
};
