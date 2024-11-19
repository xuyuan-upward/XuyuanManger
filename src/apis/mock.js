import Mock from 'mockjs';
import homeApi from './mockData/home';
import userApi from './mockData/user'
import getMenuApi from './mockData/permission'
/* 类似于服务端返回的数据 */
Mock.mock(/api\/home\/getTableData/, 'get', homeApi.getTableData);
Mock.mock(/api\/home\/getCounterData/, 'get', homeApi.getCounterData);
Mock.mock(/api\/home\/getChartData/, 'get', homeApi.getChartData);


Mock.mock(/user\/getUserData/, "get", userApi.getUserList)
Mock.mock(/user\/deleteUser/, "get", userApi.deleteUser)
Mock.mock(/user\/addUser/, "post", userApi.createUser)
Mock.mock(/user\/editUser/, "post", userApi.updateUser)


Mock.mock(/permission\/getMenu/, "post", getMenuApi.getMenu)