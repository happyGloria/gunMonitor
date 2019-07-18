import request from '../../request'
//车辆列表
export function carlist(data) {
    return request({
        url: '/car/list',
        method: 'post',
        data
    })
}
//添加车辆
export function carAdd(data) {
    return request({
        url: '/car/add',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//删除车辆
export function cardelete(data) {
    return request({
        url: '/car/delete',
        method: 'post',
        data
    })
}
//编辑车辆信息
export function carupdate(data) {
    return request({
        url: '/car/update',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//根据车牌号搜索车辆
export function carSearch(data) {
    return request({
        url: '/car/query',
        method: 'post',
        data
    })
}