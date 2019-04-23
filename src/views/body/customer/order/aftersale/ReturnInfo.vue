<template>
    <div class="content">
        <div class="account-ds">
            <div class="bar bar-nav account-top-m">
                <router-link to="/customer/order"  class="button button-link button-nav pull-left">
                    <span class="icon icon-left"></span>
                </router-link>
                <h1 class='title'>
                    {{ $t("message.order_return") }}
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
                            
                            <div class="order-items order-details box-title">
                                <h5 class="table-caption">
                                    {{ $t("message.return_status") }}:
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
                                            <th class="a-center">{{ $t("message.return_qty") }}</th>
                                            
                                            <th class="a-right">{{ $t("message.return_cost") }}</th>
                                            <th class="a-center">{{ $t("message.return_status") }}</th>
                                        </tr>
                                    </thead>
                                    <tfoot v-if="after_sale.show_dispatch">
                                        <tr class="subtotal first">
                                            <td class="a-right" colspan="4">{{ $t("message.tracking_number") }}</td>
                                            <td class="last a-right">
                                                <input type="text" v-model="tracking_number" />
                                            </td>
                                        </tr>
                                        <tr class="shipping">
                                            <td class="a-right" colspan="4">
                                                {{ $t("message.submit_return") }}
                                            </td>
                                            <td class="last a-right">
                                                <a href="javascript:void(0)" @click="dispatchOrder()" id="js_registBtn" class="button button-fill">
                                                    {{ $t("message.submit_return") }}
                                                </a>   
                                            </td>
                                        </tr>
                                        
                                    </tfoot>
                                    <tbody class="odd">
                                        <tr  id="order-item-row" class="border first">	
                                            <td>
                                                <router-link :to="'/catalog/product/' + after_sale.product_id"  >
                                                    <img :src="after_sale.image" :alt="after_sale.sku"  width="75" height="75"  />
                                                </router-link>
                                            </td>
                                            <td>
                                                <div>sku:{{after_sale.sku}}</div>
                                                <div v-if="after_sale.custom_option_info">
                                                    <div v-for="(val,label) in after_sale.custom_option_info">
                                                        {{label}}:{{val}}
                                                    
                                                    </div>
                                                </div>
                                                
                                                <dl class="item-options">
                                                </dl>
                                            </td>
                                            
                                            <td class="a-right">
                                                <span class="nobr" ><strong>{{after_sale.qty}}</strong><br>
                                                </span>
                                            </td>
                                            
                                            <td class="a-right ">
                                                <span class="price-excl-tax">
                                                    <span class="cart-price">
                                                        <span class="price">{{after_sale.currency_symbol}}{{after_sale.price}}</span>                    
                                                    </span>
                                                </span>
                                                <br>
                                            </td>
                                            
                                            <td class="a-right last">
                                                <span class="nobr" ><strong>{{after_sale.status}}</strong>
                                                </span><br>
                                                <a v-if="after_sale.can_cancel" @click="returnCancel(after_sale.id)" class="link-aftersaleorder" href="javascript:void(0)" >{{ $t("message.return_cancel") }}</a>
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
            pageInitUrl: root + '/customer/order/returnstatus' ,
            dispatchOrderUrl: root + '/customer/order/returndispatch' ,
            cancelReturnUrl: root + '/customer/order/returncancel' ,
            errormsg:'',
            order:[],
            orderProducts:[],
            after_sale:[],
            refer_url: '',
            correctmsg:'',
            tracking_number: ''
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
            var as_id = this.$route.params.as_id;
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
                    as_id:as_id
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        self.after_sale = reponseData.data.after_sale;
                        
                        console.log('');
                        var traceData = {"refer_url": self.refer_url};
                        var routerQ = self.$route.query
                        for (var k in routerQ) {
                            traceData[k] = routerQ[k]
                        }
                        self.reloadTraceJs(traceData);
                        self.saveReponseHeader(request); 
                    }else if(reponseData.code == 3000006){
                        self.$router.push('/customer/order/aftersalereturn/' + item_id);
                        return;
                    }
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('get customer order info error');
                }
            });
        },
        
        returnCancel :function(as_id){
            var self = this;
            self.loading = true;
            self.errormsg = '';
            self.correctmsg = '';
            $.showIndicator();
            $.ajax({
                url: self.cancelReturnUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                    as_id: as_id
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        console.log('fetch 200');
                        $.toast(self.$i18n.t("message.order_return_cancel_success"));
                        self.saveReponseHeader(request);
                        //self.pageInit();
                        self.$router.push('/customer/order');
                        return;
                    } else {
                        $.toast(self.$i18n.t("message.order_return_cancel_fail"));
                    }
                },
                error:function(){
                    $.toast(self.$i18n.t("message.system_error"));
                    $.hideIndicator();
                    console.log('');
                }
            });
        },
        
        
        dispatchOrder: function(){
            var self = this;
            var as_id = this.$route.params.as_id;
            self.errormsg = '';
            self.correctmsg = '';
            $.showIndicator();
            $.ajax({
                url: self.dispatchOrderUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                    as_id:as_id,
                    tracking_number:self.tracking_number
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