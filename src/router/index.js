import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout 布局 */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'operationManagement'
  }]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 根据用户选择动态的加载路由 如果需要设置权限,在meta中写roles: ['admin'] 只有admin的权限才可以访问
 * 如果不需要权限的话meta中的roles参数可以不写
 */
export const asyncRoutes = [
  {
    path: '/operationManagement',
    component: Layout,
    redirect: '/operationManagement/operationOverview', // 路由重定向  避免在地址栏输入 @/permission 的时候出现空页面
    alwaysShow: true, // will always show the root menu
    name: 'OperationManagement',
    meta: {
      title: 'operationManagement',
      icon: 'lock'
      // you can set roles in root nav
    },
    children: [
      {
        path: 'operationOverview',
        component: () => import('@/views/operationManagement/operationOverview'),
        name: 'OperationOverview',
        meta: {
          title: 'operationManagementList.operationOverview'
        }
      },
      {
        path: 'operationState',
        component: () => import('@/views/operationManagement/operationState'),
        name: 'OperationState',
        meta: {
          title: 'operationManagementList.operationState'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'operationRecord',
        component: () => import('@/views/operationManagement/operationRecord'),
        name: 'OperationRecord',
        meta: {
          title: 'operationManagementList.operationRecord'
        }
      },
      {
        path: 'gunStatistics',
        component: () => import('@/views/operationManagement/gunStatistics'),
        name: 'GunStatistics',
        meta: {
          title: 'operationManagementList.gunStatistics'
        }
      },
      {
        path: 'carsStatistics',
        component: () => import('@/views/operationManagement/carsStatistics'),
        name: 'CarsStatistics',
        meta: {
          title: 'operationManagementList.carsStatistics'
        }
      }
    ]
  },
  {
    path: '/fileManagement',
    component: Layout,
    redirect: '/fileManagement/personnelFiles',
    name: 'FileManagement',
    meta: {
      title: 'fileManagement',
      icon: 'example'
    },
    children: [
      {
        path: 'personnelFiles',
        component: () => import('@/views/fileManagement/personnelFiles'),
        name: 'PersonnelFiles',
        meta: { title: 'fileManagementList.personnelFiles', icon: 'edit' }
      },
      {
        path: 'gunFiles',
        component: () => import('@/views/fileManagement/gunFiles'),
        name: 'GunFiles',
        meta: { title: 'fileManagementList.gunFiles', icon: 'edit' }
      },
      {
        path: 'carsFiles',
        component: () => import('@/views/fileManagement/carsFiles'),
        name: 'CarsFiles',
        meta: { title: 'fileManagementList.carsFiles', icon: 'edit' }
      },
      {
        path: 'groupAdministration',
        component: () => import('@/views/fileManagement/groupAdministration'),
        name: 'GroupAdministration',
        meta: { title: 'fileManagementList.groupAdministration', icon: 'edit' }
      },
      {
        path: 'roadLineAdministration',
        component: () => import('@/views/fileManagement/roadLineAdministration'),
        name: 'RoadLineAdministration',
        meta: { title: 'fileManagementList.roadLineAdministration', icon: 'edit' }
      },
      {
        path: 'ranksAdministration',
        component: () => import('@/views/fileManagement/ranksAdministration'),
        name: 'RanksAdministration',
        meta: { title: 'fileManagementList.ranksAdministration', icon: 'edit' }
      }
    ]
  },
  {
    path: '/alarmCenter',
    component: Layout,
    redirect: '/alarmCenter/alarmSettings',
    name: 'AlarmCenter',
    meta: {
      title: 'alarmCenter',
      icon: 'edit',
      noCache: true
    },
    //  affix  选项  是否固定在导航栏 noCache: true  不会被 <keep-alive> 缓存
    //     meta: { title: 'dashboardList.prisonArea1', icon: 'monitor', noCache: true, affix: true },
    children: [
      {
        path: 'alarmSettings',
        component: () => import('@/views/alarmCenter/alarmSettings/index'), // Parent router-view
        name: 'AlarmSettings',
        meta: { title: 'alarmCenterList.alarmSettings' }
      },
      {
        path: 'alarmRecord',
        component: () => import('@/views/alarmCenter/alarmRecord/index'), // Parent router-view
        name: 'AlarmRecord',
        meta: { title: 'alarmCenterList.alarmRecord' },
        redirect: '/alarmCenter/alarmRecord/demolitionAlarm',
        children: [
          {
            path: 'demolitionAlarm',
            component: () => import('@/views/alarmCenter/alarmRecord/demolitionAlarm/index'),
            name: 'DemolitionAlarm',
            meta: { noCache: true, title: 'alarmRecordList.demolitionAlarm' }
          },
          {
            path: 'personnelAlarm',
            component: () => import('@/views/alarmCenter/alarmRecord/personnelAlarm/index'),
            name: 'PersonnelAlarm',
            meta: { noCache: true, title: 'alarmRecordList.personnelAlarm' }
          },
          {
            path: 'powerAlarm',
            component: () => import('@/views/alarmCenter/alarmRecord/powerAlarm/index'),
            name: 'PowerAlarm',
            meta: { noCache: true, title: 'alarmRecordList.powerAlarm' }
          },
          {
            path: 'carDepartureAlarm',
            component: () => import('@/views/alarmCenter/alarmRecord/carDepartureAlarm/index'),
            name: 'CarDepartureAlarm',
            meta: { noCache: true, title: 'alarmRecordList.carDepartureAlarm' }
          },
          {
            path: 'gunDeviationAlarm',
            component: () => import('@/views/alarmCenter/alarmRecord/gunDeviationAlarm/index'),
            name: 'GunDeviationAlarm',
            meta: { noCache: true, title: 'alarmRecordList.gunDeviationAlarm' }
          },
          {
            path: 'speedAlarm',
            component: () => import('@/views/alarmCenter/alarmRecord/speedAlarm/index'),
            name: 'SpeedAlarm',
            meta: { noCache: true, title: 'alarmRecordList.speedAlarm' }
          }
        ]
      },
      {
        path: 'alarmStatistics',
        component: () => import('@/views/alarmCenter/alarmStatistics/index'), // Parent router-view
        name: 'AlarmStatistics',
        meta: { title: 'alarmCenterList.alarmStatistics' },
        redirect: '/alarmCenter/alarmStatistics/statisticsOfAlarmTypes',
        children: [
          {
            path: 'statisticsOfAlarmTypes',
            component: () => import('@/views/alarmCenter/alarmStatistics/statisticsOfAlarmTypes/index'),
            name: 'StatisticsOfAlarmTypes',
            meta: { noCache: true, title: 'alarmStatistics.statisticsOfAlarmTypes' }
          },
          {
            path: 'gunAlarmStatistics',
            component: () => import('@/views/alarmCenter/alarmStatistics/gunAlarmStatistics/index'),
            name: 'GunAlarmStatistics',
            meta: { noCache: true, title: 'alarmStatistics.gunAlarmStatistics' }
          },
          {
            path: 'groupAlarmStatistics',
            component: () => import('@/views/alarmCenter/alarmStatistics/groupAlarmStatistics/index'),
            name: 'GroupAlarmStatistics',
            meta: { noCache: true, title: 'alarmStatistics.groupAlarmStatistics' }
          },
          {
            path: 'tanksAlarmStatistics',
            component: () => import('@/views/alarmCenter/alarmStatistics/tanksAlarmStatistics/index'),
            name: 'TanksAlarmStatistics',
            meta: { noCache: true, title: 'alarmStatistics.tanksAlarmStatistics' }
          },
        ]
      }
    ]
  },
  {
    path: '/userManagement',
    component: Layout,
    name: 'UserManagement',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/userManagement/index'),
        meta: { title: 'userManagement', icon: 'edit', noCache: true }
      }
    ]
  },
  {
    path: '/commonProblem',
    component: Layout,
    name: 'CommonProblem',
    children: [
      {
        path: 'index',
        component: () => import('@/views/commonProblem/index'),
        meta: { title: 'commonProblem', icon: 'edit', noCache: true }
      }
    ]
  },
  {
    path: '/videoDemo',
    component: Layout,
    name: 'VideoDemo',
    children: [
      {
        path: 'index',
        component: () => import('@/views/videoDemo/index'),
        meta: { title: '视频demo', icon: 'edit', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
