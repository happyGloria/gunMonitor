<template>
  <div id="networkAdd">
    <div class="left">
      <el-form
        class="routeForm"
        ref="temp"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:0;"
      >
        <div class="network">
          <el-input
            id="suggestId"
            prefix-icon="el-icon-search"
            v-model="networkSearchVal"
            placeholder="请输入网点名称或地址"
          ></el-input>
          <div id="r-result"></div>
        </div>
        <el-form-item prop="roadName">
          <el-input placeholder="请输入网点名称" v-model="temp.roadName "/>
        </el-form-item>
        <el-form-item prop="networkType">
          <el-select v-model="temp.networkType" class="filter-item" placeholder="请选择网点类型">
            <el-option
              v-for="item in networkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="roadStatus">
          <el-select v-model="temp.roadStatus" class="filter-item" placeholder="请选择网点状态">
            <el-option
              v-for="item in roadStatusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="addNetwork" @click="confirmAddNetwork('temp')">确认添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <div id="historyRouteMap" ref="historyRouteMap"></div>
      <div class="editRoute"></div>
      <div id="routeManageRelative"></div>
    </div>
  </div>
</template>
<script>
const roadStatusOptions = [
  { key: "使用中", display_name: "使用中" },
  { key: "已废弃", display_name: "已废弃" }
];

export default {
  data() {
    return {
      map: undefined,
      roadStatusOptions,
      searchMarke: [],
      networkTypeOptions: [
        {
          value: "选项1",
          label: "路口"
        },
        {
          value: "选项2",
          label: "ATM"
        },
        {
          value: "选项3",
          label: "加油站"
        },
        {
          value: "选项4",
          label: "银行网点"
        },
        {
          value: "选项5",
          label: "收款网点"
        }
      ],
      networkSearchVal: "",
      selectedContent: {},
      finalMarke: {},
      MarkeNum: 0,
      address_detail: null, //详细地址
      networkAddLocal: {},
      userlocation: {},
      temp: {
        roadName: undefined,
        roadStatus: undefined,

        networkType: undefined,
        finalMarkePoints: []
      },
      rules: {
        roadName: [
          { required: true, message: "请输入网点名称", trigger: "blur" }
        ],
        networkType: [
          { required: true, message: "请选择网点类型", trigger: "change" }
        ],
        roadStatus: [
          { required: true, message: "请选择网点状态", trigger: "change" }
        ]
      }
    };
  },
  created() {
  },
  mounted() {
    this.initMap();
  },
  methods: {
    //创建和初始化地图函数：
    initMap() {
      this.createMap(); //创建地图
      this.setMapEvent(); //设置地图事件
      this.addMapControl(); //向地图添加控件
      this.addFreehandRouteTool();
    },

    // 创建地图函数：
    createMap() {
      this.map = new BMap.Map("historyRouteMap"); //在百度地图容器中创建一个地图
      var point = new BMap.Point(113.925973657, 22.5760535462); //定义一个中心点坐标

      this.map.centerAndZoom(point, 13); //设定地图的中心点和坐标并将地图显示在地图容器中
      this.map.enableScrollWheelZoom();
      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: this.map
      });
      var myValue;
      var that = this;
      ac.addEventListener("onconfirm", function(e) {
        console.log(e);
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        that.address_detail = myValue;
        that.setPlace();
      });
    },

    //地图事件设置函数：
    setMapEvent() {
      this.map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
      this.map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      this.map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
      this.map.enableKeyboard(); //启用键盘上下左右键移动地图
    },

    //地图控件添加函数：
    addMapControl() {
      //向地图中添加缩放控件
      var ctrl_nav = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE
      });
      this.map.addControl(ctrl_nav);
      //向地图中添加比例尺控件
      var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
      var overView = new BMap.OverviewMapControl();

      var mapType1 = new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
        anchor: BMAP_ANCHOR_TOP_LEFT
      });
      this.map.addControl(ctrl_sca);

      this.map.addControl(mapType1); //2D图，混合图
    },

    //清除覆盖物
    remove_overlay() {
      this.map.clearOverlays();
    },

    //移除地图类型和缩略图
    delete_control() {
      this.map.removeControl(mapType1); //移除2D图，混合图
      this.map.removeControl(overView);
      this.map.removeControl(overViewOpen);
    },

    searchNetwork() {
      var that = this;
      if (this.searchMarke.length) {
        this.searchMarke.forEach((item, index, arr) => {
          // 单个删除覆盖物，不能用clearOverlay();
          this.map.removeOverlay(that.searchMarke[index]);
        });
      }

      var local = new BMap.LocalSearch(this.map, {
        renderOptions: { map: this.map, panel: "r-result" }
      });

      local.search(this.networkSearchVal);
      local.setMarkersSetCallback(function(pois) {
        console.log("pois", pois);

        for (var i = 0; i < pois.length; i++) {
          that.searchMarke.push(pois[i].marker);
        }
      });
    },

    // 选取网点
    addFreehandRouteTool() {
      var that = this;
      var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
      };

      var drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(5, 5), //偏离值
          drawingModes: [BMAP_DRAWING_MARKER]
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式*/
      });
      //控制只能选择一个网点
      document
        .getElementsByClassName("BMapLib_last")[0]
        .addEventListener("click", function() {
          if (that.MarkeNum == 1) {
            that.map.clearOverlays();
            that.temp.finalMarkePoints = [];
            that.finalMarke = {};
            that.MarkeNum = 0;
            return;
          }
        });

      // 鼠标绘制完成后，派发总事件
      drawingManager.addEventListener("overlaycomplete", function(e) {
        drawingManager.close();
        console.log(e.drawingMode);
        switch (e.drawingMode) {
          case "marker":
            {
              //画点
              var circle = e.overlay;
              that.temp.finalMarkePoints = e.overlay.getPosition();
              that.finalMarke = e.overlay;
              that.MarkeNum = 1;
              var geoc = new BMap.Geocoder();
              var pt = e.overlay.getPosition();
              var opts = {
                width: 250, // 信息窗口宽度
                height: 80, // 信息窗口高度
                title: "信息窗口", // 信息窗口标题
                enableMessage: true //设置允许信息窗发送短息
              };
              e.overlay.addEventListener("click", function(e) {
                geoc.getLocation(pt, function(rs) {
                  var addComp = rs.addressComponents;
                  console.log("addComp", addComp);

                  var content =
                    addComp.province +
                    addComp.city +
                    addComp.district +
                    addComp.street +
                    addComp.streetNumber;
                  that.openInfo(content, e, opts);
                });
              });
              //  var circleMenu = new BMap.ContextMenu();
              // circleMenu.addItem(new BMap.MenuItem("删除网点", function () {
              //   console.log(that.map)
              //   that.map.removeOverlay(circle);
              // }));
              // circle.addContextMenu(circleMenu);
              // var overLays = that.map.getOverlays();
            }
            break;
        }
      });
    },
    // 打开信息窗口
    openInfo(content, e, opts) {
      var p = e.target;
      console.log("p", p);
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    // 确认添加网点
    confirmAddNetwork(temp) {
      console.log(this.temp);
      console.log(this.temp.finalMarkePoints)
      this.$refs[temp].validate(valid => {
        if (valid && this.temp.finalMarkePoints.length > 0) {
          this.$router.push("/networkManagement");
        } else {
          console.log(this.temp.finalMarkePoints.length);
          if (this.temp.finalMarkePoints.length == 0) {
            this.$message({
              message: "请先确定网点",
              type: "error"
            });
          }

          return false;
        }
      });
    },

    setPlace() {
      var that = this;
      this.map.clearOverlays(); //清除地图上所有覆盖物

      var local = new BMap.LocalSearch(this.map, {
        //智能搜索
        onSearchComplete: this.myFun
      });
      that.networkAddLocal = local;
      local.search(that.address_detail);
    },
    myFun() {
      var that = this;
      that.userlocation = that.networkAddLocal.getResults().getPoi(0).point; //获取第一个智能搜索的结果
      this.map.centerAndZoom(that.userlocation, 18);

      this.map.addOverlay(new BMap.Marker(that.userlocation)); //添加标注
      that.temp.finalMarkePoints = this.map.getOverlays()[0].point;
      that.finalMarke = that.networkAddLocal.getResults().getPoi(0);
      that.MarkeNum = 1;

      var geoc = new BMap.Geocoder();
      var pt = that.temp.finalMarkePoints;
      var opts = {
        width: 250, // 信息窗口宽度
        height: 80, // 信息窗口高度
        title: "信息窗口", // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      };
      that.map.getOverlays()[0].addEventListener("click", function(e) {
        geoc.getLocation(pt, function(rs) {
          var addComp = rs.addressComponents;
          console.log("addComp", addComp);

          var content =
            addComp.province +
            addComp.city +
            addComp.district +
            addComp.street +
            addComp.streetNumber;
          that.openInfo(content, e, opts);
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#networkAdd {
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  .left {
    height: 100%;
    width: 260px;
    margin: 0;
    padding: 15px;
    #r-result {
      position: absolute;
      z-index: 100;
    }
    .addNetwork {
      margin-top: 10px;
    }
  }
  .content {
    flex: 1;
    .editRoute {
      position: fixed;
      top: 120px;
      left: 328px;
      z-index: 100;
    }
  }
  #historyRouteMap {
    width: 100%;
    height: 100%;
  }
  #routeManageRelative {
    position: fixed;
    z-index: 1000;
    top: 116px;
    left: 108px;
    .network {
      margin-left: 30px;
      float: right;
    }
  }
}
</style>
<style lang="scss">
#networkAdd {
  .left {
    .el-input__inner,
    .el-textarea__inner {
      margin: 15px 0;
      width: auto;
    }
    .el-input__inner {
      width: 217px !important;
    }
    .el-input__inner,
    .el-textarea__inner {
      margin: 15px 0;
      width: auto;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__error {
      top: 86% !important;
    }
    #suggestId {
      background-color: floralwhite;
      // background-color: rgb(0, 113, 198);
      color: gray;
    }
  }
  .anchorTL {
    right: 10px !important;
    left: auto !important;
  }
  .BMap_stdMpType0 {
    left: 10px !important;
    right: auto !important;
  }
  .BMapLib_Drawing_panel {
    margin-right: 90px;
  }
}
</style>

