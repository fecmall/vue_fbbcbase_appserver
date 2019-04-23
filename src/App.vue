<template>
  <div class="page-group">
    <div class="page main-page" ref="scrollContainer">
        <router-view name="header"></router-view>
        <router-view name="body"  @update-cart-count="updateCartCount"></router-view>
    </div>
    <div class="panel-overlay"></div>
    <router-view name="leftmenu"></router-view>
    <div class="panel-overlay"></div>
    <router-view name="leftaccount"></router-view>
    <router-view name="footer" ref="footerContainer"></router-view>
  </div>
</template>

<script>
$(document).ready(function(){  
    //$.config.router = false; 
    $.init();
});
export default {
  components: {
    
  },
  methods: {
    updateCartCount: function (count) {
      this.$refs.footerContainer.updateCartCount(count);
    }
  }
}
</script>




<style lang="css" src="./assets/css/sm.min.css"></style>
<style lang="css" src="./assets/css/sm-extend.min.css"></style>
<style lang="css" src="./assets/css/fec.css"></style>


