import XmlHttpRequest from '@/utils/request.js'

export function Get(url, params) {
    return XmlHttpRequest.request({
        url,
        method: 'get',
        params
    }).then(res => {
        return res
    }).catch(err => {
        return err
    })
}
export function Post(url, data) {
    return XmlHttpRequest.request({
        url,
        method: 'post',
        data
    }).then(res => {
        return res
    }).catch(err => {
        return err
    })
}