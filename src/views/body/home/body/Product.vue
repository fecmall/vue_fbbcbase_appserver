<template>
  <div>
    <div style="padding:10px;">      
      <!-- 添加 class infinite-scroll 和 data-distance  向下无限滚动可不加infinite-scroll-bottom类，这里加上是为了和下面的向上无限滚动区分-->
      <div class=" infinite-scroll infinite-scroll-bottom" data-distance="100">
        <div class="list-block">
          <div class="list-container">
            <div class="row" v-for="(item, index) in productList">
              
              <div v-if="item.one" class="col-50 product_list">
                <router-link :to="item.one.url" >
                    <img width="100%"   class="lazy" v-bind:src="item.one.image"  />
                </router-link> 
                <p class="product_name" style="">
                  <router-link :to="item.one.url" >
                    {{item.one.name}}           
                  </router-link> 
                </p>
                <p class="proPrice" v-if="item.one.price" style="color: #333;">
                    <span v-if="item.one.special_price" class="bizhong">{{item.one.special_price ? item.one.special_price.code : ''}}</span>
                    <span v-if="item.one.special_price" v-bind:orgp="item.one.special_price"   class="my_shop_price f14">
                      <span class="icon">{{item.one.special_price ? item.one.special_price.symbol : ''}}</span>
                      {{item.one.special_price ? item.one.special_price.value : ''}}
                    </span>
                    
                    <span v-if="!item.one.special_price" class="bizhong">{{item.one.price ? item.one.price.code : ''}}</span>
                    <span v-if="!item.one.special_price" v-bind:orgp="item.one.price" class="my_shop_price f14">
                        <span class="icon">{{item.one.price ? item.one.price.symbol : ''}}</span>
                        {{item.one.price ? item.one.price.value : ''}}
                    </span>
                     
                    <span v-if="item.one.special_price" class="bizhong">{{item.one.price ? item.one.price.code : ''}}</span>
                    <del  v-if="item.one.special_price" v-bind:orgp="item.one.price" class="my_shop_price">
                      <span class="icon">{{item.one.price ? item.one.price.symbol : ''}}</span>
                      {{item.one.price ? item.one.price.value : ''}}
                    </del>
                </p>
                <span v-if="item.one.price" @click="addProductToCart(item.one.product_id)" class="category-cart icon icon-cart"></span>
                                          
              </div>  
              
              
              <div v-if="item.two.name" class="col-50 product_list">
                <router-link :to="item.two.url" >
                    <img width="100%"   class="lazy" v-bind:src="item.two.image"  />
                </router-link> 
                <p class="product_name" style="">
                  <router-link :to="item.two.url" >
                    {{item.two.name}}           
                  </router-link>
                </p>
                <p class="proPrice" v-if="item.two.price" style="color: #333;">
                    <span v-if="item.two.special_price" class="bizhong">{{item.two.special_price ? item.two.special_price.code : ''}}</span>
                    <span v-if="item.two.special_price" v-bind:orgp="item.two.special_price"   class="my_shop_price f14">
                      <span class="icon">{{item.two.special_price ? item.two.special_price.symbol : ''}}</span>
                      {{item.two.special_price ? item.two.special_price.value : ''}}
                    </span>
                    
                    <span v-if="!item.two.special_price" class="bizhong">{{item.two.price ? item.two.price.code : ''}}</span>
                    <span v-if="!item.two.special_price" v-bind:orgp="item.two.price" class="my_shop_price f14">
                        <span class="icon">{{item.two.price ? item.two.price.symbol : ''}}</span>
                        {{item.two.price ? item.two.price.value : ''}}
                    </span>
                     
                    <span v-if="item.two.special_price" class="bizhong">{{item.two.price ? item.two.price.code : ''}}</span>
                    <del  v-if="item.two.special_price" v-bind:orgp="item.two.price" class="my_shop_price">
                      <span class="icon">{{item.two.price ? item.two.price.symbol : ''}}</span>
                      {{item.two.price ? item.two.price.value : ''}}
                    </del>
                </p>
                <span v-if="item.two.price" @click="addProductToCart(item.two.product_id)" class="category-cart icon icon-cart"></span>
                                          
              </div>    
            </div>	
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var root = process.env.API_ROOT; 
export default {
    ready () {
        //this.getImg() ;
        $.init();
    },
    props: {
      productList: {
        type: Array
      }
    },
    data () {
        return {   
            addProductToCartUrl: root + '/checkout/cart/add' ,
        }
    },
    methods:{
        addProductToCart(product_id){
            console.log("add product to cart");
            this.loading = true;
            var self = this;
            $.showIndicator();
            $.ajax({
                url: self.addProductToCartUrl,
                async: true,
                timeout: 120000,
                dataType: 'json', 
                type: 'post',
                headers: self.getRequestHeader(),
                data:{ 
                    product_id:product_id,
                    qty: 1
                },
                success:function(reponseData, textStatus,request){ 
                    $.hideIndicator();
                    var data = reponseData.data;
                    if(reponseData.code == 1100003){
                        console.log(self.$route.path);
                        self.setLoginSuccessRedirectUrl(self.$route.path);
                        self.$router.push('/customer/account/login');
                        return;
                    } else if(reponseData.code == 200){
                        console.log('add to cart success');
                        //self.cartActiveCount = reponseData.data.items_count;
                        self.$emit('update-cart-count', reponseData.data.items_count);
                        $.toast(self.$i18n.t("message.add_product_to_cart_success"));
                    }else if(reponseData.code == 1400001){
                        self.$router.push('/catalog/product/' + product_id);
                    }else if(reponseData.code == 1400002){
                        $.toast(self.$i18n.t("message.add_product_to_cart_fail"));
                        console.log(reponseData.message);
                    }else{
                        $.toast(self.$i18n.t("message.add_product_to_cart_fail"));
                    }
                    self.saveReponseHeader(request); 
                    
                },
                error:function (XMLHttpRequest, textStatus, errorThrown){
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('add to cart error');
                    $.hideIndicator();
                }
            });
        
        }
    }
}

</script>


<style scoped>
.isNoDisPlay{
    display:none;
}
.bizhong{
    display:none;
}

.my_shop_price.f14{
    color: #F0250F;
    font-size: 0.7rem;
}

.my_shop_price{
    color: #777;
    font-size: 0.6rem;
}

.category-cart{
    position: absolute;
    right: 0.2rem;
    display: block;
    bottom: 0.8rem;
    cursor: pointer;

}
.product_list{
    position: relative;
}



</style>