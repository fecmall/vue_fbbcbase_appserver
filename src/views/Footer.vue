<template>
  <div class="footer_container">
    <nav class="bar bar-tab">
    
    
    <router-link to="/"  class="tab-item external" :class="isHomeActive ? 'active' : ''  ">
        <span class="icon icon-home"></span>
        <span class="tab-label">{{ $t("message.home") }}</span>
    </router-link>
                
         
      <router-link to="/catalog/allcategory/list"  class="tab-item external" :class="isCategoryActive ? 'active' : ''  ">
        <span class="icon icon-app"></span>
        <span class="tab-label">{{ $t("message.all_category") }}</span>
      </router-link>
      <router-link to="/checkout/cart"  class="tab-item external" :class="isCartActive ? 'active' : ''  ">
        <span class="icon icon-cart"></span>
        <span class="tab-label">{{ $t("message.cart") }}</span>
        <span class="badge">{{cartActiveCount}}</span>
      </router-link>
      <router-link to="/customer/account/index"  class="tab-item external" :class="isAccountActive ? 'active' : ''  ">
        <span class="icon icon-friends"></span>
        <span class="tab-label">{{ $t("message.account_center") }}</span>
      </router-link>
    </nav>
  </div>
</template>
<script>
var root = process.env.API_ROOT;
export default {
  data () {
    return {
        isHomeActive: false,
        isCategoryActive: false,
        isCartActive: false,
        isAccountActive: false,
        cartActiveCount: 0,
        pageInitUrl: root + '/checkout/cart/activecount' ,
    }
  },
  beforeRouteEnter (to, from, next) {
        var isHomeActive = false;
        var isCategoryActive = false;
        var isCartActive = false;
        var isAccountActive = false;
        var currentFullPathc = to.fullPath;
        if (currentFullPathc == "/") {
            isHomeActive = true;
        } else if (currentFullPathc == "/catalog/allcategory/list") {
            isCategoryActive = true;
        } else if (currentFullPathc == "/checkout/cart") {
            isCartActive = true;
        } else if (currentFullPathc == "/customer/account/index") {
            isAccountActive = true;
        }
        next( vm => {
            vm.isHomeActive = isHomeActive;
            vm.isCategoryActive = isCategoryActive;
            vm.isCartActive = isCartActive;
            vm.isAccountActive = isAccountActive;
        });  
    },
    created: function(){
        this.pageInit();
    },
    methods: {
        pageInit: function(){
            var self = this;
            $.ajax({
                url: self.pageInitUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                },
                success:function(reponseData, textStatus,request){
                    if(reponseData.code == 200){
                        self.cartActiveCount = reponseData.data.cart_active_count;
                    }
                },
                error:function(){
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('get customer order info error');
                }
            });
        },
        updateCartCount: function (count) {
          this.cartActiveCount = count;
        }
      }
  
     // this.$route.path
  
}
</script>