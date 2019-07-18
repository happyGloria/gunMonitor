<template>
  <div class="app-container" id="unitManagement">
    <div class="filter-container">
      <el-input
        v-model="listQuery.groupNo"
        placeholder="车组编号"
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

      <el-table-column label="车组编号" width="130px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row. groupNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="车组名称" width="130px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row. groupName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="司机" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.driverName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车组长" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leaderName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建立日期" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buyDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属大队" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teamName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押运员" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.securityAName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务员" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.securityBName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.armoredcarLicenseNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SIM卡号" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chinaMobileNo }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="枪支A" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.guns[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="枪支B" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.guns[1] }}</span>
        </template>
      </el-table-column>-->

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
        <!-- <el-form-item label="车组编号" prop="groupNum">
          <el-input v-model="temp.groupNum"/>
        </el-form-item>-->
        <el-form-item label="车组编号" prop="groupNo">
          <el-input v-model.number="temp.groupNo"/>
        </el-form-item>
        <el-form-item label="车组名称" prop="groupName">
          <el-input v-model="temp.groupName"/>
        </el-form-item>
        <el-form-item label="司机" prop="driverId">
          <el-select
            filterable
            v-model="temp.driverId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in driverOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车组长" prop="leaderId">
          <el-select
            filterable
            v-model="temp.leaderId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in teamLeaderOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属大队" prop="teamId">
          <el-select
            filterable
            v-model="temp.teamId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in largeTeamOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="押运员" prop="securityAId">
          <el-select
            filterable
            v-model="temp.securityAId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in supercargoOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="securityBId">
          <el-select
            filterable
            v-model="temp.securityBId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in businessManagerOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="armoredcarId">
          <el-select
            filterable
            v-model="temp.armoredcarId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in carOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SIM卡号" prop="chinaMobileNo">
          <el-input v-model="temp.chinaMobileNo"/>
        </el-form-item>
        <!-- <el-form-item label="枪支"  prop="guns">
         <el-select filterable multiple v-model="temp.guns" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in gunaOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
              :disabled="temp.guns&&temp.guns.length==2"
            />
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  carGrouplist,
  carGroupadd,
  carGroupupdate,
  carGroupdelete,
  carGroupSearch
} from "../../../api/managementArchives/unitManagement";
import { parseToNumber } from "../../../../src/common";
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
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        groupNo: undefined
      },
      calendarTypeOptions,
      largeTeamOptions: [
        { key: 1, display_name: "大队A" },
        { key: 2, display_name: "大队B" }
      ],
      driverOptions: [
        { key: 1, display_name: "司机A" },
        { key: 2, display_name: "司机B" }
      ],
      teamLeaderOptions: [
        { key: 1, display_name: "车组长A" },
        { key: 2, display_name: "车组长B" }
      ],
      supercargoOptions: [
        { key: 1, display_name: "押运员A" },
        { key: 2, display_name: "押运员B" }
      ],
      businessManagerOptions: [
        { key: 1, display_name: "业务员A" },
        { key: 2, display_name: "业务员B" }
      ],
      gunaOptions: [
        { key: 1, display_name: "枪支1" },
        { key: 2, display_name: "枪支2" },
        { key: 3, display_name: "枪支3" },
        { key: 4, display_name: "枪支4" }
      ],
      gunbOptions: [
        { key: 1, display_name: "枪支1" },
        { key: 2, display_name: "枪支2" }
      ],
      carOptions: [
        { key: 1, display_name: "车辆1" },
        { key: 2, display_name: "车辆2" }
      ],
      temp: {
        id: undefined,
        teamId: undefined,
        teamName: undefined,
        groupName: undefined,
        groupNo: undefined,
        driverId: undefined,
        driverName: undefined,
        leaderId: undefined,
        leaderName: undefined,
        securityAId: undefined,
        securityAName: undefined,
        securityBId: undefined,
        securityBName: undefined,
        armoredcarId: undefined,
        armoredcarLicenseNo: undefined,
        chinaMobileNo: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        groupNo: [
          { required: true,type:'number', message: "请填写车组编号,且必须是数字", trigger: "blur" }
        ],
        groupName: [
          { required: true, message: "请填写车组名称", trigger: "blur" }
        ],
        teamId: [
          { required: true, message: "请选择所属大队", trigger: "chang" }
        ],
        driverId: [
          { required: true, message: "请选择司机名称", trigger: "chang" }
        ],
        leaderId: [
          { required: true, message: "请选择车组长名称", trigger: "chang" }
        ],
        securityAId: [
          { required: true, message: "请选择押运员名称", trigger: "chang" }
        ],
        securityBId: [
          { required: true, message: "请选择业务员名称", trigger: "chang" }
        ],
        armoredcarId: [
          { required: true, message: "请选择车牌号", trigger: "chang" }
        ],
        chinaMobileNo: [
          { required: true, message: "请填写SIM卡号", trigger: "blur" }
        ]
        // timestamp: [
        //   {
        //     type: "date",
        //     required: true,
        //     message: "timestamp is required",
        //     trigger: "change"
        //   }
        // ],
      },
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
      carGrouplist({
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }).then(res => {
        this.listLoading = false;
        if (res.status == 0) {
          console.log(res.data);
          this.list = res.data;
          // this.list.forEach((item, index) => {
          //   this.list[index].broughtTimeShow = formatDate(item.broughtTime);
          //   this.list[index].registerTimeShow = formatDate(item.registerTime);
          // });
          this.total = res.count;
          console.log(this.list);
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
        } else {
          this.$message.error(res.msg);
        }
      });
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
        teamId: undefined,
        teamName: undefined,
        groupName: undefined,
        groupNo: undefined,
        driverId: undefined,
        driverName: undefined,
        leaderId: undefined,
        leaderName: undefined,
        securityAId: undefined,
        securityAName: undefined,
        securityBId: undefined,
        securityBName: undefined,
        armoredcarId: undefined,
        armoredcarLicenseNo: undefined,
        chinaMobileNo: undefined
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
          console.log(this.temp);
          this.selectFilter(
            this.temp.teamId,
            this.largeTeamOptions,
            "key",
            "display_name",
            "teamId",
            "teamName"
          );
          this.selectFilter(
            this.temp.driverId,
            this.driverOptions,
            "key",
            "display_name",
            "driverId",
            "driverName"
          );
          this.selectFilter(
            this.temp.leaderId,
            this.teamLeaderOptions,
            "key",
            "display_name",
            "leaderId",
            "leaderName"
          );
          this.selectFilter(
            this.temp.securityAId,
            this.supercargoOptions,
            "key",
            "display_name",
            "securityAId",
            "securityAName"
          );
          this.selectFilter(
            this.temp.securityBId,
            this.businessManagerOptions,
            "key",
            "display_name",
            "securityBId",
            "securityBName"
          );
          this.selectFilter(
            this.temp.armoredcarId,
            this.carOptions,
            "key",
            "display_name",
            "armoredcarId",
            "armoredcarLicenseNo"
          );
          this.temp.groupNo = parseToNumber(this.temp.groupNo);
          console.log(this.temp);
          carGroupadd(this.temp).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.dialogFormVisible = false;
              this.listQuery.page = 1;
              this.$message({
                message: res.msg,
                type: "success"
              });
            } else {
              this.$message.error(res.msg);
            }
          });
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
      alert('aaa')
     this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.temp);
          this.selectFilter(
            this.temp.teamId,
            this.largeTeamOptions,
            "key",
            "display_name",
            "teamId",
            "teamName"
          );
          this.selectFilter(
            this.temp.driverId,
            this.driverOptions,
            "key",
            "display_name",
            "driverId",
            "driverName"
          );
          this.selectFilter(
            this.temp.leaderId,
            this.teamLeaderOptions,
            "key",
            "display_name",
            "leaderId",
            "leaderName"
          );
          this.selectFilter(
            this.temp.securityAId,
            this.supercargoOptions,
            "key",
            "display_name",
            "securityAId",
            "securityAName"
          );
          this.selectFilter(
            this.temp.securityBId,
            this.businessManagerOptions,
            "key",
            "display_name",
            "securityBId",
            "securityBName"
          );
          this.selectFilter(
            this.temp.armoredcarId,
            this.carOptions,
            "key",
            "display_name",
            "armoredcarId",
            "armoredcarLicenseNo"
          );
          this.temp.groupNo = parseToNumber(this.temp.groupNo);
          console.log(this.temp);
          carGroupupdate(this.temp).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.dialogFormVisible = false;
              this.listQuery.page = 1;
              this.$message({
                message: res.msg,
                type: "success"
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleDelete(row) {
      carGroupdelete({
        groupId: row.id
      }).then(res => {
        if (res.status == 0) {
          this.listQuery.page=1;
          this.getList();
          this.$message({
                message: res.msg,
                type: "success"
              });
        } else {
          this.$message.error(res.msg);
        }
      });
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
      carGroupSearch({
        groupNo: this.listQuery.groupNo
      }).then(res => {
        if (res.status == 0) {
          this.listQuery.page = 1;
          this.listLoading = false;
          this.list = [];
          this.list[0] = res.data;
          // this.list[0].broughtTimeShow = formatDate(item.broughtTime);
          // this.list[0].registerTimeShow = formatDate(item.registerTime);

          this.total = 1;
          console.log(this.list);
        } else {
          this.$message.error(res.msg);
        }
      });
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
#unitManagement {
  .el-form-item__label {
    width: 96px !important;
  }
  .el-form-item__content {
    margin-left: 96px !important;
  }
}
</style>







