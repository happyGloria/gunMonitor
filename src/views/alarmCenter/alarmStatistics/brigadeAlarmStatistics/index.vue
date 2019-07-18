<template>
  <div id="brigadeAlarmStatistics">
  
    <el-select class="selectLargeTeam" v-model="value1" placeholder="请选择">
      <el-option
        v-for="item in largeTeamOptions"
        :selected="item.value=='1'"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select class="selectRange" v-model="value2" placeholder="请选择">
      <el-option
        v-for="item in options"
        :selected="item.value=='1'"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div id="myChart" :style="{width: '100%', height: '700px'}"></div>
  </div>
</template>


<script>
import echarts from "echarts";

export default {
  name: "brigadeAlarmStatistics",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      options: [
        {
          value: "1",
          label: "本周"
        },
        {
          value: "2",
          label: "本月"
        }
      ],
      largeTeamOptions: [
        {
          value: "1",
          label: "大队A"
        },
        {
          value: "2",
          label: "大队B"
        },
        {
          value: "3",
          label: "大队C"
        },
        {
          value: "4",
          label: "大队D"
        }
      ],
      value1: "",
      value2: ""
    };
  },
  mounted() {
    this.drawLine();
  },
  created() {
    this.value = this.options[0].value;
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        // color: ["#0071c6"],
        // title: { text: "大队报警统计" },
        // tooltip: {},
        // xAxis: {
        //   data: [
        //     "枪支拆除报警",
        //     "车辆人员报警",
        //     "枪支设备电量报警",
        //     "车辆位置偏离报警",
        //     "枪支位置偏离报警",
        //     "超速报警"
        //   ]
        // },
        // yAxis: {},
        // series: [
        //   {
        //     name: "销量",
        //     type: "bar",
        //     data: [5, 20, 36, 10, 10, 20]
        //   }
        // ]
         backgroundColor: 'rgb(0, 113, 198)',

    title: {
        text: '大队报警统计',
        left: 'center',
        top: 20,
        textStyle: {
            color: 'white'
        }
    },

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series : [
        {
            name:'报警次数',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
                {value:335, name:'枪支拆除报警'},
                {value:310, name:'车辆人员报警'},
                {value:274, name:'枪支设备电量报警'},
                {value:235, name:'车辆位置偏离报警'},
                {value:400, name:'枪支位置偏离报警'},
                 {value:400, name:'超速报警'}
            ].sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 1)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#4169E1',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
      });
    },
    handleFilter() {
    //   this.listQuery.page = 1;
    //   this.getList();
    },
  }
};
</script>
<style lang="scss" scoped>
#brigadeAlarmStatistics{
.selectRange {
  position: relative;
//   left: 126px;
  top: 58px;
  z-index: 100;
  width:100px;
}
.selectLargeTeam{
position: relative;
  left: 324px;
  top: 58px;
  z-index: 200;
}
}

</style>













