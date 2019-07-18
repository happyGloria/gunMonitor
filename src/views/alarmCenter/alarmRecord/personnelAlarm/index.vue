<template>
  <div class="app-container" id="personnelAlarm">
    <div class="filter-container">
      <el-input
        v-model="listQuery.groupNum"
        placeholder="车组编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
     
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
      

      <el-table-column label="车组编号" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row. groupNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="司机" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车组长" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teamLeader }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属大队" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.largeTeam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押运员A" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.namea }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押运员B" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nameb }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆识别号" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carIdentificationNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="枪支A" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
       <el-table-column label="枪支B" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路线描述" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roadDiscribe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警状态" width="110px" align="center">
        <template slot-scope="scope">
          <span :class="{ 'red': scope.row.alarmStatus=='正在报警'}">{{ scope.row.alarmStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时长" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmDuration }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.alarmStatus==='正在报警'" type="primary" size="mini" @click="handleUpdate(row,'deal')">处理</el-button>
          <el-button
            type="primary"
            class="checkbtn"
            size="mini"
            @click="handleUpdate(row,'check')"
            v-if="row.alarmStatus==='已处理'"
          >查看详情</el-button>
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
       
        <el-form-item label="处理时间" prop="dealTime" v-if="isReadonly">
          <el-input  v-model="temp.dealTime"/>
        </el-form-item>
        <el-form-item label="处理人" prop="namea">
          <el-input :readonly="true" v-model="temp.namea"/>
        </el-form-item>
        <el-form-item label="报警原因" prop="alarmReason ">
          <el-input :readonly="isReadonly" type="textarea" v-model="temp.alarmReason "/>
        </el-form-item>
        <el-form-item label="处理意见" prop="dealAdvise">
          <el-input :readonly="isReadonly" type="textarea" v-model="temp.dealAdvise "/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='deal'?dealData():checkData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   fetchList,
//   fetchPv,
//   createArticle,
//   updateArticle
// } from "@/api/article";
// import waves from "@/directive/waves"; // waves directive
// import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  //   directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
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
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
        carNumber: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      isReadonly: true,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
        gunNumber: undefined,
        groupNum: undefined,
        name: undefined,
        teamLeader: undefined,
        largeTeam: undefined,
        namea: '赵武',
        nameb: undefined,
        carIdentificationNumber: undefined,
        phoneNumber: undefined,
        engineNumber: undefined,
        roadDiscribe: undefined,
        alarmStatus: undefined,
        alarmDuration: undefined,
        alarmReason: undefined,
        dealAdvise: undefined,
        dealTime:'2019-05-21'
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        deal: "处理",
        check: "查看"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
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
      },
      value1: "",
      value2: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = false;
      (this.list = [
        {
          gunNumber: "3254647",
          groupNum: "3534265746",
          name: "李四",
          teamLeader: "张三",
          largeTeam: "大队A",
          namea: "赵五",
          nameb: "老王",
          carIdentificationNumber: "345546567",
          phoneNumber: "3556576",
          engineNumber: "46457468",
          roadDiscribe: "广州到深圳的押运路线",
          alarmStatus: "正在报警",
          alarmDuration: "10分钟"
        },
         {
          gunNumber: "648798607",
          groupNum: "67486099870",
          name: "刘大",
          teamLeader: "曹操",
          largeTeam: "大队B",
          namea: "刘备",
          nameb: "关羽",
          carIdentificationNumber: "345546567",
          phoneNumber: "3556576",
          engineNumber: "46457468",
          roadDiscribe: "广州到深圳的押运路线",
          alarmStatus: "已处理",
          alarmDuration: "20分钟"
        },
        {
          gunNumber: "648798607",
          groupNum: "67486099870",
          name: "老大",
          teamLeader: "贾玲",
          largeTeam: "大队B",
          namea: "刘嘉玲",
          nameb: "贾乃亮",
          carIdentificationNumber: "345546567",
          phoneNumber: "3556576",
          engineNumber: "46457468",
          roadDiscribe: "广州到深圳的押运路线",
          alarmStatus: "报警已停止",
          alarmDuration: "20分钟"
        }
      ]),
        (this.total = 3);
      //   fetchList(this.listQuery).then(response => {
      //     this.list = response.data.items;
      //     this.total = response.data.total;

      //     // Just to simulate the time of the request
      //     setTimeout(() => {
      //       this.listLoading = false;
      //     }, 1.5 * 1000);
      //   });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        groupNum: undefined,
        name: undefined,
        teamLeader: undefined,
        buyDate: undefined,
        largeTeam: undefined,
        namea: undefined,
        nameb: undefined,
        carIdentificationNumber: undefined,
        phoneNumber: undefined,
        engineNumber: undefined
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "deal";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    dealData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          //   createArticle(this.temp).then(() => {
          //     this.list.unshift(this.temp);
          //     this.dialogFormVisible = false;
          //     this.$notify({
          //       title: "Success",
          //       message: "Created Successfully",
          //       type: "success",
          //       duration: 2000
          //     });
          //   });
          this.dialogFormVisible = false;
        }
      });
    },
    handleUpdate(row, type) {
      //   this.temp = Object.assign({}, row); // copy obj
      //   this.temp.timestamp = new Date(this.temp.timestamp);
      //   this.dialogStatus = "update";
      //   this.dialogFormVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs["dataForm"].clearValidate();
      //   });
      if (type == "deal") {
        this.isReadonly = false;
         this.temp.alarmReason =undefined;
        this.temp.dealAdvise =undefined;
        this.dialogStatus = "deal";
      } else {
        this.isReadonly = true;
        this.temp.alarmReason = "枪支拆除";
        this.temp.dealAdvise = "备注1";
        this.dialogStatus = "check";
      }

      this.dialogFormVisible = true;
    },
    checkData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          //   updateArticle(tempData).then(() => {
          //     for (const v of this.list) {
          //       if (v.id === this.temp.id) {
          //         const index = this.list.indexOf(v);
          //         this.list.splice(index, 1, this.temp);
          //         break;
          //       }
          //     }
          //     this.dialogFormVisible = false;
          //     this.$notify({
          //       title: "Success",
          //       message: "Update Successfully",
          //       type: "success",
          //       duration: 2000
          //     });
          //   });
          this.dialogFormVisible = false;
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    handleFetchPv() {
      //   fetchPv(pv).then(response => {
      //     this.pvData = response.data.pvData;
      //     this.dialogPvVisible = true;
      //   });
    },
    handleDownload() {
      this.downloadLoading = true;
      //   import("@/vendor/Export2Excel").then(excel => {
      //     const tHeader = ["timestamp", "title", "type", "importance", "status"];
      //     const filterVal = [
      //       "timestamp",
      //       "title",
      //       "type",
      //       "importance",
      //       "status"
      //     ];
      //     const data = this.formatJson(filterVal, this.list);
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: "table-list"
      //     });
      //     this.downloadLoading = false;
      //   });
    }
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       if (j === "timestamp") {
    //         return parseTime(v[j]);
    //       } else {
    //         return v[j];
    //       }
    //     })
    //   );
    // }
  }
};
</script>
<style lang="scss">
#personnelAlarm {
  .fixed-width .el-button--mini {
    padding-left: 0;
    padding-right: 0;
  }
  .red{
      color:red;
  }
}
</style>










