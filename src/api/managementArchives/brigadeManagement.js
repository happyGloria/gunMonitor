import request from '../../request'
//车组列表
export function teamlist(data) {
    return request({
        url: '/team/list',
        method: 'post',
        data
    })
}
//添加车组
export function teamadd(data) {
    return request({
        url: '/team/add',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//修改车组
export function teamupdate(data) {
    return request({
        url: '/team/update',
        method: 'post',
        data,
        headers:{'content-type':'application/json'}
    })
}
//删除车组
export function teamdelete(data) {
    return request({
        url: '/team/delete',
        method: 'post',
        data
    })
}
//根据车组编号搜索车组
export function teamSearch(data) {
    return request({
        url: '/team/query',
        method: 'post',
        data
    })
}