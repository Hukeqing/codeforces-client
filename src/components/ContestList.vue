<template>
    <div class="main">
        <div id="loadingDiv"></div>
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
        <el-button type="primary" :disabled="curPage === 0" v-on:click="prePage" :loading="isLoading" v-if="notFetch">
            重新拉取
        </el-button>
        <template v-if="!notFetch">
            <el-table :data="contestList.slice(curPage * 40, (curPage + 1) * 40)"
                      style="width: 100%"
                      :row-class-name="getColor">
                <el-table-column
                    label="ID"
                    align="right"
                    min-width="50">
                    <template slot-scope="scope">
                        <el-link v-if="enterButton(scope.$index + curPage * 40)" type="primary"
                                 v-on:click="clickContest(scope.$index + curPage * 40)">
                            {{ contestList[scope.$index + curPage * 40].id }}
                        </el-link>
                        <el-link v-else type="info">
                            {{ contestList[scope.$index + curPage * 40].id }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="Name"
                    align="center"
                    min-width="300">
                    <template slot-scope="scope">
                        <el-link v-if="enterButton(scope.$index + curPage * 40)" type="primary"
                                 v-on:click="clickContest(scope.$index + curPage * 40)">
                            {{ contestList[scope.$index + curPage * 40].name }}
                        </el-link>
                        <el-link v-else type="info">
                            {{ contestList[scope.$index + curPage * 40].name }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="StartTime"
                    align="center"
                    min-width="200">
                    <template slot-scope="scope">
                        {{ getTime(contestList[scope.$index + curPage * 40].startTimeSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="Length"
                    align="center"
                    min-width="100">
                    <template slot-scope="scope">
                        {{ getLengthTime(contestList[scope.$index + curPage * 40].durationSeconds) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="Status"
                    align="center"
                    min-width="100">
                    <template slot-scope="scope">
                        {{ contestList[scope.$index + curPage * 40].phase.toLowerCase() }}
                    </template>
                </el-table-column>
            </el-table>
            <el-button-group style="margin-top: 30px">
                <el-button type="primary" icon="el-icon-arrow-left" :disabled="curPage === 0" v-on:click="prePage">上一页
                </el-button>
                <el-button type="primary" v-on:click="nextPage" :disabled="curPage >= contestList.length / 40 - 1">下一页<i
                    class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
            </el-button-group>
        </template>
    </div>
</template>

<script>
import {timeCycle} from '@/static/js/time'

export default {
    name: "ContestList",

    mounted() {
        this.fetchContestList()
    },

    data() {
        return {
            isLoading: false,
            notFetch: true,
            curPage: 0,
            contestList: []
        }
    },

    methods: {
        fetchContestList() {
            this.isLoading = true
            let loading = this.$loading({
                lock: true,
                text: '正在拉取比赛列表',
                target: document.getElementById('loadingDiv'),
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
                this.isLoading = false
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
                    return false
                case 'CODING':
                case 'PENDING_SYSTEM_TEST':
                case 'SYSTEM_TEST':
                case 'FINISHED':
                    return true
            }
        },

        clickContest(index) {
            console.log(this.contestList[index].id)
            this.$emit('proMessage', {contest: this.contestList[index].id, id: '', next: '4-2'})
        }
    }
}
</script>

<style>
.el-table .contestLine_before {
    background: #c8c8ff;
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
</style>