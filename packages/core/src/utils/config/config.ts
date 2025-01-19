import fs from 'node:fs'
import * as root from '@/root'
import { lint } from './tools'
import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { randomStr } from '../fs/data'
import { defaultConfig } from './default'
import { requireFile, requireFileSync } from '../fs/require'

import type { Config, Env, FileListMap, Package, PM2, Redis } from '@/types/config'
import { setEnv } from './env'

const FILE = `${configPath}/config.json`
let cache = await lint<Config>(defaultConfig.config, await requireFile(FILE))

export const config = () => cache

/** http端口 */
export const port = (): number => Number(process.env.HTTP_PORT) || 7777
/** host */
export const host = (): string => process.env.HTTP_HOST || '127.0.0.1'
/** 主人列表 */
export const master = (): string[] => config().master
/** 管理员列表 */
export const admin = (): string[] => config().admin
/** redis配置 */
export const redis = () => requireFileSync<Redis>(`${configPath}/redis.json`, { ex: 30 })
/** pm2配置 */
export const pm2 = () => requireFileSync<PM2>(`${configPath}/pm2.json`, { ex: 30 })
/** env配置 */
export const env = () => requireFileSync<Env>(`${process.cwd()}/.env`, { ex: 30 })
/** ffmpeg路径 */
export const ffmpegPath = () => process.env.FFMPEG_PATH
/** ffprobe路径 */
export const ffprobePath = () => process.env.FFPROBE_PATH
/** ffplay路径 */
export const ffplayPath = () => process.env.FFPLAY_PATH

/** 鉴权秘钥 */
export const authKey = () => {
  const key = process.env.HTTP_AUTH_KEY
  /** 如果是默认 则生成随机秘钥 */
  if (!key || key === 'default') {
    const value = randomStr()
    process.env.HTTP_AUTH_KEY = value
    logger.warn(`HTTP鉴权秘钥为默认 使用随机秘钥: ${value}`)
    return value
  }

  return key
}

/** node-karin的package */
export const pkg = () => requireFileSync<Package>(root.karinDir + '/package.json')

/**
 * 获取配置yaml
 * @param name 文件名称
 * @param type 文件类型 用户配置/默认配置
 * @param isRefresh 是否刷新缓存
 */
export const getYaml = <T extends keyof FileListMap> (
  name: T,
  type: 'user' | 'default',
  isRefresh?: boolean,
): FileListMap[T] => {
  const file = `${type === 'user' ? root.configPath : root.defaultConfigPath}/${name}.json`
  if (!fs.existsSync(file)) {
    throw new TypeError(`${file} 文件不存在`)
  }

  return requireFileSync(file, { force: isRefresh })
}

/**
 * @description 修改框架配置
 * @param name 文件名称
 * @param data 配置数据
 */
export const setYaml = <T extends keyof FileListMap> (name: T, data: Record<string, any>) => {
  if (name === 'env') return setEnv(data)
  const file = `${root.configPath}/${name}.json`
  if (!fs.existsSync(file)) return false

  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  return true
}

/**
 * @description 修改框架配置
 * @param name 文件名称
 * @param data 配置数据
 */
export const setConfig = <T extends keyof FileListMap> (name: T, data: FileListMap[T]) => {
  return setYaml(name, data)
}

/**
 *
 */

// /** 每次启动清空临时文件夹 */
// export const clearTemp = () => {
//   const list = [root.htmlPath, root.consolePath]
//   list.forEach(file => {
//     /** console html例外 */
//     if (file === root.consolePath || file === root.htmlPath) return
//     if (fs.existsSync(file)) {
//       fs.rmSync(file, { recursive: true, force: true })
//     }
//   })
// }

/**
 * 更新日志等级
 * @param level 日志等级
 * @returns 返回更新后的日志等级
 */
export const updateLevel = (level?: string): string => {
  if (level) {
    logger.level = level
    return level
  }

  const newLevel = process.env.LOG_LEVEL || 'info'
  logger.level = newLevel
  return newLevel
}

watch<Config>(FILE, async (_, data) => {
  cache = await lint<Config>(defaultConfig.config, data)
})
