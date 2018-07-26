/**
 * Created by dsy on 2018/7/18.
 * 外汇搬砖
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button,Select,Card,Input,Form,message,Modal,InputNumber,AutoComplete,Row,Col,Icon,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import DescriptionList from 'components/DescriptionList';
import moment from 'moment';

const { Description } = DescriptionList;
const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ foreign }) => ({
  foreign,
}))
@Form.create()
export default class Foreign extends Component {
  state = {
    visible:false,//是否显示弹窗
    dataSource:[],
    quota:0,//价差
    email:"",
  };

  componentDidMount() {

  }

  //跳转
  toDetails(){
    this.props.dispatch(routerRedux.push('/chance/foreignDetails'));
  }

  //添加监控
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (values.platformFirst) {
          this.showModal();
      }
    });
  };

  //邮箱改变
  handleEmailChange = (value) => {
    this.setState({
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@gmail.com`,
        `${value}@163.com`,
        `${value}@qq.com`,
      ],
      email:value
    });
  };

  //设置提醒差价额度
  onChange=(value)=> {
    this.setState({quota:  Math.floor(value * 100) / 100
    })
  };

  //弹窗确定
  handleOk = () => {
    if(this.state.quota==0){
      message.warning("请设置提醒差价额度");
      return
    }
    if(this.state.email.length==0){
      message.warning("请设置提醒邮箱");
      return
    }
    this.setState({ visible: false });
  };

  //编辑
  setting(){
    this.setState({ visible: true });
  }

  //删除
  deleteItem(){

  }

  // 显示弹出框
  showModal = () => {
    this.setState({
      visible: true,
    },(
      this.setState({quota:0,email:""})
    ));

  };

  //弹窗关闭
  handleCancel = () => {
    this.setState({ visible: false });
  };

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

  //显示信息
  renderMonitor=()=>{
    const { foreign:{data } } = this.props;
    return(
      <Card bordered={false} style={{marginBottom:20}}>
        {
          data.map((item,i)=>(
            <div key={i}>
              <div style={{background:'#fff'}}>
                <DescriptionList size="small" col="2">
                  <Description term="平台信息">
                    <span style={{color:'#333',fontWeight:600}}>{item.platformFirst}</span>
                  </Description>
                  <Description term="创建时间">{item.createTime}</Description>
                  <Description term="运行时间">{moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}</Description>
                  <Description term="提醒次数"><span style={{textDecoration:'underline',color:'red',fontWeight:600}} onClick={()=>this.toDetails()}>{item.time}</span></Description>
                  <Description term="价差额度">{item.quota}</Description>
                  <Description term="邮箱地址">{item.email}</Description>
                </DescriptionList>
              </div>

              <div style={{width:'100%',marginTop:20}}>
                <Row>
                  <Col md={18} sm={12} xs={24} style={{position:'relative'}}>
                    <div id="main" style={{width:'75%', height: 290 }}></div>
                    <span style={{position:'absolute',right:120,top:10}}>
                      <Icon type="setting" style={{ fontSize: 16,marginRight:10 }} onClick={()=>this.setting()}></Icon>
                      <Popconfirm title="是否要删除此监控？" onConfirm={() => this.deleteItem()}>
                        <Icon type="delete" style={{ fontSize: 16 }}></Icon>
                      </Popconfirm>
                    </span>
                  </Col>
                  <Col md={3} sm={12} xs={24}>
                    <p style={{fontSize: 16,fontWeight:600}}>{item.platformFirst}</p>
                    <p style={{color:'rgb(255,83,83)'}}>6405.95</p>
                    <p style={{color:'rgb(255,83,83)'}}>6405.94</p>
                    <p style={{color:'rgb(255,83,83)'}}>6404.85</p>
                    <p style={{fontSize: 16,fontWeight:600}}>6403.99</p>
                    <p style={{color:'rgb(6,176,124)'}}>6403.95</p>
                    <p style={{color:'rgb(6,176,124)'}}>6402.94</p>
                    <p style={{color:'rgb(6,176,124)'}}>6401.85</p>
                  </Col>
                </Row>
              </div>
            </div>
          ))
        }
      </Card>
    )
  };

  render() {
    const {foreign:{platform,data},form} =this.props;
    const {getFieldDecorator} = form;
    return (
      <PageHeaderLayout
        title="外汇搬砖"
        >
        <Card>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit} layout="inline">
            <Row>
              <Col md={7} sm={16}>
                <FormItem label="平台">
                  {getFieldDecorator('platformFirst', {
                    rules: [
                      {
                        required: true,
                        message: '请选择平台',
                      },
                    ],
                  })(
                    <Select style={{ width: 200 }}
                            placeholder="请选择平台"
                      >
                      {
                        platform.map((item, i)=>(
                          <Option value={item} key={item}>{item}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={3} sm={16}>
                <FormItem style={{marginLeft:5}}>
                  <Button type="primary" htmlType="submit">
                    添加监控
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {
          data.length>0?
            this.renderMonitor():null
        }
        {
          this.renderModel()
        }
      </PageHeaderLayout>
    )
  }
}
