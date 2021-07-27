import { AureoleAppState } from '../models';
import { AureoleActionTypes } from '../types';

const initialState: AureoleAppState = {
  keywordsSearch: {},
  data_reload: {
    secondCountDown: 30,
    currentValue: -1,
    counter: 30,
    isLoadingTable: false,
  },
  isReloadApiConfig : false,
  objectId_webdb:{},
  isReloadDataFlag : false,
}

interface CommonAction {
  type: string;
  payload: AureoleAppState | any;
}


export const AureoleCommonReducer = (state = initialState, action: CommonAction): AureoleAppState => {
  switch (action.type) {

    case AureoleActionTypes.Get_object_id_webdb:
      return {
        ...state,
        objectId_webdb: action.payload
      }
    case AureoleActionTypes.isReloadApiConfig:
      return {
        ...state,
        isReloadApiConfig: action.payload,
      };
    case AureoleActionTypes.store_keywords_search:
      return {
        ...state,
        keywordsSearch: action.payload,
      };
    case AureoleActionTypes.get_data_reload_flag:
      return {
        ...state,
        data_reload: action.payload
      }
    default:
      return state;
  }

}
