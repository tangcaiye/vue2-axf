<template>
  <header>
    <div class="header-content">
      <span>人民公园 12</span>
    </div>
    <span class="search">搜索</span>
  </header>
</template>
<style lang="less" scoped>
@import url("../../common/styles/variable.less");
@import url("../../common/styles/mixin.less");

header{
  position: fixed;
  top: 0;
  width: 100%;
  height: 4.5rem;
  z-index: 3;
  background-color: @color-background;
}
.header-content{
  position: absolute;
  left: 6rem;
  right: 6rem;
  height: 4.5rem;
  text-align: center;
  span{
    line-height: 4.5rem;
    font-weight: 700;
    font-size: 1.4rem;
    &:after{
      content: "▼";
    }
  }
}
.search{
  .extend-click();
  position: absolute;
  right: 1rem;
  width: 6rem;
  height: 4.4rem;
  background-image: url("./images/serach.png");
  background-repeat: no-repeat;
  -webkit-background-size: auto 2.5rem;
  background-size: auto 2.5rem;
  background-position: right .5rem;
  text-align: right;
  line-height: 7rem;
}
</style>