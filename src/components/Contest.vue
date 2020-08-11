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
            拉取的比赛ID：
            <el-input style="margin-bottom: 15px; width: 200px;"
                      placeholder="0"
                      v-model="myCid"
                      clearable>
            </el-input>


            <el-button type="primary"
                       style="margin-bottom: 15px; margin-left: 30px; width: 80px;"
                       round
                       v-on:click="getContest">
                拉取
            </el-button>
        </div>

        <template v-if="!notFetch">
            <el-table :data="problems"
                      style="width: 100%"
                      :row-class-name="getColor">
                <el-table-column
                    prop="id"
                    label="ID"
                    align="center"
                    min-width="50">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="name"
                    align="center"
                    min-width="300">
                </el-table-column>
                <el-table-column
                    prop="passed"
                    label="passed"
                    align="center"
                    min-width="50">
                </el-table-column>
                <el-table-column
                    label=""
                    align="center"
                    min-width="50">
                    <template scope="scope">
                        <el-button type="primary"
                                   v-on:click="clickProblem(scope.$index)">
                            进入
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
let contest = require('../static/crawler/contest')

export default {
    name: "Contest",

    created() {
        this.myCid = this.contestId
        if (this.myCid !== '')
            this.getContest()
    },

    data() {
        return {
            notFetch: true,
            problems: [],
            myCid: '',
        }
    },

    props: {
        contestId: String
    },

    methods: {
        getContest() {
            this.notFetch = true
            let loading = this.$loading({
                lock: true,
                text: '正在拉取题目',
                target: document.getElementById('main'),
                background: 'rgba(0, 0, 0, 0.7)'
            })
            contest.getContestProblem(this.myCid, (e, p) => {
                if (e) {
                    console.log(p)
                    this.$message.error('拉取失败')
                } else {
                    this.problems = p
                    this.notFetch = false
                }
                loading.close()
            })
        },
        // eslint-disable-next-line no-unused-vars
        getColor({row, rowIndex}) {
            if (row.status === 1)
                return 'accept'
            if (row.status === 2)
                return 'reject'
        },

        clickProblem(index) {
            console.log(this.problems[index].id)
            this.$emit('enterProblem', {contest: this.myCid, id: this.problems[index].id})
        }
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