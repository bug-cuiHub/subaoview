import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import title from '@/assets/title.json'

//=================phone==============
// 经济信息
import economicinfo from '@/components/phone/economicinfo'
// 环境信息
import environmeninfo from '@/components/phone/environmeninfo'
// 附近断裂带
import nearfz from '@/components/phone/nearfz'
// 人口信息
import populationinfo from '@/components/phone/populationinfo'
// 地震信息
import seismicinfo from '@/components/phone/seismicinfo'
// 三维地形图
import thd from '@/components/phone/thd'
// 天气信息
import weatherinfo from '@/components/phone/weatherinfo'
// 手机端发布页面
import indexphone from '@/components/indexphone.vue'
//Phone盒子
import home from '@/components/phone/home'

//=================web=================
// 登录页面
import login from '@/components/login.vue'
// web发布页面
import index from '@/components/index.vue'
// 手机推送二维码
import qrcode from '@/components/web/qrcode.vue'
//全球历史地震
import worldEq from '@/components/web/worldEq'
//数据可视化
import dashboard from '@/components/web/dashboard.vue'
//Web盒子
import webHome from '@/components/web/webHome.vue'
// 天气信息
import cweatherinfo from '@/components/web/cweatherinfo'
// 人口信息
import cpopulationinfo from '@/components/web/cpopulationinfo'
// 环境信息
import cenvironmeninfo from '@/components/web/cenvironmeninfo'
// 经济信息
import ceconomicinfo from '@/components/web/ceconomicinfo'
// 数据管理页面
import datamanage from '@/components/web/datamanage'
//=================error==============
//未发布数据页面
import error from '@/components/pubcomponent/error'

// import hislist from '@/components/pubcomponent/hisEarthList'

import {
    resolve
} from 'path';
Vue.use(Router)


const router = new Router({
    //这是个大危害，开启后无法获取eqid
    // mode: 'history',
    //不要用路由懒加载
    base: process.env.BASE_URL,
    routes: [
        {
            name: 'login',
            path: '/login',
            component: login
        },
        {
            name: 'index',
            path: '/index',
            component: index
        },
        // {
        //   name: 'hisList',
        //   path: '/hislist',
        //   component: hislist
        // },
        {
            name: 'indexphone',
            path: '/indexphone',
            component: indexphone
        },
        {
            name: 'qrcode',
            path: 'qrcode',
            component: qrcode
        },
        {
            name: 'webHome',
            path: '/webHome/:eqid',
            component: webHome,
            children: [{
                    name: 'default',
                    path: '',
                    // redirect:'cseismicinfo',
                    component: thd
                },
                {
                    name: 'cseismicinfo',
                    path: 'cseismicinfo',
                    component: seismicinfo
                },
                {
                    name: 'ceconomicinfo',
                    path: 'ceconomicinfo',
                    component: ceconomicinfo
                },
                {
                    name: 'cweatherinfo',
                    path: 'cweatherinfo',
                    component: cweatherinfo
                },
                {
                    name: 'cenvironmeninfo',
                    path: 'cenvironmeninfo',
                    component: cenvironmeninfo
                },
                {
                    name: 'cpopulationinfo',
                    path: 'cpopulationinfo',
                    component: cpopulationinfo
                },
                {
                    name: 'dashboard',
                    path: 'dashboard',
                    component: dashboard
                },
                {
                    name: 'cthd',
                    path: 'cthd',
                    component: thd
                },
                {
                    name: 'worldEq',
                    path: 'worldEq',
                    component: worldEq
                },
                {
                    name: 'datamanage',
                    path: 'datamanage',
                    component: datamanage
                },
            ]
        },
        {
            name: 'home',
            path: '/home/:eqid',
            component: home,
            children: [{
                    name: 'default',
                    path: '',
                    redirect: 'seismicinfo',
                    component: seismicinfo
                },
                {
                    name: 'seismicinfo',
                    path: 'seismicinfo',
                    component: seismicinfo,
                    orname: '地震信息'
                },
                {
                    name: 'thd',
                    path: 'thd',
                    component: thd
                },
                {
                    name: 'weatherinfo',
                    path: 'weatherinfo',
                    component: weatherinfo
                },
                {
                    name: 'populationinfo',
                    path: 'populationinfo',
                    component: populationinfo
                },
                {
                    name: 'economicinfo',
                    path: 'economicinfo',
                    component: economicinfo
                },
                {
                    name: 'environmeninfo',
                    path: 'environmeninfo',
                    component: environmeninfo
                },
                {
                    name: 'nearfz',
                    path: 'nearfz',
                    component: nearfz
                }
            ]
        },
        {
            name: 'error',
            path: '*',
            component: error
        },
    ]
});

router.beforeEach((to, from, next) => {
    var name = title[to.name];
    store.commit('seteqhead', name);
    next();
});

export default router;