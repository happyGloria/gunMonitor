import request from '../../request'
//车组列表
export function carGrouplist(data) {
    return request({
        url: '/group/list',
        method: 'post',
        data
    })
}
//添加车组
export function carGroupadd(data) {
    return request({
        url: '/group/add',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//修改车组
export function carGroupupdate(data) {
    return request({
        url: '/group/update',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//删除车组
export function carGroupdelete(data) {
    return request({
        url: '/group/delete',
        method: 'post',
        data
    })
}
//根据车组编号搜索车组
export function carGroupSearch(data) {
    return request({
        url: '/group/query',
        method: 'post',
        data
    })
}