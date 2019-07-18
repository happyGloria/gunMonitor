import Vue from 'vue'
import store from './store/index'
import Router from 'vue-router'

Vue.use(Router)


let router = new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: () => import( /* webpackChunkName: "index" */ './views/index.vue'),
      redirect: '/realTimeMonitoring',
      children: [{
          path: 'realTimeMonitoring',
          name: 'realTimeMonitoring',
          // route level code-splitting
          // this generates a separate chunk (video.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import( /* webpackChunkName: "realTimeMonitoring" */ './views/realTimeMonitoring/index.vue'),
        },
        {
          path: 'operationalStatus',
          name: 'operationalStatus',
          component: () => import( /* webpackChunkName: "operationalStatus" */ './views/operationManagement/operationalStatus/index.vue')
        },
        {
          path: 'operationalRecords',
          name: 'operationalRecords',
          component: () => import( /* webpackChunkName: "operationalRecords" */ './views/operationManagement/operationalRecords/index.vue')
        },
        {
          path: 'gunStatistics',
          name: 'gunStatistics',
          component: () => import( /* webpackChunkName: "gunStatistics" */ './views/operationManagement/gunStatistics/index.vue')
        },
        {
          path: 'vehicleStatistics',
          name: 'vehicleStatistics',
          component: () => import( /* webpackChunkName: "vehicleStatistics" */ './views/operationManagement/vehicleStatistics/index.vue')
        },
        {
          path: 'historicalPlayback',
          name: 'historicalPlayback',
          component: () => import( /* webpackChunkName: "historicalPlayback" */ './views/historicalPlayback/index.vue')
        },
        {
          path: 'personnelFiles',
          name: 'personnelFiles',
          component: () => import( /* webpackChunkName: "personnelFiles" */ './views/managementArchives/personnelFiles/index.vue')
        },
        {
          path: 'gunFiles',
          name: 'gunFiles',
          component: () => import( /* webpackChunkName: "gunFiles" */ './views/managementArchives/gunFiles/index.vue')
        },
        {
          path: 'vehicleArchives',
          name: 'vehicleArchives',
          component: () => import( /* webpackChunkName: "vehicleArchives" */ './views/managementArchives/vehicleArchives/index.vue')
        },
        {
          path: 'unitManagement',
          name: 'unitManagement',
          component: () => import( /* webpackChunkName: "unitManagement" */ './views/managementArchives/unitManagement/index.vue')
        },
        {
          path: 'routeManagement',
          name: 'routeManagement',
          component: () => import( /* webpackChunkName: "routeManagement" */ './views/managementArchives/routeManagement/index.vue'),
        },
        {
          path: 'routeAndNetwork',
          name: 'routeAndNetwork',
          component: () => import( /* webpackChunkName: "routeManagement" */ './views/managementArchives/routeManagement/routeAndNetwork.vue')

        },
        {
          path: 'historyRoute',
          name: 'historyRoute',
          component: () => import( /* webpackChunkName: "routeManagement" */ './views/managementArchives/routeManagement/historyRoute.vue')

        },
        {
          path: 'checkRoute',
          name: 'checkRoute',
          component: () => import( /* webpackChunkName: "routeManagement" */ './views/managementArchives/routeManagement/checkRoute.vue')

        },
        {
          path: 'editRoute',
          name: 'editRoute',
          component: () => import( /* webpackChunkName: "routeManagement" */ './views/managementArchives/routeManagement/editRoute.vue')

        },
        {
          path: 'networkManagement',
          name: 'networkManagement',
          component: () => import( /* webpackChunkName: "networkManagement" */ './views/managementArchives/networkManagement/index.vue')
        },
        {
          path: 'networkAdd',
          name: 'networkAdd',
          component: () => import( /* webpackChunkName: "networkManagement" */ './views/managementArchives/networkManagement/networkAdd.vue')
        },
        {
          path: 'brigadeManagement',
          name: 'brigadeManagement',
          component: () => import( /* webpackChunkName: "brigadeManagement" */ './views/managementArchives/brigadeManagement/index.vue')
        },
        {
          path: 'alarmSettings',
          name: 'alarmSettings',
          component: () => import( /* webpackChunkName: "alarmSettings" */ './views/alarmCenter/alarmSettings/index.vue')
        },
        {
          path: 'demolitionAlarm',
          name: 'demolitionAlarm',
          component: () => import( /* webpackChunkName: "demolitionAlarm" */ './views/alarmCenter/alarmRecord/demolitionAlarm/index.vue')
        },
        {
          path: 'personnelAlarm',
          name: 'personnelAlarm',
          component: () => import( /* webpackChunkName: "personnelAlarm" */ './views/alarmCenter/alarmRecord/personnelAlarm/index.vue')
        },
        {
          path: 'electricityAlarm',
          name: 'electricityAlarm',
          component: () => import( /* webpackChunkName: "electricityAlarm" */ './views/alarmCenter/alarmRecord/electricityAlarm/index.vue')
        },
        {
          path: 'vehicleOffsetAlarm',
          name: 'vehicleOffsetAlarm',
          component: () => import( /* webpackChunkName: "vehicleOffsetAlarm" */ './views/alarmCenter/alarmRecord/vehicleOffsetAlarm/index.vue')
        },
        {
          path: 'gunOffsetAlarm',
          name: 'gunOffsetAlarm',
          component: () => import( /* webpackChunkName: "gunOffsetAlarm" */ './views/alarmCenter/alarmRecord/gunOffsetAlarm/index.vue')
        },
        {
          path: 'speedAlarm',
          name: 'speedAlarm',
          component: () => import( /* webpackChunkName: "speedAlarm" */ './views/alarmCenter/alarmRecord/speedAlarm/index.vue')
        },
        {
          path: 'statisticsOfAlarmTypes',
          name: 'statisticsOfAlarmTypes',
          component: () => import( /* webpackChunkName: "statisticsOfAlarmTypes" */ './views/alarmCenter/alarmStatistics/statisticsOfAlarmTypes/index.vue')
        },
        {
          path: 'firearmsAlarmStatistics',
          name: 'firearmsAlarmStatistics',
          component: () => import( /* webpackChunkName: "firearmsAlarmStatistics" */ './views/alarmCenter/alarmStatistics/firearmsAlarmStatistics/index.vue')
        },
        {
          path: 'alarmStatisticsOfTrainGroup',
          name: 'alarmStatisticsOfTrainGroup',
          component: () => import( /* webpackChunkName: "alarmStatisticsOfTrainGroup" */ './views/alarmCenter/alarmStatistics/alarmStatisticsOfTrainGroup/index.vue')
        },
        //--------------------------------分割线-----------------------------------------------------
        {
          path: 'brigadeAlarmStatistics',
          name: 'brigadeAlarmStatistics',
          component: () => import( /* webpackChunkName: "brigadeAlarmStatistics" */ './views/alarmCenter/alarmStatistics/brigadeAlarmStatistics/index.vue')
        },
        {
          path: '/userManagement',
          name: 'userManagement',
          component: () => import( /* webpackChunkName: "userManagement" */ './views/userManagement/index.vue'),
        },
        {
          path: '/commonProblem',
          name: 'commonProblem',
          component: () => import( /* webpackChunkName: "commonProblem" */ './views/commonProblem/index.vue'),
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import( /* webpackChunkName: "login" */ './views/login/index.vue'),
      meta: {
        notNeedToken: true
      }
    },
    {
      path: '/404',
      name: '404',
      component: () => import( /* webpackChunkName: "404" */ './views/error-page/404.vue'),
      meta: {
        notNeedToken: true
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
router.beforeEach(async (to, from, next) => {

  // console.log(router.meta.notNeedToken);

  if (to.matched.some(record => record.meta.notNeedToken)) { // 不需要进行token验证的页面
    next()
  } else {
    const token = store.getters.token
    if (token == '') {
      next(
        //   {
        //   path: '/login'
        // }
      )
    } else {
      next()
    }
  }
})
export default router