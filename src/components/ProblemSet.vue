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
        <el-form ref="form" label-width="80px"
                 style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); padding-top: 10px; padding-right: 20px; padding-bottom: 3px">
            <el-form-item label="题目标签">
                <el-select v-model="label" multiple placeholder="请选择题目标签" style="width: 100%" clearable>
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.title"
                        :value="item.value"
                        clearable>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分数范围">
                <el-slider
                    v-model="score"
                    range
                    :step="100"
                    :max="3500">
                </el-slider>
            </el-form-item>
            <el-form-item>
                <el-cascader
                    v-model="sortValue"
                    :options="sortOptions"
                    :props="{ expandTrigger: 'hover' }"></el-cascader>
                <el-button type="primary" @click="fetchProblemSet" style="margin-left: 10px; width: 120px"
                           :loading="loading">拉取
                </el-button>
            </el-form-item>
        </el-form>

        <template v-if="!notFetch">
            <el-table :data="problems"
                      style="width: 100%"
                      :row-class-name="getColor">
                <el-table-column
                    label="Contest"
                    align="center"
                    min-width="75">
                    <template scope="scope">
                        <el-link type="primary" v-on:click="clickContest(scope.$index)">
                            {{ problems[scope.$index].contest }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="ID"
                    align="center"
                    min-width="25">
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
                    prop="score"
                    label="score"
                    align="center"
                    min-width="100">
                </el-table-column>
                <el-table-column
                    prop="passed"
                    label="passed"
                    align="center"
                    min-width="50">
                </el-table-column>
            </el-table>
        </template>

        <div style="margin-top: 30px">
            第
            <el-input-number v-model="page" :min="1" :max="max_page" style="margin-left: 15px; margin-right: 15px"
                             label="页" :disabled="loading"></el-input-number>
            / {{ max_page }}
            页
            <el-button type="primary" style="margin-left: 15px" icon="el-icon-right" :loading="loading"
                       v-on:click="getProblemSet" round></el-button>
        </div>
    </div>
</template>

<script>
let problemSet = require('../static/crawler/problemSet')

export default {
    name: "ProblemSet",

    data() {
        return {
            loading: false,
            notFetch: true,
            problems: [],
            options: [{value: "combine-tags-by-or", title: "*combine tags by OR"},
                {value: "2-sat", title: "2-sat"},
                {value: "binary search", title: "binary search"},
                {value: "bitmasks", title: "bitmasks"},
                {value: "brute force", title: "brute force"},
                {value: "chinese remainder theorem", title: "chinese remainder theorem"},
                {value: "combinatorics", title: "combinatorics"},
                {value: "constructive algorithms", title: "constructive algorithms"},
                {value: "data structures", title: "data structures"},
                {value: "dfs and similar", title: "dfs and similar"},
                {value: "divide and conquer", title: "divide and conquer"},
                {value: "dp", title: "dp"},
                {value: "dsu", title: "dsu"},
                {value: "expression parsing", title: "expression parsing"},
                {value: "fft", title: "fft"},
                {value: "flows", title: "flows"},
                {value: "games", title: "games"},
                {value: "geometry", title: "geometry"},
                {value: "graph matchings", title: "graph matchings"},
                {value: "graphs", title: "graphs"},
                {value: "greedy", title: "greedy"},
                {value: "hashing", title: "hashing"},
                {value: "implementation", title: "implementation"},
                {value: "interactive", title: "interactive"},
                {value: "math", title: "math"},
                {value: "matrices", title: "matrices"},
                {value: "meet-in-the-middle", title: "meet-in-the-middle"},
                {value: "number theory", title: "number theory"},
                {value: "probabilities", title: "probabilities"},
                {value: "schedules", title: "schedules"},
                {value: "shortest paths", title: "shortest paths"},
                {value: "sortings", title: "sortings"},
                {value: "string suffix structures", title: "string suffix structures"},
                {value: "strings", title: "strings"},
                {value: "ternary search", title: "ternary search"},
                {value: "trees", title: "trees"},
                {value: "two pointers", title: "two pointers"}
            ],
            label: [],
            score: [0, 3500],
            sortOptions: [
                {
                    value: '0',
                    label: '默认排序',
                },
                {
                    value: '1',
                    label: '按分数排序',
                    children: [
                        {
                            value: 'BY_RATING_ASC',
                            label: '升序',
                        },
                        {
                            value: 'BY_RATING_DESC',
                            label: '降序',
                        }]
                }, {
                    value: '2',
                    label: '按通过人数排序',
                    children: [
                        {
                            value: 'BY_SOLVED_ASC',
                            label: '升序',
                        },
                        {
                            value: 'BY_SOLVED_DESC',
                            label: '降序',
                        }]
                }
            ],
            sortValue: ['0'],
            page: 1,
            max_page: 1
        }
    },

    methods: {
        fetchProblemSet() {
            this.page = 1
            this.getProblemSet()
        },
        getProblemSet() {
            this.notFetch = true
            this.loading = true

            let args = '?'

            if (this.sortValue[0] !== '0')
                args += 'order=' + this.sortValue[1] + '&'
            if (this.label.length !== 0)
                args += 'tags=' + this.label.join(',')
            if (this.label.length !== 0)
                args += ',' + this.score[0] + '-' + this.score[1]
            else
                args += 'tags=' + this.score[0] + '-' + this.score[1]
            problemSet.getProblemSetList(this.page, args, (e, p, m) => {
                if (e) {
                    console.log(p)
                    this.$message.error('拉取失败')
                } else {
                    this.notFetch = false
                    this.problems = p
                    m = parseInt(m)
                    this.max_page = m > this.page ? m : this.page
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

        clickContest(index) {
            this.$emit('proMessage', {contest: this.problems[index].contest, id: '', next: '4-2'})
        },

        clickProblem(index) {
            console.log(this.problems[index].id)
            this.$emit('proMessage', {contest: this.problems[index].contest, id: this.problems[index].id, next: '5'})
        },
    }
}
</script>

<style scoped>
</style>