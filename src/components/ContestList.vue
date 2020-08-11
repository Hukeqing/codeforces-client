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

        <template v-if="!notFetch">
            <el-table :data="contestList.slice(curPage * 20, (curPage + 1) * 20)"
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
                        {{ getTime(contestList[scope.$index + curPage * 20].startTimeSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="Length"
                    align="center"
                    min-width="100">
                    <template slot-scope="scope">
                        {{ getLengthTime(contestList[scope.$index + curPage * 20].durationSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="Status"
                    align="center"
                    min-width="100">
                    <template slot-scope="scope">
                        {{ contestList[scope.$index + curPage * 20].phase.toLowerCase() }}
                    </template>
                </el-table-column>
                <el-table-column
                    label=""
                    align="center"
                    min-width="50">
                    <template scope="scope">
                        <el-button type="primary"
                                   v-on:click="clickContest(scope.$index + curPage * 20)"
                                   :disabled="enterButton(scope.$index + curPage * 20)">
                            进入
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button-group style="margin-top: 30px">
                <el-button type="primary" icon="el-icon-arrow-left" :disabled="curPage === 0" v-on:click="prePage">上一页
                </el-button>
                <el-button type="primary" v-on:click="nextPage" :disabled="curPage >= contestList.length / 20 - 1">下一页<i
                    class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
            </el-button-group>
        </template>
    </div>
</template>

<script>
import {timeCycle} from '@/static/time'

export default {
    name: "ContestList",

    created() {
        this.fetchContestList()
    },

    data() {
        return {
            notFetch: true,
            curPage: 0,
            contestList: []
        }
    },

    methods: {
        fetchContestList() {
            let loading = this.$loading({
                lock: true,
                text: '正在拉取比赛列表',
                target: document.getElementById('main'),
                background: 'rgba(0, 0, 0, 0.7)'
            })
            fetch('https://codeforces.com/api/contest.list').then(response => response.json()).then(json => {
                if (json.status === 'FAILED') {
                    this.$message.error('意料之外的错误')
                    this.onFetch = false
                    loading.close()
                    return
                }
                this.contestList = json.result
                this.curPage = 0
                this.notFetch = false
                loading.close()
            }).catch(() => {
                this.$message.error('网络出错')
                this.onFetch = false
                loading.close()
            })
        },

        prePage() {
            this.curPage--
        },


        nextPage() {
            this.curPage++
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
            switch (row.phase) {
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
            switch (this.contestList[index].phase) {
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
            console.log(this.contestList[index].id)
            this.$emit('enterContest', {id: this.contestList[index].id})
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