// 重置html的font-size
function resetFontSize () {
  // 获取屏幕的宽度
  var windowW = document.documentElement.clientWidth
  // 是以iphone5作为参考
  var scale = windowW / 320
  var newSize = 10 * scale
  document.getElementsByTagName('html')[0].style.fontSize = newSize + 'px'
}
// 当浏览器大小变化更新
window.addEventListener('resize', function () {
  resetFontSize()
}, false)
resetFontSize()
