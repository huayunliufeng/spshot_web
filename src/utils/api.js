import axios from 'axios'
import {Message} from 'element-ui';

//请求对象拦截
axios.interceptors.request.use(config => {

    //如果请求存在token，请求携带这个token
    let token = window.sessionStorage.getItem("token");
    if (token) {
        config.headers['Auth'] = token;
    }
    return config;

}, error => {
    console.log(error)

})

//响应对象拦截
axios.interceptors.response.use(success => {
    //业务逻辑
    if (success.status && success.status === 200) {
        if (success.data.code !== 20000) {
            Message.error({message: success.data.message});
        }
        if (success.data.flag && success.data.message) {
            Message.success({message: success.data.message});
        }
    }

    return success.data;

}, error => {

    if (error && error.response) {
        let code = error.response.status;
        if (code === 404) {
            Message.error({message: "没找到————(╯︵╰)"})
        } else if(code === 504){
            Message.error({message: "网关超时，请重新刷新或检查网络"})
        }else if (code === 403) {
            Message.error({message: "权限不足"})
        } else {
            Message.error({message: "请重新刷新"});
        }
    }
    return null;
});

let baseUrl = 'http://localhost:10010';

export const postRequest = (url, params) => {

    return axios({
        method: 'post',
        url: baseUrl + url,
        data: params
    })

}

export const getRequest = (url) => {

    return axios({
        method: 'get',
        url: baseUrl + url
    })

}

export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: baseUrl + url,
        data: params
    })

}

export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: baseUrl + url,
        data: params
    })

}
