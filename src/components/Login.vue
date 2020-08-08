<template>
    <el-container>
        <el-aside width="50%">
            <div class="inline-div">
                <h1 style="font-size: 40px; color: white; font-weight: bolder">
                    Codeforeces Client
                </h1>
            </div>
        </el-aside>
        <el-main>
            <div class="inline-div" v-if="user===''">
                <h1 style="font-size: 20px; font-weight: bolder">
                    使用 Codeforces 账号登录
                </h1>
                <p>
                    <el-input placeholder="请输入邮箱" v-model="email" style="width: 300px"></el-input>
                </p>
                <p>
                    <el-input placeholder="请输入密码" v-model="password" style="width: 300px" show-password></el-input>
                </p>
                <el-button type="primary" v-on:click="login()" style="width: 120px" round>登录</el-button>
                <el-button type="primary" v-on:click="back()" style="width: 120px" round>返回</el-button>
            </div>
            <div class="inline-div" v-if="user!==''">
                <h1 style="font-size: 20px; font-weight: bolder">
                    已经获取到登录的账号信息
                </h1>
                <el-button type="primary" v-on:click="back()" style="width: 250px" round>返回</el-button>
                <el-button type="primary" v-on:click="toLogout()" style="width: 250px" round>退出登录</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script>

let common = require('../static/crawler/common')

export default {
    name: "Login",

    props: {
        xCsrfToken: String,
        user: String,
        logout: String
    },

    data() {
        return {
            email: '',
            password: ''
        }
    },

    methods: {
        login() {
            let loading = this.$loading({
                lock: true,
                text: '正在登录',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            common.getLoginCookie(this.cookie, this.xCsrfToken, this.email, this.password, (e, u) => {
                loading.close()
                if (e) {
                    this.$message.error('登录出错，请重试')
                } else {
                    if (u[0] !== '/enter?back=%2F') {
                        this.user = u[1]
                        this.logout = u[2]
                    }
                    this.$message.success('登录成功')
                    this.$emit('login', {user: this.user, logout: this.logout})
                }
            })
        },

        back() {
            this.$emit('login', {user: this.user, logout: this.logout})
        },

        toLogout() {
            let loading = this.$loading({
                lock: true,
                text: '正在退出登录',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            common.logout(this.logout, (e) => {
                loading.close()
                if (e) {
                    this.$message.error('退出登录出错，请重试')
                } else {
                    this.$message.success('退出登录成功')
                    this.user = ''
                    this.logout = ''
                    this.$emit('login', {user: this.user, logout: this.logout})
                }
            })
        }
    }
}

</script>

<style scoped>
.el-aside {
    position: fixed;
    left: 0;
    right: 50%;
    top: 0;
    bottom: 0;
    background-color: #71C9F8;
    text-align: center;
}

.el-main {
    position: fixed;
    left: 50%;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
}

.inline-div {
    position: relative;
    top: 40%;
}
</style>