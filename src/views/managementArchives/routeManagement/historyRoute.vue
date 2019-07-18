<template>
  <div id="historyBox">
    <div class="left">
      <el-form
        :rules="rules"
        class="routeForm"
        :ref="temp"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:0;"
      >
        <el-button type="primary" @click="selectRoute">选取线路</el-button>
        <el-button type="primary" @click="freehandRoute">手绘线路</el-button>
        <el-select
          v-model="historyRouteVlaue
          "
          placeholder="请选择历史路线"
          v-if="isHistoryRoute"
          @change="selectHistoryRoute(historyRouteVlaue)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item prop="roadName">
          <el-input placeholder="请输入路线名称" v-model="temp.roadName "/>
        </el-form-item>
        <el-form-item prop="networkOptionsVal">
          <el-select
            class="multipleSelect"
            v-model="temp.networkOptionsVal"
            multiple
            filterable
            placeholder="请选择网点"
          >
            <el-option
              class="multipleSelectOption"
              v-for="item in networkOptions"
              :key="item.value"
              :label="item.label+'('+item.type+')'"
              :value="item.value"
              :class="{ 'red': item.type=='银行网点','green':item.type=='ATM',
          'lightgray':item.type=='收款网点','blue':item.type=='路口','burlywood':item.type=='加油站'}"
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
          <el-button type="primary" @click="addRoute(temp)">确认添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <div id="historyRouteMap" ref="historyRouteMap"></div>
      <div class="editRoute">
        <el-button type="primary" v-if="temp.finalLinePoints.length>0" @click="editRoute">编辑路线</el-button>
        <el-button type="success" v-if="temp.finalLinePoints.length>0" @click="saveRoute">保存路线</el-button>
        <el-button
          v-if="!isHistoryRoute&&temp.finalLinePoints.length>0"
          type="danger"
          @click="deleteRoute"
        >删除路线</el-button>
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
      //最终获取的折线经纬度数组

      //判断是否正在编辑状态
      isEdit: false,
      //判断目前画了几条线
      polylineNum: 0,
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
          label: "网点1",
          type: "ATM"
        },
        {
          value: "选项2",
          label: "网点2",
          type: "银行网点"
        },
        {
          value: "选项3",
          label: "网点3",
          type: "加油站"
        }
      ],
      //判断是历史路线还是手绘路线
      isHistoryRoute: false,
      networkOptionsVal: [],
      //历史路线选取的默认值
      historyRouteVlaue: "1",
      selectedContent: {},
      hasPolyline: false,
      finalLine: {},
      temp: {
        largeTeam: undefined,
        roadName: undefined,
        roadDiscribe: undefined,
        roadStatus: undefined,
        finalLinePoints: []
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
      if (this.isHistoryRoute) {
        this.addPolyline(); //向地图中添加线
      }
    },

    // 创建地图函数：
    createMap() {
      this.map = new BMap.Map("historyRouteMap"); //在百度地图容器中创建一个地图
      var point = new BMap.Point(113.925973657, 22.5760535462); //定义一个中心点坐标
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
          weight: 2,
          color: "red",
          opacity: 0.6,
          points: this.point
        }
      ];
      for (var i = 0; i < this.plPoints.length; i++) {
        var json = this.plPoints[i];
        // 历史路线的所有点，需要给后台的
        var points = [];
        for (var j = 0; j < json.points.length; j++) {
          var p1 = json.points[j].split("|")[0];
          var p2 = json.points[j].split("|")[1];
          points.push(new BMap.Point(p1, p2));
        }
        console.log("所选历史路线", points);
        var line = new BMap.Polyline(points, {
          strokeWeight: 4,
          strokeColor: json.color,
          strokeOpacity: json.opacity
        });
        this.map.addOverlay(line);
        this.temp.finalLinePoints = line.getPath();
        this.finalLine = line;
        // this.addArrow(line);
        // var polylineMenu = new BMap.ContextMenu();
        // polylineMenu.addItem(
        //   new BMap.MenuItem("编辑路线", function() {
        //     line.enableEditing();
        //     console.log("编辑前路线", line.getPath());
        //     that.isEdit = true;
        //     that.finalLine = line;
        //   })
        // );
        // polylineMenu.addItem(
        //   new BMap.MenuItem("保存路线", function() {
        //     line.disableEditing();
        //     console.log("编辑后路线", line.getPath());
        //     that.finalLinePoints = line.getPath();
        //     that.isEdit = false;
        //     that.finalLine = line;
        //   })
        // );
        // line.addContextMenu(polylineMenu);
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
          color: "red",
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

    // 点击下拉框选择路线
    selectHistoryRoute(historyRouteVlaue) {
      this.remove_overlay();
      this.isEdit = false;
      this.polylineNum = 1;
      if (this.historyRouteVlaue == "1") {
        this.point = this.pointsAll[0];
      } else if (this.historyRouteVlaue == "2") {
        this.point = this.pointsAll[1];
      } else if (this.historyRouteVlaue == "3") {
        this.point = this.pointsAll[2];
      }

      this.selectedContent = this.options.find(item => {
        //这里的chargingWorkNameList就是上面遍历的数据源
        return item.value == historyRouteVlaue;
        //筛选出匹配数据，是对应数据的整个对象
      });

      this.initMap();
    },
    // 手绘路线
    addFreehandRouteTool() {
      var that = this;
      that.isEdit = false;
      that.polylineNum = 0;
      that.temp.finalLinePoints = [];
      that.finalLine = {};
      var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 4, //边线的宽度，以像素为单位。
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
          drawingModes: [BMAP_DRAWING_POLYLINE]
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式*/
      });
      //控制只能画一条路线
      document
        .getElementsByClassName("BMapLib_last")[0]
        .addEventListener("click", function() {
          if (that.polylineNum == 1) {
            that.map.clearOverlays();
            that.temp.finalLinePoints = [];
            that.finalLine = {};
            that.isEdit = false;
            that.polylineNum = 0;
            return;
          }
        });

      // 鼠标绘制完成后，派发总事件
      drawingManager.addEventListener("overlaycomplete", function(e) {
        drawingManager.close();
        that.polylineNum++;
        switch (e.drawingMode) {
          case "polyline":
            {
              //画线
              that.hasPolyline = true;
              var polyline = e.overlay;
              that.temp.finalLinePoints = polyline.getPath();
              that.finalLine = polyline;
              // var polylineMenu = new BMap.ContextMenu();

              // polylineMenu.addItem(
              //   new BMap.MenuItem("编辑路线", function() {
              //     polyline.enableEditing();
              //     console.log("编辑前路线", polyline.getPath());
              //     that.finalLinePoints = polyline.getPath();
              //     that.finalLine = polyline;
              //     that.isEdit = true;
              //   })
              // );
              // polylineMenu.addItem(
              //   new BMap.MenuItem("保存路线", function() {
              //     polyline.disableEditing();
              //     console.log("编辑后路线", polyline.getPath());
              //     that.finalLinePoints = polyline.getPath();
              //     that.finalLine = polyline;
              //     that.isEdit = false;
              //   })
              // );
              // polylineMenu.addItem(
              //   new BMap.MenuItem("删除路线", function() {
              //     that.hasPolyline = false;
              //     that.map.removeOverlay(polyline);
              //     that.finalLinePoints = [];
              //     that.finalLine = polyline;
              //     that.isEdit = false;
              //     that.polylineNum--;
              //   })
              // );
              // polyline.addContextMenu(polylineMenu);
              // var overLays = that.map.getOverlays();
              // console.log(overLays);
            }
            break;
        }
      });
    },
    // 添加路线
    addRoute(temp) {
      this.$refs[temp].validate(valid => {
        if (valid && this.finalLinePoints.length > 0) {
          console.log(temp);
          this.$router.push("/routeManagement");
        } else {
          console.log(temp);
          console.log(this.temp.finalLinePoints.length, this.isEdit);
          if (this.temp.finalLinePoints.length == 0 && this.isEdit == false) {
            this.$message({
              message: "请先选取或手绘路线",
              type: "error"
            });
          } else if (
            this.temp.finalLinePoints.length !== 0 &&
            this.isEdit == true
          ) {
            this.$message({
              message: "请先保存路线",
              type: "error"
            });
          } else if (
            this.temp.finalLinePoints.length !== 0 &&
            this.isEdit == false &&
            this.polylineNum > 1
          ) {
            this.$message({
              message: "请先删除多余的路线（只能有一条路线）",
              type: "error"
            });
          }

          return false;
        }
      });
    },
    //选取历史线路
    selectRoute() {
      this.isHistoryRoute = true;
      this.initMap();
    },
    freehandRoute() {
      this.isHistoryRoute = false;
      this.initMap();
      this.addFreehandRouteTool();
    },
    editRoute() {
      if (this.temp.finalLinePoints.length > 0) {
        this.finalLine.enableEditing();
        this.temp.finalLinePoints = this.finalLine.getPath();
        this.isEdit = true;
        console.log("编辑中", this.finalLine.getPath());
      }
    },
    saveRoute() {
      if (this.temp.finalLinePoints.length > 0) {
        this.finalLine.disableEditing();
        this.temp.finalLinePoints = this.finalLine.getPath();
        this.isEdit = false;
        console.log("编辑后", this.finalLine.getPath());
      }
    },
    deleteRoute() {
      this.map.removeOverlay(this.finalLine);
      this.finalLine = {};
      this.temp.finalLinePoints = [];
      this.isEdit = false;
    }
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
      // width: auto;
    }
    .multipleSelect .el-input__inner {
      width: 20px;
      height: 10px;
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

    .el-input__inner,
    textarea {
      width: 217px !important;
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
  .BMapLib_Drawing {
    z-index: 0 !important;
  }
  .BMapLib_Drawing_panel {
    margin-right: 90px;
  }
}

//   .red{
// color:red!important;
// }
// .green{
//   color:forestgreen!important;
// }
// .lightgray{
//   color:mediumvioletred!important;
// }
// .blue{
//   color:blue!important;
// }
// .burlywood{
//   color:burlywood!important;
// }
</style>

