<template>
    <div class="main container one-column content customer_address_list">
        <div class="col-main " >
        
            <div class="account-ds">
                <div class="bar bar-nav account-top-m">
                    
                    <router-link to="/checkout/onepage"  class="button button-link button-nav pull-left">
                        <span class="icon icon-left"></span>
                    </router-link>
                    
                    <h1 class='title'>{{ $t("message.customer_address") }}</h1>
                </div>
            </div>
            <div class="fecshop_message" v-if="errormsg">
                <div class="error-msg">
                    <div>
                        {{errormsg}}
                    </div>
                </div>
            </div>
            
            <div id="billing_address" v-for="(address, index) in address_list">	
                <ul>
                    <li>
                        <div>
                            <p>
                                {{address.first_name}} {{address.last_name}}
                                <router-link :to="'/checkout/onepage/editaddress/' + address.address_id" class="edit_shipping">
                                    <span class="icon icon-edit"></span>
                                </router-link>
                            </p>
                            <p>
                                {{address.country}} {{address.state}} {{address.city}} {{address.area}} {{address.street1}} {{address.street2}} 
                            </p>
                            <p>
                                {{ $t("message.phone") }}:{{address.telephone}}
                                {{ $t("message.zip_code") }}:{{address.zip}}
                            </p>
                        </div>
                        
                        <div class="select_address">
                            <input @click="changeDefaultAddress(address.address_id)" type="checkbox"  v-model="address.is_default" />
                        </div>
                    </li>
                </ul>
            </div>
            
            <div>
                <router-link to="/checkout/onepage/editaddress/0" class="add_new_shipping">
                    {{ $t("message.add_a_shipping_address") }}
                </router-link>
            </div>
            
        </div>
    </div>
</template>


<script>

var root = process.env.API_ROOT;

export default {
    data () {
        return {
            pageInitUrl: root + '/customer/address/lists' ,
            changeDefaultAddressUrl: root + '/customer/address/changedefaultaddress' ,
            errormsg:'',
            address_list:{},
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
        changeDefaultAddress: function(address_id){
            var self = this;
            self.errormsg = '';
            self.correctmsg = '';
            $.showIndicator();
            for (var x in self.address_list) {
                var address = self.address_list[x];
                if (address['address_id'] != address_id) {
                    address['is_default'] = false;
                } else {
                    address['is_default'] = true;
                }
            }
            $.ajax({
                url: self.changeDefaultAddressUrl,
                async: true,
                timeout: 120000,
                type: 'post',
                headers: self.getRequestHeader(),
                data:{ 
                    address_id: address_id
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.setLoginSuccessRedirectUrl('/checkout/onepage/addresslist');
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                       self.$router.push('/checkout/onepage');
                    }
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('init error');
                }
            });
        
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
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.setLoginSuccessRedirectUrl('/checkout/onepage/addresslist');
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        self.address_list = reponseData.data.address_list;
                        console.log('payment info success');
                    }
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('init error');
                }
            });
        }
    }
}
</script>



