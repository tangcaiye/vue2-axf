var Toast = {}
Toast.install = function (Vue, options) {
  Vue.prototype.$toast = (tips) => {
    // 1、创建构造器，定义好提示信息的模板
    let toastTpl = Vue.extend({     
      template: '<div class="vue-toast">' + tips + '</div>'
    });
    // 2、创建实例，挂载到文档以后的地方
    let tpl = new toastTpl().$mount().$el; 
    // 3、把创建的实例添加到body中
    document.body.appendChild(tpl); 
    // 4、延迟2.5秒后移除该提示
    setTimeout(function () {        
      document.body.removeChild(tpl);
    }, 2500)
  }
}
module.exports = Toast