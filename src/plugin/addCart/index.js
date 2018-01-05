require('./index.css')
var AddCart = {}
AddCart.install = function (Vue, options) {
  Vue.prototype.$addCart = (obj) => {
    /*
      obj
      {
        图片路径，
        图片的大小,
        动画的起点位置，
        动画的终点位置,
      }
    */
    // 创建图片的元素(标签)
    let AddCartTpl = Vue.extend({
      render: function (createElement) {
        return createElement('img', {
          // 标签的属性
          attrs: {
            src: obj.src
          },
          // 创建元素的(行间)样式
          style: {
            width: obj.width + 'px',
            height: obj.height + 'px',
            left: obj.start.left + 'px',
            top: obj.start.top + 'px'
          },
          // 类名
          'class': 'add-cart-item'
        })
      }
    })

    // 创建实例，挂载到文档以后的地方
    let tpl = new AddCartTpl().$mount().$el
    document.body.appendChild(tpl)

    // 间隔100毫秒后开始动画
    setTimeout(() => {
      tpl.style.left = obj.end.left + 'px'
      tpl.style.top = obj.end.top + 'px'
      tpl.style.transform = 'scale(0.1) rotate(180deg)'
      tpl.style.opacity = 0
    }, 100)

    // 一段时间后删除这个对象
    setTimeout(() => {
      document.body.removeChild(tpl)
    }, 900)
  }
}

module.exports = AddCart