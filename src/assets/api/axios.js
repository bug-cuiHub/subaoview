import axios from 'axios'
import store from '@/store.js'
import pub from '@/assets/pubFile.json'

export default function (callback, params) {
    let eqUnique = store.getters.geteqid;
    let setting = params.setting;

    if (typeof setting !== 'object') {
        let req = {
            reason: '请求错误',
            status: 888,
            data: null
        };
        return callback(req);
    }
    let data = params.data;
    data ? data = Object.assign({
        eqUnique: eqUnique
    }, data) : data = null;
    return axios({
        method: setting.method,
        timeout: 1000 * 10,
        baseURL: 'http://' + pub.ip + '/subaoApi/public/',
        //baseURL: '/kw/subaoApi/public/',
        url: setting.url,
        data: data,
        contentType: setting.contentType ? setting.contentType : null,
        headers: setting.headers ? setting.headers : null,
        withCredentials: true
    }).then(
        function (res) {
            res = res.data;
            callback(res);
        }.bind(this),
        function (res) {
            var req = {
                reason: '网络错误',
                status: 999,
                data: null
            };
            callback(req);
        }.bind(this)
    );
}