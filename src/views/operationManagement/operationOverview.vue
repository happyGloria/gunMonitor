<template>
  <div id="operationOverview">
    <div id="videoBox" v-show="isShow">
      <div id="video" ref="video"></div>
    </div>
    <div id="map" ref="map"></div>
    <div id="tree">
      <el-button v-waves type="primary" @click="isShowVideo" class="isShowVideo">{{isShow ? '隐藏': '显示'}}视频</el-button>
      <el-tree
        :data="data"
        show-checkbox
        ref="tree"
        node-key="id"
        :render-after-expand="true"
        :default-expand-all="true"
        :props="defaultProps"
        @check="getCheckedNodes"
        @node-click="selectVideoCar"
      ></el-tree>
      <el-tree
        class="cameraTree"
        :data="camera"
        show-checkbox
        ref="cameraTree"
        node-key="id"
        :props="cameraDefaultProps"
        @check="getCamera"
      ></el-tree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#operationOverview {
    overflow: hidden;
    position: relative;
    #videoBox {
        float: left;
        width: 60vw;
        height: calc(100vh - 84px);
    }
    #map {
        // max-width: calc(100vw - 54px);
        // min-width: calc(100vw - 210px);
        width: auto;
        height: calc(100vh - 84px);
        overflow: hidden;
    }
    #tree {
        width: 200px;
        height: auto;
        position: absolute;
        top: 35px;
        right: 20px;
        .isShowVideo{
          margin-bottom: 10px;
          margin-left: 100px;
        }
        .el-tree {
            background-color: rgba(200, 200, 200, 0.8);
        }
        .el-tree-node__content:hover {
            background-color: rgba(221, 221, 221, 0.2);
        }
        .cameraTree {
            padding-top: 30px;
        }
    }
}
</style>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
import './jquery.query-2.1.7';
import swfobject from './swfobject'
import path from './player.swf' // 获取引入的swf地址
export default {
    data() {
        return {
            map: undefined,
            isShow: true,
            data: [{
                    id: 1,
                    name: '一大队',
                    label: '一级 1',
                    children: [{
                                id: 4,
                                name: 'carNo.005',
                                label: '二级 1-1',
                                item: 'car'
                              }]
                      }, {
                          id: 2,
                          name: '二大队',
                          label: '一级 2',
                          children: [{
                                        id: 5,
                                        name: 'carNo.001',
                                        label: '二级 2-1',
                                        item: 'car'
                                    },
                                    {
                                        id: 6,
                                        name: 'carNo.002',
                                        label: '二级 2-2',
                                        item: 'car'
                                    }]
                      }
                  ],
            camera: [{
                    id: 1,
                    name: '摄像头1',
                },
                {
                    id: 2,
                    name: '摄像头2',
                },
                {
                    id: 3,
                    name: '摄像头3',
                },
                {
                    id: 4,
                    name: '摄像头4',
                }
            ],
            cameraDefaultProps: {
                label: 'name', // 指定节点标签为节点对象的某个属性值 string
            },
            defaultProps: {
                children: 'children',
                label: 'name' // 指定节点标签为节点对象的某个属性值 string
            },
            playingStatusArray: [],
            selectIndex: 0,
            isInitFinished: false, // 视频插件是否价值完成
            divId: ''  // 用于保存flash所需要的div id
        };
    },
    mounted() {
        this.initMap()
        this.divId = this.$refs.video.id
        this.initPlayerExample()
    },
    directives: {
        waves
    },
    methods: {
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
        getCheckedNodes() {
            console.log(this.$refs.tree.getCheckedNodes(true, false));
        },
        getCamera() {
            console.log(this.$refs.cameraTree.getCheckedNodes(true, false));
        },
        isShowVideo() {
            this.isShow = !this.isShow;
            if (this.isShow == true) {
              this.initPlayerExample()
            }
        },
        selectVideoCar(e) { // 鼠标单击选择节点的时候,获取点击的节点,判断是不是车,获取车的id
            if (e.item == 'car') {
                console.log(e.id);
            }
        },
        initPlayerExample() {
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
            let width = $('#videoBox').width()
            let height = $('#videoBox').height()
            //初始化flash
            swfobject.embedSWF(path, this.divId, width, height, "11.0.0", null, null, params, null);
            this.initFlash();
        },
        initFlash() {
            console.log('初始化 initFlash');
            let _this = this


            if (swfobject.getObjectById(this.divId) == null ||
                typeof swfobject.getObjectById("video").setWindowNum == "undefined") {
                // setTimeout(_this.initFlash(), 50000);
                setTimeout(() => {
                  this.initFlash()
                }, 50);
            } else {
                //初始化插件语言

                swfobject.getObjectById(this.divId).setLanguage('cn.xml');
                //先将全部窗口创建好
                swfobject.getObjectById(this.divId).setWindowNum(36);
                //再配置当前的窗口数目
                var windowNum = '4';
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
                let serverIp = '112.74.87.74'
                let serverPort = '6605'
                swfobject.getObjectById(this.divId).setServerInfo(serverIp, serverPort);
                this.isInitFinished = true;
            }
        }

    }
}
</script>

