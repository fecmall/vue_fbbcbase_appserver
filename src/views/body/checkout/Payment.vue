<template>
    <div class="main container one-column content">
        <div class="col-main">
            
            <div class="account-ds">
                <div class="bar bar-nav account-top-m">
                    
                    <a @click="routerGo()"  href="javascript:void(0)" class="button button-link button-nav pull-left">
                        <span class="icon icon-left"></span>
                    </a>
                    
                    <h1 class='title'>{{ $t("message.payment_page") }}</h1>
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
                    
                    <div class="onestepcheckout-payment-method">
                        <p class="onestepcheckout-numbers onestepcheckout-numbers-3">
                            {{ $t("message.payment_method") }}
                        </p>
                        <div class="payment_info">
                            <div class="payment-methods">
                                <dl v-if="payments" id="checkout-payment-method-load">
                                    <template v-for="(payment,payment_key) in payments">
                                        <dt>
                                            <input v-model="payment_method"  style="display:inline" :id=" 'p_method_'+payment_key" :value="payment_key" name="payment_method"
                                            :title="payment.label" class="radio validate-one-required-by-name"  type="radio">
                                            <label :for="'p_method_'+payment_key">
                                                {{payment.label}}
                                            </label>
                                        </dt>
                                        <dd :id="'container_payment_method_'+payment_key" class="payment-method" style="">
                                            <ul class="form-list" :id="'payment_form_'+payment_key" style="">
                                                <li>
                                                    <img v-if="payment.imageUrl" style="margin:10px 0 8px 0" :src="payment.imageUrl">
                                                
                                                </li>
                                            </ul>
                                        </dd>
                                    </template>   
                                </dl>
                            </div>
                        </div>
                    </div>
                    
                    
                    
                </div>
                
                <div class="onestepcheckout-column-right">
                    <div class="review_order_view">
                        <p class="onestepcheckout-numbers onestepcheckout-numbers-4">
                            {{ $t("message.review_your_order") }}: {{order_info.increment_id}}
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
                                    <tr v-for="product in order_info.products">
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
                                                {{order_info.currency_symbol}}
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
                                                {{order_info.currency_symbol}}
                                                {{order_info.product_total}}
                                                
                                            </span>       
                                        </td>
                                    </tr>
                                    <tr>
                                        <td >
                                            {{ $t("message.shipping_cost") }}
                                        </td>
                                        <td class="value">
                                            <span class="price">
                                                {{order_info.currency_symbol}}
                                                {{order_info.shipping_cost}}
                                            </span> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td >
                                            {{ $t("message.discount") }}
                                        </td>
                                        <td class="value">
                                            <span class="price">-{{order_info.currency_symbol}} {{order_info.coupon_cost}}
                                            </span> 
                                        </td>
                                    </tr>
                                    <tr class="grand-total">
                                        <td >
                                            {{ $t("message.grand_total") }}
                                        </td>
                                        <td class="value">
                                            <span class="price">{{order_info.currency_symbol}}{{order_info.grand_total}}
                                            </span>   
                                        </td>
                                    </tr>						
                                </tbody>
                            </table>
                        </div>

                    </div>
                    
                    
                    <div class="onestepcheckout-place-order">
                        <a @click="orderPayment()" class="large orange onestepcheckout-button" href="javascript:void(0)" id="onestepcheckout-place-order">
                            {{ $t("message.order_payment") }}
                        </a>
                        <div :style="'display:'+displaySubmitOrder" class="onestepcheckout-place-order-loading">
                            <img src="//img.fancyecommerce.com/images/opc-ajax-loader.gif">&nbsp;&nbsp;
                            Please wait, processing your order...
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
    data () {
        return {
            pageInitUrl: root + '/checkout/payment/index' ,
            orderPaymentUrl: root + '/checkout/payment/add' ,
            errormsg:'',
            payment_method:'',
            payments:'',
            order_info: {},
            displaySubmitOrder:'none'
        }
    },
    created: function(){
        this.pageInit();
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
        routerGo: function(){
            this.$router.go(-1);
        },
        pageInit: function(){
            var self = this;
            self.errormsg = '';
            self.correctmsg = '';
            var orderIncrementId = this.$route.params.orderIncrementId;
            $.showIndicator();
            $.ajax({
                url: self.pageInitUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                    order_increment_id: orderIncrementId,
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.setLoginSuccessRedirectUrl('/checkout/onepage');
                        self.$router.push('/customer/account/login');
                        
                        return;
                    }else if(reponseData.code == 200){
                        self.payment_method = reponseData.data.current_payment_method;
                        self.payments = reponseData.data.payments;
                        self.order_info = reponseData.data.order_info;
                        console.log('payment info success');
                        
                    }else if(reponseData.code == 1500007){
                        $.toast(self.$i18n.t("message.cart_product_is_empty"));
                        self.$router.push('/checkout/cart');
                        return;
                    }
                    //console.log('cart_products.length:'+ self.cart_products.length);
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('init error');
                }
            });
        },
        orderPayment: function(){
            self = this;
            self.errormsg = '';
            var cookies = self.getTraceAllCookie();
            var orderIncrementId = this.$route.params.orderIncrementId;
            var ajaxData = {
                payment_method: self.payment_method,
                order_increment_id: orderIncrementId,
                cookies: cookies
            };
            $.showIndicator();
            self.displaySubmitOrder = 'block';
            $.ajax({
                url: self.orderPaymentUrl,
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
                        self.$router.push(redirectUrl);
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
        }
    }
}
</script>



