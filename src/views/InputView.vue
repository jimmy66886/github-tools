<template>
    <div class="bx">
        <div class="title">
            <h1>{{ msg }}</h1>
        </div>
        <div class="dogDaily">
            <span>{{ dogSays }}</span>&nbsp;&nbsp;<span @click="reloadDog" class="reloadDog">点击换一条</span>
        </div>
        <div class="info">
            <div class="inputs">
                <input type="text" placeholder=" 账户名" v-model="user" /><br><br>
                <input placeholder=" 仓库名" v-model="repo" />
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
            spinning: false,
            dogSays: '',
        }
    },
    methods: {

        reloadDog() {
            axios.get(`https://api.oick.cn/dog/api.php`)
                .then(res => {
                    this.dogSays = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },

        enter() {
            if (this.user == '' || this.repo == '') {
                this.$message.info('请输入内容', 2)
                return
            }
            this.spinning = true

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
                    if (err.message == 'Request failed with status code 404') {
                        // 关闭加载动画
                        this.spinning = false
                        this.$message.info('没有该仓库,请检查输入!', 2)
                    }
                })

        },

    },
    mounted() {
        this.reloadDog()
    },
    beforeDestroy() {
        localStorage.setItem('allData', JSON.stringify(this.allData))
    },
}
</script>

<style scoped>
.reloadDog {
    color: green;
    cursor: pointer;
}

.dogDaily {
    font-style: italic;
    font-size: 20px;
    margin-top: 50px;
    margin-bottom: 50px;
    text-align: center;
}

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
    height: 180px;
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