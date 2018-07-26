/**
 * Created by dsy on 2018/7/18.
 * 策略搬砖
 */
export default {
  namespace: 'avaMoveBricks',

  state: {
    platform:["fcoin","huobi","okbx"],//平台
    currency:["BTC/USDT","ETH/USDT","LTC/USDT"],//货币
    data:[{quota:'2.44%',currency:"BTC/USDT",email:'1134@qq.com',time:444,
      platformFirst:'fcoin',platformSecond:'huobi',createTime:'2018-07-16 09:00:00',
      runtime:'20:20:22'}],
    details:{quota:'2.44%',currency:"BTC/USDT",email:'1134@qq.com',time:444,
      platformFirst:'fcoin',platformSecond:'huobi',createTime:'2018-07-16 09:00:00',
      runtime:'20:20:22'},
  },

  effects: {
    *fetchData(_, { call, put }) {

    },
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

