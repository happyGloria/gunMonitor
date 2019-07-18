<template>
<div id="index">
    <div id="header">
        <div id="logo">
            <img src="../../static/images/logo.png" alt class="logoImg">
            <p class="logoText">北斗监控平台</p>
        </div>
        <div id="menu">
            <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#0071c6" text-color="#fff" active-text-color="#ffd04b" @select="selectMenu">
                <el-menu-item index="1">实时监控</el-menu-item>
                <el-submenu index="2">
                    <template slot="title">运营管理</template>
                    <el-menu-item index="2-1">运营状态</el-menu-item>
                    <el-menu-item index="2-2">运营记录</el-menu-item>
                    <el-menu-item index="2-3">枪支统计</el-menu-item>
                    <el-menu-item index="2-4">车辆统计</el-menu-item>
                </el-submenu>
                <el-menu-item index="3">历史回放</el-menu-item>
                <el-submenu index="4">
                    <template slot="title">档案管理</template>
                    <el-menu-item index="4-1">人员档案</el-menu-item>
                    <el-menu-item index="4-2">枪支档案</el-menu-item>
                    <el-menu-item index="4-3">车辆档案</el-menu-item>
                    <el-menu-item index="4-4">车组管理</el-menu-item>
                    <el-menu-item index="4-5">路线管理</el-menu-item>
                    <el-menu-item index="4-6">网点管理</el-menu-item>
                    <el-menu-item index="4-7">大队管理</el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">报警中心</template>
                    <el-menu-item index="5-1">报警设置</el-menu-item>
                    <el-submenu index="5-2">
                        <template slot="title">报警记录</template>
                        <el-menu-item index="5-2-1">拆除报警</el-menu-item>
                        <el-menu-item index="5-2-2">人员报警</el-menu-item>
                        <el-menu-item index="5-2-3">电量报警</el-menu-item>
                        <el-menu-item index="5-2-4">车辆偏移报警</el-menu-item>
                        <el-menu-item index="5-2-5">枪支偏移报警</el-menu-item>
                        <el-menu-item index="5-2-6">超速报警</el-menu-item>
                    </el-submenu>
                    <el-submenu index="5-3">
                        <template slot="title">报警统计</template>
                        <el-menu-item index="5-3-1">报警类型统计</el-menu-item>
                        <el-menu-item index="5-3-2">枪支报警统计</el-menu-item>
                        <el-menu-item index="5-3-3">车组报警统计</el-menu-item>
                        <el-menu-item index="5-3-4">大队报警统计</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="6" v-if="$store.getters.power == 'admin'">用户管理</el-menu-item>
                <el-menu-item index="7">常见问题</el-menu-item>
            </el-menu>
        </div>
        <div id="placeholderBox">
            <div id="userName">
                <el-dropdown>
                    <span class="el-dropdown-link" @click="changeIndex">
              {{userName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>修改密码</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="alarmClock">
                <el-badge :value="$store.state.alarmCount" class="item alarItem" :max="99" :hidden="$store.state.alarmCount==0">
                    <span class="el-icon-message-solid"></span>
                </el-badge>
            </div>
            <p class="iconfont icondingbudaohang-zhangh" @click="logout"></p>
        </div>
    </div>
    <el-dialog title="报警提示" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal" :data="alarmData" class="elDialog alarmPrompt" top="6vh">
        <div class="formBoxAlarm">
            <el-form :model="alarmData[startAlarmIndex]" class="elForm">
                <el-form-item label="编号" :label-width="formLabelWidth" class="borderBottom">
                    <el-input readonly="readonly" type="text" v-model="alarmData[startAlarmIndex].number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="报警类型" :label-width="formLabelWidth" class="borderBottom">
                    <el-input readonly="readonly" type="text" v-model="alarmData[startAlarmIndex].typetext" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth" class="borderBottom">
                    <el-input readonly="readonly" type="text" v-model="alarmData[startAlarmIndex].startTime" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="结束时间" :label-width="formLabelWidth" class="borderBottom">
            <el-input
              readonly="readonly"
              type="text"
              v-model="alarmData[startAlarmIndex].endTime"
              autocomplete="off"
            ></el-input>
          </el-form-item>-->
                <el-form-item label="报警地点" :label-width="formLabelWidth" class="borderBottom">
                    <el-input readonly="readonly" type="text" v-model="alarmData[startAlarmIndex].startPlace" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="结束地点" :label-width="formLabelWidth" class="borderBottom">
            <el-input
              readonly="readonly"
              type="text"
              v-model="alarmData[startAlarmIndex].endPlace"
              autocomplete="off"
            ></el-input>
          </el-form-item>-->
                <!-- <el-form-item label="处理状态" :label-width="formLabelWidth" class="borderBottom">
            <el-input
              readonly="readonly"
              type="text"
              v-model="alarmData[startAlarmIndex].handleStatus"
              autocomplete="off"
            ></el-input>
          </el-form-item>-->
                <el-form-item label="电话" :label-width="formLabelWidth" class="borderBottom">
                    <el-input readonly="readonly" type="text" v-model="alarmData[startAlarmIndex].phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="报警描述" :label-width="formLabelWidth" class="borderBottom">
                    <el-input readonly="readonly" type="textarea" v-model="alarmData[startAlarmIndex].describe" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog width="40%" title="报警处理" :visible.sync="innerVisible" append-to-body :close-on-click-modal="closeOnClickModal">
            <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="处理人" prop="namea">
                    <el-input :readonly="true" v-model="temp.namea" />
                </el-form-item>
                <el-form-item label="报警原因" prop="alarmReason ">
                    <el-input type="textarea" v-model="temp.alarmReason " />
                </el-form-item>
                <el-form-item label="处理意见" prop="dealAdvise">
                    <el-input type="textarea" v-model="temp.dealAdvise " />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">取消</el-button>
                <el-button type="primary" @click="handleAlarmSubmit">确定</el-button>
            </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-divider></el-divider>
            <div class="totalAndCurrentItem">
                <span>等待处理报警总数:</span>
                <span>{{startAlarmIndex+1}}</span>/
                <span>{{alarmData.length}}</span>
            </div>
            <div>
                <el-button @click="previousItem">上一条</el-button>
                <el-button @click="nextItem">下一条</el-button>
                <el-button @click="confirm">确认报警</el-button>
                <el-button @click="handleAlarm">报警处理</el-button>
                <el-button>删除报警</el-button>
                <el-button>监听</el-button>
                <el-button>拍照</el-button>
            </div>
            <!-- <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>-->
        </div>
    </el-dialog>
    <router-view></router-view>
</div>
</template>

<style lang="scss">
.el-submenu__title i {
    font-size: 12px;
    color: #ffffff;
}

#index {
    #header {
        width: 100%;
        height: 110px;
        background-color: #0071c6;
        display: flex;

        #logo {
            width: 340px;
            min-width: 340px;
            box-sizing: border-box;
            padding: 10px 20px;
            display: flex;

            .logoImg {
                width: 100px;
                height: 95px;
            }

            .logoText {
                padding-left: 10px;
                font-size: 30px;
                font-weight: 600;
                color: #ffffff;
            }
        }

        #menu {
            flex: 1;
            min-width: 982px;

            .el-menu {
                height: 100%;

                li {
                    height: 100%;
                    font-size: 20px;
                    line-height: 130px;

                    .el-submenu__title {
                        height: 100%;
                        line-height: 130px;
                        font-size: 20px;

                        i {
                            color: #ffffff;
                            font-size: 16px;
                        }
                    }
                }
            }
        }

        #placeholderBox {
            width: 220px;
            height: 100%;
            display: flex;
            justify-content: space-around;
            box-sizing: border-box;
            padding: 5px 5px;

            #userName {
                .el-dropdown {
                    padding-top: 50px;
                }

                .el-dropdown-link {
                    cursor: pointer;
                    color: #ffffff;
                    font-size: 20px;
                }
            }

            .alarmClock {
                width: 39px;

                .alarItem.item {
                    margin-top: 50px !important;
                }

                .el-icon-arrow-down {
                    font-size: 14px;
                    margin-left: -5px;
                }
            }

            .el-icon-message-solid {
                font-size: 20px;
                color: #ffffff;
            }

            .icondingbudaohang-zhangh {
                color: #ffffff;
                font-size: 20px;
                margin: 0;
                padding-top: 50px;

                &:hover {
                    color: red;
                }
            }
        }
    }

    .alarmPrompt {
        .el-button {
            margin-left: 10px;
            margin-top: 10px;
        }

        .el-dialog__footer {
            text-align: left !important;
        }

        .totalAndCurrentItem {
            margin-left: 10px;
        }

        .el-dialog {
            .el-dialog__body {
                padding-bottom: 0 !important;
            }
        }
    }

    .formBoxAlarm {
        max-height: 550px;
        overflow: auto;

        .elForm {
            margin-right: 10px;
        }
    }
}
</style>

<script>
export default {
    data() {
        return {
            activeIndex: "1",
            activeIndex2: "1",
            userName: "userName",
            index: 0,
            time: 1000,
            timer: null,
            dialogFormVisible: false,
            closeOnClickModal: false,
            showClose: false,
            alarmData: [{
                    number: "56265376878",
                    typetext: "车辆偏离",
                    startTime: "2019-06-18 11:19",
                    endTime: "",
                    describe: "车辆偏离",
                    startPlace: "新疆维吾尔族喀什地区",
                    endPlace: "",
                    handleStatus: "未处理",
                    phone: "1321432545"
                },
                {
                    number: "7890345436",
                    typetext: "枪支低电量",
                    startTime: "2019-06-18 11:19",
                    endTime: "",
                    describe: "电量过低",
                    startPlace: "新疆维吾尔族喀什地区",
                    endPlace: "",
                    handleStatus: "未处理",
                    phone: "1321432545"
                },
                {
                    number: "867598090",
                    typetext: "枪支偏离",
                    startTime: "2019-06-18 11:19",
                    endTime: "",
                    describe: "电量过低",
                    startPlace: "深圳市南山区",
                    endPlace: "",
                    handleStatus: "未处理",
                    phone: "1321432545"
                }
            ],
            formLabelWidth: "120px",
            totalAlarm: "2",
            innerVisible: false,
            startAlarmIndex: 0,
            temp: {
                namea: "赵武",
                alarmReason: undefined,
                dealAdvise: undefined
            }
        };
    },
    created() {
    },
    mounted() {},
    watch: {
        innerVisible: function (val/* , oldval */) {
            console.log(this.innerVisible);
            if (val == false) {
                //代表一旦关闭处理窗口，就重新调用一次请求报警信息的接口，没在处理的时候就正常的没一分钟请求一次
                this.dialogFormVisible = true;
            }
        }
    },
    methods: {
      logout() {
            setTimeout(() => { // 调用登出请求
                this.$store.dispatch('user/logout')
                this.$router.push({
                    path: "/login"
                });
            }, 500);
        },
        selectMenu(key, keyPath) {
            let pathSign = "";
            if (keyPath[2]) {
                pathSign = keyPath[2];
            } else if (keyPath[1]) {
                pathSign = keyPath[1];
            } else if (keyPath[0]) {
                pathSign = keyPath[0];
            } else {
                this.$message.error("系统异常,请联系管理员");
            }
            let path = "";
            switch (pathSign) {
                case "1":
                    path = "/realTimeMonitoring";
                    break;
                case "2-1":
                    path = "/operationalStatus";
                    break;
                case "2-2":
                    path = "/operationalRecords";
                    break;
                case "2-3":
                    path = "/gunStatistics";
                    break;
                case "2-4":
                    path = "/vehicleStatistics";
                    break;
                case "3":
                    path = "/historicalPlayback";
                    break;
                case "4-1":
                    path = "/personnelFiles";
                    break;
                case "4-2":
                    path = "/gunFiles";
                    break;
                case "4-3":
                    path = "/vehicleArchives";
                    break;
                case "4-4":
                    path = "/unitManagement";
                    break;
                case "4-5":
                    path = "/routeManagement";
                    break;
                case "4-6":
                    path = "/networkManagement";
                    break;
                case "4-7":
                    path = "/brigadeManagement";
                    break;
                case "5-1":
                    path = "/alarmSettings";
                    break;
                case "5-2-1":
                    path = "/demolitionAlarm";
                    break;
                case "5-2-2":
                    path = "/personnelAlarm";
                    break;
                case "5-2-3":
                    path = "/electricityAlarm";
                    break;
                case "5-2-4":
                    path = "/vehicleOffsetAlarm";
                    break;
                case "5-2-5":
                    path = "/gunOffsetAlarm";
                    break;
                case "5-2-6":
                    path = "/speedAlarm";
                    break;
                case "5-3-1":
                    path = "/statisticsOfAlarmTypes";
                    break;
                case "5-3-2":
                    path = "/firearmsAlarmStatistics";
                    break;
                case "5-3-3":
                    path = "/alarmStatisticsOfTrainGroup";
                    break;
                case "5-3-4":
                    path = "/brigadeAlarmStatistics";
                    break;
                case "6":
                    path = "/userManagement";
                    break;
                case "7":
                    path = "/commonProblem";
                    break;
                default:
                    path = "/404";
                    this.$message.error("系统异常,请联系管理员");
                    break;
            }

            this.$router.push({
                path
            });
        },
        changeIndex() {
            this.index = 20;
        },
        // 确认报警
        confirm() {
            this.dialogFormVisible = false;
        },
        // 上一条
        previousItem() {
            if (this.startAlarmIndex > 0) {
                this.startAlarmIndex -= 1;
            }
        },
        // 下一条
        nextItem() {
            if (this.startAlarmIndex < this.alarmData.length - 1) {
                this.startAlarmIndex += 1;
            }
        },
        // 点击处理报警按钮
        handleAlarm() {
            this.innerVisible = true;
        },
        // 处理报警提交
        handleAlarmSubmit() {
            this.innerVisible = false;
        }
    }
};
</script>
