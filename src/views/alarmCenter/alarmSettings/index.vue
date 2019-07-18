<template>
  <div id="alarmSettings">
    <div class="alarmSettingBox">
      <el-select class="selectAlarmType" v-model="alarmTypeValue" placeholder="请选择" @change="getPlaceholder">
        <el-option
          v-for="item in alarmTypeOptions"
          :selected="item.value=='1'"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="editAlarmType"
        v-if="placeholderText"
        :disabled="!isDisabled"
      >修改</el-button>
      
    </div>
    <div class="carAlarmSettingOutBox" v-if="placeholderText">
      <div class="carAlarmSettingBox">
        一级报警：
        <el-input :placeholder="placeholderText" :disabled="isDisabled" class=" alarmInput" v-model="firstLevel"></el-input>
         <el-input placeholder="请输入报警时长"   :disabled="isDisabled" class=" alarmInput" v-model="firstLevelTime"></el-input>
      </div>
      <div class="carAlarmSettingBox">
        二级报警：
        <el-input :placeholder="placeholderText"    :disabled="isDisabled" class=" alarmInput" v-model="twoLevel"></el-input>
         <el-input placeholder="请输入报警时长"  :disabled="isDisabled" class=" alarmInput" v-model="twoLevelTime"></el-input>
      </div>
      <div class="carAlarmSettingBox">
        三级报警：
        <el-input :placeholder="placeholderText"    :disabled="isDisabled" class=" alarmInput" v-model="threeLevel"></el-input>
         <el-input placeholder="请输入报警时长"  :disabled="isDisabled" class=" alarmInput" v-model="threeLevelTime"></el-input>
      </div>
    </div>
    <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="confirmEdit"
         v-if="placeholderText"
        :disabled="isDisabled"
      >确认修改</el-button>
       <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="cancelEdit"
         v-if="placeholderText"
         :disabled="isDisabled"
      >取消修改</el-button>
  </div>
</template>


<script>
import echarts from "echarts";

export default {
  name: "brigadeAlarmStatistics",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      alarmTypeOptions: [
         {
          value: "4",
          label: "车辆位置偏离报警"
        },
        {
          value: "1",
          label: "枪支拆除报警"
        },
        {
          value: "2",
          label: "车辆人员报警"
        },
        {
          value: "3",
          label: "枪支设备电量报警"
        },
       
        {
          value: "5",
          label: "枪支位置偏离报警"
        },
        {
          value: "6",
          label: "超速报警"
        }
      ],
      alarmTypeValue: "",
      placeholderText: "",
      isDisabled:true,
      firstLevel:'2000米',
      twoLevel:'1000米',
      threeLevel:'500米',
       firstLevelTime:'60分钟',
      twoLevelTime:'30分钟',
      threeLevelTime:'10分钟'
    };
  },
  mounted() {
     
  },
  
  created() {
    this.alarmTypeValue = this.alarmTypeOptions[0].value;
    this.getPlaceholder();
  },
  methods: {
      getPlaceholder(){
           if (this.alarmTypeValue == "1") {
      this.placeholderText = "";
    } else if (this.alarmTypeValue == "2") {
      this.placeholderText = "";
    } else if (this.alarmTypeValue == "3") {
      this.placeholderText = "请输入设备电量";
      this.firstLevel='5%',
      this.twoLevel='10%',
      this.threeLevel='20%'
    } else if (this.alarmTypeValue == "4") {
      this.placeholderText = "请输入偏离距离(米)";
      this.firstLevel='2000米',
      this.twoLevel='1000米',
      this.threeLevel='500米'
    } else if (this.alarmTypeValue == "5") {
      this.placeholderText = "请输入偏离距离(米)";
      this.firstLevel='2000米',
      this.twoLevel='1000米',
      this.threeLevel='500米'
    } else if (this.alarmTypeValue == "6") {
      this.placeholderText = "请输入报警速度";
      this.firstLevel='120公里/小时',
      this.twoLevel='110公里/小时',
      this.threeLevel='100公里/小时'
    }
      },
      editAlarmType(){
          this.isDisabled=false;
      },
      cancelEdit(){
 this.isDisabled=true;
      },
      confirmEdit(){
this.isDisabled=true;
      }

  }
};
</script>
<style lang="scss" scoped>
#alarmSettings {
  .carAlarmSettingOutBox {
    border: 1px solid lightgray;
    margin-top: 15px;
    margin-bottom:30px;
    .carAlarmSettingBox {
      margin: 30px 30px;
      width:100%;
      .alarmInput {
        margin-top: 15px;
        width:202px;
        margin-right:15px;
       
      }
    }
   
  }

  margin: 30px;
}
</style>














