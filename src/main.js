window.state && window.state("正在加载组件...")
window.M3_LANG = 'zh-CN';

import Vue from 'vue'
import VueSplit from 'vue-split-panel'
import moment from 'moment'
import VueI18n from 'vue-i18n'
import animate from 'animate.css'
import Cookies from 'js-cookie';
import './plugins/element.js'
import './icons'

Vue.use(VueSplit);
Vue.use(animate);
Vue.use(VueI18n);
window.moment = moment;
Vue.prototype.moment = moment;
Vue.prototype.moment.locale(window.M3_LANG);
Vue.prototype.eventHub = new Vue();
Vue.config.productionTip = false;


let mods = {global:{}, auth:{}}  // 动态加载模块依赖关系，global 和 auth 为 m3 内部加载的模块
mods.App = {
    f: () => import("./App.vue"),  // 动态加载 App.vue
    deps: [mods.global, mods.auth] // App.vue 运行时依赖 global 和 auth
}
mods.Vue = {
    f: () => Vue,
}

let m3js = process.env.NODE_ENV === 'production'?"@wecise/m3js":"./m3js"
import(`${m3js}/src/index.js`).then((m)=>{
    let m3 = m.default;
    Vue.prototype.m3 = m3;
    window.m3 = m3;
    m3.init(mods, window, "app").then(()=>{
        window.state && window.state("正在加载主题...")
        const themeColor = {dark:'#252D47',light:'#409EFF'};
        const theme = Cookies.get("m3-theme")?themeColor[Cookies.get("m3-theme")]:'#252D47';// dark:#252D47 & blue:#409EFF  default theme is dark
        import(`./assets/theme/element-${theme}/index.css`)
        let completed=()=>{
            if(document.getElementsByClassName("m3").length>0){
                document.getElementById("preload").style.display = "none";
                window.state && window.state("页面渲染完成.");
                window.loaded = true;
            }else{
                setTimeout(completed,0);
            }
        }
        m3.lang().then(res=>{
            window.state && window.state("正在渲染页面...")
            try {
                window.global = m3.global;
                const i18n = new VueI18n({
                    locale: window.M3_LANG,
                    messages: res
                });
                Vue.prototype.$ELEMENT = {
                    size: Cookies.get('size') || 'small',
                    i18n: (key, value) => i18n.t(key, value)
                };
                let App = window.App;
                new Vue({
                    render: h => h(App),
                    mounted: function(){
                        window.state && window.state("正在加载数据...")
                        completed();
                    },
                    i18n,
                }).$mount('#app')
            } catch(e) {
                console.error(e);
            }
        })
    })
}).catch((e)=>{
    console.error(e)
});
