/**
 * Created by dsy on 2018/7/18.
 * 策略搬砖
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

@connect(({ avaMoveBricks,moveBricks }) => ({
  avaMoveBricks,moveBricks
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
      type: 'avaMoveBricks/fetchData',
    })
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

  // 跳转页面
  toDetails(id){
    this.props.dispatch(routerRedux.push({pathname:'/available/bricksDetails/'+ id}));
  }

  //弹窗确定
  handleOk = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        this.props.dispatch({
          type:'avaMoveBricks/addStrategy',
          payload:{
            stock_one:values.first_name,
            stock_two:values.second_name,
            key_one:values.key_one,
            key_two:values.key_two,
            futures:values.futures,
            key_three:values.key_three,
            base:values.base,
            quota:values.quota
          }
        });

        this.setState({ visible: false });

      }
    });
  };

  // 判断两平台是否不同
   checkPlatform = (rule, value, callback) => {
    console.log(rule.field);
    const { form } = this.props;
     var  name = '';
     var info  = '请选择两个不同的平台'
     if(rule.field=='first_name'){
       name='second_name';
     }
     if(rule.field=='second_name'){
       name='first_name';
     }
     if(rule.field=='base'){
       name='quota';
       info = '请选择两种不同的货币';
     }
     if(rule.field=='quota'){
       name='base';
       info = '请选择两种不同的货币';
     }
     if(rule.field=='key_one'){
       name='key_two';
       info = '请输入两个不同的路径';
     }
     if(rule.field=='key_two'){
       name='key_one';
       info = '请输入两个不同的路径';
     }

    if (value && value == form.getFieldValue(name)) {
      callback(info);
    } else {
      callback();
    }
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

  render() {
    const { avaMoveBricks:{ data },form } = this.props;

    const columns = [
      {
        title: '策略',
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
        title="搬砖">
        <Card bordered={false}>
          <Button type="primary" style={{marginBottom:20}} onClick={this.showModal}>
            添加策略
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
