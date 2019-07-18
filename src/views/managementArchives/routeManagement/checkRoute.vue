<template>
  <div id="checkRoute">
    <div class="content">
      <div id="historyRouteMap" ref="historyRouteMap"></div>
     
     
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
      searchMarke: [],
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
      isHistoryRoute: false,
      networkOptionsVal: ["选项1", "选项2"],
      selectedContent: {},
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
      this.showNetwork();
      this.addPolyline(); //向地图中添加线

      // var menu = new BMap.ContextMenu();
      // var txtMenuItem = [
      //   {
      //     text: "放大",
      //     callback: function() {
      //       map.zoomIn();
      //     }
      //   },
      //   {
      //     text: "缩小",
      //     callback: function() {
      //       map.zoomOut();
      //     }
      //   }
      // ];
      // for (var i = 0; i < txtMenuItem.length; i++) {
      //   menu.addItem(
      //     new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100)
      //   );
      // }
      // this.map.addContextMenu(menu);
    },

    // 创建地图函数：
    createMap() {
      this.map = new BMap.Map("historyRouteMap"); //在百度地图容器中创建一个地图
      var point = new BMap.Point(113.925973657, 22.5760535462); //定义一个中心点坐标
      //    var point = new BMap.Point(122.263053,29.726606); //定义一个中心点坐标

      this.map.centerAndZoom(point, 13); //设定地图的中心点和坐标并将地图显示在地图容器中
      this.map.enableScrollWheelZoom();
    },
    // 显示网点及信息窗口
    showNetwork() {
      var data_info = [
        [113.972278, 22.596245, "地址：深圳野生动物园","网点类型：ATM"],
        [113.949569, 22.547655, "地址：北京市东城区东华门大街","网点类型：ATM"],
        [113.933184, 22.559404, "地址：深圳南头直升机场","网点类型：加油站"],
        [113.990963, 22.562608, "北环龙珠立交","网点类型：银行网点"],
        [113.97774, 22.559137, "地址：地址一","网点类型：路口"],
        [113.969403, 22.547121, "地址：地址二","网点类型：加油站"],
        [113.977165, 22.542581, "地址：世界之窗","网点类型：路口"]
      ];
      var opts = {
        width: 250, // 信息窗口宽度
        height: 80, // 信息窗口高度
        title: "信息窗口", // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      };
      for (var i = 0; i < data_info.length; i++) {
        var marker = new BMap.Marker(
          new BMap.Point(data_info[i][0], data_info[i][1])
        ); // 创建标注
        var content = `<div >
        <div>${data_info[i][2]}</div>
        <div>${data_info[i][3]}</div> 
      </div>`
        this.map.addOverlay(marker); // 将标注添加到地图中
      //   var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
      //                   // offset: new BMap.Size(10, 25), // 指定定位位置
      //                   // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
      //               });
      //  marker.setIcon(myIcon);

        this.addClickHandler(content, marker, opts);
      }
    },
    addClickHandler(content, marker, opts) {
      var that = this;
      marker.addEventListener("click", function(e) {
        that.openInfo(content, e, opts);
      });
    },
    openInfo(content, e, opts) {
      var p = e.target;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); //开启信息窗口
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
        this.editLine = line;
        this.map.addOverlay(line);
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

   
   

 
  

  
   
  }
};
</script>
<style lang="scss" scoped>
#checkRoute {
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  .content {
    flex: 1;
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
#checkRoute {
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

