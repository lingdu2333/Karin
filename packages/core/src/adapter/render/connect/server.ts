import { WebSocketRender } from './ws'
import { render } from '@/utils/config/file/render'
import { listeners } from '@/core/internal'
import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

/**
 * @description WebSocket服务端渲染
 * @class WebSocketServerRenderer
 */
export class WebSocketServerRenderer extends WebSocketRender {
  /** 请求实例 */
  public request: IncomingMessage
  constructor (socket: WebSocket, request: IncomingMessage) {
    super(socket)
    this.request = request
  }

  connection () {
    const cfg = render()
    if (!cfg.ws_server.enable) {
      logger.warn('[WebSocket] 反向ws未启用')
      this.socket.close()
      return false
    }

    const url = `ws://${this.request.headers.host}${this.request.url}`

    if (process.env.WS_SERVER_AUTH_KEY) {
      const token = this.request.headers['authorization']
      if (!token || !this.auth(process.env.WS_SERVER_AUTH_KEY, token)) {
        logger.error(`[WebSocket] 鉴权失败: authorization: ${token} url: ${url}`)
        this.socket.close()
        return false
      }
    }

    logger.info(`[WebSocket] 连接成功: url: ${url}`)
    return true
  }
}

listeners.on('ws:connection:puppeteer', (socket: WebSocket, request: IncomingMessage) => {
  const server = new WebSocketServerRenderer(socket, request)
  if (!server.connection()) return

  server.init()
})
