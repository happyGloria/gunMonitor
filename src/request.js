import axios from 'axios'
import {
    MessageBox,
    Message
} from 'element-ui'
import store from '@/store'
const service = axios.create({
    baseURL: 'http://192.168.1.217:8110/app', // 闫岩ip
    // baseURL: 'http://192.168.1.240:8110/app', // 孙立坤ip
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
    config => {
        if (store.getters.token != '') {
            config.headers['X-Token'] = store.getters.token
        }
        //如果请求头需要为application/json,需要在request请求里面单独设置请求头，其他不用
        if (config.headers['content-type'] == 'application/json') {
            return config
        }
        //formdata处理
        var formData = new FormData();
        for (var key in config.data) {
            formData.append(key, config.data[key])
        }
        config.data = formData;



        return config


    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)
// 响应拦截
service.interceptors.response.use(
    response => {
        // if (response.status == 500) {
        //     // 服务器异常
        // } else {

        // }
        const res = response.data
        if (res.status != 0&&res.status != 1) {
            Message({
                message: 'error,状态码不是0',
                type: 'error',
                duration: 5 * 1000
            })
            // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
            //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
            //         confirmButtonText: 'Re-Login',
            //         cancelButtonText: 'Cancel',
            //         type: 'warning'
            //     }).then(() => {
            //         store.dispatch('user/resetToken').then(() => {
            //             location.reload()
            //         })
            //     })
            // }
            return Promise.reject('error')
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)
export default service