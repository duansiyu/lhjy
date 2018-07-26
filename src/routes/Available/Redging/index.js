/**
 * Created by dsy on 2018/7/18.
 * 策略对冲
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,Row,Col,Icon, Table,Button,Popconfirm, Divider,Form,Modal,Input} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;
const FormItem = Form.Item;

@connect(({ avaRedging }) => ({
  avaRedging,
}))
@Form.create()
export default class Index extends Component {

  state = {
    visible:false,//是否显示弹窗
  };

  componentDidMount() {

  }

  //弹窗关闭
  handleCancel = () => {
    this.setState({ visible: false });
  };

  // 显示弹出框
  showModal = () => {
    this.setState({
      visible: true,
    });

  };

  //弹窗确定
  handleOk = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        this.setState({ visible: false });
      }
    });
  };

  //弹出框
  renderModel=()=>{
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return(
      <Modal
        title="添加／设置策略信息"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        >
        <Form>
          <FormItem  label="平台1">
            {getFieldDecorator('platformFirst', {
              rules: [
                {
                  required: true,
                  message: '平台1不能为空',
                },
              ],
            })(
              <Input placeholder="请输入平台1的文件名" />
            )}
          </FormItem>
          <FormItem  label="平台2">
            {getFieldDecorator('platformSecond', {
              rules: [
                {
                  required: true,
                  message: '平台2不能为空',
                },
              ],
            })(
              <Input placeholder="请输入平台2的文件名" />
            )}
          </FormItem>
          <FormItem  label="期货平台">
            {getFieldDecorator('futures', {
              rules: [
                {
                  required: true,
                  message: '期货平台不能为空',
                },
              ],
            })(
              <Input placeholder="请输入期货平台的文件名" />
            )}
          </FormItem>
          <FormItem  label="货币">
            {getFieldDecorator('currency', {
              rules: [
                {
                  required: true,
                  message: '货币不能为空',
                },
              ],
            })(
              <Input placeholder="请输入货币名称" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  };

  render() {
    const columns = [
      {
        title: '策略',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '当前市值',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        dataIndex: 'num',
        key: 'num',
        render: (text, record) => {
          <span>
              <a>查看</a>
              <Divider type="vertical"/>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>

        },
      },
    ];

    return (
      <PageHeaderLayout
        title="对冲">
        <Card bordered={false}>
          <Button type="primary" style={{marginBottom:20}} onClick={this.showModal}>
            添加策略
          </Button>
          <Table
            pagination={false}
            loading={false}
            dataSource={[]}
            columns={columns}
            />
        </Card>
        <Card bordered={false}>
          <DescriptionList size="large" col="3">
            <Description term="预期获得利润">

            </Description>
            <Description term="现在利润">

            </Description>
            <Description term="实时利润">

            </Description>
            <Description term="币价已实现盈亏">

            </Description>
            <Description term="可用保证金">

            </Description>
            <Description term="已用保证金">

            </Description>
            <Description term="冻结保证金">

            </Description>
          </DescriptionList>
        </Card>
        {
          this.renderModel()
        }
      </PageHeaderLayout>
    )
  }
}
