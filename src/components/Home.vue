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
                </el-menu>
            </el-aside>
            <el-main>
                <Login v-if="status===1" :user="user" :logout="logout" v-on:login="login"></Login>
                <Submit v-if="status===2" :user="user"></Submit>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Login from "@/components/Login";
import Submit from "@/components/Submit";

export default {
    name: "Home",

    data() {
        return {
            status: 0
        }
    },

    components: {
        Login,
        Submit
    },

    props: {
        user: String,
        logout: String
    },

    methods: {
        changeSelect(index) {
            this.status = parseInt(index)
        },

        login(user) {
            this.user = user.user
            this.logout = user.logout
            this.status = 0
        }
    }
}
</script>

<style scoped>

</style>