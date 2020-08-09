<template>
    <el-container>
        <el-container>
            <el-aside width="200px">
                <el-menu :default-active="'0'" @select="changeSelect">
                    <el-menu-item index="1">
                        <span slot="title">登录</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <span slot="title">提交</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <span slot="title">状态</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <span slot="title">比赛列表</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <Login v-if="status===1" :user="user" :logout="logout" v-on:login="login"></Login>
                <Submit v-if="status===2" :user="user" ref="submit"></Submit>
                <Status v-if="status===3" :user="user"></Status>
                <ContestList v-if="status===4"></ContestList>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Login from "@/components/Login";
import Submit from "@/components/Submit";
import Status from "@/components/Status";
import ContestList from "@/components/ContestList";

export default {
    name: "Home",

    data() {
        return {
            status: 0,
            user: '',
            logout: '',
        }
    },

    components: {
        Login,
        Submit,
        Status,
        ContestList
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

        setProblem(contest, problem) {
            this.$refs.submit.setProblem(contest, problem)
        },

    }
}
</script>

<style scoped>

</style>