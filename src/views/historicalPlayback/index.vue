<template>
<div id="historicalPlayback">
    <div class="selectionMode">
        <el-button type="primary" @click="showVideo">视频回放</el-button>
        <el-button type="success" @click='hiddenVideo = true;showLeft = false;isTrajectory=true'>轨迹回放</el-button>
    </div>
    <div class="left" v-show="showLeft">
        <div class="placeholderBox"></div>
        <div class="findCar">
            <el-input v-model="carNumber" placeholder="请输入车辆编号" @focus='dialogSelectCar = true'></el-input>
            <!-- <el-button type="warning" @click='dialogSelectCar = true'>选择车辆</el-button> -->
        </div>
        <div class="dateBox">
            <el-date-picker v-model="videoDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
            </el-date-picker>
        </div>
        <div class="timeBox">
            <p>开始时间 : </p>
            <el-time-picker v-model="videoStartTime" value-format='HH:mm:ss' placeholder="开始时间">
            </el-time-picker>
            <p>结束时间 : </p>
            <el-time-picker v-model="videoEndTime" value-format='HH:mm:ss' placeholder="结束时间">
            </el-time-picker>
        </div>
        <div class="fileLocation">
            <p>文件位置</p>
            <el-radio-group v-model="fileLocation">
                <el-radio :label="1">设备终端</el-radio>
                <el-radio :label="2">存储服务器</el-radio>
                <el-radio :label="4">下载服务器</el-radio>
            </el-radio-group>
        </div>
        <div class="fileType">
            <p>文件类型</p>
            <el-radio-group v-model="fileType">
                <el-radio :label="2">录像</el-radio>
                <el-radio :label="1">图片</el-radio>
            </el-radio-group>
        </div>
        <div class="videoType">
            <p>录像类型</p>
            <el-radio-group v-model="videoType">
                <el-radio :label="-1">所有</el-radio>
                <el-radio :label="0">常规</el-radio>
                <el-radio :label="1">报警</el-radio>
            </el-radio-group>
        </div>
        <div class="searchBox">
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
    </div>
    <div class="content">
        <div id="videoBox" v-show="!hiddenVideo">
            <p class="videoTitle">{{videoTitle}}</p>
            <div id="video" ref="video"></div>
        </div>
        <div id="map" ref="map"></div>
        <div :class="{findTrajectory:true,changeBottom:upOrDown == 'down'}" v-show="isTrajectory">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="查找车辆">
                    <el-select v-model="value"  filterable placeholder="请输入关键词" @change="fileBlur(value)">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <i class="el-icon-more iconMore" @click="findTrajectoryCar = true"></i>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="间距">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="0 M" value="shanghai"></el-option>
                        <el-option label="500 M" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="静止时长(秒)">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="轨迹类型">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="普通" value="shanghai"></el-option>
                        <el-option label="主动安全" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="回放速度">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="正常回放"></el-radio>
                        <el-radio label="快速回放"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="轨迹点">
                    <el-switch v-model="form.delivery"></el-switch>
                </el-form-item>
                <el-form-item class="searchBox">
                    <el-button @click="searchTrajectory">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="progressBarBox" v-show="isShowProgressBarBox">
                <div class="placeholderBox">
                    <div class="timeProgressBar" v-show="isShowTimeProgressBar">
                        <span class="iconfont iconjian"></span>
                        <div class="block">
                            <el-slider v-model="playSpeed" vertical :min='10' :format-tooltip="formatTooltipTime">
                            </el-slider>
                        </div>
                        <span class="iconfont iconjia"></span>
                    </div>
                </div>
                <div class="trajectoryProgressBar">
                    <span :class="['iconfont',isStop == true? 'iconai23' : 'iconzanting']" @click="playOrStopTrajectory"></span>
                    <div class="block">
                        <el-slider v-model="trajectoryProgress" :format-tooltip="formatTooltipTrajectory"></el-slider>
                    </div>
                    <span class="iconfont iconstop"></span>
                    <span class="iconfont icontime" @click="isShowTimeProgressBar = !isShowTimeProgressBar"></span>
                </div>
            </div>
        </div>
        <div id="bottomBox">
            <div class="iconBox">
                <el-tooltip class="item" effect="dark" content="窗口化" placement="top-start">
                    <i class="el-icon-arrow-up myicons" @click="shwoBootomBox(null)" v-show="upOrDown == 'up'"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="最小化" placement="top-start">
                    <i class="el-icon-arrow-down myicons" @click="hiddenBootomBox" v-show="upOrDown == 'down'"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="最大化" placement="top-start">
                    <i class="iconfont iconmaximize myicons" @click="maxBootomBox"></i>
                </el-tooltip>
            </div>
            <el-tabs v-model="activeName" class="activeName" @tab-click="textfunctiong" v-show="!isTrajectory">
                <el-tab-pane label="时间" name="first">
                    <div class="paddingBox">
                        <div class="tooltipBox" ref='tooltipBox' @mousemove.passive='moveTimeLine'>
                            <div class="cameraPass" cName='CH1'>
                                <div class='videoDiv' v-for="(item,index) in ch1Files" :key='index' :style="{left:item.left,width:item.width}" @dblclick="videoPlayback(item)"></div>
                            </div>
                            <div class="cameraPass" cName='CH2'>
                                <div class='videoDiv' v-for="(item,index) in ch2Files" :key='index' :style="{left:item.left,width:item.width}" @dblclick="videoPlayback(item)"></div>
                            </div>
                            <div class="cameraPass" cName='CH3'>
                                <div class='videoDiv' v-for="(item,index) in ch3Files" :key='index' :style="{left:item.left,width:item.width}" @dblclick="videoPlayback(item)"></div>
                            </div>
                            <div class="cameraPass" cName='CH4'>
                                <div class='videoDiv' v-for="(item,index) in ch4Files" :key='index' :style="{left:item.left,width:item.width}" @dblclick="videoPlayback(item)"></div>
                            </div>
                            <div class="timeAxis">
                                <div class="semih">
                                    <span>00:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>01:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>02:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>03:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>04:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>05:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>06:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>07:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>08:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>09:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>10:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>11:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>12:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>13:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>14:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>15:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>16:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>17:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>18:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>19:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>20:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>21:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>22:00</span>
                                </div>
                                <div class="semih">
                                </div>
                                <div class="semih">
                                    <span>23:00</span>
                                </div>
                                <div class="semih">
                                    <span>24:00</span>
                                </div>
                            </div>
                            
                            <div class="timeLine" :style="{left:timeLineLeft}">
                                <div class="timeTitleBox" :style='{top:timeTitleTop}'>{{timeBoxTitle}}</div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文件" name="second">文件数据</el-tab-pane>
            </el-tabs>
            <el-tabs v-model="activeName" class="activeName" @tab-click="textfunctiong" v-show="isTrajectory">
                <el-tab-pane label="轨迹点" name="first">
                    轨迹点数据
                </el-tab-pane>
                <el-tab-pane label="停车点" name="second">停车点数据</el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <el-dialog title="选择车辆视频" :visible.sync="dialogSelectCar" width="30%" :before-close="handleClose">
        <div class="selectBox">
            <el-select v-model="value" filterable placeholder="请输入关键词" @change="fileBlur(value)">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="treeBox">
            <my-tree :data="data" ref="tree" node-key="id" :render-after-expand="true" :default-expand-all="true" :expand-on-click-node='false' @node-click="selectVideoCar" :props="defaultProps" @doubleClick='doubleClickTreeNode'></my-tree>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSelectCar = false">取 消</el-button>
                <el-button type="primary" @click="getCarNumber">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="选择轨迹车辆" :visible.sync="findTrajectoryCar" width="30%" :before-close="handleClose">
        <div class="selectBox">
            <el-select v-model="value" filterable placeholder="请输入关键词" @change="fileBlur(value)">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="treeBox">
            <my-tree :data="data" ref="tree" node-key="id" :render-after-expand="true" :default-expand-all="true" :expand-on-click-node='false' @node-click="selectVideoCar" :props="defaultProps" @doubleClick='doubleClickTreeNode'></my-tree>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="findTrajectoryCar = false">取 消</el-button>
            <el-button type="primary" @click="getCarNumber">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<style lang="scss">
.el-tabs__header{
    margin: 0 0 5px;
}
</style>

<style lang="scss">
.findTrajectory {
    .el-form-item__label {
        width: 100px !important;
    }

    .el-form-item__content {
        margin-left: 100px !important;
        width: 250px !important;
    }
}

.searchBox {
    .el-form-item__content {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        text-align: center;
    }
}

#bottomBox {
    .el-tabs__content {
        overflow: none;
        overflow-y: auto;
    }

    .el-tabs__content {
        height: 150px;
    }
}

.timeProgressBar .block {
    .el-slider {
        height: 100%;

        .el-slider__runway {
            height: 100% !important;
        }
    }
}
</style><style lang="scss" scoped>
#historicalPlayback {
    width: 100%;
    height: calc(100vh - 110px);
    box-sizing: border-box;
    overflow: hidden;
    display: flex;

    .treeBox {
        height: 400px;
        background-color: red;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .selectionMode {
        width: 260px;
        height: 80px;
        box-sizing: border-box;
        text-align: center;
        line-height: 80px;
        position: absolute;
        z-index: 2000;
    }

    .left {
        height: 100%;
        width: 260px;
        margin: 0;
        padding: 0;

        // position: relative;
        .placeholderBox {
            width: 0px;
            height: 80px;
        }

        .findCar {
            width: 100%;
            height: 50px;
            box-sizing: border-box;
            text-align: center;
            line-height: 50px;
            padding: 0 20px 20px 20px;

            .el-button {
                width: 100%;
            }
        }

        .dateBox {
            width: 100%;
            height: 60px;
            padding: 10px 20px 0px 20px;
            box-sizing: border-box;
            text-align: center;
        }

        .timeBox {
            width: 100%;
            height: 160px;
            padding-top: 10px;
            box-sizing: border-box;
            text-align: center;
            position: relative;

            .el-date-editor {
                padding: 10px 0;
            }

            p {
                padding: 0;
                margin: 0;
            }
        }

        .fileLocation {
            width: 100%;
            height: 150px;
            box-sizing: border-box;
            text-align: center;

            p {
                margin-bottom: 0;
            }

            .el-radio-group {
                height: 80%;
                box-sizing: border-box;
                padding-left: 20px;
                display: flex;
                flex-direction: column;
                text-align: left;
                justify-content: space-around;

                .el-radio {
                    // margin-right: 10px;
                    margin: 0;
                }
            }
        }

        .fileType {
            width: 100%;
            height: 60px;
            text-align: center;

            .el-radio {
                margin-right: 10px;
            }
        }

        .videoType {
            width: 100%;
            height: 60px;
            text-align: center;

            .el-radio {
                margin-right: 10px;
            }
        }

        .searchBox {
            padding-top: 50px;
            width: 100%;
            text-align: center;

            .el-button {
                width: 60%;
            }
        }
    }

    .content {
        margin: 0;
        padding: 0;
        height: 100%;
        flex: 1;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        position: relative;

        #videoBox {
            box-sizing: border-box;
            float: left;
            width: 60vw;
            height: calc(100vh - 150px); // 不显示底部盒子时的高度
            // height: calc(100vh - 310px);    // 显示底部盒子时的高度
            // max-height: calc(100vh - 150px);
            padding: 0;
            overflow: hidden;
            margin: 0;
            .videoTitle{
                margin: 0;
                padding: 0;
                height: 25px;
                font-size: 18px;
                line-height: 25px;
            }
        }

        #map {
            box-sizing: border-box;
            // max-width: calc(100vw - 54px);
            // min-width: calc(100vw - 210px);
            width: auto;
            height: calc(100vh - 150px); // 不显示底部盒子时的高度   110 + 40
            // height: calc(100vh - 310px); // 显示底部盒子时的高度     110 + 200
            // min-height: calc(100vh - 310px);
            // max-height: calc(100vh - 150px);
            overflow: hidden;
        }

        #bottomBox {
            width: 100%;
            // height: 40px;
            height: 200px;
            padding-left: 10px;
            position: relative;

            .el-tabs__content {
                overflow-y: auto;
            }

            // display: none;
            // max-height: 200px;
            .iconBox {
                position: absolute;
                right: 0;
                height: 200px;
                z-index: 100;

                .myicons {
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    padding: 0 10px;
                }
            }

            .activeName {
                .paddingBox{
                    width: 100%;
                    height: 100px;
                    padding: 0 20px;
                    box-sizing: border-box;
                    z-index: 101;
                    .tooltipBox {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        z-index: 200;
                        .cameraPass{
                            width: 100%;
                            height: 25px;
                            box-sizing: border-box;
                            border-bottom: 1px solid #ccc;
                            position: relative;
                            z-index: 10;
                            .videoDiv{
                                position: absolute;
                                height: 100%;
                                background-color: rgba(153, 204, 255,0.8);
                            }
                        }
                        .timeAxis{
                            width: 100%;
                            height: 30px;
                            display: flex;
                            .semih{
                                flex: 1;
                                border-left: 1px solid #ccc;
                                position: relative;
                                span{
                                    font-size: 10px;
                                    color: #ccc;
                                    position: absolute;
                                    bottom: -13px;
                                    left: -15px;
                                }
                                &:last-child{
                                    border-right: 1px solid #ccc;
                                    span{
                                        left: 15px;
                                    }
                                }
                            }
                        }
                        .timeLine{
                            width: 1px;
                            position: absolute;
                            height: 100px;
                            background-color: blue;
                            top: 0;
                            .timeTitleBox{
                                position: absolute;
                                left: 5px;
                                background-color: #0071c6;
                                font-size: 12px;
                                width: 80px;
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
        .findTrajectory {
            width: 400px;
            height: 450px;
            position: absolute;
            background-color: #ffffff;
            right: 10px;
            bottom: 50px;
            z-index: 20;
            box-sizing: border-box;
            padding: 10px 5px 5px 5px;

            .el-form-item {
                margin-bottom: 8px;
            }

            .iconMore {
                padding-left: 8px;
                font-size: 20px;
                cursor: pointer;

                &:hover {
                    color: #277fc0;
                }
            }

            .progressBarBox {
                width: 240px;
                height: 200px;
                position: absolute;
                left: -250px;
                bottom: 10px;

                .placeholderBox {
                    display: flex;
                    flex-direction: column;
                    height: 170px;
                    width: 100%;
                    padding-bottom: 10px;

                    .timeProgressBar {
                        align-self: flex-end;
                        height: 160px;
                        width: 40px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-around;
                        background-color: #ffffff;

                        .block {
                            // height: 100px;
                            flex: 1;
                            box-sizing: border-box;
                            padding-bottom: 5px;

                            .el-slider {
                                height: 100%;

                                .el-slider__runway {
                                    height: 100%;
                                }
                            }
                        }

                        span {
                            color: #999999;
                            line-height: 40px;
                            padding-bottom: 5px;

                            &:hover {
                                color: #277fc0;
                            }
                        }
                    }

                }

                .trajectoryProgressBar {
                    background-color: #ffffff;
                    height: 40px;
                    display: flex;
                    box-sizing: border-box;
                    padding-left: 5px;

                    span {
                        color: #999999;
                        line-height: 40px;
                        padding-right: 5px;

                        &:hover {
                            color: #277fc0;
                        }
                    }

                    .block {
                        flex: 1;
                        box-sizing: border-box;
                        padding-right: 5px;
                    }
                }
            }
        }

        .changeBottom {
            bottom: 220px;
        }
    }
}
</style>

<script>
import myTree from '../../components/myTree/tree'
import monitor from '../../../static/images/monitor.png'
import talkback from '../../../static/images/talkback.png'
import {
    clearTimeout
} from 'timers';
import '../../../static/flash/jquery.query-2.1.7.js';
import swfobject from '../../../static/flash/swfobject.js'
import path from '~static/flash/player.swf' // 获取引入的swf地址
export default {
    data() {
        return {
            dialogSelectCar: false,
            showLeft: true,
            windowHeight: 0, // window窗口视图高度
            isTrajectory: true, // 判断是轨迹回放还是视频回放
            //  树形控件开始
            data: [{
                    id: '1',
                    name: '监控中心',
                    label: '一级 1',
                    children: [{
                            id: '55',
                            name: '一大队',
                            label: '一级 1',
                            children: [{
                                id: 'car-1-1',
                                name: 'carNo.005',
                                label: '二级 1-1',
                                type: 'car',
                                children: [{
                                        id: 1,
                                        name: '摄像头1',
                                        type: 'camera',
                                        index: 1,
                                        parentId: 'car-1-1'
                                    },
                                    {
                                        id: 2,
                                        name: '摄像头2',
                                        type: 'camera',
                                        index: 2,
                                        parentId: 'car-1-1'
                                    },
                                    {
                                        id: 3,
                                        name: '摄像头3',
                                        type: 'camera',
                                        index: 3,
                                        parentId: 'car-1-1'
                                    },
                                    {
                                        id: 4,
                                        name: '摄像头4',
                                        type: 'camera',
                                        index: 4,
                                        parentId: 'car-1-1'
                                    }
                                ],
                            }]
                        },
                        {
                            id: 2,
                            name: '二大队',
                            label: '一级 2',
                            children: [{
                                    id: 'car-2-1',
                                    name: 'carNo.001',
                                    label: '二级 2-1',
                                    type: 'car',
                                    children: [{
                                            id: 1,
                                            name: '摄像头1',
                                            type: 'camera',
                                            index: 1,
                                            parentId: 'car-2-1'
                                        },
                                        {
                                            id: 2,
                                            name: '摄像头2',
                                            type: 'camera',
                                            index: 2,
                                            parentId: 'car-2-1'
                                        },
                                        {
                                            id: 3,
                                            name: '摄像头3',
                                            type: 'camera',
                                            index: 3,
                                            parentId: 'car-2-1'
                                        },
                                        {
                                            id: 4,
                                            name: '摄像头4',
                                            type: 'camera',
                                            index: 4,
                                            parentId: 'car-2-1'
                                        }
                                    ],
                                },
                                {
                                    id: 'car-2-2',
                                    name: 'carNo.002',
                                    label: '二级 2-2',
                                    type: 'car',
                                    children: [{
                                            id: 1,
                                            name: '摄像头1',
                                            type: 'camera',
                                            index: 1,
                                            parentId: 'car-2-2'
                                        },
                                        {
                                            id: 2,
                                            name: '摄像头2',
                                            type: 'camera',
                                            index: 2,
                                            parentId: 'car-2-2'
                                        },
                                        {
                                            id: 3,
                                            name: '摄像头3',
                                            type: 'camera',
                                            index: 3,
                                            parentId: 'car-2-2'
                                        },
                                        {
                                            id: 4,
                                            name: '摄像头4',
                                            type: 'camera',
                                            index: 4,
                                            parentId: 'car-2-2'
                                        }
                                    ],
                                }
                            ]
                        }
                    ]
                },

            ],
            defaultProps: {
                children: 'children',
                label: 'name' // 指定节点标签为节点对象的某个属性值 string
            },
            //  树形控件结束

            //  搜索下拉开始
            options: [{
                value: 'car-1-1',
                label: 'car-1-1'
            }, {
                value: 'car-2-1',
                label: 'car-2-1'
            }, {
                value: 'car-2-2',
                label: 'car-2-2'
            }],
            value: '',
            //  搜索下拉结束

            hiddenVideo: true,
            map: undefined,
            //  视频插件相关参数开始
            playingStatusArray: [],
            selectIndex: 0,
            isInitFinished: false, // 视频插件是否加载完成
            divId: 'video', // 用于保存flash所需要的div id
            initFlashNumber: 0, // 初始化flash的次数记录器
            //  视频插件相关参数结束
            serverIp: 'www.beidoulab.club', // 视频播放的ip
            serverPort: '6605', // 视频播放的端口
            activeName: 'first', // 底部选项卡激活
            upOrDown: 'up', // 底部盒子显示隐藏字体图标

            selectCarNumber: '', // dialog弹框中输入框的值
            carNumber: '5010439', // 输入框中车辆编号
            videoDate: '',
            videoStartTime: '00:00:00',
            videoEndTime: '23:59:59',
            fileLocation: 1, // 文件位置
            fileType: 2, // 文件类型
            videoType: -1, // 录像类型
            form: { // 地图右下表单数据
                name: '0',
                region: 'shanghai',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            findTrajectoryCar: false, // 轨迹车辆控制器
            trajectoryProgress: 36, // 车辆轨迹回放 进度条默认值
            playSpeed: 10, // 轨迹播放速度
            isShowProgressBarBox: false, // 地图轨迹左侧进度条
            isShowTimeProgressBar: false, // 控制时间进度条显示
            isStop: false, // 控制轨迹进度条播放
            videoTitle: '视频回放',
            fliesArray: [],
            ch1Files: [],
            ch2Files: [],
            ch3Files: [],
            ch4Files: [],
            timeLineLeft: '0',   // 时间轴线的定位left 的默认位置
            timeBoxTitle: 'CH1 00:00:00',   // 标题
            timeTitleTop: '0',  // 时间轴线标题给的定位top 的默认位置
        }
    },
    components: {
        myTree
    },
    mounted() {
        this.windowHeight = $(window).height()
        this.initMap()
        this.initPlayer()
        this.showVideo()
        /*
            // 监听点击是那个视频窗口事件
            // window.onTtxVideoMsg = function onTtxVideoMsg(index, type) {
            //     console.log(index);
            //     console.log(type);
            //     if (index != null && index != "") {
            //         index = parseInt(index, 10);
            //     }
            //     //窗口事件
            //     //window message
            //     if (type == "select") {
            //         //选中窗口     		select window
            //         // selectIndex = index;
            //         // $('#eventTip').text(lang.vedioEventStart + (index + 1) + lang.vedioEventEnd);
            //     } else if (type == "full") {
            //         //全屏		Full screen
            //     } else if (type == "norm") {
            //         //退出全屏		Exit full screen
            //     }
            //     //视频播放事件
            //     //video play messsage
            //     else if (type == "stop") {
            //         //停止播放		stop playing
            //         // playingStatusArray[index] = false;
            //     } else if (type == "start") {
            //         //开始播放		Start play
            //         // playingStatusArray[index] = true;
            //     } else if (type == "sound") {
            //         //开启声音		Turn on the sound
            //     } else if (type == "silent") {
            //         //静音		Mute
            //     } else if (type == "play") {
            //         //暂停或停止后重新播放		Play again after pause or stop
            //     } else if (type == "PicSave") {
            //         //截图		screenshot
            //         console.log('点击截图');
            //     }
            //     //对讲事件
            //     //Intercom messsage
            //     else if (type == "startRecive" || type == "uploadRecive" || type == "loadRecive") {
            //         //开启对讲		Open intercom
            //     } else if (type == "stopTalk") {
            //         //关闭对讲		Turn off intercom
            //     } else if (type == "playRecive") {
            //         //对讲中		Talkback
            //     } else if (type == "reciveStreamStop" || type == "reciveNetError" || type == "reciveStreamNotFound") {
            //         //对讲异常(网络异常等)		Talkback anomalies (network exceptions, etc.)

            //     } else if (type == "uploadNetClosed" || type == "uploadNetError") {
            //         //连接异常 		Connection exception 
            //     } else if (type == "upload") {
            //         //对讲讲话		Talkback speech
            //     } else if (type == "uploadfull") {
            //         //对讲讲话结束		Talkback speech ends
            //     }
            //     //监听事件
            //     //Listen messsage
            //     else if (type == "startListen") {
            //         //开始监听      		Start listening		    } else if (type == "stopListen") {
            //         //主动停止监听 		Active stop monitoring

            //     } else if (type == "listenNetError") {
            //         //网络异常  		Network anomaly

            //     } else if (type == "playListen") {
            //         //监听中		In listening
            //     } else if (type == "loadListen" || type == "listenStreamNotFound" || type == "listenStreamStop") {
            //         //等待请求监听	   	Waiting request monitoring 
            //     }
            // }
         */
    },
    methods: {
        /*
            id:string
            height: number 相对于窗口可视区要减去的高度
        */
        setHeightById(id, height) {
            let boxHeight = this.windowHeight - height
            $('#' + id).height(boxHeight + 'px')
        },
        initMap() {
            this.map = new BMap.Map("map");
            this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
            //添加地图类型控件
            this.map.addControl(new BMap.MapTypeControl({
                mapTypes: [
                    BMAP_NORMAL_MAP,
                    BMAP_HYBRID_MAP
                ]
            }));
            this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        },
        initPlayer() {
            for (var i = 0; i < 101; i++) {
                this.playingStatusArray.push(false);
            }
            //视频参数
            var params = {
                allowFullscreen: "true",
                allowScriptAccess: "always",
                bgcolor: "#cccccc",
                wmode: "transparent"
            };
            //赋值初始化为未完成
            this.isInitFinished = false;
            let width = $('#videoBox').width() // 获取容器宽
            let height = $('#videoBox').height() // 获取容器高
            //初始化flash
            swfobject.embedSWF(path, this.divId, width, height - 25, "11.0.0", null, null, params, null);
            this.initFlash();
        },
        initFlash() {
            let _this = this

            if (swfobject.getObjectById(this.divId) == null ||
                typeof swfobject.getObjectById("video").setWindowNum == "undefined") {
                // setTimeout(_this.initFlash(), 50000);
                setTimeout(() => {
                    if (this.initFlashNumber > 200) {
                        this.$message.error('初始化flash失败,请重启浏览器或联系开发人员!!!');
                        return
                    }
                    this.initFlash()
                    this.initFlashNumber++
                }, 50);
            } else {
                //初始化插件语言
                // swfobject.getObjectById(this.divId).setLanguage('cn.xml');
                //先将全部窗口创建好
                swfobject.getObjectById(this.divId).setWindowNum(36);
                //再配置当前的窗口数目
                var windowNum = '1';
                swfobject.getObjectById(this.divId).setWindowNum(windowNum);
                //设置服务器信息
                // var serverIp = $.trim($('#serverIp').val());
                // if (!serverIp) {
                //   $('#serverIp').focus();
                //   return;
                // }
                // var serverPort = $.trim($('#serverPort').val());
                // if (!serverPort) {
                //   $('#serverPort').focus();
                //   return;
                // }
                swfobject.getObjectById(this.divId).setServerInfo(_this.serverIp, _this.serverPort);
                this.isInitFinished = true;
            }
        },
        showVideo() {
            this.hiddenVideo = false;
            this.showLeft = true;
            this.initPlayer()
            this.isTrajectory = false;
        },
        selectVideoCar(e) { // 鼠标单击选择节点的时候,获取点击的节点,判断是不是车,获取车的id
            if (e.type == 'car') {
                this.selectCarNumber = e.name
                console.log(e.id);
            }
        },
        doubleClickTreeNode(e) { // 双击节点
            console.log(e)
            if (e.type == 'car') {
                this.carNumber = e.name;
                this.showVideo()
                // this.hiddenVideo = true;
                // 显示路径的操作
            } else if (e.type == 'camera') {
                this.carNumber = e.parentId + `(${e.name})`
                // 视频播放的操作
                this.showVideo()
            } else {
                return
            }
            this.dialogSelectCar = false
        },
        getCarNumber() { // 点击车tree的确定按钮
            this.carNumber = this.selectCarNumber
            this.dialogSelectCar = false
        },
        fileBlur(value) {
            console.log(value)
        },
        handleClose(done) { // 点击dialog右上角x
            this.dialogSelectCar = false;
        },
        setMapAndVideoHeight(height) { // 改变地图和视频的宽高
            this.setHeightById('map', height)
            this.setHeightById('video', height + 25)
            this.setHeightById('videoBox', height)
        },
        shwoBootomBox(activeName) { // 显示底部盒子
            console.log('显示底部盒子');

            this.setMapAndVideoHeight(310)
            this.setHeightById('bottomBox', this.windowHeight - 310)
            if (activeName != null) {
                this.activeName = activeName
            }
            this.upOrDown = 'down'
        },
        hiddenBootomBox() { // 隐藏底部盒子
            this.setMapAndVideoHeight(150)
            this.setHeightById('bottomBox', this.windowHeight - 150)
            this.upOrDown = 'up'
        },
        maxBootomBox() { // 最大化
            this.setMapAndVideoHeight(this.windowHeight)
            this.setHeightById('bottomBox', 0)
            this.upOrDown = 'down'
        },
        search() { // 搜索视频
            /*
                console.log('车辆编号');
                console.log(this.carNumber);
                console.log('日期');
                console.log(this.videoDate);
                console.log('开始时间');
                console.log(this.videoStartTime);
                console.log('结束时间');
                console.log(this.videoEndTime);
                console.log('文件位置');
                console.log(this.fileLocation);
                console.log('文件类型');
                console.log(this.fileType);
                console.log('录像类型');
                console.log(this.videoType);
            */
           let _this = this
           if (this.carNumber == '') {
               this.$message.error('请选择车辆终端');
               return
           }
           if (this.videoDate == '') {
               this.$message.error('请选择查询日期');
               return
           }
            
            const dateArray = this.videoDate.split('-')
            const beginSecond = this.timeToSecond(this.videoStartTime)
            const endSecond = this.timeToSecond(this.videoEndTime)
            const jsession = '504a8fde-1174-4051-8733-26d9bdca8bd6'
            

            const data = {
                DevIDNO: this.carNumber,
                LOC:this.fileLocation,
                CHN: -1,
                YEAR: Number(dateArray[0]),
                MON: Number(dateArray[1]),
                DAY: Number(dateArray[2]),
                RECTYPE: this.videoType,
                FILEATTR: this.fileType,
                BEG: beginSecond,
                END: endSecond,
                jsession: jsession,
                // 1078设备参数 非1078填0
                ARM1: 0,
                ARM2: 0,
                RES: 0,
                STREAM: 0,
                STORE: 0
            }
            $.ajax({
                type: 'POST',
                url: 'http://www.beidoulab.club:88/StandardApiAction_getVideoFileInfo.action' ,
                data: data,
                success: (data) => {
                    _this.ch1Files = []
                    _this.ch2Files = []
                    _this.ch3Files = []
                    _this.ch4Files = []
                    if (JSON.parse(data).result == 0) {
                        _this.shwoBootomBox('first')
                        let filesArray = JSON.parse(data).files
                        const timeBoxTotalLength = _this.$refs.tooltipBox.clientWidth
                        for (let index = 0; index < filesArray.length; index++) {
                            let item = filesArray[index]
                            let second = item.end - item.beg
                            item.width = _this.secondToPx(second,timeBoxTotalLength)
                            item.left = _this.secondToPx(item.beg,timeBoxTotalLength)
                            let chName = ''
                            switch (item.chn) {
                                case 0:
                                    chName = 'CH1'
                                    break;
                                case 1:
                                    chName = 'CH2'
                                    break;
                                case 2:
                                    chName = 'CH3'
                                    break;
                                case 3:
                                    chName = 'CH4'
                                    break;
                                default:
                                    break;
                            }
                            const fileNameArray = item.file.split('-')
                            const data = `20${fileNameArray[1].slice(0,2)}-${fileNameArray[1].slice(2,4)}-${fileNameArray[1].slice(4,6)}`
                            let title = `${item.devIdno} - ${chName} - ${data} ${_this.formatTime(item.beg)} - ${_this.formatTime(item.end)}`            
                            item.title = title
                            switch (item.chn) {
                                case 0:
                                    _this.ch1Files.push(item)
                                    break;
                                case 1:
                                    _this.ch2Files.push(item)
                                    break;
                                case 2:
                                    _this.ch3Files.push(item)
                                    break;
                                case 3:
                                    _this.ch4Files.push(item)
                                    break;
                                default:
                                    break;
                            }
                        }
                        // _this.fliesArray = fliesArray
                        console.log(filesArray);
                        console.log(_this.ch1Files);
                        console.log(_this.ch2Files);
                        console.log(_this.ch3Files);
                        console.log(_this.ch4Files);
                    } else {
                        this.$message('请求出错!!!')
                    }
                }
            });

        },
        formatTooltipTrajectory(value) { // 格式化轨迹进度条
            return (value / 100) + ' %';
        },
        formatTooltipTime(value) { // 格式化轨迹进度条
            return (value * 10) + ' ms';
        },
        searchTrajectory() { // 搜索轨迹
            this.isShowProgressBarBox = true
        },
        playOrStopTrajectory() { // 播放或暂停轨迹
            if (this.isStop) {
                // 继续播放轨迹的代码
            } else {
                // 暂停播放轨迹的代码
            }
            this.isStop = !this.isStop
        },
        textfunctiong(tab, event) { // 标签页tab 被选中时触发 的测试方法
            console.log(tab);
            console.log(tab.name);
            console.log(event);
            this.shwoBootomBox(tab.name)
        },
        moveTimeLine(e){    // 移动鼠标,时间轴线运动
            const nowX = e.pageX - 260 - 10 - 20
            if (nowX < 0) {
                return
            }
            const timeBoxTotalLength = this.$refs.tooltipBox.clientWidth
            if (nowX > timeBoxTotalLength) {
                return
            }
            const second = 86400 * nowX/this.$refs.tooltipBox.clientWidth
            const formatTime = this.formatTime(second)
            const cName = e.target.getAttribute('cName')
            switch (cName) {
                case 'CH1':
                    this.timeTitleTop = `${25 * 0 + e.offsetY}px`
                    this.timeBoxTitle = `${cName} ${formatTime}`
                    break;
                case 'CH2':
                    this.timeTitleTop = `${25 * 1 + e.offsetY}px`
                    this.timeBoxTitle = `${cName} ${formatTime}`
                    break;
                case 'CH3':
                    this.timeTitleTop = `${25 * 2 + e.offsetY}px`
                    this.timeBoxTitle = `${cName} ${formatTime}`
                    break;
                case 'CH4':
                    this.timeTitleTop = `${25 * 3 + e.offsetY}px`
                    this.timeBoxTitle = `${cName} ${formatTime}`
                    break;
                default:
                    break;
            }
            this.timeLineLeft = `${nowX}px`
            // this.timeBoxTitle = `${cName} ${formatTime}`
        },
        formatTime(value) { // 格式化时间 从秒转换为 00:00:00
            let hour = parseInt(value / 3600)
            if (hour < 10) {
                hour = '0' + hour
            }
            let minute = parseInt((value % 3600) / 60)
            if (minute < 10) {
                minute = '0' + minute
            }
            let second = parseInt((value % 3600) % 60)
            if (second < 10) {
                second = '0' + second
            }
            // console.log(`${hour} : ${minute} : ${second}`)
            return `${hour}:${minute}:${second}`;
        },
        timeToSecond(string){   // 00:00:00 转换为秒
            const timeArray = string.split(':')
            const s = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])
            return s
        },
        secondToPx(second,timeBoxTotalLength){  // 将秒转换为px
            return `${(second/86400) * timeBoxTotalLength}px`
        },
        videoPlayback(item){    // 双击  视频回放
            this.videoTitle = item.title
            console.log(item);
        }
    },
}
</script>
