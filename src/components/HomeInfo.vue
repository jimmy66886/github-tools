<template>
    <div>
        <div class="title bx">
            <div class="user_info">
                <img :src="avatar">
                <span>{{ fullName }}</span>
            </div>
            <div><a :href="htmlUrl">仓库链接</a></div>
        </div>

        <div class="repoInfo bx">
            
            <div class="dateInfo">
                <span>更新时间 {{ pushedAt }}</span>
                <span>创建时间 {{ createdAt }}</span>
            </div>
        </div>

        <div class="bottom bx">
            <span>{{ oneWord }}</span><span @click="reloadWord" class="reloadWord">点击换一条</span>
        </div>

        <div class="echart" id="mychart" :style="{ float: 'left', width: '100%', height: '400px' }"></div>

    </div>
</template>

<script>

import axios from 'axios'
import * as echarts from "echarts"

export default {
    name: 'HomeInfo',
    data() {
        return {
            oneWord: '',
            fullName: '',
            htmlUrl: '',
            size: '',
            avatar: '',
            pushedAt: '',
            createdAt: '',
            showSize: 0,
        }
    },
    methods: {

        initEcharts() {
            const option = {
                title: {
                    text: '仓库使用情况',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: this.size, name: '已使用' },
                            { value: 1048567, name: '总空间' },
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            const myChart = echarts.init(document.getElementById("mychart"));// 图标初始化
            myChart.setOption(option);// 渲染页面
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },

        // 一言
        reloadWord() {
            axios.get(`https://api.oick.cn/yiyan/api.php`)
                .then(res => {
                    this.oneWord = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },

        // 仓库最大1GB=1024MB=1048576KB
        // size的单位就是KB
        // 拿当前size/maxSize,得到使用的占比
        // 占比就是容量的宽度,占父盒子的百分比

        convertToShanghaiTime(originalTime) {
            const utcTime = new Date(originalTime);
            const shanghaiTime = new Date(utcTime.getTime());

            const year = shanghaiTime.getFullYear();
            const month = shanghaiTime.getMonth() + 1; // Months are zero-based
            const day = shanghaiTime.getDate();
            const hours = shanghaiTime.getHours();
            let minutes = shanghaiTime.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes
            }


            this.shanghaiTime = `${year}/${month}/${day} ${hours}:${minutes}`;
            return this.shanghaiTime
        },

    },
    // 接收数据
    mounted() {


        this.msg = this.reloadWord()

        let data = JSON.parse(localStorage.getItem('allData'))

        // 对需要用到的值进行赋值
        this.fullName = data.full_name
        this.htmlUrl = data.html_url
        this.avatar = data.owner.avatar_url
        this.size = data.size
        console.log(data.pushed_at)
        this.pushedAt = this.convertToShanghaiTime(data.pushed_at)
        this.createdAt = this.convertToShanghaiTime(data.created_at)
        setTimeout(() => {
            this.showSize = ((this.size / 1048567) * 100).toFixed(2)
        }, 500);

        this.initEcharts();

    },
    beforeDestroy() {
        localStorage.removeItem('allData')
    }
}
</script>

<style scoped>
.reloadWord {
    color: green;
    cursor: pointer;
}

.bottom {
    padding-top: 100px;
    font-size: 30px;
    text-align: center;
}

.dateInfo {
    display: flex;
    flex-direction: column;

}

.repoInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.repoInfo .intro {
    font-size: 15px;
}

.nowSize {
    height: 60px;
    border-radius: 8px;
    background-color: rgb(173, 216, 233);
    line-height: 60px;
    color: black;
    transition: all 1s;
}

.maxSize {
    width: 300px;
    height: 60px;
    border-radius: 8px;
    border: 1px solid black;
}

.bx {
    width: 900px;
    margin: 0 auto;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 100px;
}

.title a {
    font-size: 16px;
}

.user_info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user_info span {
    font-size: 20px;
    font-weight: bold;
}

.user_info img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}
</style>