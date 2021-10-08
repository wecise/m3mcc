<template>
    
    <v-chart :option="options" 
        class="chart" 
        :autoresize="true">
    </v-chart>
    
</template>

<script>
import _ from 'lodash';
import ECharts  from "vue-echarts";
import { use } from "echarts/core";
import * as echarts from "echarts/lib/echarts";

import {
  CanvasRenderer
} from 'echarts/renderers';

import {
  LineChart
} from 'echarts/charts';

import {
  GridComponent,
  GraphicComponent,
  TooltipComponent,
  ToolboxComponent
} from 'echarts/components';

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  GraphicComponent,
  TooltipComponent,
  ToolboxComponent
]);

export default {
    name: 'ChartView',
    props:{
        model: Object
    },
    components: {
        "v-chart": ECharts
    },
    data() {
        return {
            options: {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    right: 10,
                    top: 0,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                grid: {
                    top: '15%',
                    left: '3%',
                    right: '4%',
                    bottom: '45%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            }  
        }
    },
    watch:{
        model:{
            handler(){
                this.initData();
            },
            deep:true
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.initData();
        })
    },
    methods: {
        initData(){
            try{

                let param = encodeURIComponent( JSON.stringify(this.model) );
                this.m3.callFS("/matrix/m3event/diagnosis/tsdb/searchPerformanceByTerm.js",param).then( val=>{
                    let rtn = val.message.result.reverse();

                    //取实时数据的time作为xAxis
                    this.options.xAxis.data = _.map(rtn,(v)=>{
                        return this.moment(v[0]).format('YY-MM-DD HH:mm');
                    });
                    
                    this.options.series = [{
                        name: `${this.model.bucket} ${this.model.key}`,
                        data: _.map(rtn,(v)=>{ return v[1];}),
                        type: 'line',
                        smooth:true,
                        color: 'rgba(108, 212, 11, 1)',
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(108, 212, 11, .5)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(108, 212, 11, .1)'
                                }])
                            }
                        }
                    }];
                } );
                
            } catch(err){
                console.error(err);
            }
        },
        destroyed(){
            document.querySelector(this.$el).off();
        }
    }
};
</script>