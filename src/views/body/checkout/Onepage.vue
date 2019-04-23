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

                        <div class="onestepcheckout-column-middle">
                            <div class="shipping_method_html">
                                <div class="onestepcheckout-shipping-method">
                                    <p class="onestepcheckout-numbers onestepcheckout-numbers-2">
                                        {{ $t("message.shipping_method") }}
                                    </p>
                                    <div class="onestepcheckout-shipping-method-block">    
                                        <dl class="shipment-methods">
                                            
                                            <div v-for="(shipping,index) in shippings" class="shippingmethods">
                                                <div class="flatrate">
                                                    {{shipping.label}}
                                                </div>
                                                <div>
                                                    <input @change="changeShipping()" v-model="shipping_method"  data-role="none"  type="radio" :id="'s_method_flatrate_flatrate'+shipping.shipping_i" :value="shipping.method" class="validate-one-required-by-name" name="shipping_method">
                                                    <label :for="'s_method_flatrate_flatrate'+shipping.shipping_i">{{shipping.name}}
                                                        <strong>                 
                                                            <span class="price">
                                                                {{shipping.symbol}}
                                                                {{shipping.cost}}
                                                            </span>
                                                        </strong>
                                                    </label>
                                                </div>
                                            </div>
                                            
                                        </dl>
                                    </div>
                                </div>
                            </div>
                         
                            <div v-if="show_coupon" class="onestepcheckout-coupons">
                                <div style="display: none;" id="coupon-notice"></div>
                                <div class="op_block_title">
                                    {{ $t("message.coupon_codes") }}
                                </div>
                                <label for="id_couponcode">
                                    {{ $t("message.enter_your_coupon_code") }}
                                    
                                </label>
                                
                                <input v-model="coupon_code" style="color:#777;" class="input-text" id="id_couponcode" name="coupon_code" >
                                <br>
                                <button @click="addCoupon()" style="" type="button" class="submitbutton add_coupon_submit" id="onestepcheckout-coupon-add">
                                    {{couponLabel}}
                                </button>
                                <div class="clear"></div>
                                <div class="coupon_add_log"></div>
                            </div>
                            
                            <div class="onestepcheckout-remark">
    							<div class="op_block_title">
                                    <input type="checkbox"  id="write_remark" v-model="write_remark"   />
                                    <label for="write_remark">{{ $t("message.order_remark") }}</label>
                                </div> 
    							<label v-if="write_remark">{{ $t("message.fill_order_remark") }}</label> 
    							<textarea v-if="write_remark"  v-model="order_remark" class="order_remark" name="order_remark" style="width:94%;height:100px;padding:10px;"></textarea>
    						</div>
                        </div>

                        <div class="onestepcheckout-column-right">
                            <div class="review_order_view">
                                
                                
                                
                                <p class="onestepcheckout-numbers onestepcheckout-numbers-4">
                                    {{ $t("message.review_your_order") }}
                                </p>
                                <div class="onestepcheckout-summary">
                                    <table class="onestepcheckout-summary">
                                        <thead>
                                            <tr>
                                                <th class="image"></th>
                                                <th class="name">{{ $t("message.name") }}</th>
                                                <th class="qty">{{ $t("message.qty") }}</th>
                                                <th class="total">{{ $t("message.subtotal") }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="product in cart_info.products">
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
                                                        {{cart_info.product_total}}
                                                        
                                                    </span>       
                                                </td>
                                            </tr>
                                            <tr>
                                                <td >
                                                    {{ $t("message.shipping_cost") }}
                                                </td>
                                                <td class="value">
                                                    <span class="price">
                                                        {{currency_info.symbol}}
                                                        {{cart_info.shipping_cost}}
                                                    </span> 
                                                </td>
                                            </tr>
                                            <tr v-if="show_coupon">
                                                <td >
                                                    {{ $t("message.discount") }}
                                                </td>
                                                <td class="value">
                                                    <span class="price">-{{currency_info.symbol}} {{cart_info.coupon_cost}}
                                                    </span> 
                                                </td>
                                            </tr>
                                            <tr class="grand-total">
                                                <td >
                                                    {{ $t("message.grand_total") }}
                                                </td>
                                                <td class="value">
                                                    <span class="price">{{currency_info.symbol}}{{cart_info.grand_total}}
                                                    </span>   
                                                </td>
                                            </tr>						
                                        </tbody>
                                    </table>
                                </div>

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
            customerPasswordDisplay:'none',
            customer_password:'',
            confirm_password:'',
            isGuest:1,
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
            
            var cookies = self.getTraceAllCookie();
            var ajaxData = {
                order_remark: self.order_remark,
                shipping_method: self.shipping_method,
                cookies: cookies
            };
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
        changeShipping: function(){
            self = this;
            self.getShippingAndCartInfo();
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
        
        pageInit: function(){
            var self = this;
            self.errormsg = '';
            self.correctmsg = '';

            $.showIndicator();
            $.ajax({
                url: self.pageInitUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.setLoginSuccessRedirectUrl('/checkout/onepage');
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        self.isGuest = reponseData.data.isGuest;
                        
                        self.default_address_list = reponseData.data.default_address_list;
                        self.shippings = reponseData.data.shippings;
                        self.currency_info = reponseData.data.currency_info;
                        self.shipping_method = reponseData.data.current_shipping_method;
                        self.show_coupon = reponseData.data.show_coupon;
                        self.cart_info = reponseData.data.cart_info;
                        self.coupon_code = self.cart_info.coupon_code;
                        if(self.coupon_code){
                            self.couponType = 2;
                            self.couponLabel = self.$i18n.t("message.cancel_coupon");
                        }
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