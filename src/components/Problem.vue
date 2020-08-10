<template>
    <div class="main">
        <template>
            <el-backtop>
                <div style="
                        height: 100%;
                        width: 100%;
                        background-color: #64c8ff;
                        box-shadow: 0 0 6px rgba(0,0,0, .12);
                        text-align: center;
                        line-height: 40px;
                        color: #1989fa;
                        border-radius: 30px;"
                ><i class="el-icon-top"></i>
                </div>
            </el-backtop>
        </template>

        <div style="text-align: left">
            <el-input style="margin-bottom: 15px; width: 160px;"
                      placeholder="比赛编号（1393）"
                      v-model="myCid"
                      clearable>
            </el-input>

            <el-input style="margin-bottom: 15px; margin-left: 15px; width: 90px;"
                      placeholder="ID（A）"
                      v-model="myPid"
                      clearable>
            </el-input>
            <el-button type="primary"
                       style="margin-bottom: 15px; margin-left: 15px; width: 120px;"
                       round
                       v-on:click="getProblem">
                拉取题面
            </el-button>
            <el-button type="success" icon="el-icon-edit"
                       style="margin-bottom: 15px; margin-left: 15px; width: 120px;"
                       round
                       :disabled="problemData === ''"
                       v-on:click="submitProblem">
                提交
            </el-button>
            <el-button type="info"
                       style="margin-bottom: 15px; margin-left: 15px; width: 100px;"
                       round
                       :disabled="problemData === ''"
                       v-on:click="saveProblem">
                {{ useLocalStorage ? '删除缓存' : '缓存此题' }}
            </el-button>
            <el-button type="warning"
                       style="margin-bottom: 15px; margin-left: 15px; width: 100px;"
                       round
                       :disabled="problemData === '' || !useLocalStorage"
                       v-on:click="reloadProblem">
                重新拉取
            </el-button>
        </div>

        <div id="problemMainData" class="problemMainData">
            <div v-html="problemData">

            </div>
        </div>
    </div>
</template>

<script>
import '../static/problem/problem-statement.css'
import '../static/problem/ttypography.css'

let problem = require('../static/crawler/problem')

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
            myPid: '',
            useLocalStorage: false
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
            if (window.localStorage.getItem(this.myCid + this.myPid) != null) {
                this.useLocalStorage = true
                this.problemData = window.localStorage.getItem(this.myCid + this.myPid)
                this.$nextTick(function () { //这里要注意，使用$nextTick等组件数据渲染完之后再调用MathJax渲染方法，要不然会获取不到数据
                    this.commonsVariable.MathQueue("problemMainData");//传入组件id，让组件被MathJax渲染
                })
            } else {
                this.useLocalStorage = false
                this.loadProblem()
            }
        },

        saveProblem() {
            console.log(this.contestId + this.problemId)
            console.log(this.myCid + this.myPid)
            if (window.localStorage.getItem(this.contestId + this.problemId) == null) {
                let saved = window.localStorage.savedProblem
                if (saved == null) saved = this.contestId + this.problemId
                else saved += ';' + this.contestId + this.problemId
                window.localStorage.savedProblem = saved
            }
            window.localStorage.setItem(this.contestId + this.problemId, this.problemData)
            this.useLocalStorage = true
        },

        reloadProblem() {
            window.localStorage.removeItem(this.contestId + this.problemId)
            this.myCid = this.contestId
            this.myPid = this.problemId
            this.loadProblem()
        },

        loadProblem() {
            let loading = this.$loading({
                lock: true,
                text: '正在拉取题面',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            problem.getProblem(this.myCid, this.myPid, (e, d) => {
                if (d === '') {
                    e = true
                    d = '题目序号越界'
                }
                if (e) {
                    this.$message.error(d)
                    loading.close()
                    return
                }
                this.problemData = d
                this.$emit('loadProblem', {contest: this.myCid, id: this.myPid})
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
            this.$emit('submitProblem')
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
