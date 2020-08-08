<template>
    <div class="main">
        <el-input style="margin-bottom: 15px; width: 200px;"
                  placeholder="比赛编号（例如：1393）"
                  v-model="contest"
                  clearable>
        </el-input>

        <el-input style="margin-bottom: 15px; margin-left: 30px; width: 100px;"
                  placeholder="ID（A）"
                  v-model="problem"
                  clearable>
        </el-input>

        <el-button type="primary"
                   style="margin-bottom: 15px; margin-left: 30px; width: 80px;"
                   round
                   v-on:click="submitCode">
            提交
        </el-button>

        <el-input
            type="textarea"
            :rows="10"
            placeholder="请将代码复制粘贴至此处"
            v-model="code"
            class="rt-input"
            :autosize="{ minRows: 10 }">
        </el-input>
    </div>
</template>

<script>
let submit = require('../static/crawler/submit')
let common = require('../static/crawler/common')

export default {
    name: "Submit",

    data() {
        return {
            code: '',
            contest: '',
            problem: ''
        }
    },

    props: {
        user: String,
    },

    methods: {
        submitCode() {
            console.log(this.code)
            if (this.user === '') {
                this.$message.error('当前未登录')
                return
            }
            let loading = this.$loading({
                lock: true,
                text: '正在提交',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            common.getXCsrfToken((e, x) => {
                submit.submitCode(x, this.contest, this.problem, this.code, e => {
                    if (e) {
                        this.$message.error('提交肯定出错了')
                    } else {
                        this.$message.success('提交大概是成功了')
                    }
                    loading.close()
                })
            })
        }
    }
}
</script>

<style scoped>
.main {
    margin-top: 30px;
    margin-left: 30px;
    margin-right: 30px;
}
</style>