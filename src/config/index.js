const env = process.env.NODE_ENV || "prod";
const EnvConfig = {
    development: {
        baseURL: "/api",
        mockApi: "https://mock.apipark.cn/m1/4068509-0-default/api"
    },
    test: {
        baseURL: "//test.xuyuan.com/api",
        mockApi: "https://mock.apipark.cn/m1/4068509-0-default/api"
    },
    prod: {
        baseURL: "//xuyuan.com/api",
        mockApi: "https://mock.apipark.cn/m1/4068509-0-default/api"
    },
}
export default {
    env,
    /* 将其重新解构成一个对象，并将其合并到默认配置中 */
    ...EnvConfig[env],
    isMock:false,
};