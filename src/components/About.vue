<template>
    <div>
        <h1 style="font-size: 50px">
            Codeforces Client
        </h1>
        <h2>
            <a href="https://github.com/Hukeqing/codeforces-client" target="_blank" style="text-decoration:none;">
                <el-link type="primary">
                    查看源码
                </el-link>
            </a>
            <br>
            <br>
            <a href="https://github.com/Hukeqing/codeforces-client/releases" target="_blank"
               style="text-decoration:none; margin-top: 20px">
                <el-link type="primary">
                    下载其他版本
                </el-link>
            </a>
            <br>
            <br>
            <a href="https://github.com/Hukeqing/codeforces-client/issues/new" target="_blank"
               style="text-decoration:none;">
                <el-link type="primary">
                    提交反馈与建议
                </el-link>
            </a>
        </h2>
        <p style="font-size: 20px">当前的版本号为：{{ version }}</p>
        <p>最新的版本号：{{ latestVersion }}
            <a :href="updateLink" target="_blank"
               style="text-decoration:none; margin-left: 20px">
                <el-link type="primary">
                    下载链接
                </el-link>
            </a></p>
        <p style="margin-top: 120px; font-size: 14px">
            Copyleft (ɔ) 2020.Mauve，版权部分所有，遵循 GPL 授权使用
        </p>
    </div>
</template>

<script>
export default {
    name: "Info",

    data() {
        return {
            version: 'v1.2.3',
            latestVersion: '',
            updateLink: '',
        }
    },

    mounted() {
        fetch('https://api.github.com/repos/Hukeqing/codeforces-client/releases/latest').then(response => response.json()).then(json => {
            this.latestVersion = json.tag_name
            this.updateLink = json.html_url
            if (this.latestVersion !== this.version) {
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: '检测到更新的版本：' + this.latestVersion + '<br>' + json.body.replace(/\r\n/g, '<br>').replace(/ - \[x\]/g, '&#12288;'),
                    showClose: true
                })
            }
        }).catch(() => {
            this.$message.error('检测版本出错')
        })
    }
}
</script>

<style scoped>

</style>
