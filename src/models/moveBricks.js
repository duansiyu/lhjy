import { getMonitorList,getPlatformInfo,getCurrency,addMonitoring,updateMonitoring,deleteMonitoring} from '../services/chance.js';

export default {
  namespace: 'moveBricks',

  state: {
    loading:true,
    list: [],
    platform:[],//平台
    currency:[],//货币
    data:[{quota:'2.44%',currency:"BTC/USDT",email:'1134@qq.com',time:444,
      platformFirst:'fcoin',platformSecond:'huobi',createTime:'2018-07-16 09:00:00',
      runtime:'20:20:22'}],
    details:{quota:'2.44%',currency:"BTC/USDT",email:'1134@qq.com',time:444,
      platformFirst:'fcoin',platformSecond:'huobi',createTime:'2018-07-16 09:00:00',
      runtime:'20:20:22'},
  },

  effects: {
    *fetchData(_, { call, put }) {
      const response = yield call(getMonitorList);
      if(response.status==0){
        response.data.forEach((item,i)=>{
          var xdata = [];
          var y1data = [];
          var y2data = [];
          item.k1.forEach((x,y)=>{
            xdata.push(x.time);
            y1data.push(x.difference);
          });
          item.k2.forEach((x,y)=>{
            y2data.push(x.difference);
          });
          item.xdata=xdata;
          item.y1data=y1data;
          item.y2data=y2data;
        });
        yield put({
          type: 'save',
          payload: response.data,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }else{

      }
    },
    *fetchPlatform(_, { call, put }) {
      const response = yield call(getPlatformInfo);
      if(response.status==0) {
        yield put({
          type: 'savePlatform',
          payload: response.data,
        });
      }
    },
    *fetchCurrency(_, { call, put }) {
      const response = yield call(getCurrency);
      if(response.status==0) {
        yield put({
          type: 'saveCurrency',
          payload: response.data,
        });
      }
    },
    *addMonitoring({ payload,callback }, { call, put }) {
      const response = yield call(addMonitoring, payload);
      if (callback) callback(response);
    },
    *updateMonitoring({ payload,callback }, { call, put }) {
      const response = yield call(updateMonitoring, payload);
      if (callback) callback(response);
    },
    *deleteMonitoring({ payload,callback }, { call, put }) {
      const response = yield call(deleteMonitoring, payload);
      if (callback) callback(response);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    savePlatform(state, action) {
      return {
        ...state,
        platform: action.payload,
      };
    },
    saveCurrency(state, action) {
      return {
        ...state,
        currency: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },

},
};
