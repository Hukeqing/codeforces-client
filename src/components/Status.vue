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
        拉取提交列表长度：
        <el-input-number style="margin-bottom: 15px; width: 200px;"
                         placeholder="0"
                         v-model="count"
                         clearable>
        </el-input-number>

        <el-button type="primary"
                   style="margin-bottom: 15px; margin-left: 30px; width: 120px;"
                   round
                   v-on:click="getStatus"
                   :loading="loading">
            拉取
        </el-button>

        <template v-if="!notFetch">
            <el-table :data="submits"
                      style="width: 100%"
                      :row-class-name="getColor">
                <el-table-column
                    label="ID"
                    align="center"
                    min-width="40">
                    <template scope="scope">
                        <el-link type="primary" v-on:click="openSubmit(scope.$index)">
                            {{ submits[scope.$index].id }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="SubmitTime"
                    align="center"
                    min-width="100">
                    <template scope="scope">
                        {{ getTime(submits[scope.$index].creationTimeSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="problem"
                    align="center"
                    min-width="120">
                    <template scope="scope">
                        <el-link type="primary" v-on:click="gotoProblem(scope.$index)">
                            {{ getProblemName(scope.$index) }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="verdict"
                    label="Status"
                    align="center"
                    min-width="100">
                </el-table-column>
                <el-table-column
                    prop="passedTestCount"
                    label="通过的测试数"
                    align="center"
                    min-width="50">
                </el-table-column>
                <el-table-column
                    prop="timeConsumedMillis"
                    label="Time"
                    align="center"
                    min-width="30">
                </el-table-column>
                <el-table-column
                    label="Member"
                    align="center"
                    min-width="35">
                    <template scope="scope">
                        {{ getMemory(scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="programmingLanguage"
                    label="Language"
                    align="center"
                    min-width="50">
                </el-table-column>
            </el-table>
        </template>

        <el-dialog
            :title="curSubmission"
            :visible.sync="submissionDialog"
            width="80%">
            <el-button size="mini" v-on:click="copyCode" style="margin-bottom: 20px"
                       :loading="onGetSubmission" round>拷 贝
            </el-button>
            <el-input
                type="textarea"
                :rows="10"
                v-model="detail.source"
                class="rt-input"
                readonly
                :autosize="{ minRows: 10 }">
            </el-input>
            <div v-for="data in detail.data" v-bind:key="data.id"
                 style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); border-radius: 4px; padding: 10px 10px 10px 10px">
                <h1>{{ data.id }}</h1>
                <p>
                    Time: {{ data.timeConsumed }}ms &emsp;
                    memory: {{ data.memoryConsumed }}KB &emsp;
                    exitCode: {{ data.exitCode }}
                    <br>
                    Verdict: {{ data.verdict }}
                </p>
                <el-form label-position="left">
                    <el-form-item label="Input">
                        <el-input type="textarea" :autosize="{ minRows: 0 }" readonly
                                  v-model="data.input"></el-input>
                    </el-form-item>
                    <el-form-item label="Output">
                        <el-input type="textarea" :autosize="{ minRows: 0 }" readonly
                                  v-model="data.output"></el-input>
                    </el-form-item>
                    <el-form-item label="Answer">
                        <el-input type="textarea" :autosize="{ minRows: 0 }" readonly
                                  v-model="data.answer"></el-input>
                    </el-form-item>
                    <el-form-item label="comment">
                        <el-input type="textarea" :autosize="{ minRows: 0 }" readonly
                                  v-model="data.checkerStdoutAndStderr"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submissionDialog = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {timeCycle} from '@/static/js/time'

let copy = require('../static/js/copy')
let common = require('../static/crawler/common')
let submission = require('../static/crawler/submission')

export default {
    name: "Status",

    created() {
        this.getStatus()
    },

    data() {
        return {
            loading: false,
            notFetch: true,
            from: 1,
            count: 1,
            submits: [],
            curSubmission: '',
            onGetSubmission: false,
            submissionDialog: false,
            detail: {},
            timeOut: null
        }
    },

    props: {
        user: String
    },

    methods: {
        startTimeout(func, time) {
            return setTimeout(function () {
                func()
            }, time);
        },

        getStatus() {
            if (this.user === '') {
                this.$message.error('当前未登录')
                return
            }
            this.loading = true
            if (this.timeOut !== null) {
                clearTimeout(this.timeOut)
                this.timeOut = null
            }
            fetch('https://codeforces.com/api/user.status?handle='
                + this.user + '&from=' + this.from + '&count=' + this.count)
                .then(response => response.json()).then(json => {
                if (json.status === 'FAILED') {
                    this.$message.error('意料之外的错误')
                    this.loading = false
                    return
                }
                this.submits = json.result
                this.notFetch = false
                this.loading = false
                this.timeOut = this.startTimeout(this.getStatus, this.count <= 20 ? 5000 : this.count * 1000)
            }).catch(() => {
                this.$message.error('网络出错')
                this.notFetch = false
                this.loading = false
            })
        },

        getProblemName(index) {
            let curSubmit = this.submits[index]
            return curSubmit.problem.contestId + curSubmit.problem.index + ' - ' + curSubmit.problem.name
        },

        getMemory(index) {
            let curSubmit = this.submits[index]
            return curSubmit.memoryConsumedBytes / 1024 + 'KB'
        },

        getTime(time) {
            return timeCycle(time)
        },

        // eslint-disable-next-line no-unused-vars
        getColor({row, rowIndex}) {
            if (row.verdict === 'OK')
                return 'verdict-accepted'
            if (row.verdict === 'TESTING' || row.verdict === '' || row.verdict === null)
                return 'verdict-waiting'
            return 'verdict-failed'
        },

        openSubmit(index) {
            this.submissionDialog = true
            this.curSubmission = this.submits[index].id
            this.onGetSubmission = true
            // submission.getSubmission(this.submits[index].contestId, this.submits[index].id, (e, r) => {
            //     this.onGetSubmission = false
            //     if (e) {
            //         console.log(r)
            //         this.$message.error('拉取出错')
            //         return
            //     }
            //     this.code = r
            // })
            this.detail = {}
            common.getXCsrfToken((e, x) => {
                submission.getSubmissionDetail(x, this.submits[index].id, (e, r) => {
                    this.onGetSubmission = false
                    if (e) {
                        console.log(r)
                        this.$message.error(r)
                        return
                    }
                    r = JSON.parse(r)
                    this.detail = {
                        source: r.source,
                        contestName: r.contestName,
                        problemName: r.problemName,
                        partyName: r.partyName,
                        verdict: r.verdict,
                        nextId: r.nextId,
                        prevId: r.prevId,
                        data: []
                    }
                    console.log(this.detail)
                    for (let i = r['testCount']; i >= 1; --i) {
                        this.detail.data.push({
                            id: i,
                            timeConsumed: r['timeConsumed#' + i],
                            memoryConsumed: parseInt(r['memoryConsumed#' + i]) / 1024,
                            exitCode: r['exitCode#' + i],
                            verdict: r['verdict#' + i],
                            input: r['input#' + i],
                            output: r['output#' + i],
                            answer: r['answer#' + i],
                            checkerStdoutAndStderr: r['checkerStdoutAndStderr#' + i]
                        })
                    }
                    console.log(this.detail)
                })
            })
        },

        gotoProblem(index) {
            let curSubmit = this.submits[index]
            this.$emit('proMessage', {
                contest: String(curSubmit.problem.contestId),
                id: curSubmit.problem.index,
                next: '5'
            })
        },

        copyCode() {
            copy.copy(this.detail.source)
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
.main {
    margin-top: 30px;
    margin-left: 30px;
    margin-right: 30px;
}

</style>