<template>
    <div class="content">
        <div class="shopping-cart-img">
            {{ $t("message.register") }}
            <router-link to="/customer/account/login"  class="f-right">
                {{ $t("message.login") }}
            </router-link>
        </div>
        <div class="fecshop_message" v-if="errormsg">
            <div class="error-msg">
                <div>
                    {{errormsg}}
                </div>
            </div>
		</div>
        <div class="list-block customer-login  customer-register">
            <div  id="register-form" class="account-form">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-media">
                                <i class="icon icon-form-name"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-input">
                                <input v-model="firstname" class="required-entry" type="text" :placeholder="t_first_name"  id="firstname" name="editForm[firstname]"  title="First Name">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon "></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="phone" class="required-entry  validate-phone"  type="text" :placeholder="t_phone"  name="editForm[phone]" id="phone"  title="phone">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon icon-form-email"></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="email" class="required-entry  validate-email"  type="email" :placeholder="t_e_mail"  name="editForm[email]" id="email_address"  title="Email Address">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon icon-form-password"></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="password"  type="password" :placeholder="t_password"  name="editForm[password]" class="input-text required-entry validate-password" id="password" title="Password" >
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon icon-form-password"></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="confirmationPassword" type="password" :placeholder="t_confirm_password"  name="editForm[confirmation]" title="Confirm Password" id="confirmation" >
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li v-if="registerCaptchaActive">
                        <div class="item-content">
                            <div class="item-media"><i class="icon icon-form-password"></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="captcha" :placeholder="t_captcha" type="text" name="editForm[captcha]" value="" size=10 class="login-captcha-input">
                                    <img class="login-captcha-img"  title="click refresh" :src="captchaFile" align="absbottom" ></img>
                                    <span @click="reflushCaptcha()" class="icon icon-refresh"></span>
                                </div>
                            </div>
                        </div>
                    </li>	
                    	
                </ul>
                <div class="clear"></div>
                <div class="buttons-set">
                    <p>
                        <a @click="registerAccount()" href="javascript:void(0)" id="js_registBtn" class="button button-fill">
                            {{ $t("message.register_account") }}
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
            getCaptchaUrl: root + '/customer/site/captcha' ,
            pageInitUrl: root + '/customer/register/index' ,
            accountRegisterUrl: root + '/customer/register/account' ,
            firstname:'',
            lastname:'',
            email:'',
            phone:'',
            password:'',
            is_subscribed:true,
            confirmationPassword:'',
            captcha:'',
            captchaFile:'',
            registerCaptchaActive:false,  // 是否开启注册验证码
            minNameLength: 0,
            maxNameLength: 0,
            minPassLength: 0,
            maxPassLength: 0,
            refer_url: '',
            errormsg:'',
            t_captcha: '',
            t_confirm_password: '',
            t_password: '',
            t_e_mail: '',
            t_phone: '',
            t_first_name: ''
        }
    },
    created: function(){
        this.pageInit();
        this.t_captcha = this.$i18n.t("message.t_captcha");
        this.t_confirm_password = this.$i18n.t("message.t_confirm_password");
        this.t_password = this.$i18n.t("message.t_password");
        this.t_e_mail = this.$i18n.t("message.t_e_mail");
        this.t_phone = this.$i18n.t("message.t_phone");
        this.t_first_name = this.$i18n.t("message.t_first_name");
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
        registerAccount: function(){
            var self = this;
            var firstname = self.firstname;
            var lastname = self.lastname;
            var email = self.email;
            var phone = self.phone;
            var password = self.password;
            var is_subscribed = self.is_subscribed;
            var confirmationPassword = self.confirmationPassword;
            var msgArr = [];
            self.errormsg = '';
            var captcha = self.captcha;
            if(self.registerCaptchaActive){
                if(!captcha){
                    msgArr.push(self.$i18n.t("message.captcha_cannot_blank"));
                }
            }
            if(!email){
                msgArr.push(self.$i18n.t("message.email_cannot_blank"));
            }
            if(!phone){
                msgArr.push(self.$i18n.t("message.phone_cannot_blank"));
            }
            if(!password){
                msgArr.push(self.$i18n.t("message.password_cannot_blank"));
            }
            if(!firstname){
                msgArr.push(self.$i18n.t("message.firstname_cannot_blank"));
            }
            if(confirmationPassword != password){
                msgArr.push(self.$i18n.t("message.password_confirm_cannot_blank"));
            }
            if(password.length < self.minPassLength || password.length > self.maxPassLength){
                msgArr.push(self.$i18n.t("message.the_password_must_be_greater_than")+self.minPassLength + ', ' + self.$i18n.t("message.less_than") + self.maxPassLength);
            }
            if(firstname.length < self.minNameLength || firstname.length > self.maxNameLength){
                msgArr.push(self.$i18n.t("message.the_firstname_must_be_greater_than")+self.minNameLength + ', ' + self.$i18n.t("message.less_than")+ self.maxNameLength);
            }
            if(msgArr.length > 0){
                self.errormsg = msgArr.join(",");
                return;
            }
            var cookies = self.getTraceAllCookie();
            $.showIndicator();
            $.ajax({
                url: self.accountRegisterUrl,
                async: true,
                timeout: 120000,
                type: 'post',
                headers: self.getRequestHeader(),
                data:{ 
                    email:email,
                    phone:phone,
                    password: password,
                    firstname: firstname,
                    lastname: lastname,
                    is_subscribed: is_subscribed,
                    captcha: captcha,
                    cookies: cookies
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    var code = reponseData.code;
                    if(code == 200){
                        console.log('account login success');
                        self.saveReponseHeader(request); 
                        self.$router.push('/customer/account/login');
                    }else if(code == 3000011){    
                        $.toast(self.$i18n.t("message.user_register_success_and_need_enable"));
                        self.$router.push('/customer/account/login');
                    }else if(code == 1100006){
                        console.log('account has login');
                        self.errormsg = 'account has logined';
                        self.saveReponseHeader(request); 
                        //self.$router.push('/customer/account/index');
                    }else if(code == 1100007){
                        var content = reponseData.data.error;
                        self.errormsg = content;
                    }else{
                        self.errormsg = 'register account error';
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
                    if(reponseData.code == 400){
                        self.isLogin = reponseData.data.isLogin;
                        self.$router.push('/customer/account/index');
                        return;
                    }else if(reponseData.code == 200){
                        //如果用户登录，则跳转到账户中心页面
                        self.registerCaptchaActive = reponseData.data.registerCaptchaActive;
                        self.minNameLength = reponseData.data.minNameLength;
                        self.maxNameLength = reponseData.data.maxNameLength;
                        self.minPassLength = reponseData.data.minPassLength;
                        self.maxPassLength = reponseData.data.maxPassLength;
                        console.log('get register info success');
                        var traceData = {"refer_url": self.refer_url};
                        var routerQ = self.$route.query
                        for (var k in routerQ) {
                            traceData[k] = routerQ[k]
                        }
                        self.reloadTraceJs(traceData);
                        self.saveReponseHeader(request); 
                        console.log(self.registerCaptchaActive);
                        if(self.registerCaptchaActive){
                            console.log('begin get register captcha');
                            self.getRegisterCaptcha();
                        }
                    }
                    
                },
                error:function(){
                    $.toast(self.$i18n.t("message.system_error"));
                    $.hideIndicator();
                    console.log('get get Category info error');
                }
            });
            
        },
        reflushCaptcha: function(){
            this.getRegisterCaptcha();
        },
        redirectLoginPage: function(){
            this.$router.push('/customer/account/login');
        }, 
       
        getRegisterCaptcha: function(){
            var self = this;
            $.showIndicator();
            $.ajax({
                url: self.getCaptchaUrl,
                async: true,
                timeout: 120000,
                type: 'get',
                headers: self.getRequestHeader(),
                data:{ 
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 200){
                        self.captchaFile = "data:image/gif;base64," + reponseData.data.image;
                        self.saveReponseHeader(request); 
                    }
                    
                },
                error:function(){
                    $.hideIndicator();
                    console.log('get get Category info error');
                }
            });
        
        }
    
    }
}
</script>