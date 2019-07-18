<template>
<router-view></router-view>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    mounted() {
            // // websocket 
            // let ws = new WebSocket("ws://192.168.1.126:12345");
            // switch (ws.readyState) {
            //     case WebSocket.CONNECTING:
            //         console.log('正在连接');

            //         break;
            //     case WebSocket.OPEN:
            //         console.log('连接成功');
            //         break;
            //     case WebSocket.CLOSING:
            //         console.log('正在关闭');
            //         break;
            //     case WebSocket.CLOSED:
            //         console.log('已经关闭，或者打开连接失败');
            //         break;
            //     default:
            //         // this never happens
            //         break;
            // }
            // ws.onopen = function () {
            //     ws.send('Hello Server!');
            //     console.log('onopen');
            // }
            // ws.onmessage = function (event) {
            //     console.log(event.data);
            // };
    },
    methods: {

    },
}
</script>
