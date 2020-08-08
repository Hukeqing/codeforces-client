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
            <div class="inline-div">
                <h1 style="font-size: 20px; font-weight: bolder">
                    使用 Codeforces 账号登录
                </h1>
                <p>
                    <el-input placeholder="请输入邮箱" v-model="user" style="width: 300px"></el-input>
                </p>
                <p>
                    <el-input placeholder="请输入密码" v-model="password" style="width: 300px" show-password></el-input>
                </p>
                <el-button type="primary" v-on:click="login()" style="width: 250px" round>登录</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script>

let common = require('../static/crawler/common')

export default {
    name: "Login",

    props: {
        cookie: Array,
        xCsrfToken: String
    },

    data() {
        return {
            user: "",
            password: ""
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
            common.getLoginCookie(this.cookie, this.xCsrfToken, this.user, this.password, (e) => {
                loading.close()
                if (e) {
                    this.$message.error('登录出错，请重试')
                } else {
                    this.$message.success('登录成功')
                    this.$emit('login')
                }
            })
        },

        fastLogin() {
            this.$message.success('登录成功')
            this.$emit('login')
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