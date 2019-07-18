<template>
  <div class="app-container" id="routeManagement">
    <div class="filter-container">
      <el-input
        v-model="listQuery.carNumber"
        placeholder="路线编号"
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
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>-->
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
      <el-table-column label="路线编号" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.carNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路线名称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="goCheckRoute(scope)">{{ scope.row.roadName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点" width="150px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="goNetworkManage(scope)">5个</span>
        </template>
      </el-table-column>
      <el-table-column label="线路描述" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roadDiscribe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建立时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buyDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属大队" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.largeTeam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roadStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="deleteRoute(row)">删除</el-button>
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
       <el-select v-model="networkValue" multiple placeholder="请选择" disabled="disabled">
    <el-option
      v-for="item in networkOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        <!-- <el-form-item label="路线编号" prop="carNumber">
          <el-input v-model="temp.carNumber"/>
        </el-form-item>
        <el-form-item label="路线名称" prop="roadName ">
          <el-input v-model="temp.roadName "/>
        </el-form-item>-->
        <!-- <el-form-item label prop="gunNum ">
          <el-input v-model="temp.gunNum "/>
          <el-button @click="selectHistoryRoute">从历史记录中选取路线</el-button>
          <el-button @click="freehandRoute">手绘路线</el-button>
        </el-form-item> -->

        <!-- <el-form-item label="线路描述" prop="roadDiscribe ">
          <el-input type="textarea" v-model="temp.roadDiscribe "/>
        </el-form-item>
        <el-form-item label="建立时间" prop="buyDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="temp.buyDate"
            align="right"
            type="date"
            placeholder="建立时间"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="所属大队" prop="largeTeam ">
          <el-select v-model="temp.largeTeam " class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in largeTeamOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="roadStatus">
          <el-select v-model="temp.roadStatus" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in roadStatusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">确定</el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button> -->
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

const roadStatusOptions = [
  { key: "使用中", display_name: "使用中" },
  { key: "已废弃", display_name: "已废弃" }
];
const largeTeamOptions = [
  { key: "A大队", display_name: "A大队" },
  { key: "B大队", display_name: "B大队" },
  { key: "C大队", display_name: "C大队" },
  { key: "D大队", display_name: "D大队" }
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
        carNumber: undefined,
        roadName: undefined,
        roadDiscribe: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      roadStatusOptions,
      largeTeamOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
        carNumber: undefined,
        largeTeam: undefined,
        cardNumber: undefined,
        carBrand: undefined,
        buyDate: undefined,
        registrationDate: undefined,
        tyreModel: undefined,
        oilCode: undefined,
        engineNumber: undefined,
        carUsage: undefined,
        roadName: undefined,
        roadDiscribe: undefined,
        roadStatus: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
        showNetwork:'网点'
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
       networkOptions: [{
          value: '选项1',
          label: '网点1'
        }, {
          value: '选项2',
          label: '网点2'
        }, {
          value: '选项3',
          label: '网点3'
        }, {
          value: '选项4',
          label: '网点4'
        }, {
          value: '选项5',
          label: '网点5'
        }],
        networkValue: ['选项1','选项2','选项3','选项4','选项5'],
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
      this.list = [
        {
          carNumber: "36543746786",
          largeTeam: "大队A",
          cardNumber: "54356567567",
          carBrand: "品牌A",
          buyDate: "2017-02-09",
          registrationDate: "2016-09-25",
          tyreModel: "型号A",
          oilCode: "34554365474",
          engineNumber: "353645758",
          /* engineNumber: "45346547", */
          carUsage: "在使用",
          roadName: "广深线",
          roadDiscribe: "广州到深圳的押运路线",
          roadStatus: "使用中"
        }
      ];
      this.total = 1;
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
        carNumber: undefined,
        largeTeam: undefined,
        cardNumber: undefined,
        carBrand: undefined,
        buyDate: undefined,
        registrationDate: undefined,
        tyreModel: undefined,
        oilCode: undefined,
        engineNumber: undefined,
        carUsage: undefined
      };
    },
    handleCreate() {
      this.$router.push("/historyRoute");
      // this.resetTemp();
      // this.dialogStatus = "create";
      // this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    createData() {
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
        }
      });
    },
    handleUpdate() {
      this.$router.push({ path: "/editRoute", query: { id: 1 } });

      // this.temp = Object.assign({}, row); // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp);
      // this.dialogStatus = "update";
      // this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    updateData() {
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
    },
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
    // },
    goNetworkManage(scope) {
      // this.$router.push({ path: "/routeAndNetwork", query: { id: 1 } });
       this.temp = Object.assign({}, scope.row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "showNetwork";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    goCheckRoute() {
      this.$router.push({ path: "/checkRoute", query: { id: 1 } });
    },
    selectHistoryRoute() {
      //  sessionStorage.removeItem('selectedRouteContent');
      this.$router.push({ path: "/historyRoute", query: { id: 1 } });
    },
    freehandRoute() {
      this.$router.push({ path: "/freehandRoute", query: { id: 1 } });
    },
    deleteRoute() {}
  }
};
</script>








