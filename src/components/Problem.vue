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
                      clearable
                      :disabled="loading">
            </el-input>

            <el-input style="margin-bottom: 15px; margin-left: 15px; width: 90px;"
                      placeholder="ID（A）"
                      v-model="myPid"
                      clearable
                      :disabled="loading">
            </el-input>
            <el-button type="primary"
                       style="margin-bottom: 15px; margin-left: 15px; width: 120px;"
                       round
                       v-on:click="getProblem"
                       :loading="loading">
                拉取题面
            </el-button>
            <el-button type="success" icon="el-icon-edit"
                       style="margin-bottom: 15px; margin-left: 15px; width: 120px;"
                       round
                       :disabled="problemData === '' || loading"
                       v-on:click="submitProblem">
                提交
            </el-button>
            <el-button type="info"
                       style="margin-bottom: 15px; margin-left: 15px; width: 100px;"
                       round
                       :disabled="problemData === '' || loading"
                       v-on:click="saveProblem">
                {{ useLocalStorage ? '删除缓存' : '缓存此题' }}
            </el-button>
            <!--            <el-button type="warning"-->
            <!--                       style="margin-bottom: 15px; margin-left: 15px; width: 100px;"-->
            <!--                       round-->
            <!--                       :disabled="problemData === '' || !useLocalStorage || loading"-->
            <!--                       v-on:click="reloadProblem">-->
            <!--                重新拉取-->
            <!--            </el-button>-->
        </div>
        <div>
        <span v-for="test in tests" :key="test.id" style="margin-left: 10px">
            <el-button size="mini" v-on:click="copyTest(test.value)" round> 拷贝样例 {{ test.id + 1 }}</el-button>
        </span>
        </div>

        <div id="problemMainData" class="problemMainData">
            <div v-html="problemData">
            </div>
        </div>
    </div>
</template>

<script>
import '../static/css/problem-statement.css'
import '../static/css/ttypography.css'

let problem = require('../static/crawler/problem')
let copy = require('../static/js/copy')

export default {
    name: "Problem",

    data() {
        return {
            loading: false,
            problemData: '',
            myCid: '',
            myPid: '',
            curCid: '',
            curPid: '',
            useLocalStorage: false,
            dialogVisible: false,
            curLink: '',
            tests: []
        }
    },

    props: {
        contestId: String,
        problemId: String,
        wat: Boolean,
    },

    watch: {
        wat: function (value) {
            if (value === true) {
                if (this.curCid === this.contestId && this.curPid === this.problemId) return
                this.myCid = this.contestId
                this.myPid = this.problemId
                if (this.myCid === '' || this.myPid === '')
                    return
                this.getProblem()
            }
        }
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
                this.loadProblemTest()
            } else {
                this.useLocalStorage = false
                this.loadProblem()
            }
            this.$emit('proMessage', {contest: this.myCid, id: this.myPid, next: '5'})
            this.curCid = this.myCid
            this.curPid = this.myPid
        },

        saveProblem() {
            if (!this.useLocalStorage) {
                if (window.localStorage.getItem(this.curCid + this.curPid) == null) {
                    let saved = window.localStorage.savedProblem
                    if (saved == null) saved = this.curCid + this.curPid + ';'
                    else saved += this.curCid + this.curPid + ';'
                    window.localStorage.savedProblem = saved
                }
                window.localStorage.setItem(this.curCid + this.curPid, this.problemData)
                this.useLocalStorage = true
            } else {
                if (window.localStorage.getItem(this.curCid + this.curPid) != null) {
                    window.localStorage.removeItem(this.curCid + this.curPid)
                    window.localStorage.savedProblem = window.localStorage.savedProblem.replace(this.curCid + this.curPid + ';', '')
                }
                this.useLocalStorage = false
            }
        },

        // reloadProblem() {
        //     window.localStorage.removeItem(this.curCid + this.curPid)
        //     window.localStorage.savedProblem = window.localStorage.savedProblem.replace(this.curCid + this.curPid + ';', '')
        //     this.myCid = this.curCid
        //     this.myPid = this.curPid
        //     this.loadProblem()
        //     this.useLocalStorage = false
        // },

        loadProblem() {
            this.loading = true
            this.problemData = ''
            this.tests = []
            problem.getProblem(this.myCid, this.myPid, (e, d) => {
                if (d === '') {
                    e = true
                    d = '题目序号越界'
                }
                if (e) {
                    this.$message.error(d)
                    this.loading = false
                    return
                }
                this.problemData = d
                this.$nextTick(function () { //这里要注意，使用$nextTick等组件数据渲染完之后再调用MathJax渲染方法，要不然会获取不到数据
                    this.commonsVariable.MathQueue("problemMainData");//传入组件id，让组件被MathJax渲染
                })
                this.loading = false
                this.loadProblemTest()
            })
        },

        submitProblem() {
            if (this.myCid === '' || this.myPid === '') {
                this.$message.error('请输入题目的两个编号')
                return
            }
            this.$emit('proMessage', {contest: this.curCid, id: this.curPid, next: '2'})
        },

        loadProblemTest() {
            this.tests = []
            let test = this.problemData.match(/<pre>[\w\W]+?<\/pre>/g)
            for (let i = 0; i < test.length; i += 2)
                this.tests.push({id: i / 2, value: test[i].match(/<pre>([\w\W]+?)<\/pre>/)[1].replace(/<br>/g, '\n')})
        },

        copyTest(value) {
            copy.copy(value)
            this.$notify({
                title: '成功',
                message: '拷贝成功',
                type: 'success'
            });
        }
    }
}
</script>

<style scoped>
.problemMainData {
    text-align: left;
}
</style>
