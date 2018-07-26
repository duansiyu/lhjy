/**
 * Created by dsy on 2018/7/18.
 * 策略搬砖
 */
import { addStrategy,getStockType,getFuturesType,getCurrencyType,getList } from '../services/available.js';
export default {
  namespace: 'avaMoveBricks',

  state: {
    stockType:[],//现货平台
    futuresType:[],//期货平台
    currencyType:[],//货币
    data:[],
  },

  effects: {
    *fetchData(_, { call, put }) {
      const response = yield call(getList);
      if(response.status==0){
        response.data.forEach((item,i)=>{
          item.key=item.id;
        });
        console.log(response.data);
        yield put({
          type: 'saveTags',
          payload: response.data,
        });
      }
    },
    //添加策略
    *addStrategy({ payload,callback }, { call, put }) {
      const response = yield call(addStrategy, payload);
      if (callback) callback(response);
    },
    //获取平台
    *getStockType(_, { call, put }) {
      const response = yield call(getStockType);
      if(response.status==0) {
        yield put({
          type: 'saveStockType',
          payload: response.data,
        });
      }
    },
    *getFuturesType(_, { call, put }) {
      const response = yield call(getFuturesType);
      if(response.status==0) {
        yield put({
          type: 'saveFuturesType',
          payload: response.data,
        });
      }
    },
    *getCurrencyType(_, { call, put }) {
      const response = yield call(getCurrencyType);
      if(response.status==0) {
        yield put({
          type: 'saveCurrencyType',
          payload: response.data,
        });
      }
    },

  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveStockType(state, action) {
      return {
        ...state,
        stockType: action.payload,
      };
    },
    saveFuturesType(state, action) {
      return {
        ...state,
        futuresType: action.payload,
      };
    },
    saveCurrencyType(state, action) {
      return {
        ...state,
        currencyType: action.payload,
      };
    },
  },
};

