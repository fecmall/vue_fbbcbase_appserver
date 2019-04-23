<template>
    <div class="main container one-column content customer_address_list">
        <div class="col-main " >
        
            <div class="account-ds">
                <div class="bar bar-nav account-top-m">
                    
                    <a @click="routerGo()"  href="javascript:void(0)" class="button button-link button-nav pull-left">
                        <span class="icon icon-left"></span>
                    </a>
                    
                    <h1 class='title'>{{ $t("message.order_customer_address") }}</h1>
                </div>
            </div>
            <div class="fecshop_message" v-if="errormsg">
                <div class="error-msg">
                    <div>
                        {{errormsg}}
                    </div>
                </div>
            </div>
            
            <div class="list-block customer-login  customer-register">
                <div class="addressedit" id="form-validate" >
                    <input v-model="address.address_id" name="address[address_id]"  type="hidden">            
                    <ul>
                        
                        <li>
                            <div class="item-content">
                                <div class="item-media">
                                    <i class="icon icon-form-name"></i>
                                </div>
                                <div class="item-inner">
                                    <div class="item-input">
                                        <input v-model="address.first_name" class="input-text required-entry" maxlength="255" :placeholder="customer_name" title="Name"  name="address[first_name]" id="firstname" type="text">
                                    </div>
                                </div>
                            </div>
                        </li>	
                        
                        <li>
                            <div class="item-content">
                                <div class="item-media">
                                    <i class="icon icon-form-name"></i>
                                </div>
                                <div class="item-inner">
                                    <div class="item-input">
                                        <input type="text" id='city-picker' />
                                    </div>
                                </div>
                            </div>
                        </li>	
                        
                        <li>
                            <div class="item-content">
                                <div class="item-media">
                                    <i class="icon icon-form-name"></i>
                                </div>
                                <div class="item-inner">
                                    <div class="item-input">
                                        <input v-model="address.street1" class="input-text required-entry" maxlength="255" :placeholder="street1" value="" name="address[street1]" id="street1" type="text" />
                                    </div>
                                </div>
                            </div>
                        </li>	
                        
                        <li>
                            <div class="item-content">
                                <div class="item-media">
                                    <i class="icon icon-form-name"></i>
                                </div>
                                <div class="item-inner">
                                    <div class="item-input">
                                        <input v-model="address.telephone" class="input-text required-entry" maxlength="255" :placeholder="telephone"  title="telephone"  name="address[telephone]" id="lastname" type="text">
                                    </div>
                                </div>
                            </div>
                        </li>	
                        
                        
                        <li>
                            <div class="item-content">
                                <div class="item-media">
                                    <i class="icon icon-form-name"></i>
                                </div>
                                <div class="item-inner">
                                    <div class="item-input">
                                        <input v-model="address.zip" class="input-text required-entry" maxlength="255" :placeholder="zip_code" value="" name="address[zip]" id="zip" type="text">
                                    </div>
                                </div>
                            </div>
                        </li>	
                        
                    </ul>	
                    <div class="clear"></div>
                    <div class="buttons-set">
                        <p>
                            <a external href="javascript:void(0)" @click="submit_address()"   id="js_registBtn" class="button button-fill">
                                {{ $t("message.save_address_and_continue") }}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
    var root = process.env.API_ROOT;
    var defaultCity = "山东 青岛 李沧区";

    export default {
        data () {
            return {
                pageInitUrl: root + '/customer/address/e' ,
                submitAddressUrl: root + '/customer/address/save' ,
                errormsg:'',
                address:{},
                order_info: {},
                customer_name: '',
                telephone: '',
                street1: '',
                zip_code: '',
                displaySubmitOrder:'none'
            }
        },
        created: function(){
            this.address.state_city = '山东 青岛 李沧区';
            this.customer_name = this.$i18n.t("message.customer_name");
            this.telephone = this.$i18n.t("message.phone");
            this.street1 = this.$i18n.t("message.street1");
            this.zip_code = this.$i18n.t("message.zip_code");
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
            submit_address: function(){
                var self = this;
                self.errormsg = '';
                self.correctmsg = '';
                console.log(self.address);
                
                if(!self.address.first_name){ 
                    self.errormsg = self.$i18n.t("message.first_name_can_not_empty"); 
                    return;
                }
                self.address.state_city = $("#city-picker").val();
                if(!self.address.state_city){ 
                    self.errormsg = self.$i18n.t("message.state_city_can_not_empty"); 
                    return;
                }
                if(!self.address.telephone){ 
                    self.errormsg = self.$i18n.t("message.telephone_can_not_empty"); 
                    return;
                }
                if(!self.address.street1){ 
                    self.errormsg = self.$i18n.t("message.street1_can_not_empty"); 
                    return;
                }
                if(!self.address.zip){ 
                    self.errormsg = self.$i18n.t("message.zip_can_not_empty"); 
                    return;
                }
                $.showIndicator();
                self.address.is_default = true;
                self.address.country = 'CN';
                $.ajax({
                    url: self.submitAddressUrl,
                    async: true,
                    timeout: 120000,
                    type: 'post',
                    headers: self.getRequestHeader(),
                    data:{ 
                        address: self.address
                    },
                    success:function(reponseData, textStatus,request){
                        $.hideIndicator();
                        if(reponseData.code == 1100003){
                            self.setLoginSuccessRedirectUrl('/checkout/onepage/addresslist');
                            self.$router.push('/customer/account/login');
                            return;
                        } else if(reponseData.code == 200){
                            self.$router.push('/checkout/onepage');
                        } else if(reponseData.data && reponseData.data.errors){   
                            $.toast(reponseData.data.errors);
                        } else {
                            $.toast(self.$i18n.t("message.save_fail"));
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
                console.log("address init");
                setTimeout(function(){
                    $('#city-picker').cityPicker({toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button><h1 class="title">选择收货地址</h1></header>'});
                    $.init();
                    $("#city-picker").val(defaultCity);
                },800);
            }
        }
    }
</script>



