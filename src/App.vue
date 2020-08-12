<template>
    <div id="app">
        <Home></Home>
    </div>
</template>

<script>

import Home from "@/components/Home";

export default {
    name: 'App',

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
