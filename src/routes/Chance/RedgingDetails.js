/**
 * Created by dsy on 2018/7/17.
 *  对冲详情
 * dsy
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,Row,Col,Icon, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;

@connect(({ redging }) => ({
  redging ,
}))

export default class Details extends Component{

  componentDidMount(){

  }

  render(){
    const { redging:{ details } } = this.props;

    const columns = [
      {
        title: '时间',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '平台1(sell/buy)',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '平台2(sell/buy)',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
      },
      {
        title: '价差',
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
      <PageHeaderLayout
        title="对冲监控详情"
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        >
        <Card bordered={false}>
          <DescriptionList size="small" col="2">
            <Description term="平台信息">{details.platformFirst+"-"+details.platformSecond+"_"+details.currency}</Description>
            <Description term="创建时间">{details.createTime}</Description>
            <Description term="运行时间">{moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}</Description>
            <Description term="提醒次数">{details.time}</Description>
            <Description term="价差额度">{details.quota}</Description>
            <Description term="邮箱地址">{details.email}</Description>
          </DescriptionList>
        </Card>
        <Card bordered={false}>
          <Table
            pagination={false}
            loading={false}
            dataSource={[]}
            columns={columns}
            />
        </Card>
      </PageHeaderLayout>
    )
  }
}
