/**
 * Created by dsy on 2018/7/30.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,Row,Col,Icon, Table,Button,Popconfirm, Divider,Form,Modal,Input,Select} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';
import { routerRedux } from 'dva/router';

const Option = Select.Option;
const { Description } = DescriptionList;
const FormItem = Form.Item;

@connect(({ avaRamming,avaMoveBricks }) => ({
  avaRamming,
  avaMoveBricks
}))
@Form.create()
export default class Index extends Component {

  state = {
    visible:false,//是否显示弹窗
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'avaMoveBricks/getStockType',
    });
    this.props.dispatch({
      type: 'avaMoveBricks/getFuturesType',
    });
    this.props.dispatch({
      type: 'avaMoveBricks/getCurrencyType',
    });
    this.props.dispatch({
      type: 'avaRamming/fetchData',
    });
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

  //弹出框
  renderModel=()=>{
    const { avaMoveBricks:{ stockType,futuresType,currencyType },form } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return(
      <Modal
        title="添加／设置策略信息"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        >
        <Form>
          <FormItem label="平台1名称" {...formItemLayout}>
            {getFieldDecorator('first_name', {
              rules: [
                {
                  required: true,
                  message: '请选择平台',
                },
                {
                  validator:this.checkPlatform,
                },
              ],
            })(
              <Select style={{ width: '100%' }}
                      placeholder="请选择平台"
                >
                {
                  stockType.map((item, i)=>(
                    <Option value={item} key={item}>{item}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem  label="平台1" {...formItemLayout}>
            {getFieldDecorator('key_one', {
              rules: [
                {
                  required: true,
                  message: '平台1路径不能为空',
                },
                {
                  validator:this.checkPlatform,
                },
              ],
            })(
              <Input placeholder="请输入平台1的路径" />
            )}
          </FormItem>
          <FormItem label="平台2名称" {...formItemLayout}>
            {getFieldDecorator('second_name', {
              rules: [
                {
                  required: true,
                  message: '请选择平台',
                },
                {
                  validator:this.checkPlatform,
                },
              ],
            })(
              <Select style={{ width: '100%' }}
                      placeholder="请选择平台"
                >
                {
                  stockType.map((item, i)=>(
                    <Option value={item} key={item}>{item}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem  label="平台2" {...formItemLayout}>
            {getFieldDecorator('key_two', {
              rules: [
                {
                  required: true,
                  message: '平台1路径不能为空',
                },
                {
                  validator:this.checkPlatform,
                },
              ],
            })(
              <Input placeholder="请输入平台2的文件名" />
            )}
          </FormItem>
          <FormItem label="期货平台名称" {...formItemLayout}>
            {getFieldDecorator('futures', {
              rules: [
                {
                  required: true,
                  message: '请选择期货平台',
                },
              ],
            })(
              <Select style={{ width: '100%' }}
                      placeholder="请选择平台"
                >
                {
                  futuresType.map((item, i)=>(
                    <Option value={item} key={item}>{item}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem  label="期货平台" {...formItemLayout}>
            {getFieldDecorator('key_three', {
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
          <FormItem  label="基础货币" {...formItemLayout}>
            {getFieldDecorator('base', {
              rules: [
                {
                  required: true,
                  message: '基础货币不能为空',
                },
                {
                  validator:this.checkPlatform,
                },
              ],
            })(
              <Select style={{ width: '100%' }}
                      placeholder="请选择基础货币"
                >
                {
                  currencyType.map((item, i)=>(
                    <Option value={item} key={item}>{item}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="定额货币" {...formItemLayout}>
            {getFieldDecorator('quota', {
              rules: [
                {
                  required: true,
                  message: '请选择定额货币',
                },
                {
                  validator:this.checkPlatform,
                },
              ],
            })(
              <Select style={{ width: '100%' }}
                      placeholder="请选择定额货币"
                >
                {
                  currencyType.map((item, i)=>(
                    <Option value={item} key={item}>{item}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  };

  // 跳转页面
  toDetails(id){
    this.props.dispatch(routerRedux.push({pathname:'/available/rammingDetails/'+ id}));
  }

  render() {
    const { avaRamming:{ data } } = this.props;

    const columns = [
      {
        title: '对捣',
        dataIndex: 'strategy',
        render: (text, record) => {
          return(
            <span>
            {record.stock_one+"-"+record.stock_two+"_"+record.base+"/"+record.quota}
          </span>)
        },
      },
      {
        title: '当前市值',
        dataIndex: 'stock_two',
      },
      {
        title: '操作',
        render: (text, record) => {
          return(
            <span>
              <a  onClick={()=>this.toDetails(record.id)}>查看</a>
          </span>
          )},
      },
    ];

    return (
      <PageHeaderLayout
        title="对捣">
        <Card bordered={false}>
          <Button type="primary" style={{marginBottom:20}} onClick={this.showModal}>
            添加对捣
          </Button>
          <Table
            pagination={false}
            loading={false}
            dataSource={data}
            columns={columns}
            />
          </Card>
        {
          this.renderModel()
        }
      </PageHeaderLayout>
        )
  }
}
