// addCart.js
require('./addCart.css')
var AddCart = {}
AddCart.install = function (Vue, options) {
  Vue.prototype.$addCart = (obj) => {
    let AddCartTpl = Vue.extend({
      render: function (createElement) {
        return createElement('img', {
          attrs: {
            src: obj.src
          },
          style: {
            width: obj.width + 'px',
            height: obj.height + 'px',
            left: obj.start.left + 'px',
            top: obj.start.top + 'px'
          },
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
