<template>
    <el-container>
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
                    <el-menu-item index="4">
                        <span slot="title">
                            <i class="el-icon-s-grid"></i>
                            比赛列表
                        </span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <span slot="title">
                            <i class="el-icon-menu"></i>
                            比赛题目列表
                        </span>
                    </el-menu-item>
                    <el-menu-item index="7">
                        <span slot="title">
                            <i class="el-icon-document"></i>
                            比赛题面
                        </span>
                    </el-menu-item>
                    <el-menu-item index="8">
                        <span slot="title">
                            <i class="el-icon-folder"></i>
                            本地缓存
                        </span>
                    </el-menu-item>
                    <el-menu-item index="9">
                        <span slot="title">
                            <i class="el-icon-info"></i>
                            关于
                        </span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main id="main">
                <Login v-if="status===1" :user="user" :logout="logout" v-on:login="login"></Login>
                <Submit v-if="status===2" :user="user" :contestId="contestId" :problemId="problemId"
                        v-on:submitOver="submitOver"></Submit>
                <Status v-if="status===3" :user="user"></Status>
                <ContestList v-if="status===4" v-on:enterContest="enterContest"></ContestList>
                <Contest v-if="status===5" :contestId="contestId" v-on:enterProblem="enterProblem"></Contest>
                <Problem v-if="status===7" :contestId="contestId" :problemId="problemId"
                         v-on:submitProblem="submitProblem" v-on:loadProblem="loadProblem"></Problem>
                <LocalManager v-if="status===8"></LocalManager>
                <Info v-if="status===9"></Info>
            </el-main>
        </el-container>
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
import Info from "@/components/Info";

export default {
    name: "Home",

    data() {
        return {
            status: 0,
            user: '',
            logout: '',
            contestId: '',
            problemId: ''
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
        Info
    },

    methods: {
        changeSelect(index) {
            this.status = parseInt(index)
        },

        login(user) {
            this.user = user.user
            this.logout = user.logout
            this.status = 0
        },

        submitOver(problem) {
            this.contestId = String(problem.contest)
            this.problemId = problem.id
            this.status = 3
        },

        enterContest(contest) {
            this.contestId = String(contest.id)
            this.problemId = ''
            this.status = 5
        },

        enterProblem(problem) {
            this.contestId = String(problem.contest)
            this.problemId = problem.id
            this.status = 6
        },

        submitProblem() {
            this.status = 2
        },

        loadProblem(problem) {
            this.contestId = String(problem.contest)
            this.problemId = problem.id
        }
    }
}
</script>

<style scoped>

</style>