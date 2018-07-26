/**
 * Created by dsy on 2018/7/19.
 * 对冲策略详情
 */
/**
 * Created by dsy on 2018/7/18.
 * 策略搬砖详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,Row,Col,Icon, Table,Button,Popconfirm, Divider,Form,Modal,Input, Tooltip, Progress} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;
const FormItem = Form.Item;

@connect(({ avaRedging }) => ({
  avaRedging,
}))
@Form.create()
export default class Details extends Component {

  //基本信息及图表
  renderInfo(){
    const {avaRedging:{details}} = this.props;

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
            <span style={{textDecoration:'underline'}}>{details.quota}</span>
          </Description>
        </DescriptionList>
      </Card>
    )
  }

  //市值利润等
  renderProfit(){
    return(
      <Card  bordered={false}  style={{ marginTop: 20 }}>
        <DescriptionList size="large">
          <Description term="收敛获得利润">1000000000</Description>
          <Description term="现在利润">1234123421</Description>
          <Description term="现价差百分比">1234123421</Description>
          <Description term="现在市值">21432</Description>
          <Description term="初始币数量">1234123421</Description>
          <Description term="平仓币数量">1234123421</Description>
          <Description term="币价格">21432</Description>
        </DescriptionList>
      </Card>
    )
  }

  renderFutures(){
    return(
      <Card  bordered={false}   title="期货信息">
        <DescriptionList>
          <Description term="币价已实现盈亏">1000000000</Description>
          <Description term="可用保证金">1234123421</Description>
          <Description term="已用保证金">1234123421</Description>
          <Description term="冻结保证金">21432</Description>
          <Description term="初始币数量">1234123421</Description>
        </DescriptionList>
      </Card>
    )
  }

  renderBaseInfo(){
    return(
      <Card  bordered={false}   title="信息">
        <DescriptionList>
          <Description term="期货账号">100000</Description>
          <Description term="邮箱地址">
            <span style={{textDecoration:'underline'}}>1000000000</span>
          </Description>
        </DescriptionList>
      </Card>
    )
  }

  render(){
    return(
      <PageHeaderLayout
        title="对冲策略详情">
        {this.renderInfo()}
        {this.renderProfit()}
        {this.renderFutures()}
        {this.renderBaseInfo()}
      </PageHeaderLayout>
    )
  }
}
