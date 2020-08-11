<template>
    <div class="main">
        <el-button type="primary" :disabled="!account"
                   v-on:click="removeUser">
            删除账号信息
        </el-button>
        <el-table :data="problems"
                  style="width: 100%"
                  v-loading="loading">
            <el-table-column
                prop="id"
                label="问题编号"
                align="center"
                min-width="100">
            </el-table-column>
            <el-table-column
                prop="memory"
                label="占用内存"
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
        if (window.localStorage.getItem('email') != null)
            this.account = true
        if (window.localStorage.savedProblem != null) {
            let problemList = window.localStorage.savedProblem
            problemList = problemList.split(';')
            for (let i = 0; i < problemList.length - 1; ++i) {
                let pro = {
                    id: problemList[i],
                    memory: window.localStorage.getItem(problemList[i]).length / 1024 + 'KB'
                }
                this.problems.push(pro)
            }
        }
        this.loading = false
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
        }
    }
}
</script>

<style scoped>

</style>