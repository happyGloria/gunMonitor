<template>
  <div class="app-container" id="vehicleArchives">
    <div class="filter-container">
      <el-input
        v-model="listQuery.licenseNo"
        placeholder="车牌号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        type="index"
      ></el-table-column>
      <el-table-column label="车牌号" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.licenseNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="大队id" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teamId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属大队" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teamName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="4G卡号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chinaMobileNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆厂家品牌" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车型" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.style }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买日期" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.broughtTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登记日期" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.registerTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="轮胎型号" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wheelNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="油品编号" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oilType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发动机型号" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆识别号" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carIMSI }}</span>
        </template>
      </el-table-column>

      <el-table-column label="车辆使用情况" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行情况" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ formatRunStatus(scope.row.runType)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前道路id" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.routeId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前道路名称" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.routeName}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="车牌号" prop="licenseNo">
          <el-input v-model="temp.licenseNo"/>
        </el-form-item>
        <el-form-item label="汽车名称" prop="carName">
          <el-input v-model="temp.carName"/>
        </el-form-item>
        <el-form-item label="设备编号" prop="serialNo">
          <el-input v-model="temp.serialNo"/>
        </el-form-item>
        <el-form-item label="所属大队" prop="teamId">
          <el-select v-model.number="temp.teamId" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in largeTeamOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="4G卡号" prop="chinaMobileNo">
          <el-input v-model="temp.chinaMobileNo"/>
        </el-form-item>

        <el-form-item label="车辆厂家品牌" prop="brand">
          <el-input v-model="temp.brand"/>
        </el-form-item>

        <el-form-item label="车型" prop="style">
          <el-input v-model="temp.style"/>
        </el-form-item>
        <el-form-item label="购买日期" prop="broughtTimeShow">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="temp.broughtTimeShow"
            align="right"
            type="date"
            placeholder="购买日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="登记日期" prop="registerTimeShow">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="temp.registerTimeShow"
            align="right"
            type="date"
            placeholder="登记日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="轮胎型号" prop="wheelNo">
          <el-input v-model="temp.wheelNo"/>
        </el-form-item>
        <el-form-item label="油品型号" prop="oilType">
          <el-input v-model="temp.oilType"/>
        </el-form-item>
        <el-form-item label="发动机型号" prop="engineType">
          <el-input v-model="temp.engineType"/>
        </el-form-item>
        <el-form-item label="车辆识别号" prop="carIMSI">
          <el-input v-model="temp.carIMSI "/>
        </el-form-item>

        <el-form-item label="车辆使用情况" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in carUsageOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运行情况" prop="runType">
          <el-select v-model="temp.runType" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in runOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from "vue";
// import axios from "axios";
// import qs from "qs";

// Vue.prototype.$axios = axios; //全局注册，使用方法为:this.$axios
// Vue.prototype.qs = qs; //全局注册，使用方法为:this.qs
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  carlist,
  carAdd,
  cardelete,
  carupdate,
  carSearch
} from "../../../api/managementArchives/vehicleArchives";
import { formatDate } from "../../../../src/common";
import { Header } from "element-ui";

const calendarTypeOptions = [
  {
    key: "CN",
    display_name: "China"
  },
  {
    key: "US",
    display_name: "USA"
  },
  {
    key: "JP",
    display_name: "Japan"
  },
  {
    key: "EU",
    display_name: "Eurozone"
  }
];

const carUsageOptions = [
  {
    key: 1,
    display_name: "在使用"
  },
  {
    key: 2,
    display_name: "维修中"
  },
  {
    key: 3,
    display_name: "保养中"
  },
  {
    key: 4,
    display_name: "报废"
  }
];

// arr to obj, such as { CN : "China", US : "USA" }
/* const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {}); */

const carUsageTypeKeyValue = carUsageOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: {
    Pagination
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        licenseNo: undefined
      },
      calendarTypeOptions,
      carUsageOptions,
      runOptions: [
        {
          key: 0,
          display_name: "入库"
        },
        {
          key: 1,
          display_name: "上路"
        }
      ],

      statusOptions: ["published", "draft", "deleted"],
      largeTeamOptions: [
        {
          key: 1,
          display_name: "大队A"
        },
        {
          key: 2,
          display_name: "大队B"
        }
      ],
      temp: {
        licenseNo: undefined,
        carName: undefined,
        serialNo: undefined,
        teamId: undefined,
        teamName: undefined,
        chinaMobileNo: undefined,
        brand: undefined,
        style: undefined,
        broughtTime: undefined,
        registerTime: undefined,
        wheelNo: undefined,
        oilType: undefined,
        engineType: undefined,
        carIMSI: undefined,
        status: undefined,
        runType: undefined,
        routeId: null,
        routeName: null
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      dialogPvVisible: false,
      rules: {
        carName: [
          {
            required: true,
            message: "请填写汽车名称",
            trigger: "blur"
          }
        ],
        serialNo: [
          {
            required: true,
            message: "请填写汽车绑定的设备编号",
            trigger: "blur"
          }
        ],
        licenseNo: [
          {
            required: true,
            message: "请填写车牌号",
            trigger: "blur"
          }
        ],
        teamId: [
          {
            required: true,
            type:'number',
            message: "请选择大队",
            trigger: "change"
          }
        ],
        teamName: [
          {
            required: true,
            message: "请选择所属大队",
            trigger: "change"
          }
        ],
        chinaMobileNo: [
          {
            required: true,
            message: "请填写4G卡号",
            trigger: "blur"
          }
        ],
        brand: [
          {
            required: true,
            message: "请填写车辆厂家品牌",
            trigger: "blur"
          }
        ],
        style: [
          {
            required: true,
            message: "请填写车型",
            trigger: "blur"
          }
        ],
        broughtTimeShow: [
          {
            required: true,
            message: "请选择购买日期",
            trigger: "change"
          }
        ],
        registerTimeShow: [
          {
            required: true,
            message: "请选择登记日期",
            trigger: "change"
          }
        ],
        wheelNo: [
          {
            required: true,
            message: "请填写轮胎型号",
            trigger: "blur"
          }
        ],
        oilType: [
          {
            required: true,
            message: "请填写油品型号",
            trigger: "blur"
          }
        ],
        engineType: [
          {
            required: true,
            message: "请填写发动机号",
            trigger: "blur"
          }
        ],
        carIMSI: [
          {
            required: true,
            message: "请填写车辆识别号",
            trigger: "blur"
          }
        ],

        status: [
          {
            required: true,
            message: "请选择车辆使用情况",
            trigger: "change"
          }
        ],
        runType: [
          {
            required: true,
            message: "请选择车辆运行情况",
            trigger: "change"
          }
        ]
      },
      downloadLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      carlist({
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }).then(res => {
        if (res.status == 0) {
          console.log(res.data);
          this.listLoading = false;
          this.list = res.data;
          this.list.forEach((item, index) => {
            this.list[index].broughtTimeShow = formatDate(item.broughtTime);
            this.list[index].registerTimeShow = formatDate(item.registerTime);
          });
          this.total = res.count;
          console.log(this.list);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    formatStatus(status) {
      if (status == 1) {
        return "使用中";
      } else if (status == 2) {
        return "维修中";
      } else if (status == 3) {
        return "保养中";
      } else {
        return "报废";
      }
    },
    formatRunStatus(status) {
      if (status == 0) {
        return "入库";
      } else if (status == 1) {
        return "上车";
      }
    },
    handleFilter() {
      if (
        this.listQuery.licenseNo == "" ||
        this.listQuery.licenseNo == undefined
      ) {
        this.listQuery.licenseNo = null;
         this.getList();
        return;
      }
      carSearch({
        licenseNo: this.listQuery.licenseNo
      }).then(res => {
        if (res.status == 0) {
          this.listQuery.page = 1;
          this.listLoading = false;
          this.list = [];
          this.list[0] = res.data;
          this.list[0].broughtTimeShow = formatDate(res.data.broughtTime);
          this.list[0].registerTimeShow = formatDate(res.data.registerTime);

          this.total = 1;
          console.log(this.list);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    sortChange (data) {},

    resetTemp() {
      this.temp = {
        licenseNo: undefined,
        carName: undefined,
        serialNo: undefined,
        teamId: undefined,
        teamName: undefined,
        chinaMobileNo: undefined,
        brand: undefined,
        style: undefined,
        broughtTime: undefined,
        registerTime: undefined,
        wheelNo: undefined,
        oilType: undefined,
        engineType: undefined,
        carIMSI: undefined,
        status: undefined,
        runType: undefined,
        routeId: null,
        routeName: null,
        broughtTimeShow: undefined,
        registerTimeShow: undefined
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
             this.selectFilter(
            this.temp.teamId,
            this.largeTeamOptions,
            "key",
            "display_name",
            "teamId",
            "teamName"
          );
          console.log(this.temp);
          this.temp.broughtTime = new Date(this.temp.broughtTimeShow).getTime();
          this.temp.registerTime = new Date(
            this.temp.registerTimeShow
          ).getTime();
          console.log(this.temp);
          carAdd(this.temp).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.listQuery.page=1;
              this.dialogFormVisible = false;
              

            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
            this.selectFilter(
            this.temp.teamId,
            this.largeTeamOptions,
            "key",
            "display_name",
            "teamId",
            "teamName"
          );
          this.temp.broughtTime = new Date(this.temp.broughtTimeShow).getTime();
          this.temp.registerTime = new Date(
            this.temp.registerTimeShow
          ).getTime();
          carupdate(JSON.stringify(this.temp)).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDelete(row) {
      cardelete({
        id: row.id
      }).then(res => {
        if (res.status == 0) {
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    formatDateTime(timestamp) {
      return formatDate(timestamp);
    },
    //筛选出select选择的值和内容，参数分别代表（select的v-model值，option数组，option值，option内容，后台需要的id,后台需要的name）
    selectFilter(vId, selectList, id, name, id1, name1) {
      let obj = {};
      obj = selectList.find(item => {
        //这里的selectList就是上面遍历的数据源
        return item[id] === vId; //筛选出匹配数据
      });
      this.temp[name1] = obj[name];
      console.log(obj);
    }
  }
};
</script>

<style lang="scss">
#vehicleArchives {
  .el-form-item__label {
    width: 120px !important;
  }

  .el-form-item__content {
    margin-left: 120px !important;
  }

  .el-dialog__body {
    overflow: auto;
    max-height: 506px;
  }
}
</style>
