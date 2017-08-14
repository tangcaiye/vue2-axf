// toast.js
require('./toast.css')
var Toast = {}
Toast.install = function (Vue, options) {
  let tpl = null
  Vue.prototype.$toast = (tips) => {
    tips = tips || '加载中'
    let ToastTpl = Vue.extend({
      render: function (createElement) {
        return createElement('div', {
          'class': 'tc-toast'
        }, [createElement('div', {
          'class': 'tc-toast-ball-wrap'
        },
          Array.apply(null, { length: 3 }).map(() => {
            return createElement('div', {
              'class': 'tc-toast-ball-middle'
            }, [createElement('span', {
              'class': 'tc-toast-ball'
            })])
          })),
          createElement('div', {
            'class': 'tc-toast-text'
          }, tips)
        ])
      }
    })
    // 创建实例，挂载到文档以后的地方
    tpl = new ToastTpl().$mount().$el
    document.body.appendChild(tpl)
  }
  Vue.prototype.$hideToast = () => {
    document.body.removeChild(tpl)
  }
}
module.exports = Toast
