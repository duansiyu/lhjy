/**
 * Created by dsy on 2018/7/22.
 */
import React, { Component } from 'react';
import { Button,Select,Card,Input,Form,message,Modal,InputNumber,AutoComplete,Row,Col,Icon,Popconfirm } from 'antd';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class BlendChart extends Component {
  state = {};

  componentDidMount() {
    var myChart = echarts.init(document.getElementById(this.props.id));
    console.log(this.props.data);
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      title: {text: this.props.title || '柱状图'},
      toolbox: {
        feature: {
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      legend: {
        data: ['平台1-平台2', '平台2-平台1']
      },
      xAxis: [
        {
          type: 'category',
          data: this.props.data.xdata,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [{
        type: 'value',
        name: '差价',
        axisLabel: {
          formatter: '{value}'
        }
      },

      ],
      series: [{
        name: '平台1-平台2差价',
        type: 'bar',
        data: this.props.data.y1data,
        itemStyle : {
          normal : {
            color:'rgb(240, 72, 100)',
            lineStyle:{
              color:'rgb(240, 72, 100)'
            }
          }
        },
      }, {
        name: '平台2-平台1差价',
        type: 'bar',
        data: this.props.data.y2data,
        itemStyle : {
          normal : {
            color:'rgb(47, 194, 91)',
            lineStyle:{
              color:'rgb(47, 194, 91)'
            }
          }
        },
      },
      ]
    });
  }


  render() {
    return (
      <div id={this.props.id} style={{width:'80%', height: 290 }}></div>
    );
  }
}

export default BlendChart;
