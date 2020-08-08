<template>
    <div>
        <transition name="fade">
            <el-button type="primary" v-show="notFetch" :loading="onFetch" v-on:click="fetchContestList">Fetch
            </el-button>
        </transition>

        <template v-if="!notFetch">
            <el-table :data="showContest"
                      style="width: 100%"
                      :row-class-name="getColor">
                <el-table-column
                    prop="id"
                    label="ID"
                    align="right"
                    min-width="50">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="Name"
                    align="center"
                    min-width="300">
                </el-table-column>
                <el-table-column
                    label="StartTime"
                    align="center"
                    min-width="200">
                    <template slot-scope="scope">
                        {{ getTime(showContest[scope.$index].startTimeSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="Length"
                    align="center"
                    min-width="100">
                    <template slot-scope="scope">
                        {{ getLengthTime(showContest[scope.$index].durationSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="Status"
                    align="center"
                    min-width="100">
                    <template slot-scope="scope">
                        {{ showContest[scope.$index].phase.toLowerCase() }}
                    </template>
                </el-table-column>
                <el-table-column
                    label=""
                    align="center"
                    min-width="50">
                    <template scope="scope">
                        <el-button type="primary"
                                   v-on:click="clickContest(scope.$index)"
                                   :disabled="enterButton(scope.$index)">
                            进入
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>

    </div>
</template>

<script>
import {timeCycle} from '@/static/time'

export default {
    name: "ContestList",

    data() {
        return {
            onFetch: false,
            notFetch: true,
            curPage: 0,
            showContest: [],
            contestList: []
        }
    },

    methods: {
        fetchContestList() {
            this.onFetch = true;
            fetch('https://codeforces.com/api/contest.list').then(response => response.json()).then(json => {
                if (json.status === 'FAILED') {
                    this.$message.error('意料之外的错误')
                    this.onFetch = false
                    return
                }
                this.contestList = json.result
                this.curPage = 0
                this.getPage()
                this.notFetch = false
            }).catch(() => {
                this.$message.error('网络出错')
                this.onFetch = false
            })
        },

        nextPage() {
            this.curPage++
            this.getPage()
        },

        getPage() {
            this.showContest = this.contestList.slice(this.curPage * 20, this.curPage * 20 + 20)
        },

        getTime(time) {
            return timeCycle(time)
        },

        getLengthTime(time) {
            let hour = Math.floor(time / 3600)
            let mint = Math.floor(time % 3600) / 60
            return hour + ':' + (mint > 10 ? mint : '0' + mint)
        },

        // eslint-disable-next-line no-unused-vars
        getColor({row, rowIndex}) {
            switch (this.showContest[rowIndex].phase) {
                case 'BEFORE':
                    return 'contestLine_before'
                case 'CODING':
                    return 'contestLine_coding'
                case 'PENDING_SYSTEM_TEST':
                    return 'contestLine_pend_system_test'
                case 'SYSTEM_TEST':
                    return 'contestLine_system_test'
                case 'FINISHED':
                    return 'contestLine_system_finish'
            }
        },

        enterButton(index) {
            switch (this.showContest[index].phase) {
                case 'BEFORE':
                    return true
                case 'CODING':
                case 'PENDING_SYSTEM_TEST':
                case 'SYSTEM_TEST':
                case 'FINISHED':
                    return false
            }
        },

        clickContest(index) {
            console.log(this.showContest[index].id)

        }
    }
}
</script>

<style>
.el-table .contestLine_before {
    background: #c8ffff;
}

.el-table .contestLine_coding {
    background: #ff6464;
}

.el-table .contestLine_pend_system_test {
    background: #ffc8c8;
}

.el-table .contestLine_system_test {
    background: #ff9600;
}

.el-table .contestLine_system_finish {
    background: #ffffff;
}
</style>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>