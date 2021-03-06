/**
 * Created by dsy on 2018/7/30.
 */
import {
  addStrategy,
  getStockType,
  getFuturesType,
  getCurrencyType,
  getList,
  updateMarket,
  getInfo,
} from '../services/available.js';
export default {
  namespace: 'avaRamming',

  state: {
    stockType: [], //现货平台
    futuresType: [], //期货平台
    currencyType: [], //货币
    data: [], //列表数据
    marketChar: {}, //市值数据
    id: 0, //更新id,
    depot: {},
  },

  effects: {
    *fetchData(_, { call, put }) {
      const response = yield call(getList);
      if (response.status == 0) {
        response.data.forEach((item, i) => {
          item.key = item.id;
        });
        console.log(response.data);
        yield put({
          type: 'saveTags',
          payload: response.data,
        });
      }
    },
    //添加策略
    *addStrategy({ payload, callback }, { call, put }) {
      const response = yield call(addStrategy, payload);
      if (callback) callback(response);
    },
    //获取搬砖市值图表
    *getInfo({ payload, callback }, { call, put }) {
      const response = yield call(getInfo, payload);
      if (response.status == 0) {
        var xdata = [];
        var ydata = [];

        response.data.market.forEach((item, i) => {
          xdata.push(item.create_ts);
          ydata.push(item.total_market_value);
        });

        var data = {
          xdata: xdata,
          ydata: ydata,
          maxData: response.data.market[response.data.market.length - 1],
        };

        yield put({
          type: 'saveMarketChar',
          payload: data,
        });
        yield put({
          type: 'saveId',
          payload: response.data.market[response.data.market.length - 1].id,
        });
        yield put({
          type: 'saveDepot',
          payload: response.data.strategy[0],
        });
        if (callback) {
          callback(data);
        }
      }
    },
    *updateMarket({ payload, callback }, { select, call, put }) {
      const response = yield call(updateMarket, payload);
      if (response.status == 0) {
        if (response.data.length > 0) {
          yield put({
            type: 'saveId',
            payload: response.data[0].id,
          });
          var maxData = response.data[0];
          var xdata = [];
          var ydata = [];
          var newData = response.data.reverse();
          newData.forEach((item, i) => {
            xdata.push(item.create_ts);
            ydata.push(item.total_market_value);
          });
          var data = { xdata: xdata, ydata: ydata, maxData: maxData};
          yield put({
            type: 'saveMarketChar',
            payload: data,
          });

          if (callback) {
            callback(data);
          }
        }
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
    saveMarketChar(state, action) {
      return {
        ...state,
        marketChar: action.payload,
      };
    },
    saveId(state, action) {
      return {
        ...state,
        id: action.payload,
      };
    },
    saveDepot(state, action) {
      return {
        ...state,
        depot: action.payload,
      };
    },
  },
};
