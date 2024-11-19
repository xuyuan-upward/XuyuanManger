<template>
    <div class="home">
        <el-row>
            <!-- 左侧 -->
            <el-col :span="7">
                <div class="l-user">
                    <el-card style="max-width: 480px" shadow="hover" class="user-info">
                        <div class="user">
                            <img src="@/assets/images/xuyuan.jpg" alt=""
                                style="width: 100px;height: 100px;border-radius: 50%;margin-right: 10px;">
                            <div class="userInfo">
                                <h>admin</h>
                                <p style="margin-top: 20px; color: #999;">超级管理员</p>
                            </div>
                        </div>
                        <el-divider />
                        <div class="login-info">
                            <p>上次登录时间：<span>2024-11-18 1:00:00</span></p>
                            <p style="margin-top: 10px;">上次登录地点：<span>广西</span></p>
                        </div>
                    </el-card>

                    <el-card style="max-width: 480px" shadow="hover" class="user-table">
                        <el-table :data="tableData" style="width: 100%">
                            <!-- 遍历val是值 key是键 -->
                            <el-table-column v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val">
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </el-col>
            <!-- 右侧 -->
            <el-col :span="17">
                <div class="r-echart">
                    <div class="top">
                        <el-card v-for="(item) in counterData" :key="item.name"
                            :body-style="{ padding: '20px', display: 'flex' }" shadow="hover">
                            <component :is="item.icon" class="icons" :style="{ background: item.color }" />
                            <div class="detail">
                                <p class="num">￥{{ item.value }}</p>
                                <p class="txt">￥{{ item.name }}</p>
                            </div>
                        </el-card>
                    </div>
                    <div class="bottom">
                        <!-- 三个图表容器 -->
                        <div class="echart-top">
                            <el-card shadow="hover">
                                <div ref="echart" style="height: 220px;"></div>
                            </el-card>
                        </div>
                        <div class="echart-bottom">
                            <el-card shadow="hover">
                                <div ref="userEchart" style="height: 140px"></div>
                            </el-card>
                            <el-card shadow="hover">
                                <div ref="videoEchart" style="height: 140px"></div>
                            </el-card>
                        </div>
                    </div>
                </div>
            </el-col>

        </el-row>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, nextTick, getCurrentInstance } from 'vue'
import * as echarts from 'echarts';

//这个tableData是假数据，等会我们使用axios请求mock数据
const { proxy } = getCurrentInstance()
const tableData = ref([])
const counterData = ref([])

//observer 接收观察器实例对象
const observer = ref(null)

//这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
    // 图例文字颜色
    textStyle: {
        color: "#333",
    },
    legend: {},
    grid: {
        left: "20%",
    },
    // 提示框
    tooltip: {
        trigger: "axis",
    },
    xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
            lineStyle: {
                color: "#17b3a3",
            },
        },
        axisLabel: {
            interval: 0,
            color: "#333",
        },
    },
    yAxis: [
        {
            type: "value",
            axisLine: {
                lineStyle: {
                    color: "#17b3a3",
                },
            },
        },
    ],
    color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
    series: [],
})
const pieOptions = reactive({
    tooltip: {
        trigger: "item",
    },
    legend: {},
    color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf",
    ],
    series: []
})

const getTableData = async () => {
    const data = await proxy.$apis.getTableData()
    console.log("home,tableData获取到的数据：", data);
    tableData.value = data.tableData
}
const getCounterData = async () => {
    const data = await proxy.$apis.getCounterData()
    console.log("home,counterData获取到的数据：", data);
    counterData.value = data
}

const getChartData = async () => {
    // 获取图标信息 ，解构
    const { orderData, userData, videoData } = await proxy.$apis.getChartData()
    console.log("home,orderData获取到的数据：", orderData);
    //对第一个图表的xAxis和series赋值
    xOptions.xAxis.data = orderData.date
    xOptions.series = Object.keys(orderData.data[0]).map(val => {
        return {
            name: val,
            data: orderData.data.map(item => item[val]),
            type: "line"
        }
    }
    )
    //one               echarts.init方法初始化ECharts实例，需要传入dom对象
    const OneEcharts = echarts.init(proxy.$refs["echart"])
    //setOption方法应用配置对象
    OneEcharts.setOption(xOptions)
    //对第二个图表的xAxis和series赋值
    xOptions.xAxis.data = userData.map((item) => item.date)
    xOptions.series = [
        {
            name: "新增用户",
            data: userData.map((item) => item.new),
            type: "bar",
        },
        {
            name: "活跃用户",
            data: userData.map((item) => item.active),
            type: "bar",
        }
    ]
    //two
    const TwoEcharts = echarts.init(proxy.$refs["userEchart"])
    TwoEcharts.setOption(xOptions)

    //对第三个图表的series赋值
    pieOptions.series = [
        {
            data: videoData,
            type: "pie",
        },
    ]
    //three
    const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"])
    ThreeEcharts.setOption(pieOptions);

    //ResizeObserver 如果监视的容器大小变化，如果改变会执行传递的回调
    observer.value = new ResizeObserver(entries => {
        OneEcharts.resize()
        TwoEcharts.resize()
        ThreeEcharts.resize()
    })
    //如果这个容器存在
    if (proxy.$refs["echart"]) {
        //则调用监视器的observe方法，监视这个容器的大小
        observer.value.observe(proxy.$refs["echart"]);
    }
}

onMounted(() => {
    getTableData()
    getCounterData()
    getChartData()
    console.log(proxy);
})
const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})


</script>
<style lang='less' scoped>
.home {
    height: 100%;
    overflow: hidden;

    .l-user {
        .user-info {
            .user {
                display: flex;
                align-items: center;

                .userInfo {
                    margin-left: 30px;
                }
            }

            .login-info {
                p {
                    font-size: 14px;
                    color: #999;

                    span {
                        color: #666;
                        margin-left: 30px;
                    }
                }
            }
        }

        .user-table {
            margin-top: 50px;
        }
    }

    .r-echart {
        .top {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .el-card {
                width: 30%;
                margin-bottom: 10px;
                margin-left: 20px;

            }

            .icons {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 20px;
            }

            .detail {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .num {
                    margin-bottom: 10px;
                }
            }


        }

        .bottom {
            margin-left: 20px;

            .echart-top {
                margin-bottom: 20px;
            }

            .echart-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .el-card {
                    width: 48%;

                }
            }
        }

    }
}
</style>