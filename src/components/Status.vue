<template>
    <div class="main">拉取提交列表长度：
        <el-input style="margin-bottom: 15px; width: 200px;"
                  placeholder="0"
                  v-model="count"
                  clearable>
        </el-input>


        <el-button type="primary"
                   style="margin-bottom: 15px; margin-left: 30px; width: 80px;"
                   round
                   v-on:click="getStatus">
            拉取
        </el-button>

        <template v-if="!notFetch">
            <el-table :data="submits"
                      style="width: 100%"
                      :row-class-name="getColor">
                <el-table-column
                    prop="id"
                    label="ID"
                    align="center"
                    min-width="50">
                </el-table-column>
                <el-table-column
                    label="StartTime"
                    align="center"
                    min-width="100">
                    <template slot-scope="scope">
                        {{ getTime(submits[scope.$index].creationTimeSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="problem"
                    align="center"
                    min-width="100">
                    <template scope="scope">
                        {{ getProblemName(scope.$index) }}
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
                    min-width="35">
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
    },

    data() {
        return {
            notFetch: true,
            from: 1,
            count: 1,
            submits: []
        }
    },

    props: {
        user: String
    },

    methods: {
        getStatus() {
            if (this.user === '') {
                this.$message.error('当前未登录')
                return
            }
            fetch('https://codeforces.com/api/user.status?handle='
                + this.user + '&from=' + this.from + '&count=' + this.count)
                .then(response => response.json()).then(json => {
                if (json.status === 'FAILED') {
                    this.$message.error('意料之外的错误')
                    return
                }
                this.submits = json.result
                this.notFetch = false
            }).catch(() => {
                this.$message.error('网络出错')
                this.notFetch = false
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
                return 'accept'
            return 'reject'
        },
    }
}
</script>

<style>
.el-table .accept {
    background: #64ff64;
}

.el-table .reject {
    background: #ff6464;
}
</style>

<style scoped>
.main {
    margin-top: 30px;
    margin-left: 30px;
    margin-right: 30px;
}
</style>