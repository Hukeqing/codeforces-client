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
        <el-input style="margin-bottom: 15px; width: 200px;"
                  placeholder="0"
                  v-model="count"
                  clearable>
        </el-input>

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
    </div>
</template>

<script>
import {timeCycle} from '@/static/time'

export default {
    name: "Status",

    created() {
        this.getStatus()
        if (this.user !== '') {
            this.startInter(this.getStatus)
        }
    },

    data() {
        return {
            loading: false,
            notFetch: true,
            from: 1,
            count: 1,
            submits: [],
        }
    },

    props: {
        user: String
    },

    methods: {
        startInter(func) {
            setInterval(function () {
                if (!this.loading)
                    func()
            }, 5000);
        },

        getStatus() {
            if (this.user === '') {
                this.$message.error('当前未登录')
                return
            }
            this.loading = true
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
            window.open('https://codeforces.com/contest/1399/submission/' + this.submits[index].id)
        },

        gotoProblem(index) {
            let curSubmit = this.submits[index]
            this.$emit('proMessage', {
                contest: String(curSubmit.problem.contestId),
                id: curSubmit.problem.index,
                next: '5'
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