var log = console.log.bind(console)

//app的方法
let app = getApp();

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 这个是传递过来的跳转信息
    item: {            // 属性名
      type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
//    value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    //这个是显示的位置，可能需要传递给父页面中去做统计的事件
// showMore: {
// 		type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
////    value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
// }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
  	
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
     /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
  },
})