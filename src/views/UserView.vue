<template>
    <div class="user">
        <div class="user-head">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-form :inline="true" :model="formData">
                <el-form-item label="请输入">
                    <el-input placeholder="请输入姓名" v-model="formData.keyWord"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handlerSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="user-table">
            <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
                :before-close="handleClose">
                <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-
		在css进行处理-->
                <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="formUser.name" placeholder="请输入姓名" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="年龄" prop="age">
                                <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <!-- 使用:inline="true"会对select造成影响，此时长度应该设置最大 -->
                            <el-form-item label="性别" prop="sex" style="width: 80%;">
                                <el-select v-model="formUser.sex" placeholder="请选择" class="select-clean">
                                    <el-option label="男" :value="1" />
                                    <!-- 注意这里的 :value 表示绑定一个表达式即所谓的"1" 其实代表的是number类型1 -->
                                    <el-option label="女" :value="0" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">

                            <el-form-item label="出生日期" prop="birth">
                                <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入"
                                    style="width: 100%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="地址" prop="addr">
                            <el-input v-model="formUser.addr" placeholder="请输入地址" />
                        </el-form-item>
                    </el-row>
                    <el-row style="justify-content: flex-end">
                        <el-form-item>
                            <el-button type="primary" @click="handleCancel">取消</el-button>
                            <el-button type="primary" @click="onSubmit">确定</el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-dialog>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" />
                <el-table-column fixed="right" label="Operations" min-width="120">
                    <template #="scoped">
                        <el-button type="primary" size="small" @click="onEdit(scoped.row)">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" @click="onDelete(scoped.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="config.total" @current-change="handlerChangePage"
                class="page" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, nextTick, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance()
const tableData = ref([])
const tableLabel = reactive([
    {
        prop: "name",
        label: "姓名",
    },
    {
        prop: "age",
        label: "年龄",
    },
    {
        prop: "sex",
        label: "性别",
    },
    {
        prop: "birth",
        label: "出生日期",
        width: 200,
    },
    {
        prop: "addr",
        label: "地址",
        width: 400,
    },
])
const config = reactive({
    name: "",
    total: 0,
}
)
const formData = reactive({
    keyWord: ""
})
const dialogVisible = ref(false)
const action = ref("add")
const formUser = ref({
    sex: 0,
})

//表单校验规则
const rules = reactive({
    name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
    age: [
        { required: true, message: "年龄是必填项", trigger: "blur" },
        { type: "number", message: "年龄必须是数字" },
    ],
    sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
    birth: [{ required: true, message: "出生日期是必选项" }],
    addr: [{ required: true, message: '地址是必填项' }]
})

const handlerSearch = () => {
    console.log("搜索", formData.keyWord);
    config.name = formData.keyWord
    // console.log("搜索", searchText);
    getUserData(config)

}
const getUserData = async (query) => {
    const data = await proxy.$apis.getUserData(query)
    console.log("UserView的数据", data);
    config.total = data.count
    tableData.value = data.list.map((item) => {
        return {
            ...item,
            sex: item.sex === 1 ? '女' : '男'
        }
    })


}
onMounted(() => {
    getUserData()
})
const handlerChangePage = (value) => {
    console.log("当前页码", value);
    config.page = value
    getUserData(config)
}
const onDelete = (row) => {
    console.log("删除", row);
    ElMessageBox.confirm(
        '你确定要删除吗?',
        '删除提示',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'danger   ',
        }
    )
        .then(() => {
            proxy.$apis.deleteUser({ id: row.id })
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            getUserData()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
const onEdit = (row) => {

    console.log("编辑", row);
    action.value = "edit"
    dialogVisible.value = true
    /* nextTick 确保在 DOM 更新完成之后再执行回调函数
    也就是编辑表单
    */
    nextTick(() => {
        formUser.value = {
            ...row,
        }
    }
    )
    /*   formUser.value = {
         ...row,
     } */
}

//这个方法之前定义过
const handleAdd = () => {
    action.value = "add"
    //打开对话窗
    dialogVisible.value = true
}

//对话框右上角的关闭事件
const handleClose = () => {
    //获取到表单dom，执行resetFields重置表单
    //关闭对话框
    dialogVisible.value = false
    proxy.$refs["userForm"].resetFields()
}

//对话框右下角的取消事件
const handleCancel = () => {
    dialogVisible.value = false
    proxy.$refs["userForm"].resetFields()
}

//格式化日期，格式化为：1997-01-02这种
const timeFormat = (time) => {
    var time = new Date(time);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    function add(m) {
        return m < 10 ? "0" + m : m;
    }
    return year + "-" + add(month) + "-" + add(date);
}
const onSubmit = async () => {
    // 获取表单数据
    console.log("添加的xxx", formUser.value);
    // 先进行校验
    proxy.$refs["userForm"].validate(async (validate) => {
        if (validate) {
            let res = null;
            //这里无论是新增或者是编辑，我们都要对这个日期进行一个格式化
            //如果不是1997-01-02这种格式，使用timeFormat方法进行格式化
            formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
                ? formUser.birth
                : timeFormat(formUser.birth)
            // 提交表单时候，还需要判断是add or edit
            if (action.value === "add") {
                res = await proxy.$apis.addUser(formUser.value)
            } else {
                res = await proxy.$apis.editUser(formUser.value)

            }
            if (res) {
                ElMessage({
                    type: 'success',
                    message: action.value === "add" ? '添加成功' : "编辑成功",
                })
                dialogVisible.value = false
                proxy.$refs["userForm"].resetFields()
                // 刷新页面数据
                getUserData()
            }
        }
        else {
            ElMessage({
                type: 'error',
                message: "请输入正确内容",
            })
        }
    })
    // 校验通过，执行添加操作
    proxy.$apis.addUser(formUser.value)


}
</script>
<style lang='less' scoped>
.user {
    height: 100%;

    .user-head {
        display: flex;
        justify-content: space-between;
    }

    .user-table {
        height: 540px;
        position: relative;

        .page {
            position: absolute;
            bottom: 50px;
            right: 50px;
        }

    }
}
</style>