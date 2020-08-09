import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import globalVariable from './static/renderer/globalVariable'

Vue.prototype.commonsVariable = globalVariable;
globalVariable.initMathjaxConfig()
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
