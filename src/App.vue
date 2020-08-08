<template>
    <div id="app">
        <p v-if="status===-1" style="position: fixed; top: 40%;left: 50%; transform: translateX(-50%);">
            请刷新页面来再次尝试加载
        </p>
        <Home v-if="status===1"></Home>
    </div>
</template>

<script>

import Home from "@/components/Home";

export default {
    name: 'App',

    data() {
        return {
            status: 0,
            connectTimes: 1,
            userName: '',
            logout: ''
        }
    },

    components: {
        Home
    },
}
</script>

<style>
#app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
