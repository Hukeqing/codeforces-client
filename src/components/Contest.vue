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
                      clearable
                      :disabled="loading">
            </el-input>


            <el-button type="primary"
                       style="margin-bottom: 15px; margin-left: 30px; width: 120px;"
                       round
                       v-on:click="getContest"
                       :loading="loading">
                拉取
            </el-button>
        </div>

        <template v-if="!notFetch">
            <el-table :data="problems"
                      style="width: 100%"
                      :row-class-name="getColor">
                <el-table-column
                    label="ID"
                    align="center"
                    min-width="50">
                    <template scope="scope">
                        <el-link type="primary" v-on:click="clickProblem(scope.$index)">
                            {{ problems[scope.$index].id }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="name"
                    align="center"
                    min-width="300">
                    <template scope="scope">
                        <el-link type="primary" v-on:click="clickProblem(scope.$index)">
                            {{ problems[scope.$index].name }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="passed"
                    label="passed"
                    align="center"
                    min-width="50">
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
let contest = require('../static/crawler/contest')

export default {
    name: "Contest",

    data() {
        return {
            loading: false,
            notFetch: true,
            problems: [],
            myCid: '',
        }
    },

    props: {
        contestId: String,
        wat: Boolean,
    },

    watch: {
        wat: function (value) {
            if (value === true) {
                if (this.myCid === this.contestId) return
                this.myCid = this.contestId
                if (this.myCid !== '')
                    this.getContest()
            }
        }
    },

    methods: {
        getContest() {
            this.notFetch = true
            this.loading = true
            contest.getContestProblem(this.myCid, (e, p) => {
                if (e) {
                    console.log(p)
                    this.$message.error('拉取失败')
                } else {
                    this.problems = p
                    this.notFetch = false
                    this.$emit('proMessage', {contest: this.myCid, id: '', next: '4-2'})
                }
                this.loading = false
            })
        },
        // eslint-disable-next-line no-unused-vars
        getColor({row, rowIndex}) {
            if (row.status === 1)
                return 'verdict-accepted'
            if (row.status === 2)
                return 'verdict-failed'
        },

        clickProblem(index) {
            console.log(this.problems[index].id)
            this.$emit('proMessage', {contest: this.myCid, id: this.problems[index].id, next: '5'})
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