import request from '../../request'
//车组列表
export function personList(data) {
    return request({
        url: '/person/list',
        method: 'post',
        data
    })
}
//添加车组
export function personAdd(data) {
    return request({
        url: '/person/add',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//修改车组
export function personUpdate(data) {
    return request({
        url: '/person/update',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//删除车组
export function personDelete(data) {
    return request({
        url: '/person/delete',
        method: 'post',
        data
    })
}
//根据车组编号搜索车组
export function personSearch(data) {
    return request({
        url: '/person/query',
        method: 'post',
        data
    })
}