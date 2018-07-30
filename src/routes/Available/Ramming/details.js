/**
 * Created by dsy on 2018/7/30.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Icon,
  InputNumber,
  AutoComplete,
  Table,
  Button,
  Popconfirm,
  Divider,
  Form,
  Modal,
  Input,
  Tooltip,
  Progress,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';

import Style from './details.scss';

const { Description } = DescriptionList;
const FormItem = Form.Item;

@connect(({ avaMoveBricks,avaRamming }) => ({
  avaMoveBricks,
  avaRamming
}))
@Form.create()
export default class Details extends Component {

  state={
    maxData:{},
    id:this.props.match.params.id
    };

  componentDidMount() {
    this.props.dispatch({
      type: 'avaRamming/getInfo',
      payload: {
        id: this.state.id,
      },
      callback: (res ) => {
        this.renderMarket(res);
        // 缓存数据
        this.setState(
          {
            mapData: res,
            updateId: res.maxData.id,
            maxData: res.maxData,
          },
          () => {
            this.state.outtimer=setTimeout(()=>this.updateMarket(), 5000);
          }
        );
      },
    });
  }

  // 监听离开页面事件
  componentWillUnmount() {
    // 停止实时刷新数据
    clearInterval(this.state.timer);
    clearTimeout(this.state.outtimer);
  }

  //市值图表
  renderMarket = data => {
    if (!this.marketChart) {
      this.marketChart = echarts.init(document.getElementById('market'));
    }
    // 绘制图表
    this.marketChart.setOption(
      {
        backgroundColor: '#fff',
        animation: false,
        legend: {
          bottom: 10,
          left: 'center',
          data: ['市值'],
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000',
          },
          position: function(pos, params, el, elRect, size) {
            var obj = { top: 10 };
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
          },
          // extraCssText: 'width: 170px'
        },
        axisPointer: {
          link: { xAxisIndex: 'all' },
          label: {
            backgroundColor: '#777',
          },
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false,
            },
            brush: {
              type: ['lineX', 'clear'],
            },
          },
        },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          outOfBrush: {
            colorAlpha: 0.1,
          },
        },
        visualMap: {
          show: false,
          seriesIndex: 5,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: '#333',
            },
            {
              value: -1,
              color: 'red',
            },
          ],
        },
        grid: [
          {
            left: '10%',
            right: '8%',
            height: '50%',
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: data.xdata,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              z: 100,
            },
          },
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true,
            },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 98,
            end: 100,
          },
          {
            show: true,
            xAxisIndex: [0],
            type: 'slider',
            top: '70%',
            start: 98,
            end: 100,
          },
        ],
        series: [
          {
            name: '市值',
            type: 'line',
            data: data.ydata,
            smooth: true,
            lineStyle: {
              normal: { opacity: 0.5 },
            },
            itemStyle: {
              normal: {
                color: '#1890ff',
                lineStyle: {
                  color: '#1890ff',
                },
              },
            },
          },
        ],
      },
      true
    );
  };

  //刷新数据
  updateMarket() {

    this.state.timer = setInterval(() => {
      this.props.dispatch({
        type: 'avaRamming/updateMarket',
        payload: {
          id: this.state.id,
          max: this.state.updateId,
        },
        callback: res => {
          let { xdata, ydata, maxData } = res;
          this.state.mapData.xdata = this.state.mapData.xdata.concat(xdata);
          this.state.mapData.ydata = this.state.mapData.ydata.concat(ydata);

          this.setState(
            {
              mapData: this.state.mapData,
              updateId: maxData.id,
              maxData: res.maxData,
            },
            () => {
              this.renderMarket(this.state.mapData);
            }
          );
        },
      });
    }, 3000);
  }

  render(){
    let {
      a_base_amt,
      a_quote_amt,
      a_market_value,
      } = this.state.maxData;

    const {
      avaRamming: {  depot },
      } = this.props;
    let { stock_one, stock_two, base, quota} = depot;
    let a_market_base_pro = ((a_market_value - a_quote_amt) / a_market_value) * 100;
    let a_market_quote_pro = (a_quote_amt / a_market_value) * 100;

    return (
      <PageHeaderLayout title="对捣详情">
        <Card
          bordered={false}
          title={`${stock_one}-${stock_two}_${base}/${quota}`}>
          <div id="market" style={{ width: '100%', height: 500 }} />
          <DescriptionList>
           <p><span className={Style.admin}>{`现货${stock_one}账号`}:</span><span>{ this.state.maxData.a_access_key}</span></p>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term={`${stock_one}剩余BTC`}>{a_base_amt}</Description>
            <Description term={`${stock_one}剩余USDT"`}>{a_quote_amt}</Description>
            <Description>
              <div className={Style.box}>
                <span className={Style.rnum}>{`${parseInt(a_market_base_pro * 100) / 100}%`}</span>
                <div className={Style.progress}>
                  <div className={Style.left} style={{ width: `${a_market_base_pro}%` }} />
                  <div className={Style.right} style={{ width: `${a_market_quote_pro}%` }} />
                  <div className={Style.title}>
                    {stock_one}总市值{a_market_value}
                  </div>
                </div>
                <span className={Style.lnum}>{`${parseInt(a_market_quote_pro * 100) / 100}%`}</span>
              </div>
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
