<template>
    <div class="main">
        <div id="memory"
             style="border-style: dotted; border-color: #8cc5ff;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border-radius: 4px">
            <h1>缓存管理</h1>
            <el-button type="warning" :disabled="!account"
                       v-on:click="removeUser">
                删除账号信息
            </el-button>

            <el-button type="danger"
                       v-on:click="removeAll">
                删除所有信息
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
                            {{ scope.row.id }}
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
                        <el-button type="primary" v-on:click="remove(scope.$index)">
                            删除缓存
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div id="setting"
             style="border-style: dotted; border-color: #8cc5ff;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border-radius: 4px; margin-top: 20px">
            <h1>设 置</h1>
            字体大小：
            <el-input-number v-model="setting.fontsize" @change="handleChange" :min="1" label="字体大小"></el-input-number>
        </div>
    </div>
</template>

<script>
export default {
    name: "LocalManager",

    data() {
        return {
            account: false,
            problems: [],
            loading: false,
            setting: {
                fontsize: 14
            }
        }
    },

    created() {
        this.loading = true

        // 缓存
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

        // 设置
        if (window.localStorage.getItem('setting') != null) {
            this.setting = JSON.parse(window.localStorage.getItem('setting'))
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
            if (window.localStorage.savedProblem != null)
                total += window.localStorage.savedProblem.length / 1024
            if (window.localStorage.getItem('setting') != null)
                total += window.localStorage.setting.length / 1024
            return total
        }
    },

    methods: {
        remove(index) {
            window.localStorage.removeItem(this.problems[index].id)
            window.localStorage.savedProblem = window.localStorage.savedProblem.replace(this.problems[index].id + ';', '')
            this.problems.splice(index, 1)
        },

        removeUser() {
            window.localStorage.removeItem('email')
            window.localStorage.removeItem('password')
            this.account = false
        },

        removeAll() {
            this.$confirm('确认删除？')
                .then(() => {
                    window.localStorage.clear();
                    this.$message.success('数据已清空')
                    this.$emit('proMessage', {contest: '', id: '', next: '0'})
                })
                .catch(() => {
                });
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
        },

        // eslint-disable-next-line no-unused-vars
        handleChange(currentValue, odlValue) {
            document.getElementsByTagName('body')[0].style.fontSize = currentValue + 'px'
            window.localStorage.setItem('setting', JSON.stringify(this.setting))
        }
    }
}
</script>

<style scoped>

</style>
