/**
 * Created by dsy on 2018/7/22.
 */
import { stringify } from 'qs';
import request from '../utils/request';
//获取监控数据
export async function getMonitorList() {
  return request(`/getMonitoringData`);
}

//获取平台
export async function getPlatformInfo(){
  return request(`/getPlatformInfo`);
}

//获取货币对
export async function getCurrency(){
  return request(`/getCurrency`);
}

//添加监控
export async function addMonitoring(params){
  return request(`/addMonitoring`,
    {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      }
    }
  );
}

//修改监控
export async function updateMonitoring(params){
  return request(`/updateMonitoring`,
    {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      }
    }
  );
}

//删除监控
export async function deleteMonitoring(params){
  return request(`/deleteMonitoring`,
    {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      }
    }
  );
}
