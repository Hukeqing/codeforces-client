<template>
    <div id="app">
        <el-container>
            <!--            <el-header>Header</el-header>-->
            <el-container>
                <!--                <el-aside width="200px">Aside</el-aside>-->
                <el-container>
                    <el-main>
                        <p v-if="status===-1" style="position: fixed; top: 40%;left: 50%; transform: translateX(-50%);">
                            请刷新页面来再次尝试加载
                        </p>
                        <Login v-if="status===1" :xCsrfToken="xCsrfToken" v-on:login="login"></Login>
                        <ContestList v-if="status===2" :xCsrfToken="xCsrfToken"></ContestList>
                    </el-main>
                    <!--                    <el-footer>Footer</el-footer>-->
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>

import ContestList from "@/components/ContestList"
import Login from "@/components/Login"

let common = require('./static/crawler/common')

export default {
    name: 'App',

    created() {
        let loadScreen = this.openFullScreen()
        this.connectTimes = 1
        this.createSession(b => {
            if (b) {
                loadScreen.close()
                setTimeout(() => {
                    this.status = 1
                }, 500);
            } else {
                this.status = -1
                loadScreen.close()
            }
        })
    },

    data() {
        return {
            status: 0,
            connectTimes: 1,
            fullscreenLoading: false,
            xCsrfToken: '',
            userName: '',
            logout: ''
        }
    },

    components: {
        ContestList,
        Login
    },

    methods: {
        openFullScreen() {
            return this.$loading({
                lock: true,
                text: '正在创建一个连接至 codeforces 的会话，请稍等...此过程在没有代理的情况下需要数十秒',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },

        createSession(callback) {
            // eslint-disable-next-line no-unused-vars
            common.startSession((e, x, u) => {
                if (e) {
                    this.connectTimes++
                    if (this.connectTimes > 5) {
                        this.$message.error('会话创建失败，且失败次数过多')
                        callback(false)
                        return
                    }
                    this.$message.error('会话创建失败，三秒后进行第' + this.connectTimes + '次尝试')
                    setTimeout(() => {
                        this.createSession(callback)
                    }, 3000);
                } else {
                    common.startSession((e, x, u) => {
                        if (e) {
                            this.$message.error('会话创建出错')
                        } else {
                            this.$message.success('会话创建成功')
                            console.log(x)
                            console.log(u)
                            if (u[0] !== '/enter?back=%2F') {
                                this.userName = u[1]
                                this.logout = u[2]
                            }
                            this.xCsrfToken = x
                            callback(true)
                        }
                    })
                }
            })
        },

        login() {
            this.status = 2
        }
    }
}
</script>

<style>
#app {
    /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
}
</style>
