/**
 * Created by dsy on 2018/7/18.
 * 策略搬砖详情
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

@connect(({ avaMoveBricks }) => ({
  avaMoveBricks,
}))
@Form.create()
export default class Details extends Component {
  state = {
    visible: false,
    id: 0,
    updateId: 0,
    maxData: {},
  };

  componentDidMount() {
    this.setState({ id: this.props.location.state });

    this.props.dispatch({
      type: 'avaMoveBricks/getInfo',
      payload: {
        id: this.props.location.state,
      },
      callback: (res, hedged ) => {
        this.renderMarket(res);
        this.renderHedged(hedged);
        // 缓存数据
        this.setState(
          {
            mapData: res,
            updateId: res.maxData.id,
            maxData: res.maxData,
            hedgedData: hedged,
          },
          () => {
            setTimeout(this.updateMarket(), 5000);
          }
        );
      },
    });
  }

  //刷新数据
  updateMarket() {
    const {
      avaMoveBricks: { id },
    } = this.props;
    this.state.timer = setInterval(() => {
      this.props.dispatch({
        type: 'avaMoveBricks/updateMarket',
        payload: {
          id: this.state.id,
          max: this.state.updateId,
        },
        callback: res => {
          let { xdata, ydata, maxData } = res;
          this.state.mapData.xdata = this.state.mapData.xdata.concat(xdata);
          this.state.mapData.ydata = this.state.mapData.ydata.concat(ydata);

          this.state.hedgedData.xdata = this.state.hedgedData.xdata.concat(res.hedged.xdata);
          this.state.hedgedData.ydata = this.state.hedgedData.ydata.concat(res.hedged.ydata);

          this.setState(
            {
              mapData: this.state.mapData,
              updateId: maxData.id,
              maxData: res.maxData,
              hedgedData: this.state.hedgedData,
            },
            () => {
              this.renderMarket(this.state.mapData);
              this.renderHedged(this.state.hedgedData);
            }
          );
        },
      });
    }, 3000);
  }

  componentWillUnMount() {
    clearInterval(this.state.timer);
  }

  // 监听离开页面事件
  componentWillUnmount() {
    // 停止实时刷新数据
    clearInterval(this.state.timer);
  }
  //基本信息及图表
  renderInfo() {
    const {
      avaMoveBricks: { details, depot },
    } = this.props;
    let { stock_one, stock_two, base, quota, create_time, run_time } = depot;
    return (
      <Card bordered={false} title={`${stock_one}-${stock_two}_${base}/${quota}`}>
        <DescriptionList size="large" col="3">
          <Description term="创建时间">{create_time}</Description>
          <Description term="运行时间">{parseInt(run_time * 100) / 100}小时</Description>
          <Description term="价差额度">
            <a onClick={() => this.showModal()} style={{ textDecoration: 'underline' }} />
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  renderTable() {
    const columns = [
      {
        title: '时间',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '买卖(sell/buy)',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '价格',
        dataIndex: 'memo',
        key: 'memo',
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
      },
    ];

    return (
      <Row gutter={24}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card loading={false} bordered={false} title="平台1" style={{ marginTop: 20 }}>
            <Table pagination={true} loading={false} dataSource={[]} columns={columns} />
          </Card>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card
            loading={false}
            bordered={false}
            title="平台2"
            bodyStyle={{ padding: 24 }}
            style={{ marginTop: 20 }}
          >
            <Table pagination={true} loading={false} dataSource={[]} columns={columns} />
          </Card>
        </Col>
      </Row>
    );
  }

  //市值利润等
  renderProfit() {
    return (
      <Card bordered={false} style={{ marginTop: 20 }}>
        <DescriptionList size="large">
          <Description term="获得利润">1000000000</Description>
          <Description term="现市值">1234123421</Description>
          <Description term="期货市值">1234123421</Description>
          <Description term="手续费市值">21432</Description>
        </DescriptionList>
      </Card>
    );
  }

  //仓位信息
  renderPositiont() {
    if (!this.state.maxData) return false;
    let {
      a_access_key,
      b_access_key,
      a_base_amt,
      b_base_amt,
      a_quote_amt,
      b_quote_amt,
      a_market_value,
      b_market_value,
    } = this.state.maxData;

    const {
      avaMoveBricks: { depot },
    } = this.props;
    let { stock_one, stock_two } = depot;

    let a_market_base_pro = ((a_market_value - a_quote_amt) / a_market_value) * 100;
    let a_market_quote_pro = (a_quote_amt / a_market_value) * 100;

    let b_market_base_pro = ((b_market_value - b_quote_amt) / b_market_value) * 100;
    let b_market_quote_pro = (b_quote_amt / b_market_value) * 100;
    return (
      <Card bordered={false} style={{ marginTop: 20 }} title="平台仓位信息">
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
          <Description term={`${stock_two}剩余BTC`}>{b_base_amt}</Description>
          <Description term={`${stock_two}剩余USDT`}>{b_quote_amt}</Description>
          <Description>
            <div className={Style.box}>
              <span className={Style.rnum}>{`${parseInt(b_market_base_pro * 100) / 100}%`}</span>
              <div className={Style.progress}>
                <div className={Style.left} style={{ width: `${b_market_base_pro}%` }} />
                <div className={Style.right} style={{ width: `${b_market_quote_pro}%` }} />
                <div className={Style.title}>
                  {stock_two}总市值{b_market_value}
                </div>
              </div>
              <span className={Style.lnum}>{`${parseInt(b_market_quote_pro * 100) / 100}%`}</span>
            </div>
          </Description>

          <Description term="现货1账号">{a_access_key}</Description>
          <Description term="现货2账号">{b_access_key}</Description>
          {/* <Description term="期货账号">100000</Description> */}
          {/* <Description term="提醒邮箱">
            <span style={{ textDecoration: 'underline' }}>1000000000</span>
          </Description> */}
        </DescriptionList>
      </Card>
    );
  }

  renderTrade() {
    const columns = [
      {
        title: '时间',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '平台',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '交易对',
        dataIndex: 'memo',
        key: 'memo',
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '手续费',
        dataIndex: 'money',
        key: 'money',
      },
    ];
    return (
      <Card bordered={false} style={{ marginTop: 20 }} title="交易记录">
        <Table pagination={true} loading={false} dataSource={[]} columns={columns} />
      </Card>
    );
  }

  //弹出框
  renderModel = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title="设置信息"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="设置提醒差价额度">
            <InputNumber
              min={0}
              max={100}
              step={0.01}
              onChange={this.onChange}
              value={this.state.quota}
            />
            <span>%</span>
          </FormItem>
          <FormItem label="设置提醒邮箱地址">
            <AutoComplete
              dataSource={this.state.dataSource}
              style={{ width: 200 }}
              onChange={this.handleEmailChange}
              placeholder="Email"
            />
          </FormItem>
        </Form>
      </Modal>
    );
  };

  // 显示弹出框
  showModal() {
    this.setState({
      visible: true,
    });
  }

  //弹窗关闭
  handleCancel = () => {
    this.setState({ visible: false });
  };

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

  // 对冲图表
  renderHedged( data ){
    let marketChart = echarts.init(document.getElementById('hedged'));
    // 绘制图表
    marketChart.setOption(
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
            name: '对冲',
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
  }

  render() {
    const {
      avaMoveBricks: { marketChar },
    } = this.props;
    return (
      <PageHeaderLayout title="搬砖策略详情">
        {this.renderInfo()}
        <Card
          bordered={false}
          title="市值折线图"
          style={{ display: JSON.stringify(marketChar) == '{}' ? 'none' : 'block' }}
        >
          <div id="market" style={{ width: '100%', height: 500 }} />
        </Card>

        <Card
          bordered={false}
          title="对冲折线图"
          style={{ display: JSON.stringify(marketChar) == '{}' ? 'none' : 'block' }}
        >
          <div id="hedged" style={{ width: '100%', height: 500 }} />
        </Card>
        {this.renderPositiont()}
      </PageHeaderLayout>
    );
  }
}
