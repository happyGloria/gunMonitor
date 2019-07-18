<template>
  <div class="app-container" id="gunFiles">
    <div class="filter-container">
      <el-input
        v-model="listQuery.gunNumber"
        placeholder="枪号"
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
      <el-table-column label="枪号" width="200px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.gunNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gunModels }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登记日期" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registrationDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属大队" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.largeTeam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SIM卡号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gunNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column label="使用状态" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usageState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用者" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买日期" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buyDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报废日期" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scrapDate }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
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
        <!-- <el-form-item label="枪号" prop="gunNumber">
          <el-input v-model="temp.gunNumber"/>
        </el-form-item>-->
        <el-form-item label="型号" prop="gunModels">
          <el-input v-model="temp.gunModels"/>
        </el-form-item>
        <el-form-item label="登记日期" prop="registrationDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="temp.registrationDate"
            align="right"
            type="date"
            placeholder="登记日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="所属大队" prop="largeTeam">
          <el-select v-model="temp.largeTeam" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in largeTeamOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态" prop="usageState">
          <el-select v-model="temp.usageState" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in usageStatusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SIM卡号" prop="gunNumber">
          <el-input v-model="temp.gunNumber"/>
        </el-form-item>
        <el-form-item label="使用者" prop="name">
          <el-select v-model="temp.name" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in userOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="购买日期" prop="buyDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="temp.buyDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报废日期" prop="scrapDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="temp.scrapDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
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
import Pagination from "../../../components/Pagination"; // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

const largeTeamOptions = [
  { key: "A大队", display_name: "A大队" },
  { key: "B大队", display_name: "B大队" },
  { key: "C大队", display_name: "C大队" },
  { key: "D大队", display_name: "D大队" }
];
const usageStatusOptions = [
  { key: "在仓库", display_name: "在仓库" },
  { key: "在途中", display_name: "在途中" },
  { key: "维修中", display_name: "维修中" },
  { key: "保养中", display_name: "保养中" },
  { key: "报废", display_name: "报废" },
  { key: "追踪中", display_name: "追踪中" }
];

export default {
  name: "ComplexTable",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        gunNumber: undefined
      },
      calendarTypeOptions,
      largeTeamOptions,
      usageStatusOptions,
      userOptions: [
        { key: "张三", display_name: "张三" },
        { key: "李四", display_name: "李四" },
        { key: "王五", display_name: "王五" }
      ],
      temp: {
        timestamp: new Date(),
        sextype: undefined,
        largeTeamtype: undefined,
        personStatustype: undefined,
        posttype: undefined,
        gunNumber: undefined,
        gunModels: undefined,
        registrationDate: undefined,
        largeTeam: undefined,
        usageState: undefined,
        name: undefined,
        buyDate: undefined,
        scrapDate: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        gunModels: [{ required: true, message: "请填写型号", trigger: "blur" }],
        registrationDate: [
          { required: true, message: "请选择登记 时间", trigger: "change" }
        ],
        largeTeam: [
          { required: true, message: "请选择所属大队", trigger: "change" }
        ],
        gunNumber: [
          { required: true, message: "请填写SIM卡号", trigger: "blur" }
        ],
        usageState: [
          { required: true, message: "请选择使用状态", trigger: "change" }
        ],
        name: [{ required: true, message: "请选择使用者", trigger: "change" }],
        buyDate: [
          { required: true, message: "请选择购买日期", trigger: "change" }
        ]
        // scrapDate: [
        //   { required: true, message: "请选择报废日期", trigger: "blur" }
        // ]
        // timestamp: [
        //   {
        //     type: "date",
        //     required: true,
        //     message: "timestamp is required",
        //     trigger: "change"
        //   }
        // ],
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
  methods: {
    getList() {
      this.listLoading = false;
      this.list = [
        {
          sextype: undefined,
          largeTeamtype: undefined,
          personStatustype: undefined,
          posttype: undefined,
          gunNumber: "2543654764",
          gunModels: "型号A",
          registrationDate: "2017-02-19",
          largeTeam: "大队A",
          usageState: "在途中",
          name: "李四",
          buyDate: "2017-01-27",
          scrapDate: "2019-04-19"
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
    sortChange(data) {},

    resetTemp() {
      this.temp = {
        timestamp: new Date(),
        sextype: undefined,
        largeTeamtype: undefined,
        personStatustype: undefined,
        posttype: undefined,
        gunNumber: undefined,
        gunModels: undefined,
        registrationDate: undefined,
        largeTeam: undefined,
        usageState: undefined,
        name: undefined,
        buyDate: undefined,
        scrapDate: undefined
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
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
    }
  }
};
</script>
<style lang="scss">
#gunFiles {
  .el-form-item__label {
    width: 96px !important;
  }
  .el-form-item__content {
    margin-left: 96px !important;
  }
}
</style>




