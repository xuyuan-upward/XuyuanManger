import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}

let List = []
const count = 200
//模拟200条用户数据
for (let i = 0; i < count; i++) {
    List.push(
        Mock.mock({
            id: Mock.Random.guid(),
            name: Mock.Random.cname(),
            addr: Mock.mock('@county(true)'),
            'age|18-60': 1,
            birth: Mock.Random.date(),
            sex: Mock.Random.integer(0, 1)
        })
    )
}


export default {
    /**
     * 获取列表
     * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
     * @param name, page, limit
     * @return {{code: number, count: number, data: *[]}}
     */
    getUserList: config => {
        //limit默认是10，因为分页器默认也是一页10个
        const { name, page = 1, limit = 10 } = param2Obj(config.url)

        const mockList = List.filter(user => {
            //如果name存在会，根据name筛选数据
            if (name && user.name.indexOf(name) === -1) return false
            return true
        })
        //分页
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        return {
            code: 200,
            data: {
                list: pageList,
                count: mockList.length, //数据总条数需要返回
            }
        }
    },


    /**
     * 删除用户
     * @param id
     * @return {*}
     */
    deleteUser: config => {
        const { id } = param2Obj(config.url)

        if (!id) {
            return {
                code: -999,
                message: '参数不正确'
            }
        } else {
            List = List.filter(u => u.id !== id)
            return {
                code: 200,
                message: '删除成功'
            }
        }
    },
    /**
       * 增加用户
       * @param name, addr, age, birth, sex
       * @return {{code: number, data: {message: string}}}
       */
    createUser: config => {
        const { name, addr, age, birth, sex } = JSON.parse(config.body)
        List.unshift({
            id: Mock.Random.guid(),
            name: name,
            addr: addr,
            age: age,
            birth: birth,
            sex: sex
        })
        return {
            code: 200,
            data: {
                message: '添加成功'
            }
        }
    },
    /**
   * 修改用户
   * @param id, name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
    updateUser: config => {
        const { id, name, addr, age, birth, sex } = JSON.parse(config.body)
        const sex_num = parseInt(sex)
        List.some(u => {
            if (u.id === id) {
                u.name = name
                u.addr = addr
                u.age = age
                u.birth = birth
                u.sex = sex_num
                return true
            }
        })
        return {
            code: 200,
            data: {
                message: '编辑成功'
            }
        }
    }
}