<template>
    <div class="main">
        <el-button type="primary" :disabled="!account"
                   v-on:click="removeUser">
            删除账号信息
        </el-button>
        <span style="margin-left: 60px">总内存占用：{{ (memoryTotal) }} KB(非准确值)</span>
        <el-table :data="problems"
                  style="width: 100%"
                  v-loading="loading">
            <el-table-column
                label="问题编号"
                align="center"
                min-width="100">
                <template scope="scope">
                    <el-link type="primary" v-on:click="clickProblem(scope.$index)">
                        {{ problems[scope.$index].id }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="memory"
                label="占用内存(KB)"
                align="center"
                min-width="100">
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                min-width="50">
                <template scope="scope">
                    <el-button type="primary"
                               v-on:click="remove(scope.$index)">
                        删除缓存
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "LocalManager",

    data() {
        return {
            account: false,
            problems: [],
            loading: false
        }
    },

    created() {
        this.loading = true
        if (window.localStorage.getItem('email') != null) {
            this.account = true
        }
        if (window.localStorage.savedProblem != null) {
            let problemList = window.localStorage.savedProblem
            problemList = problemList.split(';')
            for (let i = 0; i < problemList.length - 1; ++i) {
                let pro = {
                    id: problemList[i],
                    memory: window.localStorage.getItem(problemList[i]).length / 1024
                }
                this.problems.push(pro)
            }
        }
        this.loading = false
    },

    computed: {
        memoryTotal() {
            let total = 0
            for (let i = 0; i < this.problems.length; ++i)
                total += this.problems[i].memory
            if (this.account)
                total += (window.localStorage.email.length + window.localStorage.password.length) / 1024
            if (window.localStorage.getItem('email') != null)
                total += window.localStorage.savedProblem.length / 1024
            return total
        }
    },

    methods: {
        remove(index) {
            window.localStorage.removeItem(this.problems[index].id)
            window.localStorage.savedProblem = window.localStorage.savedProblem.replace(this.problems[index].id + ';', '')
            this.useLocalStorage = false
            this.problems.splice(index, 1)
        },

        removeUser() {
            window.localStorage.removeItem('email');
            window.localStorage.removeItem('password');
            this.account = false
        },

        clickProblem(index) {
            let id = this.problems[index].id

            let contestId = id.match(/(\d+)/)[0]
            let problem = id.match(/\d+(\w+)/)[1]

            this.$emit('proMessage', {
                contest: String(contestId),
                id: problem,
                next: '5'
            })
        }
    }
}
</script>

<style scoped>

</style>