<template>
    <div class="main container one-column content">
        <div class="col-main">
            
            <div class="account-ds">
                <div class="bar bar-nav account-top-m">
                    
                    <a @click="routerGo()"  href="javascript:void(0)" class="button button-link button-nav pull-left">
                        <span class="icon icon-left"></span>
                    </a>
                    
                    <h1 class='title'>{{ $t("message.checkout") }}</h1>
                </div>
            </div>
            <div class="fecshop_message" v-if="errormsg">
                <div class="error-msg">
                    <div>
                        {{errormsg}}
                    </div>
                </div>
            </div>
            <div  id="onestepcheckout-form">
                <div style="margin: 0;" class="group-select">
                    <p class="onestepcheckout-description">
                        {{ $t("message.welcome_to_checkout") }}
                    </p>
                    <p v-if="isCustomerPassword && isGuest" class="onestepcheckout-login-link">
                        <router-link to="/customer/account/login" id="onestepcheckout-login-link" >
                            {{ $t("message.already_registered") }}
                        </router-link>
                    </p>
                    <div class="onestepcheckout-threecolumns checkoutcontainer onestepcheckout-skin-generic onestepcheckout-enterprise">
                        <div class="onestepcheckout-column-left">
                            <div class="guest_address">
                                
                                <div id="billing_address" >	
                                    <p class="onestepcheckout-numbers onestepcheckout-numbers-2">
                                        {{ $t("message.shipping_address") }}
                                    </p>
                                    <router-link :to="'/checkout/onepage/addresslist'" >
                                        <ul>
                                            <li>
                                                <div>
                                                    <p>
                                                        {{default_address_list.first_name}} {{default_address_list.last_name}}
                                                    </p>
                                                    <p>
                                                        {{default_address_list.country}} {{default_address_list.state}} {{default_address_list.city}} {{default_address_list.area}} {{default_address_list.street1}} {{default_address_list.street2}} 
                                                    </p>
                                                    <p>
                                                        {{ $t("message.phone") }}:{{default_address_list.telephone}}
                                                        {{ $t("message.zip_code") }}:{{default_address_list.zip}}
                                                    </p>
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="more_shipping_address">
                                            <span class="icon icon-right"></span>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                        </div>

                        <div v-for="(bdmin_cart_info, bdmin_user_id) in cart_info">
                            <div class="review_order_view">
                                <p class="onestepcheckout-numbers onestepcheckout-numbers-4">
                                    {{ bdmin_info[bdmin_user_id] }}
                                </p>
                                <div class="onestepcheckout-summary">
                                    <table class="onestepcheckout-summary">
                                        <thead>
                                            <tr>
                                                <th class="image"></th>
                                                <th class="name">{{ $t("message.product_name") }}</th>
                                                <th class="qty">{{ $t("message.qty") }}</th>
                                                <th class="total">{{ $t("message.subtotal") }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="product in bdmin_cart_info.products">
                                                <td class='image'>
                                                    
                                                    <router-link :to="'/catalog/product/'+product.product_id" class="product-image" >
                                                        <img :src="product.imgUrl" alt="2121" >
                                                    </router-link>
                                                    
                                                </td>
                                                
                                                <td class="name">
                                                    <h2 class="product-name">
                                                        <router-link :to="'/catalog/product/'+product.product_id" :title="product.name" class="product-image" >
                                                            {{product.name}}
                                                        </router-link>
                                                    </h2>
                                                    <ul v-if="product.custom_option_info">
                                                        <li v-for="(val,label) in product.custom_option_info">
                                                            {{label}}:
                                                            {{val}}
                                                        </li>  
                                                    </ul>
                                                </td>
                                                <td class="qty">
                                                    {{product.qty}}
                                                </td>
                                                <td class="total">
                                                    <span class="price">
                                                        {{currency_info.symbol}}
                                                        {{product.product_row_price}}
                                                    </span>
                                                </td>
                                            </tr>
                                                    
                                        </tbody>
                                    </table>
                                    <table class="onestepcheckout-totals">
                                        <tbody>
                                            <tr>
                                                <td >
                                                    {{ $t("message.subtotal") }}
                                                </td>
                                                <td class="value">
                                                    <span class="price">
                                                        {{currency_info.symbol}}
                                                        {{bdmin_cart_info.product_total}}
                                                        
                                                    </span>       
                                                </td>
                                            </tr>
                                            <tr>
                                                <td >
                                                    {{ $t("message.shipping_method") }}
                                                </td>
                                                <td class="value">
                                                    <div @click="showShippingList(bdmin_user_id)">
                                                        <span class="">
                                                            {{bdmin_cart_info.shipping_method_label}}
                                                        </span>
                                                        <span  :class=" activeIndex == bdmin_user_id ? 'icon icon-down' : 'icon icon-right'" style="float:right;"></span>
                                                        <span   class="price" style="float:right;margin-right:0.1rem">
                                                            {{currency_info.symbol}}
                                                            {{bdmin_cart_info.shipping_cost}}
                                                            
                                                        </span> 
                                                    </div> 
                                                    <div v-show="activeIndex == bdmin_user_id"  >
                                                        <div v-for="(shipMethod, index) in bdmin_cart_info.shipping_methods" class="shippingmethods">
                                                            <div>
                                                                <input @change="changeShipping(bdmin_user_id, shipMethod.id)" v-model="bdmin_cart_info.shipping_method"  data-role="none"  type="radio" :id="'s_method_flatrate_flatrate'+shipMethod.id" :value="shipMethod.id" class="validate-one-required-by-name" :name=" 'shipping_method' + shipMethod.id ">
                                                                <label :for="'s_method_flatrate_flatrate'+shipMethod.id">
                                                                    {{shipMethod.label}} 
                                                                    <strong>                 
                                                                        <span class="price">
                                                                            {{currency_info.symbol}}{{shipMethod.current_cost}}
                                                                        </span>
                                                                    </strong>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="show_coupon">
                                                <td >
                                                    {{ $t("message.discount") }}
                                                </td>
                                                <td class="value">
                                                    <span class="price">-{{currency_info.symbol}} {{bdmin_cart_info.coupon_cost}}
                                                    </span> 
                                                </td>
                                            </tr>
                                            <tr class="grand-total">
                                                <td >
                                                    {{ $t("message.grand_total") }}
                                                </td>
                                                <td class="value">
                                                    <span class="price">{{currency_info.symbol}}{{bdmin_cart_info.grand_total}}
                                                    </span>   
                                                </td>
                                            </tr>						
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            
                        </div>
                        
                            
                        <div class="onestepcheckout-column-right">
                            <div style="    padding: .8rem 1rem .2rem;font-size: 0.6rem; background: #fff;margin: .2rem 0 0;">
                                共： {{all_count}}个，合计：{{currency_info.symbol}} {{all_total}}
                            </div>
                            <div class="onestepcheckout-place-order">
                                <a @click="submitOrder()" class="large orange onestepcheckout-button" href="javascript:void(0)" id="onestepcheckout-place-order">
                                    {{ $t("message.place_order_now") }}
                                </a>
                                <div :style="'display:'+displaySubmitOrder" class="onestepcheckout-place-order-loading">
                                    <img src="//img.fancyecommerce.com/images/opc-ajax-loader.gif">&nbsp;&nbsp;
                                    Please wait, processing your order...
                                </div>
                            </div>
                        </div>
                        <div style="clear: both;">&nbsp;</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

var root = process.env.API_ROOT;

export default {
    data () {
        return {
            pageInitUrl: root + '/checkout/onepage/index' ,
            changeCountryUrl: root + '/checkout/onepage/changecountry' ,
            addCouponUrl: root + '/checkout/cart/addcoupon' ,
            cancelCouponUrl: root + '/checkout/cart/cancelcoupon' , 
            submitOrderUrl: root + '/checkout/onepage/submitorder' ,
            getShippingAndCartInfoUrl: root + '/checkout/onepage/getshippingandcartinfo' ,
            errormsg:'',
            bdmin_info: {},
            activeIndex: -1,
            customerPasswordDisplay:'none',
            customer_password:'',
            confirm_password:'',
            isGuest:1,
            all_count:0,
            all_total:0,
            show_coupon: false,
            currency_info:{},
            shippings:'',
            cart_info:{},
            displayAddressDetails:'none',
            default_address_list:'',
            isCustomerPassword:0,
            currency:'',
            couponLabel:'',
            couponType:1, // 1 代表 add coupon 2 代表 cancel coupon
            coupon_code:'',
            write_remark: false,
            order_remark:'',
            correctmsg:'',
            displaySubmitOrder:'none',
            refer_url: '',
            shipping_method:''
        }
    },
    created: function(){
        this.pageInit();
        this.couponLabel = this.$i18n.t("message.add_coupon");
    },
    beforeRouteEnter (to, from, next) {
        var website_root = process.env.WEBSITE_ROOT
        var fullPath = from.fullPath
        var name = from.name
        console.log(fullPath);
        console.log(from);  
        if (fullPath !== '/' || typeof(name) === 'undefined' ) {
            var referUrl = website_root + "/#" + fullPath
            console.log(referUrl)
        } else {
            referUrl = ''
        }
        next( vm => {
            vm.refer_url = referUrl;
        });  
    },
    methods: {
        submitOrder: function(){
            self = this;
            self.errormsg = '';
            
            var aData = {};
            var ajaxData = {};
            var cart_info = self.cart_info;
            if (self.isObNotEmpty(cart_info)) {
                for (var bdmin_user_id in cart_info) {
                    var bdmin_cart = cart_info[bdmin_user_id];
                    var shipping_method = bdmin_cart.shipping_method;
                    aData[bdmin_user_id] = shipping_method;
                }
                ajaxData.shipping_method = aData;
            }
            
            var cookies = self.getTraceAllCookie();
            ajaxData.cookies = cookies;
            //var ajaxData = {
            //    order_remark: self.order_remark,
            //    shipping_method: self.shipping_method,
            //    cookies: cookies
            //};
            $.showIndicator();
            self.displaySubmitOrder = 'block';
            $.ajax({
                url: self.submitOrderUrl,
                async: true,
                timeout: 120000,
                type: 'post',
                headers: self.getRequestHeader(),
                data:ajaxData,
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 200){
                        self.saveReponseHeader(request); 
                        var redirectUrl = reponseData.data.redirectUrl;
                        self.$emit('update-cart-count', reponseData.data.items_count);
                        self.$router.push('/checkout/payment');
                    }else{
                        var message = reponseData.message;
                        self.errormsg = message;
                        if(reponseData.code == 1500004){
                            $.toast(self.$i18n.t("message.require_param_invaild"));
                        }else if(reponseData.code == 1500005){
                            $.toast(self.$i18n.t("message.create_account_fail"));
                        }else if(reponseData.code == 1500006){
                            $.toast(self.$i18n.t("message.save_account_address_fail"));
                        }else if(reponseData.code == 1500002){
                            $.toast(self.$i18n.t("message.generate_order_fail"));
                            self.errormsg =  reponseData.data.error;                           
                        }
                        self.displaySubmitOrder = 'none';
                        
                    }
                    
                    self.saveReponseHeader(request); 
                    
                },
                error:function(){
                    $.toast(self.$i18n.t("message.system_error"));
                    $.hideIndicator();
                    console.log('get address list page init error');
                }
            });
        },
        changeShipping: function(bdmin_user_id, shipMethodId){
            self = this;
            console.log("changeShipping");
            console.log(bdmin_user_id);
            console.log(self.cart_info[bdmin_user_id]);
            console.log(self.cart_info[bdmin_user_id].shipping_method);
            //self.getShippingAndCartInfo();
            self.pageInit();
        },
        getShippingAndCartInfo: function(){
            console.log("getShippingAndCartInfo");
            var self = this;
            var shipping_method = self.shipping_method;
            self.errormsg = '';
            self.correctmsg = '';
            $.showIndicator();
            $.ajax({
                url: self.getShippingAndCartInfoUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                    shipping_method:shipping_method,
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 200){
                        self.shippings = reponseData.data.shippings;
                        self.cart_info = reponseData.data.cart_info;
                    }else if(reponseData.code == 1500008){
                        
                    }
                    self.saveReponseHeader(request); 
                    
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('get address list page init error');
                }
            });
        
        },
        routerGo: function(){
            this.$router.go(-1);
        },
        isObNotEmpty: function(obj){
            for(var key in obj) {
            
                return true;
            }
            
            return false;
        },
        
        pageInit: function(){
            var self = this;
            self.errormsg = '';
            self.correctmsg = '';
            var cart_info = self.cart_info;
            var aData = {};
            var ajaxData = {};
            if (self.isObNotEmpty(self.cart_info)) {
                for (var bdmin_user_id in cart_info) {
                    var bdmin_cart = cart_info[bdmin_user_id];
                    var shipping_method = bdmin_cart.shipping_method;
                    aData[bdmin_user_id] = shipping_method;
                }
                ajaxData.shipping_method = aData;
            }
            
            
            $.showIndicator();
            $.ajax({
                url: self.pageInitUrl,
                async: true,
                timeout: 120000,
                type: 'post',
                headers: self.getRequestHeader(),
                data:ajaxData,
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.setLoginSuccessRedirectUrl('/checkout/onepage');
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        self.isGuest = reponseData.data.isGuest;
                        
                        self.default_address_list = reponseData.data.default_address_list;
                        //self.shippings = reponseData.data.shippings;
                        self.currency_info = reponseData.data.currency_info;
                        self.bdmin_info = reponseData.data.bdmin_info;
                        self.all_count = reponseData.data.all_count;
                        self.all_total = reponseData.data.all_total;
                        //self.shipping_method = reponseData.data.current_shipping_method;
                        self.show_coupon = reponseData.data.show_coupon;
                        self.cart_info = reponseData.data.cart_info;
                        self.activeIndex = -1;
                        //self.coupon_code = self.cart_info.coupon_code;
                        //if(self.coupon_code){
                        //    self.couponType = 2;
                        //    self.couponLabel = self.$i18n.t("message.cancel_coupon");
                        //}
                        console.log('get editAccount info success');
                        var traceData = {"refer_url": self.refer_url};
                        var routerQ = self.$route.query
                        for (var k in routerQ) {
                            traceData[k] = routerQ[k]
                        }
                        self.reloadTraceJs(traceData);
                        self.saveReponseHeader(request); 
                        // self.changeCountry();
                    }else if(reponseData.code == 1500007){
                        $.toast(self.$i18n.t("message.cart_product_is_empty"));
                        self.$router.push('/checkout/cart');
                        return;
                    }else if(reponseData.code == 3000007){
                        self.$router.push('/checkout/onepage/addressinit');
                        return;
                    }
                    //console.log('cart_products.length:'+ self.cart_products.length);
                    
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('get address list page init error');
                }
            });
            
        },
         
        showShippingList(bdmin_user_id){
            this.activeIndex = (this.activeIndex == bdmin_user_id) ? -1 : bdmin_user_id;
        },                                                    
        addCoupon: function(){
            var self = this;
            var coupon_code = self.coupon_code;
            self.errormsg = '';
            if(!coupon_code){
                self.errormsg = 'coupon code can not empty';
                return;
            }
            $.showIndicator();
            var url = '';
            if(self.couponType == 1){
                url = self.addCouponUrl;
            }else{
                url = self.cancelCouponUrl;
            }
            $.ajax({
                url: url,
                async: true,
                timeout: 120000,
                type: 'post',
                headers: self.getRequestHeader(),
                data:{ 
                    coupon_code:coupon_code
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.setLoginSuccessRedirectUrl('/checkout/onepage');
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        self.saveReponseHeader(request);
                        self.pageInit();
                        
                        if(self.couponType == 1){
                            self.couponType = 2;
                            self.couponLabel = self.$i18n.t("message.cancel_coupon");
                        }else{
                            self.couponType = 1;
                            self.couponLabel = self.$i18n.t("message.add_coupon");
                            self.self.coupon_code = '';
                        }
                    }else{
                        self.saveReponseHeader(request); 
                        if(self.couponType == 1){
                            self.errormsg = 'add coupon error,coupon code is wrong or has timeout';
                        }else{
                            self.errormsg = 'cancel coupon error';
                        }
                    }
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('get address list page init error');
                }
            });
            
        }
        
    }
    
    
    
}
</script>