<template>
  <div class="app-container" id="brigadeManagement">
    <div class="filter-container">
      <el-input
        v-model="listQuery.teamName"
        placeholder="大队名称"
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
      <el-table-column label="大队名称" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teamName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建立日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="队长" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leaderName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="队员数" width="110px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="goFiles(1)">{{ scope.row.sercurityCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="枪支数" width="110px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="goFiles(2)">{{ scope.row.gunCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车组数" width="110px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="goFiles(3)">{{ scope.row.securityGroupCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管辖地区" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.geometryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.status )}}</span>
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
        <el-form-item label="大队名称" prop="teamName">
          <el-input v-model="temp.teamName "/>
        </el-form-item>
        <el-form-item label="队长" prop="leaderId">
          <el-select v-model.number="temp.leaderId" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in teamLeaderOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="队员数" prop="teamMemberNum">
          <el-input v-model="temp.teamMemberNum "/>
        </el-form-item>
        <el-form-item label="枪支数" prop="gunNum">
          <el-input v-model="temp.gunNum"/>
        </el-form-item>
        <el-form-item label="车组数" prop="carNum">
          <el-input v-model="temp.carNum"/>
        </el-form-item>-->
        <el-form-item label="管辖地区" prop="geometryId">
          <el-select
            v-model.number="temp.geometryId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in geometryOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model.number="temp.status" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in teamStatusOptions"
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
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  teamlist,
  teamadd,
  teamupdate,
  teamdelete,
  teamSearch
} from "../../../api/managementArchives/brigadeManagement";
import { formatDate } from "../../../../src/common";
const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

export default {
  name: "ComplexTable",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
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
        teamName: undefined
      },
      calendarTypeOptions,
      teamLeaderOptions: [
        { key: 1, display_name: "队长A" },
        { key: 2, display_name: "队长B" }
      ],
      geometryOptions: [
        { key: 1, display_name: "地区1" },
        { key: 2, display_name: "地区2" }
      ],
      teamStatusOptions: [
        { key: 1, display_name: "存在" },
        { key: 2, display_name: "取消" }
      ],
      temp: {
        teamId: undefined,
        teamName: undefined,
        geometryId: undefined,
        geometryName: undefined,
        leaderId: undefined,
        leaderName: undefined,
        createTime: undefined,
        status: undefined,
        sercurityCount: undefined,
        gunCount: undefined,
        securityGroupCount: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        teamName : [
          { required: true, message: "请填写大队名称", trigger: "blur" }
        ],
        leaderId: [{ required: true, message: "请选择队长", trigger: "change" }],
        geometryId : [
          { required: true, message: "请选择管辖地区", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择大队状态", trigger: "change" }
        ],
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
     teamlist({
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }).then(res => {
        if (res.status == 0) {
          console.log(res.data);
          this.listLoading = false;
          this.list = res.data;
          this.total = res.count;
           this.list.forEach((item, index) => {
             if(this.list.sercurityCount==null){
            this.list[index].sercurityCount = 0

             }
              if(this.list.gunCount==null){
            this.list[index].gunCount =0
               
             }
              if(this.list.securityGroupCount==null){
            this.list[index].securityGroupCount = 0
               
             }
          });
          console.log(this.list);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleFilter() {
      if (
        this.listQuery.teamName == "" ||
        this.listQuery.teamName == undefined
      ) {
        this.listQuery.teamName = null;
        this.getList()
        return
      }
      teamSearch({
        teamName: this.listQuery.teamName
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
    handleDelete(row) {
      teamdelete({
        id: row.id
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
    sortChange(data) {},

    resetTemp() {
      this.temp = {
        teamId: undefined,
        teamName: undefined,
        geometryId: undefined,
        geometryName: undefined,
        leaderId: undefined,
        leaderName: undefined,
        createTime: undefined,
        status: undefined,
        sercurityCount: undefined,
        gunCount: undefined,
        securityGroupCount: undefined
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
            this.temp.leaderId,
            this.teamLeaderOptions,
            "key",
            "display_name",
            "leaderId",
            "leaderName"
          );
           this.selectFilter(
            this.temp.geometryId,
            this.geometryOptions,
            "key",
            "display_name",
            "geometryId",
            "geometryName"
          )
          this.temp.createTime=Date.parse(new Date())
          console.log(this.temp);
          teamadd(this.temp).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.listQuery.page=1;
              this.dialogFormVisible = false;
               this.$message({
                message: res.msg,
                type: "success"
              });

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
          // delete this.temp.id;
          //  delete this.temp.sercurityCount;
          //   delete this.temp.gunCount;
          //    delete this.temp.securityGroupCount;
             this.selectFilter(
            this.temp.leaderId,
            this.teamLeaderOptions,
            "key",
            "display_name",
            "leaderId",
            "leaderName"
          );
           this.selectFilter(
            this.temp.geometryId,
            this.geometryOptions,
            "key",
            "display_name",
            "geometryId",
            "geometryName"
          )
          this.temp.createTime=Date.parse(new Date())
          console.log(this.temp);
          teamupdate(this.temp).then(res => {
            console.log(res);
            if (res.status == 0) {
              this.getList();
              this.listQuery.page=1;
              this.dialogFormVisible = false;
               this.$message({
                message: res.msg,
                type: "success"
              });

            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
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
    },

    goFiles(type) {
      if (type == 1) {
        this.$router.push({ path: "/personnelFiles", query: { id: 1 } });
      } else if (type == 2) {
        this.$router.push({ path: "/gunFiles", query: { id: 2 } });
      } else {
        this.$router.push({ path: "/unitManagement", query: { id: 3 } });
      }
    },
    formatDateTime(timestamp) {
      return formatDate(timestamp);
    },
     formatStatus(status) {
      if (status == 1) {
        return "存在";
      } else if (status == 2) {
        return "取消";
      }
    }
    
  }
};
</script>
<style lang="scss">
#brigadeManagement {
  .el-form-item__label {
    width: 80px !important;
  }
  .el-form-item__content {
    margin-left: 80px !important;
  }
}
</style>









