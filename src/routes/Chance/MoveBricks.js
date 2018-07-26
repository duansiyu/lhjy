/**
 * Created by dsy on 2018/7/16.
 * 搬砖
 * dsy
 */
import React, { Component,PureComponent } from 'react';
import { connect } from 'dva';
import { Button,Select,Card,Input,Form,message,Modal,InputNumber,AutoComplete,Row,Col,Icon,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;
import BlendChart from 'components/Charts/Blend';
import Bar from 'components/Charts/Bar/double';

const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ moveBricks }) => ({
  moveBricks,
}))
@Form.create()
export default class MoveBricks extends Component {
  state = {
    visible:false,//是否显示弹窗
    dataSource:[],
    quota:0,//价差
    email:"",
    values:{},
    status:0,//0+ 1update
    id:0,
  };

  // 获取数据
  componentDidMount() {
    this.props.dispatch({
      type: 'moveBricks/fetchData',
    });
    this.props.dispatch({
      type: 'moveBricks/fetchPlatform',
    });
    this.props.dispatch({
      type: 'moveBricks/fetchCurrency',
    });

  }

  //添加监控
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (values.platformFirst&&values.platformSecond&&values.currency) {
        if(values.platformFirst==values.platformSecond){
          message.warning('请选择两个不同的交易平台');
        }else{
          this.setState({
            status:0
          },(this.showModal(values)));

        }
      }
    });
  };

  //邮箱改变
  handleEmailChange = (e) => {
    this.setState({
      email:e.target.value
    });
  };

  //设置提醒差价额度
  onChange=(value)=> {
    this.setState({quota:  Math.floor(value * 100) / 100
    })
  };

  //弹窗确定
  handleOk = () => {
    //console.log(this.state.quota);
    if(this.state.quota==0){
      message.warning("请设置提醒差价额度");
      return
    }
    if(this.state.email.length==0){
      message.warning("请设置提醒邮箱");
      return
    }
    var email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if(!(email.test(this.state.email))){
      message.warning("请设置正确的提醒邮箱");
      return
    }
    if(this.state.status==0){
      this.props.dispatch({
        type:"moveBricks/addMonitoring",
        payload:{
          platform_one:this.state.values.platformFirst,
          platform_two:this.state.values.platformSecond,
          currency:this.state.values.currency,
          difference:this.state.quota,
          mail:this.state.email,
        },callback: (res) =>{
          if(res.status==0){
            message.success("添加成功");
            this.props.dispatch({
              type: 'moveBricks/fetchData',
            });
            this.setState({ visible: false });
          }else{
            message.error(res.msg);
          }

        }
      });
    }else{
      this.props.dispatch({
        type:"moveBricks/updateMonitoring",
        payload:{
          difference:this.state.quota,
          mail:this.state.email,
          id:this.state.id
        },callback: (res) =>{
          if(res.status==0){
            message.success("修改成功");
            this.props.dispatch({
              type: 'moveBricks/fetchData',
            });
            this.setState({ visible: false });
          }else{
            message.error(res.msg);
          }
        }
      });
    }
  };

  //编辑
  setting(data){
    this.setState({ visible: true,email:data.mail,quota:data.difference,status:1,id:data.id });
  }

  //删除
  deleteItem(id){
    this.props.dispatch({
    type:"moveBricks/deleteMonitoring",
    payload:{
        id:id
    },callback: (res) =>{
        if(res.status==0){
          message.success("删除成功");
          this.props.dispatch({
            type: 'moveBricks/fetchData',
          });
          this.setState({ visible: false });
        }else{
          message.error(res.msg);
        }

      }
});
  }

  //跳转
  toDetails(){
    this.props.dispatch(routerRedux.push('/chance/bricksDetails'));
  }

  //弹窗关闭
  handleCancel = () => {
    this.setState({ visible: false,status:0 });
  };

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
              <Input
                value={this.state.email}
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
  renderMonitor=(list)=>{
    return(
      <Card bordered={false} style={{marginBottom:20}}>
        {
          list.map((item,i)=>(
            <div key={i}>
              <div style={{background:'#fff'}}>
                <DescriptionList size="small" col="2">
                  <Description term="平台信息">
                    <span style={{color:'#333',fontWeight:600}}>{item.monitoringData.platform_one}</span>
                    -
                    <span style={{color:'#333',fontWeight:600}}>{item.monitoringData.platform_two}</span>
                    _
                    <span style={{color:'#333',fontWeight:600}}>{item.monitoringData.currency}</span>
                  </Description>
                  <Description term="创建时间">{item.monitoringData.create_time}</Description>
                  <Description term="运行时间">{moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}</Description>
                  <Description term="提醒次数"><a style={{textDecoration:'underline',color:'red',fontWeight:600}} onClick={()=>this.toDetails()}>100</a></Description>
                  <Description term="价差额度">{item.monitoringData.difference}%</Description>
                  <Description term="邮箱地址">{item.monitoringData.mail}</Description>
                </DescriptionList>
              </div>

              <div style={{width:'100%',marginTop:20}}>
                <Row>
                  <Col md={18} sm={12} xs={24} style={{position:'relative'}}>
                    <BlendChart data={item} id={i} title="平台差价折线图" one={item.monitoringData.platform_one} two={item.monitoringData.platform_two}></BlendChart>
                    <span style={{position:'absolute',right:120,top:10}}>
                      <Icon type="setting" style={{ fontSize: 16,marginRight:10 }} onClick={()=>this.setting(item.monitoringData)}></Icon>
                      <Popconfirm title="是否要删除此监控？" onConfirm={() => this.deleteItem(item.monitoringData.id)}>
                        <Icon type="delete" style={{ fontSize: 16 }}></Icon>
                      </Popconfirm>
                    </span>
                  </Col>
                  <Col md={3} sm={12} xs={24}>
                    <p style={{fontSize: 16,fontWeight:600}}>{item.monitoringData.platform_one}</p>
                    <p style={{color:'rgb(255,83,83)'}}>6405.95</p>
                    <p style={{color:'rgb(255,83,83)'}}>6405.94</p>
                    <p style={{color:'rgb(255,83,83)'}}>6404.85</p>
                    <p style={{fontSize: 16,fontWeight:600}}>6403.99</p>
                    <p style={{color:'rgb(6,176,124)'}}>6403.95</p>
                    <p style={{color:'rgb(6,176,124)'}}>6402.94</p>
                    <p style={{color:'rgb(6,176,124)'}}>6401.85</p>
                  </Col>
                  <Col md={3} sm={12} xs={24}>
                    <p style={{fontSize: 16,fontWeight:600}}> {item.monitoringData.platform_two}</p>
                    <p style={{color:'rgb(255,83,83)'}}>6405.95</p>
                    <p style={{color:'rgb(255,83,83)'}}>6405.94</p>
                    <p style={{color:'rgb(255,83,83)'}}>6404.85</p>
                    <p style={{fontSize: 16,fontWeight:600}}>6403.99</p>
                    <p style={{color:'rgb(6,176,124)'}}>6402.95</p>
                    <p style={{color:'rgb(6,176,124)'}}>6401.94</p>
                    <p style={{color:'rgb(6,176,124)'}}>6400.85</p>
                  </Col>
                </Row>
              </div>
            </div>
          ))
        }
      </Card>
    )
  };

  // 显示弹出框
  showModal = (values) => {
    console.log(values);
    this.setState({
      visible: true,
    },(
      this.setState({quota:0,email:"",values:values})
    ));

  };

  render(){
    const { moveBricks:{ platform,currency,list,loading },form } = this.props;
    const { getFieldDecorator } = form;
    console.log(platform);
    return(
      <PageHeaderLayout
        title="搬砖"
        >
        <Card bordered={false} loading={loading}>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit} layout="inline">
            <Row>
              <Col md={7} sm={16}>
                <FormItem label="平台1">
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
              <Col md={7} sm={16}>
                <FormItem label="平台2">
                  {getFieldDecorator('platformSecond', {
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
              <Col md={7} sm={16}>
                <FormItem label="货币">
                  {getFieldDecorator('currency', {
                    rules: [
                      {
                        required: true,
                        message: '请选择货币',
                      },
                    ],
                  })(
                    <Select style={{ width: 200 }}
                            placeholder="请选择货币"
                      >
                      {
                        currency.map((item, i)=>(
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
          list.length>0?
          this.renderMonitor(list):null
        }
        {
          this.renderModel()
        }
      </PageHeaderLayout>
    )
  }
}
