/**
 * Created by dsy on 2018/7/18.
 * 策略搬砖
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
  namespace: 'avaMoveBricks',

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
    //获取平台
    *getStockType(_, { call, put }) {
      const response = yield call(getStockType);
      if (response.status == 0) {
        yield put({
          type: 'saveStockType',
          payload: response.data,
        });
      }
    },
    //获取期货
    *getFuturesType(_, { call, put }) {
      const response = yield call(getFuturesType);
      if (response.status == 0) {
        yield put({
          type: 'saveFuturesType',
          payload: response.data,
        });
      }
    },
    //获取货币
    *getCurrencyType(_, { call, put }) {
      const response = yield call(getCurrencyType);
      if (response.status == 0) {
        yield put({
          type: 'saveCurrencyType',
          payload: response.data,
        });
      }
    },
    //获取搬砖市值图表
    *getInfo({ payload, callback }, { call, put }) {
      const response = yield call(getInfo, payload);
      console.log('请求结果', response);
      if (response.status == 0) {
        // 市值折线图
        var xdata = [];
        var ydata = [];
        // 对冲市值图表数据
        var hedged = {
          xdata: [],
          ydata: []
        };

        // 仓位信息折线图
        var positiont = {
          xdata: [],
          ydataOne: [],
          ydataTwo: [],
        }

        // 所有quote的总量
        var totalQuote = {
          xdata: [],
          ydata: [],
        }

        response.data.market.forEach((item, i) => {
          xdata.push(item.create_ts);
          ydata.push(item.total_market_value);

          hedged.xdata.push( item.create_ts );
          // hedged.ydata.push( 
          //   ( item.a_base_amt + item.b_base_amt + item.init_margin_base_amt ) / item.hedged_base_amt
          // )
          hedged.ydata.push( item.a_base_amt + item.b_base_amt );

          positiont.xdata.push( item.create_ts );
          // positiont.ydataOne.push( (item.a_market_value - item.a_quote_amt) / item.a_quote_amt );
          // positiont.ydataTwo.push( (item.b_market_value - item.b_quote_amt) / item.b_quote_amt );
          positiont.ydataOne.push( item.a_base_amt / item.a_market_value );
          positiont.ydataTwo.push( item.b_base_amt  / item.b_market_value );

          totalQuote.xdata.push( item.create_ts );
          totalQuote.ydata.push( item.total_quote_value );
        });

        var data = {
          xdata: xdata,
          ydata: ydata,
          maxData: response.data.market[response.data.market.length - 1],
          positiont: positiont,
          totalQuote: totalQuote,
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
          callback(data, hedged);
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

          var hedged = {
            xdata: [],
            ydata: []
          };

          // 仓位信息折线图
          var positiont = {
            xdata: [],
            ydata1: [],
            ydata2: [],
          }

          // 所有quote的总量
          var totalQuote = {
            xdata: [],
            ydata: [],
          }

          var newData = response.data.reverse();
          newData.forEach((item, i) => {
            xdata.push(item.create_ts);
            ydata.push(item.total_market_value);

            hedged.xdata.push( item.create_ts );
            // hedged.ydata.push( 
            //   ( item.a_base_amt + item.b_base_amt + item.init_margin_base_amt ) / item.hedged_base_amt
            // )
            hedged.ydata.push( item.a_base_amt + item.b_base_amt );

            positiont.xdata.push( item.create_ts );
            // positiont.ydata1.push( (item.a_market_value - item.a_quote_amt) / item.a_quote_amt );
            // positiont.ydata2.push( (item.b_market_value - item.b_quote_amt) / item.b_quote_amt );
            positiont.ydataOne.push( item.a_base_amt / item.a_market_value );
            positiont.ydataTwo.push( item.b_base_amt / item.b_market_value );

            totalQuote.xdata.push( item.create_ts );
            totalQuote.ydata.push( item.total_quote_value );
          });
          var data = { 
            xdata: xdata, 
            ydata: ydata, 
            maxData: maxData,
            hedged:hedged,
            positiont:positiont,
            totalQuote:totalQuote,
           };
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
