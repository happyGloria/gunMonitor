<template>
<div id="realTimeMonitoring">
    <div class="left">
        <div class="selectionMode">
            <el-button type="primary" @click="showVideo">视频模式</el-button>
            <el-button type="success" @click='isVideo = false'>地图模式</el-button>
        </div>
        <div class="selectBox">
            <el-select v-model="value" multiple filterable placeholder="请输入关键词" @change="fileBlur()">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="treeBox">
            <my-tree :data="data" show-checkbox ref="tree" node-key="id" :render-after-expand="true" :default-expand-all="true" :props="defaultProps" @check="getCheckedNodes" @node-click="selectVideoCar" :default-expanded-keys="defaultSelect" @doubleClick='doubleClickTreeNode'></my-tree>
        </div>
        <div class="consistency">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="语音" name="1">
                    <div class="content">
                        <div class="radio">
                            <el-radio v-model="radio" label="1">对讲</el-radio>
                            <el-radio v-model="radio" label="2">监听</el-radio>
                        </div>
                        <img :src="changeImageUrl" alt="" class="monitor">
                        <span>车辆编号: {{onSelectCar == '' ? selectCarNumber.id : onSelectCar}}</span>
                        <span>{{onSelectCamera == '' ? monitorCamera.name : onSelectCamera}}</span>
                        <el-button type="success" @click="open" v-show="!openState">开启</el-button>
                        <el-button type="danger" v-show="openState" @click="stop">停止</el-button>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
    <div class="content">
        <div id="videoBox" v-show="isVideo">
            <div id="video" ref="video"></div>
        </div>
        <div id="map" ref="map"></div>
    </div>
</div>
</template>

<style lang="scss" scoped>
#realTimeMonitoring {
    width: 100%;
    height: calc(100vh - 110px);
    display: flex;

    .selectionMode {
        width: 100%;
        height: 80px;
        box-sizing: border-box;
        text-align: center;
        line-height: 80px;
        // display: flex;
        // justify-content: space-around;
    }

    .left {
        height: 100%;
        width: 260px;
        margin: 0;
        padding: 0;
        // position: relative;

        .selectBox {
            padding: 5px;
            box-sizing: border-box;
            width: 100%;
        }

        .treeBox {
            box-sizing: border-box;
            padding: 5px 5px 0px 30px;
            height: calc(100vh - 110px - 80px - 50px - 50px);
            overflow-y: scroll;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        .consistency {
            width: 260px;
            box-sizing: border-box;
            padding: 5px;
            position: absolute;
            bottom: 0px;

            .content {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;

                .radio {
                    padding-top: 10px;
                    box-sizing: border-box;
                    margin: 0 auto;
                }

                img {
                    width: 110px;
                    height: 110px;
                    box-sizing: border-box;
                    padding: 10px;
                }
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

        #videoBox {
            box-sizing: border-box;
            float: left;
            width: 60vw;
            height: calc(100vh - 110px);
            padding: 0;
            overflow: hidden;
            margin: 0;
        }

        #map {
            box-sizing: border-box;
            // max-width: calc(100vw - 54px);
            // min-width: calc(100vw - 210px);
            width: auto;
            height: 100%;
            background-color: green;
            overflow: hidden;
        }
    }
}
</style>

<script>
import myTree from '../../components/myTree/tree'
import monitor from '~static/images/monitor.png'
import talkback from '~static/images/talkback.png'
import {
    clearTimeout
} from 'timers';
import '~static/flash/jquery.query-2.1.7.js';
import swfobject from '~static/flash/swfobject.js'
import path from '~static/flash/player.swf' // 获取引入的swf地址
import protobuf from 'protobufjs'
import locationFile from '~static/location.proto'
import carImg from '~static/images/car/3.png'
export default {
    data() {
        return {
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
                                        index: 0,
                                        isHiddenSelect: true,
                                        parentId: 'car-1-1'
                                    },
                                    {
                                        id: 2,
                                        name: '摄像头2',
                                        type: 'camera',
                                        index: 1,
                                        isHiddenSelect: true,
                                        parentId: 'car-1-1'
                                    },
                                    {
                                        id: 3,
                                        name: '摄像头3',
                                        type: 'camera',
                                        index: 2,
                                        isHiddenSelect: true,
                                        parentId: 'car-1-1'
                                    },
                                    {
                                        id: 4,
                                        name: '摄像头4',
                                        type: 'camera',
                                        index: 3,
                                        isHiddenSelect: true,
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
                                            index: 0,
                                            isHiddenSelect: true,
                                            parentId: 'car-2-1'
                                        },
                                        {
                                            id: 2,
                                            name: '摄像头2',
                                            type: 'camera',
                                            index: 1,
                                            isHiddenSelect: true,
                                            parentId: 'car-2-1'
                                        },
                                        {
                                            id: 3,
                                            name: '摄像头3',
                                            type: 'camera',
                                            index: 2,
                                            isHiddenSelect: true,
                                            parentId: 'car-2-1'
                                        },
                                        {
                                            id: 4,
                                            name: '摄像头4',
                                            type: 'camera',
                                            index: 3,
                                            isHiddenSelect: true,
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
                                            index: 0,
                                            isHiddenSelect: true,
                                            parentId: 'car-2-2'
                                        },
                                        {
                                            id: 2,
                                            name: '摄像头2',
                                            type: 'camera',
                                            index: 1,
                                            isHiddenSelect: true,
                                            parentId: 'car-2-2'
                                        },
                                        {
                                            id: 3,
                                            name: '摄像头3',
                                            type: 'camera',
                                            index: 2,
                                            isHiddenSelect: true,
                                            parentId: 'car-2-2'
                                        },
                                        {
                                            id: 4,
                                            name: '摄像头4',
                                            type: 'camera',
                                            index: 3,
                                            isHiddenSelect: true,
                                            parentId: 'car-2-2'
                                        }
                                    ],
                                }
                            ]
                        }
                    ]
                },

            ],
            defaultSelect: [],
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

            timeout: '', //  保存定时器
            isVideo: true, // 是否是视频模式
            map: undefined,
            selectCarArray: [], // 选中的车数组
            //  视频插件相关参数开始
            // serverIp: '112.74.87.74', // 视频播放的ip
            // serverPort: '6605', // 视频播放的端口
            serverIp: 'www.beidoulab.club', // 视频播放的ip
            serverPort: '6605', // 视频播放的端口
            playingStatusArray: [],
            selectIndex: 0,
            isInitFinished: false, // 视频插件是否价加载完成
            divId: '', // 用于保存flash所需要的div id
            initFlashNumber: 0, // 初始化flash的次数记录器
            //  视频插件相关参数结束
            activeNames: ['1'], // 折叠面板默认打开
            radio: '1', // radio 默认选中
            openState: false, // 当前是在监听/对讲 的状态  false 没有在监听 true 正在监听
            cameraIndex: 0, // 
            monitorCamera: { // 监听的摄像头信息
                name: '摄像头1',
                index: 0
            },
            onSelectCamera: '', // 选中监听的摄像头
            onSelectCar: '',
            websocket: null,
            carMarkerArray: [],
            latText:22,
        }
    },
    components: {
        myTree
    },
    mounted() {
        let _this = this
        this.initMap()
        // websocket  begin
        this.websocket = new WebSocket("ws://192.168.1.126:12345");

        this.websocket.onmessage = this.wstOnMessage

        // websocket end
        this.divId = this.$refs.video.id
        this.showVideo()
        // 监听点击是那个视频窗口事件
        window.onTtxVideoMsg = function onTtxVideoMsg(index, type) {
            if (index != null && index != "") {
                index = parseInt(index, 10);
            }
            //窗口事件
            //window message
            if (type == "select") {
                //选中窗口     		select window
                let title = ''
                switch (index) { // 摄像头编号
                    case 0:
                        title = '摄像头1'
                        break;
                    case 1:
                        title = '摄像头2'
                        break;
                    case 2:
                        title = '摄像头3'
                        break;
                    case 3:
                        title = '摄像头4'
                        break;
                    default:
                        break;
                }

                _this.monitorCamera.name = title
                _this.monitorCamera.index = index
            } else if (type == "full") {
                //全屏		Full screen
            } else if (type == "norm") {
                //退出全屏		Exit full screen
            }
            //视频播放事件
            //video play messsage
            else if (type == "stop") {
                //停止播放		stop playing
                // playingStatusArray[index] = false;
            } else if (type == "start") {
                //开始播放		Start play
                // playingStatusArray[index] = true;
            } else if (type == "sound") {
                //开启声音		Turn on the sound
            } else if (type == "silent") {
                //静音		Mute
            } else if (type == "play") {
                //暂停或停止后重新播放		Play again after pause or stop
            } else if (type == "PicSave") {
                //截图		screenshot
            }
            //对讲事件
            //Intercom messsage
            else if (type == "startRecive" || type == "uploadRecive" || type == "loadRecive") {
                //开启对讲		Open intercom
            } else if (type == "stopTalk") {
                //关闭对讲		Turn off intercom
            } else if (type == "playRecive") {
                //对讲中		Talkback
            } else if (type == "reciveStreamStop" || type == "reciveNetError" || type == "reciveStreamNotFound") {
                //对讲异常(网络异常等)		Talkback anomalies (network exceptions, etc.)

            } else if (type == "uploadNetClosed" || type == "uploadNetError") {
                //连接异常 		Connection exception 
            } else if (type == "upload") {
                //对讲讲话		Talkback speech
            } else if (type == "uploadfull") {
                //对讲讲话结束		Talkback speech ends
            }
            //监听事件
            //Listen messsage
            else if (type == "startListen") {
                //开始监听      		Start listening		    } else if (type == "stopListen") {
                //主动停止监听 		Active stop monitoring

            } else if (type == "listenNetError") {
                //网络异常  		Network anomaly

            } else if (type == "playListen") {
                //监听中		In listening
            } else if (type == "loadListen" || type == "listenStreamNotFound" || type == "listenStreamStop") {
                //等待请求监听	   	Waiting request monitoring 
            }
        }
    },
    computed: {
        changeImageUrl() {
            let path = '';
            switch (this.radio) {
                case '1':
                    path = talkback
                    break;
                case '2':
                    path = monitor
                    break;
                default:
                    break;
            }
            return path
        },
        selectCarNumber() {
            if (this.selectCarArray.length == 0) {
                return ''
            } else {
                return this.selectCarArray[0]
            }
        }
    },
    methods: {
        initMap() {
            this.map = new BMap.Map("map");
            this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 5); // 初始化地图,设置中心点坐标和地图级别  11
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
            let width = $('#videoBox').width()
            let height = $('#videoBox').height()
            //初始化flash
            swfobject.embedSWF(path, this.divId, width, height, "11.0.0", null, null, params, null);
            this.initFlash();
        },
        initFlash() {
            let _this = this

            if (swfobject.getObjectById(this.divId) == null ||
                typeof swfobject.getObjectById(this.divId).setWindowNum == "undefined") {
                // setTimeout(_this.initFlash(), 50000);
                setTimeout(() => {
                    if (this.initFlashNumber > 200) {
                        this.$message.error('初始化flash失败,请检查浏览器是否禁用flash!');
                        return
                    }
                    this.initFlash()
                    this.initFlashNumber++
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
                swfobject.getObjectById(this.divId).setServerInfo(this.serverIp, this.serverPort);
                this.isInitFinished = true;
            }
        },
        showVideo() {
            this.isVideo = true;
            this.initPlayer()
        },
        getCheckedNodes() { // 获取被选中的车
            let array = this.$refs.tree.getCheckedNodes(false, false)
            let filterArray = array.filter(item => {
                return item.type == 'car'
            })
            this.selectCarArray = filterArray
            console.log(filterArray)
        },
        selectVideoCar(e) { // 鼠标单击选择节点的时候,获取点击的节点,判断是不是摄像头,获取车的id
            if (e.type == 'camera') {
                if (!this.isVideo) {
                    if (!this.isInitFinished) {
                        this.showVideo()
                    }
                }
                this.playLiveVideo(e.index, e.parentId)
            }
        },
        doubleClickTreeNode(e) { // 双击节点
            if (!this.isVideo) {
                return 
            }
            console.log(e)
            setTimeout(() => {
                if (e.type == 'car') {
                    console.log(e.id)
                    for (let index = 0; index <= 4; index++) {
                        this.playLiveVideo(index, e.id)
                    }
                    // 在地图上显示车的操作
                } else if (e.type == 'camera') {
                    this.carNumber = e.parentId + `(${e.name})`
                    // 视频播放的操作
                    this.playLiveVideo(e.index, e.parentId)
                } else {
                    return
                }
                this.dialogSelectCar = false
            }, 100);
        },
        playLiveVideo(index, parentId) { // 播放实时视频
            let title = ''
            switch (index) { // 摄像头编号
                case 0:
                    title = '摄像头1'
                    break;
                case 1:
                    title = '摄像头2'
                    break;
                case 2:
                    title = '摄像头3'
                    break;
                case 3:
                    title = '摄像头4'
                    break;
                default:
                    break;
            }

            let videoIndex = index // index  窗口下标
            let channel = index // 通道 车上的摄像头的编号
            let stream = 1 // 码流
            let jsession = '504a8fde-1174-4051-8733-26d9bdca8bd6' // 会话号
            let devIdno = '5010439' // 设备号   根据parentId获取设备号或者是车牌号
            let carNumber = '' // 车牌号   与设备号2选1
            // let minBufferTime = 2   // 最小缓冲时长
            // let maxBufferTime = 6   // 最大缓冲时长  主要用于调整视频延时，当缓存的数据达到了最小缓冲时长时（默认为2秒），则会进行播放，当到了最大缓冲时长（默认为6秒），则进行快放。
            swfobject.getObjectById(this.divId).setVideoInfo(index, title); // 设置标题
            swfobject.getObjectById(this.divId).stopVideo(videoIndex); // 先将当前窗口下标的视频停止播放
            //播放视频
            swfobject.getObjectById(this.divId).startVideo(videoIndex, jsession, devIdno, channel, stream, true);
        },
        startMonitor(devIdno) { // 开始监听
            let jsession = '504a8fde-1174-4051-8733-26d9bdca8bd6' // 会话号
            // let devIdno = '5010439' // 设备号   根据parentId获取设备号或者是车牌号
            //通道号
            let channel = this.monitorCamera.index // 通道 车上的摄像头的编号
            let ip = this.serverIp // 视频播放的ip 服务器ip
            let port = this.serverPort //服务器端口

            swfobject.getObjectById(this.divId).setListenParam(1);
            swfobject.getObjectById(this.divId).startListen(jsession, devIdno, channel, ip, port);
        },
        startTalkback(devIdno) { // 开始对讲
            let jsession = '504a8fde-1174-4051-8733-26d9bdca8bd6' // 会话号
            let ip = this.serverIp // 视频播放的ip 服务器ip
            let port = this.serverPort //服务器端口
            let ret = swfobject.getObjectById(this.divId).startTalkback(jsession, devIdno, 0, ip, port);
            console.log(ret);

            //返回 0成功，1表示正在对讲，2表示没有mic，3表示禁用了mic
            if (ret == 0) {
                console.log('成功');
            } else if (ret == 1) {
                console.log('正在对讲');
            } else if (ret == 2) {
                console.log('没有mic');
            } else if (ret == 3) {
                console.log('禁用了mic');
            } else {
                console.log('母鸡');
            }
        },
        fileBlur() { // 下拉搜索框选中时改变触发 通过下拉选择的车添加树状控件的选中
            window.clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.$refs.tree.setCheckedKeys(this.value)
                this.defaultSelect = this.value
            }, 500);
        },
        open() { // 开启对讲还是监听
            if (this.selectCarNumber == '') {
                this.$message.error('请在车辆列表选中车辆后进行操作');
                return
            }
            this.openState = true;
            if (this.radio == '1') {
                this.startTalkback('5010439')
                // this.startMonitor(this.selectCarNumber.id)
            } else if (this.radio == '2') {
                this.startMonitor('5010439')
                // this.startMonitor(this.selectCarNumber.id)
            }
            this.onSelectCamera = this.monitorCamera.name
            this.onSelectCar = this.selectCarNumber.id
        },
        stop() { // 停止对讲还是监听

            // 对讲
            swfobject.getObjectById(this.divId).stopTalkback();
            // 监听
            swfobject.getObjectById(this.divId).stopListen(); // 停止监听
            // 请空数据
            this.onSelectCamera = ''
            this.onSelectCar = ''
            this.openState = false;
        },
        wstOnMessage(msg) { // 接收到信息的回调
            if (Object.prototype.toString.call(msg.data) === '[object Blob]') {
                    this.changeMessage(msg.data,(message)=>{
                        let imei = message.imei
                        let type = message.type
                        let lng = message.lng   // 经度
                        let lat = message.lat   // 纬度
                        let array = [{lng,lat},{lng,lat:this.latText++}]
                        this.gpsChangeBaidu(array,(data)=>{
                            for (let index = 0; index < this.carMarkerArray.length; index++) {
                                let marker = this.carMarkerArray[index]
                                this.map.removeOverlay(marker); // 移除标注
                            }
                            let markerArray = []
                            let points = data.points
                            for (let index = 0; index < points.length; index++) {
                                let {lng,lat} = points[index]
                                markerArray.push(this.addCarInMap(lng,lat))
                            }
                            this.carMarkerArray = markerArray
                        })
                    })

            } else {
                this.$message.error('数据格式异常,请联系开发人员');
            }

        },
        changeMessage(blod,callback){ // blod转换为对象
            let  reader = new FileReader();
            reader.readAsArrayBuffer(blod);
            reader.onload = () => {
                let arraybuffer = reader.result
                let dataView = new DataView(arraybuffer.slice(0, 8));
                let int32_length = dataView.getInt32(0);
                let int32_cmd = dataView.getInt32(4);
                protobuf.load(locationFile, (err, root) => {
                    if (err) {
                        console.log(err);
                    }
                    let locationInfo = root.lookupType("com.beidou.proto.share.LocationInfoResponse");
                    let source = new Uint8Array(arraybuffer.slice(8, int32_length + 4));
                    let message = locationInfo.decode(source);
                    callback(message)
                });
            }
        },
        gpsChangeBaidu(array,callback){   // gps坐标转换为百度坐标
            let pointArr = []
            for (let index = 0; index < array.length; index++) {
                let {lng,lat} = array[index]
                let ggPoint = new BMap.Point(lng,lat)
                pointArr.push(ggPoint)
            }
            let convertor = new BMap.Convertor()
            convertor.translate(pointArr, 1, 5, callback)
        },
        addCarInMap(blng,blat){ // 在地图上渲染车
            let point = new BMap.Point(blng, blat);
            let myIcon = new BMap.Icon(carImg, new BMap.Size(100, 100));
            myIcon.imageSize = new BMap.Size(30, 30)  // 图片大小
            // myIcon.size = new BMap.Size(600, 600)   // 可视区域
            let marker = new BMap.Marker(point, {
                icon: myIcon,
            }); // 创建标注
            this.map.addOverlay(marker); // 将标注添加到地图中
            return marker
        }
    },
    beforeDestroy() {
        this.websocket.close()  // 关闭websocket
    }
}
</script>
