import { router } from '../router'
import { config, adapter, render, pm2, redis, setConfig } from '@/utils/config'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'
import type { GroupsObjectValue, PrivatesObjectValue } from '@/types/config'

/**
 * 保存配置文件
 */
const setFileRouter: RequestHandler = async (req, res) => {
  const { type, data } = req.body

  if (!data || typeof data !== 'object') {
    res.status(400).json({ error: '无效的配置数据' })
    return
  }

  try {
    switch (type) {
      case 'config': {
        const cfg = config()
        setConfig('config', { ...cfg, ...data })
        break
      }
      case 'adapter': {
        const cfg = adapter()
        setConfig('adapter', { ...cfg, ...data })
        break
      }
      case 'render': {
        const cfg = render()
        setConfig('render', { ...cfg, ...data })
        break
      }
      case 'pm2': {
        const cfg = pm2()
        setConfig('pm2', { ...cfg, ...data })
        break
      }
      case 'redis': {
        const cfg = redis()
        setConfig('redis', { ...cfg, ...data })
        break
      }
      case 'env': {
        setConfig('env', data)
        break
      }
      case 'groups': {
        if (!Array.isArray(data.groups) || !data.groups.every((item: unknown) => typeof item === 'object')) {
          createServerErrorResponse(res, 'groups 数据格式错误')
          return
        }

        /** cd、userCD 需要转换为数字 */
        const newData = data.groups.map((item: GroupsObjectValue) => {
          const cd = Number(item.cd)
          const userCD = Number(item.userCD)
          return {
            ...item,
            cd: isNaN(cd) ? 0 : cd,
            userCD: isNaN(userCD) ? 0 : userCD,
          }
        })

        setConfig('groups', newData)
        break
      }
      case 'privates': {
        if (!Array.isArray(data.privates) || !data.privates.every((item: unknown) => typeof item === 'object')) {
          createServerErrorResponse(res, 'privates 数据格式错误')
          return
        }

        /** cd 需要转换为数字 */
        const newData = data.privates.map((item: PrivatesObjectValue) => {
          const cd = Number(item.cd)
          return {
            ...item,
            cd: isNaN(cd) ? 0 : cd,
          }
        })

        setConfig('privates', newData)
        break
      }
      default: {
        res.status(400).json({ error: '不支持的配置类型' })
        return
      }
    }

    createSuccessResponse(res, { message: '配置保存成功' })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
  }
}

router.post('/config/set', setFileRouter)
