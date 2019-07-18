<template>
  <div class="app-container" id="personnelFiles">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
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
      <el-table-column label="姓名" width="200px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ formatSexStatus(scope.row.sex)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.officeTimeShow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属大队" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teamName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="手机号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="职位" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ formatPostStatus(scope.row.workType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车组名称" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="枪支号" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.guniMei }}</span>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="userCode">
          <el-input v-model="temp.userCode"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model.number="temp.sex" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in sexOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="temp.age"/>
        </el-form-item>
        <el-form-item label="入职时间" prop="officeTimeShow">
          <!-- <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" /> -->
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="temp.officeTimeShow"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
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
        <el-form-item label="状态" prop="status">
          <el-select v-model.number="temp.status" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in personStatusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="身份证号" prop="userCode">
          <el-input v-model="temp.userCode" />
        </el-form-item>-->
        <el-form-item label="职位" prop="workType">
          <el-select v-model.number="temp.workType" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in postOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车组名称" prop="groupId">
          <el-select v-model.number="temp.groupId" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in groupOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="枪号" prop="gunId">
          <el-select v-model.number="temp.gunId" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in gunOptions"
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
import Pagination from "../../../components/Pagination"; // secondary package based on el-pagination
import {
  personList,
  personAdd,
  personUpdate,
  personDelete,
  personSearch
} from "../../../api/managementArchives/personnelFiles";
import { /* parseToNumber , */formatDate} from "../../../../src/common";


const sexOptions = [
  { key: 1, display_name: "男" },
  { key: 0, display_name: "女" }
];
const largeTeamOptions = [
  { key: 0, display_name: "A大队" },
  { key: 1, display_name: "B大队" },
  { key: 2, display_name: "C大队" },
  { key: 3, display_name: "D大队" }
];
const personStatusOptions = [
  { key: 0, display_name: "在职" },
  { key: 1, display_name: "离职" },
  { key: 2, display_name: "请假" }
];
const postOptions = [
  { key: 0, display_name: "司机" },
  { key: 1, display_name: "车组长" },
  { key: 2, display_name: "押运员" },
  { key: 3, display_name: "业务员" }
];

export default {
  name: "ComplexTable",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: ""
      },
      sexOptions,
      largeTeamOptions,
      personStatusOptions,
      postOptions,
      groupOptions: [
        { key: 0, display_name: "车组1" },
        { key: 1, display_name: "车组2" },
        { key: 2, display_name: "车组3" }
      ],
      gunOptions: [
        { key: 0, display_name: "4654657" },
        { key: 1, display_name: "765676" },
        { key: 2, display_name: "68768" },
        { key: 3, display_name: "68768769" }
      ],
      temp: {
        name: undefined,
        userCode: undefined,
        sex: undefined,
        age: undefined,
        officeTime: undefined,
        updateTime: undefined,
        status: undefined,
        groupId: undefined,
        groupName: undefined,
        workType: undefined,
        teamId: undefined,
        teamName: undefined,
        gunId: undefined,
        guniMei: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        userCode: [
          { required: true, message: "请填写身份证号", trigger: "blur" }
        ],
        sex: [
          {
            required: true,
            type: "number",
            message: "请选择性别",
            trigger: "change"
          }
        ],
        age: [
          {
            required: true,
            type: "number",
            message: "请填写年龄",
            trigger: "blur"
          }
        ],
        officeTimeShow: [
          { required: true, message: "请选择入职时间", trigger: "change" }
        ],
        teamId: [
          {
            required: true,
            type: "number",
            message: "请选择所属大队",
            trigger: "change"
          }
        ],
        groupId: [
          {
            required: true,
            type: "number",
            message: "请选择所属大队",
            trigger: "change"
          }
        ],
        status: [
          {
            required: true,
            type: "number",
            message: "请选择状态",
            trigger: "change"
          }
        ],
        workType: [
          {
            required: true,
            type: "number",
            message: "请选择职位",
            trigger: "change"
          }
        ],
        gunId: [
          {
            required: true,
            type: "number",
            message: "请选择枪支",
            trigger: "change"
          }
        ]
       
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
      personList({
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }).then(res => {
        this.listLoading = false;
        if (res.status == 0) {
          console.log(res.data);
          this.list = res.data;
          this.list.forEach((item, index) => {
            this.list[index].officeTimeShow = formatDate(item.officeTime);
          });
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
    handleFilter() {
      if (this.listQuery.name == "" || this.listQuery.name == undefined) {
        this.listQuery.name = null;
        this.getList();
        return;
      }
      personSearch({
        name: this.listQuery.name
      }).then(res => {
        if (res.status == 0) {
          this.listQuery.page = 1;
          this.listLoading = false;
          this.list = [];
          this.list[0] = res.data;
          this.list[0].officeTimeShow = formatDate(res.data.officeTime);
          this.total = 1;
          console.log(this.list);
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
        name: undefined,
        userCode: undefined,
        sex: undefined,
        age: undefined,
        officeTime: undefined,
        updateTime: undefined,
        status: undefined,
        groupId: undefined,
        groupName: undefined,
        workType: undefined,
        teamId: undefined,
        teamName: undefined,
        gunId: undefined,
        guniMei: undefined
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
            this.temp.groupId,
            this.groupOptions,
            "key",
            "display_name",
            "groupId",
            "groupName"
          );
          this.selectFilter(
            this.temp.gunId,
            this.gunOptions,
            "key",
            "display_name",

            "gunId",
            "guniMei"
          );
          this.temp.officeTime = new Date(this.temp.officeTimeShow).getTime();
          this.temp.updateTime = new Date().getTime();
          console.log(this.temp);
          personAdd(this.temp).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.listQuery.page = 1;
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
            this.temp.groupId,
            this.groupOptions,
            "key",
            "display_name",
            "groupId",
            "groupName"
          );
          this.selectFilter(
            this.temp.gunId,
            this.gunOptions,
            "key",
            "display_name",
            "gunId",
            "guniMei"
          );
          this.temp.officeTime = new Date(this.temp.officeTimeShow).getTime();
          this.temp.updateTime = new Date().getTime();
          console.log(this.temp);
          personUpdate(this.temp).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.listQuery.page = 1;
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
      personDelete({
        personId: row.id
      }).then(res => {
        if (res.status == 0) {
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    formatSexStatus(status) {
      if (status == 0) {
        return "女";
      } else if (status == 1) {
        return "男";
      }
    },
    formatStatus(status) {
      if (status == 0) {
        return "在职";
      } else if (status == 1) {
        return "离职";
      } else {
        return "请假";
      }
    },
    formatPostStatus(status) {
      if (status == 0) {
        return "司机";
      } else if (status == 1) {
        return "车组长";
      } else if (status == 2) {
        return "押运员";
      } else {
        return "业务员";
      }
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
#personnelFiles {
  .el-form-item__label {
    width: 96px !important;
  }
  .el-form-item__content {
    margin-left: 96px !important;
  }
  .el-dialog__body {
    overflow: auto;
    max-height: 506px;
  }
}
</style>


