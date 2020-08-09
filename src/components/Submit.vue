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

        <el-select v-model="languageSelect" style="margin-bottom: 15px; margin-left: 30px; width: 200px;"
                   placeholder="language">
            <el-option
                v-for="item in lang"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>

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
            lang: [{name: 'GNU GCC C11 5.1.0', value: 43},
                {name: 'Clang++17 Diagnostics', value: 52},
                {name: 'GNU G++11 5.1.0', value: 42},
                {name: 'GNU G++14 6.4.0', value: 50},
                {name: 'GNU G++17 7.3.0', value: 54},
                {name: 'Microsoft Visual C++ 2010', value: 2},
                {name: 'Microsoft Visual C++ 2017', value: 59},
                {name: 'GNU G++17 9.2.0 (64 bit, msys 2)', value: 61},
                {name: 'C# Mono 6.8', value: 9},
                {name: 'D DMD32 v2.091.0', value: 28},
                {name: 'Go 1.14', value: 32},
                {name: 'Haskell GHC 8.10.1', value: 12},
                {name: 'Java 11.0.6', value: 60},
                {name: 'Java 1.8.0_241', value: 36},
                {name: 'Kotlin 1.3.70', value: 48},
                {name: 'OCaml 4.02.1', value: 19},
                {name: 'Delphi 7', value: 3},
                {name: 'Free Pascal 3.0.2', value: 4},
                {name: 'PascalABC.NET 3.4.2', value: 51},
                {name: 'Perl 5.20.1', value: 13},
                {name: 'PHP 7.2.13', value: 6},
                {name: 'Python 2.7.15', value: 7},
                {name: 'Python 3.7.2', value: 31},
                {name: 'PyPy 2.7 (7.2.0)', value: 40},
                {name: 'PyPy 3.6 (7.2.0)', value: 41},
                {name: 'Ruby 2.7.1', value: 8},
                {name: 'Rust 1.42.0', value: 49},
                {name: 'Scala 2.12.8', value: 20},
                {name: 'JavaScript V8 4.8.0', value: 34},
                {name: 'Node.js 12.6.3', value: 55},
                {name: 'ActiveTcl 8.5', value: 14},
                {name: 'Io-2008-01-07 (Win32)', value: 15},
                {name: 'Pike 7.8', value: 17},
                {name: 'Befunge', value: 18},
                {name: 'OpenCobol 1.0', value: 22},
                {name: 'Factor', value: 25},
                {name: 'Secret_171', value: 26},
                {name: 'Roco', value: 27},
                {name: 'Ada GNAT 4', value: 33},
                {name: 'Mysterious Language', value: 38},
                {name: 'FALSE', value: 39},
                {name: 'Picat 0.9', value: 44},
                {name: 'GNU C++11 5 ZIP', value: 45},
                {name: 'Java 8 ZIP', value: 46},
                {name: 'J', value: 47},
                {name: 'Microsoft Q#', value: 56},
                {name: 'Text', value: 57},
                {name: 'UnknownX', value: 62}],
            code: '',
            contest: '',
            problem: '',
            languageSelect: 50
        }
    },

    props: {
        user: String,
    },

    methods: {
        setProblem(contest, problem) {
            this.contest = contest
            this.problem = problem
        },

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
                submit.submitCode(x, this.contest, this.problem, this.code, this.languageSelect, e => {
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