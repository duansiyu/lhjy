/**
 * Created by dsy on 2018/7/18.
 * 策略搬砖详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,Row,Col,Icon,InputNumber,AutoComplete, Table,Button,Popconfirm, Divider,Form,Modal,Input, Tooltip, Progress} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;
const FormItem = Form.Item;

@connect(({ avaMoveBricks }) => ({
  avaMoveBricks,
}))
@Form.create()
export default class Details extends Component {

  state = {
    visible:false
  };

  componentDidMount() {

  }

  //基本信息及图表
  renderInfo(){
   const {avaMoveBricks:{details}} = this.props;

    return(
      <Card bordered={false} title={details.platformFirst+"-"+details.platformSecond+"_"+details.currency}>
        <DescriptionList size="large" col="3">
          <Description term="创建时间">
            {details.createTime}
          </Description>
          <Description term="运行时间">
            {details.runtime}
          </Description>
          <Description term="价差额度">
            <a onClick={()=>this.showModal()}style={{textDecoration:'underline'}}>{details.quota}</a>
          </Description>
        </DescriptionList>
      </Card>
    )
  }

  renderTable(){
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

    return(
      <Row gutter={24}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card
            loading={false}
            bordered={false}
            title="平台1"
            style={{ marginTop: 20 }}
            >
            <Table
              pagination={true}
              loading={false}
              dataSource={[]}
              columns={columns}
              />
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
            <Table
              pagination={true}
              loading={false}
              dataSource={[]}
              columns={columns}
              />
          </Card>
        </Col>
      </Row>
    )
  }

  //市值利润等
  renderProfit(){
    return(
      <Card  bordered={false}  style={{ marginTop: 20 }}>
        <DescriptionList size="large">
          <Description term="获得利润">1000000000</Description>
          <Description term="现市值">1234123421</Description>
          <Description term="期货市值">1234123421</Description>
          <Description term="手续费市值">21432</Description>
        </DescriptionList>
      </Card>
    )
  }

  //仓位信息
  renderPositiont(){
    return(
      <Card  bordered={false}  style={{ marginTop: 20 }}   title="平台仓位信息">
        <DescriptionList size="large">
          <Description term="A平台剩余BTC">1000000000</Description>
          <Description term="A平台剩余USDT">1234123421</Description>
          <Description>
            <Tooltip style={{width:200}}>
              <Progress style={{width:200}} percent={100} successPercent={50}/>
            </Tooltip>
          </Description>
          <Description term="B平台剩余BTC">1000000000</Description>
          <Description term="B平台剩余USDT">1234123421</Description>
          <Description>
            <Tooltip>
              <Progress style={{width:200}} percent={100} successPercent={30}/>
            </Tooltip>
          </Description>
          <Description term="现货1账号">1000000000</Description>
          <Description term="现货2账号">1000000000</Description>
          <Description term="期货账号">100000</Description>
          <Description term="提醒邮箱">
            <span style={{textDecoration:'underline'}}>1000000000</span>
          </Description>
        </DescriptionList>
      </Card>
    )
  }

  renderTrade(){
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
    return(
      <Card  bordered={false}  style={{ marginTop: 20 }}   title="交易记录">
        <Table
          pagination={true}
          loading={false}
          dataSource={[]}
          columns={columns}
          />
      </Card>
    )
  }

  //弹出框
  renderModel=()=>{
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return(
      <Modal
        title="设置信息"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        >
        <Form>
          <FormItem  label="设置提醒差价额度">
            <InputNumber min={0} max={100} step={0.01} onChange={this.onChange} value={this.state.quota}/>
            <span>%</span>
          </FormItem>
          <FormItem  label="设置提醒邮箱地址">
            <AutoComplete
              dataSource={this.state.dataSource}
              style={{ width: 200 }}
              onChange={this.handleEmailChange}
              placeholder="Email"
              />
          </FormItem>
        </Form>
      </Modal>
    )
  };

  // 显示弹出框
  showModal() {
    this.setState({
      visible: true,
    });

  };

  //弹窗关闭
  handleCancel = () => {
    this.setState({ visible: false });
  };

  render(){
    return(
      <PageHeaderLayout
        title="搬砖策略详情">
        {this.renderInfo()}
        {this.renderTable()}
        {this.renderProfit()}
        {this.renderPositiont()}
        {this.renderTrade()}
        {this.renderModel()}
      </PageHeaderLayout>
    )
  }
}
