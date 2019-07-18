<template>
    <div id="videoDemo">
        <p>视频demo</p>
        <div id="cmsv6flash" ref="cmsv6flash" @click="logref"></div>
    </div>
</template>

<style lang="scss" scoped>
#cmsv6flash {
    width: 300px;
    height: 300px;
    background: red;
}
</style>


<script>
import './jquery.query-2.1.7';
import swfobject from './swfobject'
import path from './player.swf' // 获取引入的swf地址
export default {
    data() {
        return {
            playingStatusArray: [],
            selectIndex: 0,
            isInitFinished: false, // 视频插件是否价值完成
            id: ''  // 用于保存flash所需要的div id
        }
    },
    created() {
        // console.log(swfobject);
        // console.log(path.split('/')[1]);


    },
    mounted() {
      this.id = this.$refs.cmsv6flash.id
      // console.log($(this.$refs.cmsv6flash));  // jq对象

      this.initPlayerExample()
        // console.log(this.$refs.cmsv6flash);
    },
    methods: {
        logref() {
            console.log();

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
            //视频插件宽度
            // var width = $.trim($('.playerWidth').val());
            // if (width == '') {
            //   $('.playerWidth').focus();
            //   return;
            // }
            //视频插件高度
            // var hieght = $.trim($('.playerHeight').val());
            // if (hieght == '') {
            //   $('.playerHeight').focus();
            //   return;
            // }
            //初始化flash
            swfobject.embedSWF(path, this.id, 400, 400, "11.0.0", null, null, params, null);
            this.initFlash();
        },
        initFlash() {
            console.log('初始化 initFlash');
            let _this = this


            if (swfobject.getObjectById(this.id) == null ||
                typeof swfobject.getObjectById("cmsv6flash").setWindowNum == "undefined") {
                // setTimeout(_this.initFlash(), 50000);
                setTimeout(() => {
                  this.initFlash()
                }, 50);
            } else {
                //初始化插件语言

                swfobject.getObjectById(this.id).setLanguage('cn.xml');
                //先将全部窗口创建好
                swfobject.getObjectById(this.id).setWindowNum(36);
                //再配置当前的窗口数目
                var windowNum = '4';
                swfobject.getObjectById(this.id).setWindowNum(windowNum);
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
                swfobject.getObjectById(this.id).setServerInfo(serverIp, serverPort);
                this.isInitFinished = true;
            }
        }
    },
}
</script>
