<template>
    <div class="content">
        
        <div class="account-ds">
            <div class="bar bar-nav account-top-m">
                <router-link to="/customer/account/index"  class="button button-link button-nav pull-left">
                    <span class="icon icon-left"></span>
                </router-link>
                <h1 class='title'>{{ $t("message.edit_account") }}</h1>
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

        <div class="list-block customer-login  customer-register">
            <div  id="form-validate" autocomplete="off" >
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-media">
                                <i class="icon icon-form-name"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="email" type="text" :placeholder="email_address_str"  style="color:#ccc;" readonly="true" id="customer_email" name="editForm[email]"  title="Email"  class="input-text required-entry" />
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
                                    <input v-model="firstname"  :placeholder="first_name_str" id="firstname" name="editForm[firstname]"  title="First Name"  class="input-text required-entry" type="text"  />
                                    <div class="validation-advice" id="required_current_firstname" style="display:none;">This is a required field.</div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li v-if="show_last_name">
                        <div class="item-content">
                            <div class="item-media">
                                <i class="icon icon-form-name"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="lastname"  type="text" :placeholder="last_name_str" id="lastname" name="editForm[lastname]"  title="Last Name" maxlength="255" class="input-text required-entry" />
                                    <div class="validation-advice" id="required_current_lastname" style="display:none;"><?= Yii::$service->page->translate->__('This is a required field.');?></div>
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li class="control">
                        <div class="change_password_label item-content">
                            <input name="editForm[change_password]" id="change_password" v-model="change_password_is_checked" @click="setPasswordForm()" title="Change Password" class="checkbox" type="checkbox">
                            <label for="change_password">
                                {{ $t("message.change_password") }}
                            </label>
                        </div>
                    </li>
                    
                    <li class="fieldset_pass" v-if="change_password">
                        <div class="item-content">
                            <div class="item-media">
                                <i class="icon icon-form-name"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="current_password" :placeholder="current_password_str" title="Current Password" class="input-text required-entry" name="editForm[current_password]" id="current_password" type="password" />
                                    <div class="validation-advice" id="required_current_password" style="display:none;">This is a required field</div>    
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li class="fieldset_pass" v-if="change_password">
                        <div class="item-content">
                            <div class="item-media">
                                <i class="icon icon-form-name"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="new_password" :placeholder="new_password_str" title="New Password" class="input-text validate-password required-entry" name="editForm[password]" id="password" type="password" />
                                    <div class="validation-advice" id="required_new_password" style="display:none;"><?= Yii::$service->page->translate->__('This is a required field.');?></div>	
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li class="fieldset_pass" v-if="change_password">
                        <div class="item-content">
                            <div class="item-media">
                                <i class="icon icon-form-name"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="confirm_new_password" :placeholder="confirm_new_password_str"  title="Confirm New Password" class="input-text validate-cpassword required-entry" name="editForm[confirmation]" id="confirmation" type="password"  />
                                    <div class="validation-advice" id="required_confirm_password" style="display:none;">This is a required field.</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="clear"></div>
                <div class="buttons-set">
                    <p>
                        <a @click="editAccountInfo()"  href="javascript:void(0)"  id="js_editBtn" class="button button-fill">
                            {{ $t("message.edit_account") }}
                            
                        </a>
                    </p>
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
            pageInitUrl: root + '/customer/editaccount/index' ,
            editAccountUrl: root + '/customer/editaccount/update' ,
            change_password_is_checked:false,
            change_password:false,
            email:'',
            firstname:'',
            lastname:'',
            current_password:'',
            new_password:'',
            confirm_new_password:'',
            
            errormsg:'',
            correctmsg:'',
            minNameLength: 0,
            maxNameLength: 0,
            minPassLength: 0,
            refer_url: '',
            show_last_name:false,
            email_address_str:'',
            first_name_str:'',
            last_name_str:'',
            confirm_new_password_str: '',
            new_password_str: '',
            current_password_str: '',
            maxPassLength: 0
        }
    },
    created: function(){
        this.pageInit();
        this.email_address_str = this.$i18n.t("message.email_address");
        this.first_name_str = this.$i18n.t("message.first_name_cn");
        this.confirm_new_password_str = this.$i18n.t("message.confirm_new_password");
        this.new_password_str = this.$i18n.t("message.new_password");
        this.current_password_str = this.$i18n.t("message.current_password");
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
        setPasswordForm: function(){
            var self = this;
            console.log(self.change_password_is_checked);
            if(self.change_password_is_checked){
                console.log(111);
                self.change_password = false;
            }else{
                console.log(222);
                self.change_password = true;
            }
        },
        editAccountInfo: function(){
            var self = this;
            self.errormsg = '';
            self.correctmsg = '';
            if(self.firstname == ''){
                self.errormsg = 'firstname can not empty';
                return;
            }
            if(self.lastname == ''){
                self.errormsg = 'lastname can not empty';
                return;
            }
            if(self.firstname.length < self.minNameLength || self.firstname.length > self.maxNameLength){
                self.errormsg = 'The firstname must be greater than '+self.minNameLength + ', less than '+ self.maxNameLength;
                return;
            }
            if(self.lastname.length < self.minNameLength || self.lastname.length > self.maxNameLength){
                self.errormsg = 'The lastname must be greater than '+self.minNameLength + ', less than ' + self.maxNameLength;
                return;
            }
            if(self.change_password_is_checked){
                if(self.current_password == ''){
                    self.errormsg = 'current password can not empty';
                    return;
                }
                if(self.new_password == ''){
                    self.errormsg = 'New password can not empty';
                    return;
                }
                if(self.confirm_new_password == ''){
                    self.errormsg = 'confirm new password can not empty';
                    return;
                }
                if(self.new_password != self.confirm_new_password){
                    self.errormsg = 'Password and confirmation password must be consistent';
                    return;
                }
                if(self.new_password.length < self.minPassLength || self.new_password.length > self.maxPassLength){
                    self.errormsg = 'The New password must be greater than '+self.minPassLength + ', less than ' + self.maxPassLength;
                    return;
                }
            }
            // 开始提交更改信息
            $.showIndicator();
            
            var updateData = {
                firstname:self.firstname,
                lastname:self.lastname
            };
            if(self.change_password_is_checked){
                updateData.current_password     = self.current_password;
                updateData.new_password         = self.new_password;
                updateData.confirm_new_password = self.confirm_new_password;
            }
            
            $.ajax({
                url: self.editAccountUrl,
                async: true,
                timeout: 120000,
                type: 'post',
                headers: self.getRequestHeader(),
                data:updateData,
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100003){
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        //self.correctmsg = 'update account info success';
                        $.toast(self.$i18n.t("message.update_account_info_success"));
                    }else if(reponseData.code == 401){
                        self.errormsg = reponseData.data.error;
                    }
                    self.saveReponseHeader(request); 
                    
                },
                error:function(){
                    $.hideIndicator();
                    $.toast(self.$i18n.t("message.system_error"));
                    console.log('login account error');
                }
            });
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
                        self.$router.push('/customer/account/login');
                        return;
                    }else if(reponseData.code == 200){
                        //如果用户登录，则跳转到账户中心页面
                        self.email      = reponseData.data.email;
                        self.firstname  = reponseData.data.firstname;
                        self.lastname   = reponseData.data.lastname;
                        self.minNameLength = reponseData.data.minNameLength;
                        self.maxNameLength = reponseData.data.maxNameLength;
                        self.minPassLength = reponseData.data.minPassLength;
                        self.maxPassLength = reponseData.data.maxPassLength;
                        console.log('get editAccount info success');
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
                    console.log('edit account init page error');
                }
            });
            
        }
    }
}
</script>