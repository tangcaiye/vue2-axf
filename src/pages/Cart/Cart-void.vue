<template>
    <div class="cart-void">
        <div class="cart-void-top">
            <div class="cart-icon"></div>
            亲，购物车空空的耶~
            </br>
            <span class="talkWalk" @click="goHome">
                去逛逛
            </span>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        goHome () {
            this.$router.push({path:'/'})
        }
    }
}
</script>
<style scoped>
.cart-void{
    position: absolute;
    top:4.5rem;
    height: 100%;
    width: 100%;
    background-color: #EFEFEF;
}
.cart-void-top{
    color: #999;
    padding-top: 20%;
    text-align: center;
    line-height: 4rem;
    font-size: 1.4rem;
}
.cart-icon{
    width: 8rem;
    height: 8rem;
    border-radius: 4rem;
    background-image: url("./images/dingwei.png");
    background-size: contain;
    margin: auto;
}
.talkWalk{
    border: 1px solid #e0e0e0;
    border-radius: .3rem;
    padding: .4rem 3rem;
    cursor: pointer;
}
</style>
