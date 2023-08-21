<template>
    <div class="bx">
        <div class="title">
            <h1>{{ msg }}</h1>
        </div>
        <div class="info">
            <div class="inputs">
                <input type="text" placeholder="账户名" v-model="user" /><br>
                <input placeholder="仓库名" v-model="repo" />
            </div>
            <v-spin :spinning="spinning" size="large" tip="加载中"></v-spin>
            <v-button @click="enter">点击查询</v-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'InputView',
    data() {
        return {
            msg: 'GitHub Tools',
            allData: {},// 返回结果集
            user: '',
            repo: '',
            spinning: false
        }
    },
    methods: {
        enter() {
            this.spinning = true
            if (this.user == '' || this.repo == '') {
                return
            }
            // 输入不为空,给接口发请求:`https://api.github.com/repos/user/repo`
            axios.get(`https://api.github.com/repos/${this.user}/${this.repo}`)
                .then(res => {
                    // 拿到了返回json串的所有数据
                    this.allData = res.data
                    console.log(this.allData)

                    // 关闭加载动画
                    this.spinning = false
                    // 成功跳转
                    this.$router.push('/homeInfo')
                })
                .catch(err => {
                    console.error(err);
                })

        },

    },
    beforeDestroy() {
        localStorage.setItem('allData', JSON.stringify(this.allData))
    },
}
</script>

<style scoped>
.title {
    text-align: center;
    font-size: 30px;
}

.bx {
    width: 1140px;
    margin: 0 auto;
}

.info {
    display: flex;
    align-items: center;
    justify-content: center;
}

.info button {
    margin-left: 100px;
    width: 160px;
    height: 160px;
    border-radius: 20px;
    font-size: 25px;
}

.inputs input {
    width: 300px;
    height: 80px;
    border-radius: 20px;
    font-size: 25px;
}
</style>