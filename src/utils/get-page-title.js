import defaultSettings from '@/settings'
import i18n from '@/lang'

const title = defaultSettings.title || '北斗通信智能人员管理系统'

export default function getPageTitle(key) {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
