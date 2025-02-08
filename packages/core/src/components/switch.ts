import { Component } from './base'
import { ComponentType } from '@/types/components'
import type { SwitchProps } from '@/types/components'

class Switch extends Component<SwitchProps> {
  _config: SwitchProps = { key: '', componentType: ComponentType.SWITCH }

  constructor (key: string) {
    super(ComponentType.SWITCH)
    this._config.key = key
  }

  /**
   * 设置开始文本
   * @param text 开始文本
   */
  startText = (text: string) => {
    this._config.startText = text
    return this
  }

  /**
   * 设置结束文本
   * @param text 结束文本
   */
  endText = (text: string) => {
    this._config.endText = text
    return this
  }

  /**
   * 设置大小
   * @param size 大小
   */
  size = (size: 'sm' | 'md' | 'lg') => {
    this._config.size = size
    return this
  }

  /**
   * 设置颜色
   * @param color 颜色
   */
  color = (color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger') => {
    this._config.color = color
    return this
  }

  /**
   * 设置开关图标
   * @param icon 图标
   */
  thumbIcon = (icon: string) => {
    this._config.thumbIcon = icon
    return this
  }

  /**
   * 设置开始内容图标
   * @param icon 图标
   */
  startContent = (icon: string) => {
    this._config.startContent = icon
    return this
  }

  /**
   * 设置结束内容图标
   * @param icon 图标
   */
  endContent = (icon: string) => {
    this._config.endContent = icon
    return this
  }

  /**
   * 设置是否被选中（只读）
   * @param selected 是否被选中
   */
  selected = (selected: boolean = true) => {
    this._config.isSelected = selected
    return this
  }

  /**
   * 设置默认选中状态
   * @param selected 是否默认选中
   */
  defaultSelected = (selected: boolean = true) => {
    this._config.defaultSelected = selected
    return this
  }

  /**
   * 设置是否只读
   * @param readonly 是否只读
   */
  readonly = (readonly: boolean = true) => {
    this._config.isReadOnly = readonly
    return this
  }

  /**
   * 设置是否禁用
   * @param disabled 是否禁用
   */
  disabled = (disabled: boolean = true) => {
    this._config.isDisabled = disabled
    return this
  }

  /**
   * 设置是否禁用动画
   * @param disable 是否禁用动画
   */
  disableAnimation = (disable: boolean = true) => {
    this._config.disableAnimation = disable
    return this
  }

  /**
   * 自定义参数
   * @param options 参数
   */
  options = (options: SwitchProps) => {
    this._config = options
    return this
  }
}

/**
 * 开关组件
 */
const switchComponent = {
  /**
   * 创建基础开关
   * @param key 唯一标识符
   */
  create: (key: string) => new Switch(key),
  /**
   * 自定义参数
   * @param key 唯一标识符
   * @param options 参数
   */
  options: (key: string, options: SwitchProps) => new Switch(key).options(options)
}

export { switchComponent }
