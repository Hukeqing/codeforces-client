<template>
    <el-container>
        <el-aside width="200px">
            <el-menu :default-active="String(status)" @select="changeSelect">
                <el-menu-item index="1">
                    <span slot="title">
                        <i class="el-icon-user"></i>
                        登录
                    </span>
                </el-menu-item>
                <el-menu-item index="2">
                    <span slot="title">
                        <i class="el-icon-upload2"></i>
                        提交
                    </span>
                </el-menu-item>
                <el-menu-item index="3">
                    <span slot="title">
                        <i class="el-icon-circle-check"></i>
                        状态
                    </span>
                </el-menu-item>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-folder"></i>
                        <span>比赛</span>
                    </template>
                    <el-menu-item index="4-1">
                        <span slot="title">
                            <i class="el-icon-s-grid"></i>
                            比赛列表
                        </span>
                    </el-menu-item>
                    <el-menu-item index="4-2">
                        <span slot="title">
                            <i class="el-icon-menu"></i>
                            比赛题目
                        </span>
                    </el-menu-item>
                    <el-menu-item index="4-3">
                        <span slot="title">
                            <i class="el-icon-s-data"></i>
                            题目列表
                        </span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="5">
                    <span slot="title">
                        <i class="el-icon-document"></i>
                        题面
                    </span>
                </el-menu-item>
                <el-menu-item index="6">
                    <span slot="title">
                        <i class="el-icon-setting"></i>
                        设置
                    </span>
                </el-menu-item>
                <el-menu-item index="7">
                    <span slot="title">
                        <i class="el-icon-info"></i>
                        关于
                    </span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <Login v-show="status==='1'" :user="user" :logout="logout" v-on:login="login"></Login>
            <Submit v-show="status==='2'" :user="user" :contestId="contestId" :problemId="problemId"
                    :wat="watchAttr['2']" v-on:proMessage="proMessage"></Submit>
            <Status v-if="status==='3'" :user="user" v-on:proMessage="proMessage"></Status>
            <ContestList v-show="status==='4-1'" v-on:proMessage="proMessage"></ContestList>
            <Contest v-show="status==='4-2'" :contestId="contestId" :problemId="problemId" v-on:proMessage="proMessage"
                     :wat="watchAttr['4-2']"></Contest>
            <ProblemSet v-show="status==='4-3'" v-on:proMessage="proMessage"></ProblemSet>
            <Problem v-show="status==='5'" :contestId="contestId" :problemId="problemId" :wat="watchAttr['5']"
                     v-on:proMessage="proMessage"></Problem>
            <LocalManager v-if="status==='6'" v-on:proMessage="proMessage"></LocalManager>
            <About v-show="status==='7'"></About>
        </el-main>
    </el-container>
</template>

<script>
import Login from "@/components/Login";
import Submit from "@/components/Submit";
import Status from "@/components/Status";
import ContestList from "@/components/ContestList";
import Contest from "@/components/Contest";
import Problem from "@/components/Problem";
import LocalManager from "@/components/LocalManager";
import About from "@/components/About";
import ProblemSet from "@/components/ProblemSet";

import '../static/css/status.css'

export default {
    name: "Home",

    created() {
        let setting = {
            fontsize: 14
        }
        if (window.localStorage.getItem('setting') != null) {
            setting = JSON.parse(window.localStorage.getItem('setting'))
        }
        document.getElementsByTagName('body')[0].style.fontSize = setting.fontsize + 'px'
    },

    data() {
        return {
            status: 0,
            user: '',
            logout: '',
            contestId: '',
            problemId: '',
            watchAttr: {},
        }
    },

    components: {
        Login,
        Submit,
        Status,
        ContestList,
        Contest,
        Problem,
        LocalManager,
        About,
        ProblemSet
    },

    methods: {
        changeSelect(index) {
            this.watchAttr[this.status] = false
            this.status = index
        },

        login(user) {
            this.user = user.user
            this.logout = user.logout
            this.status = '0'
        },

        proMessage(problem) {
            this.contestId = String(problem.contest)
            this.problemId = problem.id
            if (this.status !== problem.next) {
                this.watchAttr[this.status] = false
                this.status = String(problem.next)
                this.watchAttr[problem.next] = true
            }
        }
    }
}
</script>

<style scoped>

</style>
