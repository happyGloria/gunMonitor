import router from '../../router'
const state = {
    token: '',
    userName: '',
    power: ''
}
const mutations = {
    setToken: (state, token) => {
        state.token = token
    },
    setUserName: (state, userName) => {
        state.userName = userName
    },
    setPower: (state, power) => {
        state.power = power
    },
    removeUserName: (state) => {
        state.userName = ''
    },
    removeToken: state => {
        state.token = ''
    },
    removePower: (state, power) => {
        state.power = power
    },
}
const actions = {
    // user login
    login({
        commit
    }/* , userInfo */) {
        /* const {
            username,
            password
        } = userInfo */
        // return new Promise((resolve, reject) => {
        //     login({
        //         username: username.trim(),
        //         password: password
        //     }).then(response => {
        //         const {
        //             data
        //         } = response
        //         // 存token
        //         commit('setToken', data.token)
        //         resolve()
        //     }).catch(error => {
        //         reject(error)
        //     })
        // })
        console.log('this is login function');
        
        commit('setToken', '123')
        commit('setUserName', 'userName')
        commit('setPower', 'admin')
    },
    // user logout
    logout({
        commit
    }) {
        // return new Promise((resolve, reject) => {
        //     logout(state.token).then(() => {
        //         commit('setToken')
        //         // 返回登录页面
        //         resolve()
        //     }).catch(error => {
        //         reject(error)
        //     })
        // })
        commit('removeToken')
        commit('removeUserName')
        commit('removePower','user')
        router.replace('/login')
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}