<template>
    <div class="main">
        <div style="text-align: left">
            <el-input style="margin-bottom: 15px; width: 200px;"
                      placeholder="比赛编号（例如：1393）"
                      v-model="myCid"
                      clearable>
            </el-input>

            <el-input style="margin-bottom: 15px; margin-left: 30px; width: 100px;"
                      placeholder="ID（A）"
                      v-model="myPid"
                      clearable>
            </el-input>
            <el-button type="primary"
                       style="margin-bottom: 15px; margin-left: 30px; width: 120px;"
                       round
                       v-on:click="getProblem">
                拉取题目
            </el-button>
            <el-button type="primary"
                       style="margin-bottom: 15px; margin-left: 30px; width: 120px;"
                       round
                       v-on:click="submitProblem">
                提交此题
            </el-button>
        </div>

        <div id="problemMainData" class="problemMainData">
            <div v-html="problemData">

            </div>
        </div>
    </div>
</template>

<script>
let problem = require('../static/crawler/problem')
import '../static/problem/problem-statement.css'
import '../static/problem/ttypography.css'

export default {
    name: "Problem",

    created() {
        this.myCid = this.contestId
        this.myPid = this.problemId
        if (this.myCid === '' || this.myPid === '')
            return
        this.getProblem()
    },

    data() {
        return {
            problemData: '',
            myCid: '',
            myPid: ''
        }
    },

    props: {
        contestId: String,
        problemId: String
    },

    methods: {
        getProblem() {
            if (this.myCid === '' || this.myPid === '') {
                this.$message.error('请输入题目的两个编号')
                return
            }
            let loading = this.$loading({
                lock: true,
                text: '正在拉取题面',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            problem.getProblem(this.myCid, this.myPid, (e, d) => {
                if (e) {
                    console.log(d)
                    this.$message.error('意料之外的错误')
                    loading.close()
                    return
                } else {
                    this.problemData = d
                }
                this.$nextTick(function () { //这里要注意，使用$nextTick等组件数据渲染完之后再调用MathJax渲染方法，要不然会获取不到数据
                    this.commonsVariable.MathQueue("problemMainData");//传入组件id，让组件被MathJax渲染
                })
                loading.close()
            })
        },

        submitProblem() {
            if (this.myCid === '' || this.myPid === '') {
                this.$message.error('请输入题目的两个编号')
                return
            }
            this.$emit('submitProblem', {contest: this.myCid, id: this.myPid})
        }
    }
}
</script>

<style scoped>
.problemMainData {
    text-align: left;
    font-size: 14px;
}
</style>
