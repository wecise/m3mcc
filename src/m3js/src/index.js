/**
 * Wecise Applet Framework
 * 
 * Requirement: ES6
 * 
 * Copyright (c) 2020, Wecise
 * All rights reserved.
 */

const version = "1.0.0";

import http from "./axios/http"

/**
 * 动态模块加载 import("...") 或 require("...") 只能用字符串做参数，不支持变量，
 * 以 `${variable}/...` 形式使用变量也必须含有部分字符串，否则会加载该所有能找到的模块
 */

// Default global variables
var loading = 0;
var G = window;
var rootDivID = "app";
var auth = {};
var global = {};

/**
 * connect to M3 platform and return sessionid
 */
 let connect = function (param) {
    return new Promise(function(resolve, reject) {
        http.post({
            url: `/user/signin?company=${encodeURIComponent(param.company)}&username=${encodeURIComponent(param.username)}&password=${encodeURIComponent(param.password)}`
        }).then(res=>{
            G.sessionid = res.data.message;
            resolve(res);
        }).catch(err=>{
            reject(err.data);
        })
    })
}

/**
 * auto connect to M3 platform and return sessionid  For development env
 */
let autoConnect = function () {
    return new Promise(function(resolve, reject) {
        if(process.env.NODE_ENV === "development") {
            let param = {company: process.env.VUE_APP_M3_COMPANY, username: process.env.VUE_APP_M3_USERNAME, password: process.env.VUE_APP_M3_PASSWORD }
            connect(param).then(()=>{
                resolve();
            }).catch(err=>{
                reject(err.data);
            })
        } else {
            resolve();
        }
    })
};



/** 
 * Call a serverJS interface for M3 platform
 */
let callFS = function (fileName, param) {
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("input", param);
        fm.append("isfile",true);
        http.post({
            url: `/script/exec/js?filepath=${fileName}`,
            param: fm
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        })
    })
};

/**
 * Call a m3service interface by nats for M3 platform
 */
let callService = function (service, action, params) {
    service = (process.env.NODE_ENV==='production'?"v1.":"dev.")+service
    let input = encodeURIComponent(JSON.stringify({ service: service, action: action, params: params }));
    return callFS("/matrix/nats/action.js", input);
};

/**
 * 当前用户权限 
 */
let authUser = function () {
    return new Promise((resolve, reject) => {
        callFS("/matrix/user/signedUser.js").then(res=>{
            let tmp = { signedUser: res.message, isAdmin: res.message.isadmin };
            G._.extend(G.m3.auth, tmp);
            G.auth = G.m3.auth;
            resolve();
        }).catch(e=>{
            reject(e);
        })
    })
};

/**
 * Get global register info for M3 platform
 */
let globalInfo = function () {
    return new Promise((resolve, reject) => {
        callFS("/matrix/utils/global.js").then(res=>{
            G._.extend(G.m3.global, res.message);
            G.global = G.m3.global;
            resolve()
        }).catch(e=>{
            reject(e);
        })
    })
};

let langInfo = function() {
    return new Promise((resolve, reject) => {
        try{
            let cache = localStorage.getItem("M3-LANG-LIST");
            if (cache) {
                G.m3.langList = JSON.parse(cache)
                resolve();
            } else {
                callFS("/matrix/lang/getLangList.js").then(res=>{
                    localStorage.setItem("M3-LANG-LIST", JSON.stringify(res.message));
                    G.m3.langList = res.message
                    resolve();
                }).catch(e=>{
                    reject(e);
                })
            }
        }catch(e){
            reject(e);
        }
    })
}
/**
 * 通过选项创建 VueI18n 实例
 */
let lang = function() {
    return new Promise((resolve, reject) => {
        resolve(G.m3.langList);
    })
};

/**
 * Set Home for login user
 */
let setAppAsHome = function(vm,item){
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
        fm.append("_csrf", G.getCookie("_csrf"))
        http.post({
            url: `/user/settings/home`,
            param: fm
        }).then(res=>{
            vm.$message({
                type: "info",
                message: "首页已设置为：" + item.url
            });
            resolve(res.data);
        }).catch(err=>{
            vm.$message({
                type: "error",
                message: "首页设置失败：" + err
            });
            reject(err.data);
        })
    })
};

/**
 * Set Home for all user
 */
let setAppAsHomeForAllUser = function(vm,item){
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
        fm.append("_csrf", G.getCookie("_csrf"))
        http.post({
            url: `/admin/users/home`,
            param: fm
        }).then(res=>{
            vm.$message({
                type: "info",
                message: "首页已设置为：" + item.url
            });
            resolve(res.data);
        }).catch(err=>{
            vm.$message({
                type: "error",
                message: "首页设置失败：" + err
            });
            reject(err.data);
        })
    })
};

/**
 * Set Title for M3 platform
 */
let setTitle = function(auth){
    new Promise((resolve,reject)=>{
        try {
            let pathName = window.location.pathname;
            if(G._.isEmpty(pathName)) {
                document.title = auth.Company.title;
                return false;
            }
            callFS("/matrix/system/getAppNameByUrl.js", encodeURIComponent(pathName)).then( res=>{
                let name = res.message;
                if(!G._.isEmpty(name)) {
                    document.title = name['cnname'] || name['enname'];
                } else {
                    document.title = auth.Company.title;
                }
                setTimeout(()=>{
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = auth.Company.icon || auth.Company.logo;
                    resolve();
                },0)
            });
        } catch(err) {
            console.error(err,auth)
            document.title = auth.Company.title;
            reject(err);
        }
    })
};

/**
 * 单位转换
 */
let bytesToSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

/**
 * 全屏控制
 */
let fullScreen = function(mode) {
    if ( mode ) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
};

let fullScreenByEl = function(el) {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        return false;
    } else {
        el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        return true;
    }
}

/**
 * Vue Render
 */
let render = function() {
    return new Promise(function(resolve,reject){
        try {
            new G.Vue({
                render: h => h(G.App),
                mounted: function() {
                    resolve();
                    console.log("Vue mounted.")
                },
            }).$mount('#'+G.rootDivID)
        } catch(e) {
            reject(e)
        }
    })
}

/**
 * Vue Render Completed
 */
let completed = function() {
    document.getElementById("preload").style.display = "none";
}

/**
 * 组件加载并初始化相关数据，必须保证执行顺序，下一级组件或操作依赖上一级输出，同一层次的组件可以同时加载：
 * -> m3（this）
 *    -> js-cookie cookie信息存取
 *    -> http 访问REST API
 *       -> (依赖js-cookie) auth 当前登录用户信息
 *       -> global 全局设置信息
 *       -> lang 语言包所需数据
 *          -> i18n 语言包
 *    -> moment 时间库
 *    -> animate 动画效果
 *    -> icons 图标
 *    -> vue vue支持
 *       -> elementui 常用UI组件
 *          -> theme 可切换主题皮肤CSS
 *       -> vue-split 分割栏
 * -> (依赖auth, global) App.vue 应用组件 
 *    -> m3.render() 开始render页面 
 *       -> 其他应用组件由应用自行控制 
 *          ->m3.completed() render完成
 */

var mods = {Vue:{}, App:{}}
mods.lodash = {
    f: () => import("lodash"),
    keys: {_:""} // 全模块映射为指定变量
}
mods.Cookies = {
    f: () => import("js-cookie"),
}
mods.getCookie = {
    f: () => import("./utils/cookie"),
}
mods.autoConnect = {
    f: autoConnect,
    deps: [mods.Cookies],
}
mods.auth = {
    f: authUser,
    deps: [mods.autoConnect, mods.lodash],
}
mods.global = {
    f: globalInfo,
    deps: [mods.autoConnect, mods.lodash],
}
mods.lang = {
    f: langInfo,
    deps: [mods.autoConnect, mods.lodash],
}
// mods.render = {
//     f: render,
//     deps: [mods.Vue, mods.App, mods.getCookie],
// }
// mods.completed = {
//     f: completed,
//     deps: [mods.render],
// }
mods.completed = {
    f: () => {},
    deps: [mods.Vue, mods.App, mods.getCookie],
}

/**
 * 合并Mods
 */
let combinMods = function(nms) {
    for(var nk in nms) {
        var nm = nms[nk]
        if (nm) {
            nm.ID = nk
        }
    }
    for(var mk in mods) {
        var mm = mods[mk]
        if (mm) {
            mm.ID = mk
        }
    }
    for(var k in nms) {
        var m = nms[k]
        if (m) {
            if(m.deps) {
                for(var di=0; di<m.deps.length; di++) {
                    m.deps[di] = mods[m.deps[di].ID]
                }
            }
            if(!mods[k]) {
                mods[k] = m
            } else {
                for(var tk in m) {
                    mods[k][tk] = m[tk]
                }
            }
        }
    }
}

/**
 * 按 mods 的设定加载组件或执行初始化操作
 */
let loadCompos = function() {
    let mcfOk = function(id, mc, m, st, resolve, reject) {
        try {
            if(m){
                if(mc.keys) {
                    for(var kk in mc.keys){
                        var mk = mc.keys[kk]
                        if(mk==""){
                            G[kk] = m
                        } else if(mk){
                            G[kk] = m[mk]
                        } else {
                            G[kk] = m[kk];
                        }
                    }
                } else if(m.default) {
                    G[id] = m.default;
                } else if(m[id]) {
                    G[id] = m[id];
                } else {
                    G[id] = m;
                }
            }
            mc.loaded = true;
            loading--;
            console.debug("[M3L]","loading="+loading,", id="+id,", m=",m,", ut="+(Date.now()-st))
            if(mc.next) {
                for(var nk in mc.next){
                    mcfCall(nk, mc.next[nk], resolve, reject);
                }
            }
            if(loading == 0) {
                resolve();
            }
        } catch(e) {
            reject(e)
            console.error(e)
        }
    }
    /**
     * 检查所有依赖条件，全部准备好后，执行操作
     */
    let mcfCall = function(id, mc, resolve, reject) {
        try{
            var ready=true;
            if(mc.f && mc.deps){
                for(var i=0;i<mc.deps.length;i++){
                    if(!(mc.deps[i] && mc.deps[i].loaded)){
                        ready=false;
                        return
                    }
                }
            }
            if(ready && mc.f) {
                let st = Date.now()
                let r = mc.f()
                if(r && r.then && r.catch) {
                    r.then((m)=>{
                        mcfOk(id, mc, m, st, resolve, reject)
                    }).catch((e)=>{
                        reject(e)
                        console.error(id, mc, e)
                    })
                } else {
                    mcfOk(id, mc, r, st, resolve, reject)
                }
            }
        } catch(e) {
            reject(e)
            console.error(e)
        }
    }
    return new Promise(function(resolve, reject){
        try{
            loading = Object.keys(mods).length
            for(var k in mods) {
                var mc = mods[k]
                if(mc){
                    if(mc.deps){
                        for(var i=0;i<mc.deps.length;i++){
                            if(mc.deps[i] && !mc.deps[i].loaded){
                                if(!mc.deps[i].next){
                                    mc.deps[i].next = {}
                                }
                                mc.deps[i].next[k] = mc
                            }
                        }
                    }
                    mcfCall(k, mc, resolve, reject)
                } else {
                    loading--
                }
            }
            if(loading == 0) {
                resolve();
            }
        }catch(e){
            reject(e)
            console.error(e)
        }
    })
}

/*
 * 组件加载并初始化相关数据，必须保证执行顺序，下一级组件或操作依赖上一级输出，同一层次的组件可以同时加载：
 * -> m3（this）
 *    -> js-cookie cookie信息存取
 *    -> http 访问REST API
 *       -> (依赖js-cookie) auth 当前登录用户信息
 *       -> global 全局设置信息
 *       -> lang 语言包所需数据
 *          -> i18n 语言包
 *    -> moment 时间库
 *    -> animate 动画效果
 *    -> icons 图标
 *    -> vue vue支持
 *       -> elementui 常用UI组件
 *          -> theme 可切换主题皮肤CSS
 *       -> vue-split 分割栏
 *       -> (依赖auth, global) App.vue 应用组件 
 *          -> m3.render() 开始render页面 
 *              -> 其他应用组件由应用自行控制 
 */
let init = function(m,g,r) {
    G = g?g:G;
    G.rootDivID = r||rootDivID;
    G.m3 = this;
    return new Promise((resolve, reject) => {
        try {
            combinMods(m);
            loadCompos().then(()=>{
                resolve();
            }).catch((e)=>{
                reject(e)
                console.error(e)
            });
        } catch(e) {
            reject(e)
            console.error(e)
        }
    })
}

let exports = {}

exports.version = version;
exports.init = init;
exports.connect = connect;
exports.callFS = callFS;
exports.callService = callService;
exports.lang = lang;
exports.auth = auth;
exports.global = global;
exports.setTitle = setTitle;
exports.setAppAsHome = setAppAsHome;
exports.setAppAsHomeForAllUser = setAppAsHomeForAllUser;
exports.fullScreen = fullScreen;
exports.fullScreenByEl = fullScreenByEl;
const theme = require("./global/theme.js");
exports.EDITOR_THEME = theme.EDITOR_THEME;
  
/* omdb */
const omdb = require('./omdb/index.js');
exports.getClassFieldsById = omdb.getClassFieldsById;


/* job */
const job = require('./job/index.js');
exports.jobNew = job.userList;

/* user */
const user = require('./user/index.js');
exports.userList = user.userList;

/* dfs */
const dfs = require('./dfs/index.js');
exports.dfsList = dfs.dfsList;
exports.dfsWrite = dfs.dfsWrite;
exports.dfsRead = dfs.dfsRead;
exports.dfsNew = dfs.dfsNew;
exports.dfsDelete = dfs.dfsDelete;
exports.dfsRename = dfs.dfsRename;
exports.dfsUpdateAttr = dfs.dfsUpdateAttr;
exports.dfsRefresh = dfs.dfsRefresh;
exports.dfsMove = dfs.dfsMove;
exports.dfsSyncToLocal = dfs.dfsSyncToLocal;
exports.dfsUnZip = dfs.dfsUnZip;
exports.dfsZip = dfs.dfsZip;

/* app */
const app = require('./app/index.js');
exports.appDeploy = app.appDeploy;

/* rule */
const rule = require('./rule/index.js');
exports.ruleGet = rule.ruleGet;
exports.ruleAdd = rule.ruleAdd;
exports.ruleUpdate = rule.ruleUpdate;
exports.ruleDelete = rule.ruleDelete;
exports.ruleExport = rule.ruleExport;

/* policy */
const policy = require('./policy/index.js');
exports.policyDeploy = policy.policyDeploy;
exports.policyUndeploy = policy.policyUndeploy;

/* console log */
const consolelog = require('./consolelog/index.js');
exports.consolelogTrace = consolelog.consolelogTrace;
exports.consolelogDelete = consolelog.consolelogDelete;
exports.consolelogTruncate = consolelog.consolelogTruncate;

/* trigger */
const trigger = require('./trigger/index.js');
exports.triggerList = trigger.triggerList;
exports.triggerNew = trigger.triggerNew;
exports.triggerDelete = trigger.triggerDelete;

const event = require("./global/event.js");
exports.EventViewDataObj = event.EventViewDataObj;
exports.EventViewTools = event.EventViewTools;

/* utils */
exports.bytesToSize = bytesToSize;
exports.jsFormat = require("./utils/jsFormat.js");
exports.htmlFormat = require("./utils/htmlFormat.js");

const adjustColor = function(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};
exports.adjustColor = adjustColor;

const cookie = require("./utils/cookie.js");
exports.getCookie = cookie.getCookie;

export default exports
