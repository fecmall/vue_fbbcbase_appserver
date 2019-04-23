<template>
    <div class="content">
        <div class="account-ds">
            <div class="bar bar-nav account-top-m">
                <router-link to="/customer/order"  class="button button-link button-nav pull-left">
                    <span class="icon icon-left"></span>
                </router-link>
                <h1 class='title'>
                    {{ $t("message.customer_order") }}
                </h1>
            </div>
        </div>
        <div class="fecshop_message" v-if="errormsg">
            <div class="error-msg">
                <div>
                    {{errormsg}}
                </div>
            </div>
		</div>
        <div class="fecshop_message" v-if="correctmsg">
            <div class="correct-msg">
                <div>
                    {{correctmsg}}
                </div>
            </div>
		</div>
        
        <div class="account-container">
            <div class="col-main account_center">
                <div class="std">
                    <div style="margin:2px 0 0">
                        <div class="my_account_order">
                            <table class="page-title title-buttons">
                                <tbody>
                                    <tr><td>{{ $t("message.order_increment_id") }} :</td><td>{{order.increment_id}}</td></tr>		
                                </tbody>
                            </table>
                            <div class="order-items order-details box-title">
                                <h5 class="table-caption">
                                    {{ $t("message.items_ordered") }}:
                                </h5>

                                <table v-if="orderProducts" summary="Items Ordered" id="my-orders-table" class="data-table">
                                    <colgroup>
                                        <col width="1">
                                        <col width="1">
                                        <col width="1">
                                        <col width="1">
                                        <col width="1">
                                    </colgroup>
                                    <thead>
                                        <tr class="first last">
                                            <th>{{ $t("message.product_image") }}</th>
                                            <th>{{ $t("message.product_info") }}</th>
                                            <th class="a-center">{{ $t("message.qty") }}</th>
                                            <th class="a-center"></th>
                                            <th class="a-right">{{ $t("message.subtotal") }}</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr class="subtotal first">
                                            <td class="a-right" colspan="4">{{ $t("message.return_qty") }}</td>
                                            <td class="last a-right">
                                                <input type="text" v-model="return_qty" />
                                            </td>
                                        </tr>
                                        <tr class="shipping">
                                            <td class="a-right" colspan="4">
                                                {{ $t("message.submit_return") }}
                                            </td>
                                            <td class="last a-right">
                                                <a href="javascript:void(0)" @click="submitReturn()" id="js_registBtn" class="button button-fill">
                                                    {{ $t("message.submit_return") }}
                                                </a>   
                                            </td>
                                        </tr>
                                        
                                    </tfoot>
                                    <tbody class="odd">
                                    
                                        <tr v-for="(itemProduct,index) in orderProducts" id="order-item-row" class="border first">	
                                            <td>
                                                <router-link :to="'/catalog/product/' + itemProduct.product_id"  >
                                                    <img :src="itemProduct.imgUrl" :alt="itemProduct.name"  width="75" height="75"  />
                                                </router-link>
                                            </td>
                                            <td>
                                                <div>sku:{{itemProduct.sku}}</div>
                                                <div v-if="itemProduct.custom_option_info">
                                                    <div v-for="(val,label) in itemProduct.custom_option_info">
                                                        {{label}}:{{val}}
                                                    
                                                    </div>
                                                </div>
                                                
                                                <dl class="item-options">
                                                </dl>
                                            </td>
                                            
                                            <td class="a-right">
                                                <span class="nobr" ><strong>{{itemProduct.qty}}</strong><br>
                                                </span>
                                            </td>
                                            <td class="a-right"></td>
                                            <td class="a-right last">
                                                <span class="price-excl-tax">
                                                    <span class="cart-price">
                                                        <span class="price">{{order.currency_symbol}}{{itemProduct.row_total}}</span>                    
                                                    </span>
                                                </span>
                                                <br>
                                            </td>
                                            
                                        </tr>
                                    </tbody>								   
                                </table>
                                
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>

var root = process.env.API_ROOT;

export default {
    data () {
        return {
            pageInitUrl: root + '/customer/order/returnview' ,
            returnSubmitUrl: root + '/customer/order/returnsubmit' ,
            errormsg:'',
            order:[],
            orderProducts:[],
            after_sale:[],
            refer_url: '',
            correctmsg:'',
            return_qty: 1
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
        pageInit: function(){
            var self = this;
            var item_id = this.$route.params.item_id;
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
                    item_id:item_id
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        self.order = reponseData.data.order;
                        var after_sale = reponseData.data.after_sale;
                        if(after_sale){
                            self.$router.push('/customer/order/aftersalereturninfo/'+item_id+ '/' + after_sale.id);
                            //if (after_sale.status == 'after_sale_return_accept') {
                            //    self.$router.push('/customer/order/returndispatch/' + after_sale.id);
                            //} else {
                            //    self.$router.push('/customer/order/aftersalereturninfo/' + after_sale.id);
                            //}
                        } else if(self.order && self.order.products.length > 0){
                            self.orderProducts = self.order.products;
                        }
                        
                        console.log('');
                        var traceData = {"refer_url": self.refer_url};
                        var routerQ = self.$route.query
                        for (var k in routerQ) {
                            traceData[k] = routerQ[k]
                        }
                        self.reloadTraceJs(traceData);
                        self.saveReponseHeader(request); 
                    }
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('get customer order info error');
                }
            });
        },
        
        submitReturn: function(){
            var self = this;
            var item_id = this.$route.params.item_id;
            self.errormsg = '';
            self.correctmsg = '';
            $.showIndicator();
            $.ajax({
                url: self.returnSubmitUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                    item_id:item_id,
                    return_qty:self.return_qty,
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        $.toast(self.$i18n.t("message.return_submit_success"));
                        var traceData = {"refer_url": self.refer_url};
                        var routerQ = self.$route.query
                        for (var k in routerQ) {
                            traceData[k] = routerQ[k]
                        }
                        self.reloadTraceJs(traceData);
                        self.saveReponseHeader(request); 
                        self.pageInit();
                    }
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('submit order return error');
                }
            });
        }
    }
}
</script>