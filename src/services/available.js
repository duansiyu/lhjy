/**
 * Created by dsy on 2018/7/26.
 * 搬砖
 */

import { stringify } from 'qs';
import request from '../utils/request';

//获取数据列表
export async function getList() {
  return request(`/strategy/getList`)
}

//添加监控
export async function addStrategy(params){
  return request(`/strategy/add`,
    {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      }
    }
  );
}

//获取现货交易平台
export async function getStockType() {
  return request(`/platform/getStockType`)
}

//获取期货交易平台
export async function getFuturesType() {
  return request(`/platform/getFuturesType`)
}

//获取货币
export async function getCurrencyType() {
  return request(`/currency/getCurrencyType`)
}

//获取搬砖详情市值图表
export async function getInfo(params) {
  return request(`/strategy/getInfo`,
    {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      }
    });
}
