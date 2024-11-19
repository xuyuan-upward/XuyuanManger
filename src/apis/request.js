import axios from 'axios';
import { ElMessage } from 'element-plus'
import config from '@/config'
const service = axios.create({
    baseURL: config.baseURL,
    timeout: 5000
}
)
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(
    (res) => {
        const { code, data, msg } = res.data;
        if (code === 200) {
            console.log("请求成功，数据为：", data);
            return data;
        } else {
            return ElMessage.error(msg || '网络请求错误');
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);
// 真正调用请求的地方
function request(options) {
    options.method = options.method || 'get';
    // 关于请求参数的调整
    if (options.method.toUpperCase() === 'GET') {
        options.params = options.data || {};
    }
    // 对mock开关做一个处理
    let isMock = config.isMock
    if (typeof options.isMock !== undefined) {
        isMock = options.isMock
    }
    // 生产环境
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseURL;
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseURL;
    }
    return service(options);
}

export default request;