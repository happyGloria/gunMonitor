<template>
  <div>
    <div id="allmap" style="overflow:hidden;zoom:1;position:relative;">
      <div
        id="map"
        style="height:100%;-webkit-transition: all 0.5s ease-in-out;transition: all 0.5s ease-in-out;"
      ></div>
    </div>
    <div id="result">
      <input type="button" value="获取绘制的覆盖物个数" @click="a">
      <input type="button" value="清除所有覆盖物" @click="clearAll()">
    </div>
    <div @click="test()">测试</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: undefined,
      overlays: [],
      aaaa:undefined
    };
  },
  created() {
   
  },
  mounted() {
    this.initMap();
    // this.addFreehandRouteTool();
  },
  methods: {
    initMap() {
      // 初始化地图
      // 百度地图API功能
      this.map = new BMap.Map("map");
      var poi = new BMap.Point(116.307852, 40.057031);
      this.map.centerAndZoom(poi, 16);
      this.map.enableScrollWheelZoom();

      var that = this;
      var overlays = [];
      var overlaycomplete = function(e) {
        overlays.push(e.overlay);
       that.aaaa=e.overlay;
       console.log(that.aaaa)
      };
      that.overlays = overlays;
      var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
      };
      // //实例化鼠标绘制工具
      // var drawingManager = new BMapLib.DrawingManager(this.map, {
      //   isOpen: false, //是否开启绘制模式
      //   enableDrawingTool: true, //是否显示工具栏
      //   drawingToolOptions: {
      //     anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
      //     offset: new BMap.Size(5, 5) //偏离值
      //   },
      //   circleOptions: styleOptions, //圆的样式
      //   polylineOptions: styleOptions, //线的样式
      //   polygonOptions: styleOptions, //多边形的样式
      //   rectangleOptions: styleOptions //矩形的样式
      // });
      // //添加鼠标绘制工具监听事件，用于获取绘制结果
      // drawingManager.addEventListener("overlaycomplete", overlaycomplete);
       //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(this.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(25, 54), //偏离值
                scale: 0.8,
                drawingModes: [BMAP_DRAWING_CIRCLE, BMAP_DRAWING_RECTANGLE, BMAP_DRAWING_POLYGON]
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式*/
        });

        // 鼠标绘制完成后，派发总事件
        drawingManager.addEventListener("overlaycomplete", function (e) {
            switch (e.drawingMode) {
                case "circle": { //画圆
                    var circle = e.overlay;
                    var circleMenu = new BMap.ContextMenu();
                    circleMenu.addItem(new BMap.MenuItem("编辑区域", function () {
                        circle.enableEditing();
                    }));
                    circleMenu.addItem(new BMap.MenuItem("保存编辑", function () {
                        circle.disableEditing();
                    }));
                    circleMenu.addItem(new BMap.MenuItem("删除区域", function () {
                      console.log(that.map)
                        that.map.removeOverlay(circle);
                        // generateGeoDesc();
                    }));
                    circle.addContextMenu(circleMenu);
                      // var overLays = that.map.getOverlays();

                    // generateGeoDesc();
                }
                break;
            case "polygon": { //画多边形
                var polygon = e.overlay;
                var polygonMenu = new BMap.ContextMenu();
                polygonMenu.addItem(new BMap.MenuItem("编辑区域", function () {
                    polygon.enableEditing();
                }));
                polygonMenu.addItem(new BMap.MenuItem("保存编辑", function () {
                    polygon.disableEditing();
                }));
                polygonMenu.addItem(new BMap.MenuItem("删除区域", function () {
                    that.map.removeOverlay(polygon);
                    // generateGeoDesc();
                }));
                polygon.addContextMenu(polygonMenu);
                // generateGeoDesc();
            }
            break;
            case "rectangle": { //画矩形
                var rectangle = e.overlay;
                var rectangleMenu = new BMap.ContextMenu();
                rectangleMenu.addItem(new BMap.MenuItem("编辑区域", function () {
                    rectangle.enableEditing();
                }));
                rectangleMenu.addItem(new BMap.MenuItem("保存编辑", function () {
                    rectangle.disableEditing();
                }));
                rectangleMenu.addItem(new BMap.MenuItem("删除区域", function () {
                    that.map.removeOverlay(rectangle);
                    // generateGeoDesc();
                }));
                rectangle.addContextMenu(rectangleMenu);

                // generateGeoDesc();
            }
            break;
            }
        });
    },
    clearAll() {
      for (var i = 0; i < this.overlays.length; i++) {
        this.map.removeOverlay(this.overlays[i]);
      }
      overlays.length = 0;
    },
    a(){
      alert(this.overlays.length)
    }
    ,test(){
      console.log(this.aaaa)
         this.aaaa.enableEditing();

    }
  }
};
</script>
<style>
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: "微软雅黑";
}
#allmap {
  width: 100%;
  height: 500px;
  overflow: hidden;
}
#result {
  width: 100%;
  font-size: 12px;
}
dl,
dt,
dd,
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
p {
  font-size: 12px;
}
dt {
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bold;
  border-bottom: 1px dotted #000;
  padding: 5px 0 5px 5px;
  margin: 5px 0;
}
dd {
  padding: 5px 0 0 5px;
}
li {
  line-height: 28px;
}
</style>

