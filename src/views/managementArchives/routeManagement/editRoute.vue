<template>
  <div id="historyBox">
    <div class="left">
      <el-form
        class="routeForm"
        ref="temp"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:0;"
      >
        <el-form-item prop="roadName">
          <el-input placeholder="请输入路线名称" v-model="temp.roadName "/>
        </el-form-item>
        <el-form-item prop="networkOptionsVal">
          <el-select
            class="multipleSelect"
            v-model="temp.networkOptionsVal"
            multiple
            placeholder="请选择网点"
          >
            <el-option
              v-for="item in networkOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="roadStatus">
          <el-select v-model="temp.roadStatus" class="filter-item" placeholder="请选择路线状态">
            <el-option
              v-for="item in roadStatusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="roadDiscribe">
          <el-input type="textarea" placeholder="请输入路线描述" v-model="temp.roadDiscribe "/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmEditRoute('temp')">确认编辑</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <div id="historyRouteMap" ref="historyRouteMap"></div>
      <div class="editRoute">
         <el-button type="primary" v-if="finalLinePoints.length>0" @click="editRoute">编辑路线</el-button>
        <el-button type="success" v-if="finalLinePoints.length>0" @click="saveRoute">保存路线</el-button>
      </div>
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
      plPoints: [],
      pointsAll: [
        [
          "113.972166|22.588416",
          "113.949847|22.544037",
          "113.932384|22.554785",
          "113.981252|22.566867",
          "113.978736|22.557522",
          "113.97349|22.545907",
          "113.980605|22.543303"
        ],
        [
          "113.932166|22.588416",
          "113.949847|22.544037",
          "113.942384|22.554785",
          "113.951252|22.566867",
          "113.928736|22.557522",
          "113.96349|22.545907",
          "113.910605|22.543303"
        ],
        [
          "113.972166|22.568416",
          "113.949847|22.544037",
          "113.932384|22.564785",
          "113.981252|22.536867",
          "113.968736|22.577522",
          "113.97349|22.575907",
          "113.950605|22.583303"
        ]
      ],
      point: [
        "113.972166|22.588416",
        "113.949847|22.544037",
        "113.932384|22.554785",
        "113.981252|22.566867",
        "113.978736|22.557522",
        "113.97349|22.545907",
        "113.980605|22.543303"
      ],
      options: [
        {
          value: "1",
          label: "路线一"
        },
        {
          value: "2",
          label: "路线二"
        },
        {
          value: "3",
          label: "路线三"
        }
      ],
      networkOptions: [
        {
          value: "选项1",
          label: "网点1"
        },
        {
          value: "选项2",
          label: "网点2"
        },
        {
          value: "选项3",
          label: "网点3"
        }
      ],
      selectedContent: {},
      finalLinePoints: [],
      finalLine:{},
      isEdit: false,
      temp: {
        largeTeam: "A大队",
        roadName: "广深线",
        roadDiscribe: "备注1",
        roadStatus: "使用中",
        networkOptionsVal: ["选项1", "选项2"]
      },
      rules: {
        roadName: [
          { required: true, message: "请输入路线名称", trigger: "blur" }
        ],
        networkOptionsVal: [
          { required: true, message: "请选择网点", trigger: "blur" }
        ],
        roadStatus: [
          { required: true, message: "请选择路线状态", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.selectedContent = this.options[0];
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
      // this.addFreehandRouteTool();
      this.addPolyline(); //向地图中添加线
    },

    // 创建地图函数：
    createMap() {
      this.map = new BMap.Map("historyRouteMap"); //在百度地图容器中创建一个地图
      var point = new BMap.Point(113.925973657, 22.5760535462); //定义一个中心点坐标
      //    var point = new BMap.Point(122.263053,29.726606); //定义一个中心点坐标

      this.map.centerAndZoom(point, 13); //设定地图的中心点和坐标并将地图显示在地图容器中
      this.map.enableScrollWheelZoom();
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

    //向地图中添加线函数
    addPolyline() {
      //标注线数组
      var that = this;
      this.plPoints = [
        {
          weight: 4,
          color: "red",
          opacity: 0.6,
          points: this.point
        }
      ];
      for (var i = 0; i < this.plPoints.length; i++) {
        var json = this.plPoints[i];
        var points = [];
        for (var j = 0; j < json.points.length; j++) {
          var p1 = json.points[j].split("|")[0];
          var p2 = json.points[j].split("|")[1];
          points.push(new BMap.Point(p1, p2));
        }
        var line = new BMap.Polyline(points, {
          strokeWeight: json.weight,
          strokeColor: json.color,
          strokeOpacity: json.opacity
        });
        console.log(line);
        this.map.addOverlay(line);
        var polylineMenu = new BMap.ContextMenu();
        that.finalLinePoints = line.getPath();
         that.finalLine = line;
        // polylineMenu.addItem(
        //   new BMap.MenuItem("编辑路线", function() {
        //     line.enableEditing();
        //     console.log("编辑前路线", line.getPath());
        //     that.finalLinePoints = line.getPath();
        //     that.isEdit = true;
        //   })
        // );
        // polylineMenu.addItem(
        //   new BMap.MenuItem("保存路线", function() {
        //     line.disableEditing();
        //     console.log("编辑后路线", line.getPath());
        //     that.finalLinePoints = line.getPath();
        //     that.isEdit = false;
        //   })
        // );
        // line.addContextMenu(polylineMenu);
        // this.addArrow(line);
      }
    },
    addArrow(line) {
      //绘制标注的函数
      var linePoint = line.getPath(); //线的坐标串
      var arrowCount = linePoint.length;
      // var end = new BMap.Marker(linePoint[linePoint.length - 1]); // 创建标注
      // this.map.addOverlay(end); // 将标注添加到地图中
      // end.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      var myIcon = new BMap.Icon(
        "http://api0.map.bdimg.com/images/stop_icon.png",
        new BMap.Size(11, 11)
      );
      for (var i = 0; i < arrowCount; i++) {
        //在拐点处添加标注
        var marker = new BMap.Marker(linePoint[i], { icon: myIcon }); // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
        var label = new BMap.Label("折点" + (i + 1), {
          offset: new BMap.Size(20, -10)
        });
        label.setStyle({
          color: "blue",
          fontSize: "10px",
          height: "15px",
          lineHeight: "15px",
          backgroundColor:
            "rgba(255, 255, 255, 0.8) none repeat scroll 0 0 !important", //设置背景色透明
          border: "0px solid red"
        });
        marker.setLabel(label);
      }
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
    addFreehandRouteTool() {
      var overlays = [];
      var that = this;
      var overlaycomplete = function(e) {
        overlays.push(e.overlay);
        var path = e.overlay.getPath(); //Array<Point> 返回多边型的点数组

        var polyline = new BMap.Polyline(path);
        // 双击画好折线以后开启线面可编辑功能
        e.overlay.enableEditing();
        //  that.testPath=(e.overlay.getPath());
      };
      var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
      };
      //实例化鼠标绘制工具

      var drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(5, 5), //偏离值
          drawingModes: [BMAP_DRAWING_POLYLINE], //设置只显示画矩形、圆的模式
          drawingTypes: [
            BMAP_DRAWING_MARKER,
            BMAP_DRAWING_CIRCLE,
            BMAP_DRAWING_POLYLINE,
            BMAP_DRAWING_POLYGON,
            BMAP_DRAWING_RECTANGLE
          ]
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
      });
      //添加鼠标绘制工具监听事件，用于获取绘制结果
      drawingManager.addEventListener("overlaycomplete", overlaycomplete);
    },
    // 编辑路线
    confirmEditRoute(temp) {
      this.$refs[temp].validate(valid => {
        if (valid && this.finalLinePoints.length > 0 && this.isEdit == false) {
          console.log(this.temp);
          this.$router.push("/routeManagement");
        } else {
          if (this.isEdit == true) {
            this.$message({
              message: "请先保存路线",
              type: "error"
            });
          }
          return false;
        }
      });
    },
    editRoute() {
      if (this.finalLinePoints.length > 0) {
        this.finalLine.enableEditing();
        this.finalLinePoints = this.finalLine.getPath();
        this.isEdit = true;
        console.log("编辑中", this.finalLine.getPath());
      }
    },
    saveRoute() {
      if (this.finalLinePoints.length > 0) {
        this.finalLine.disableEditing();
        this.finalLinePoints = this.finalLine.getPath();
        this.isEdit = false;
        console.log("编辑后", this.finalLine.getPath());
      }
    },
  }
};
</script>
<style lang="scss" scoped>
#historyBox {
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  .left {
    height: 100%;
    width: 260px;
    margin: 0;
    padding: 15px;
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
#historyBox {
  .left {
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

