<template>
    <div class="content">
        <div class="shopping-cart-img">
            {{ $t("message.login") }}
            <router-link to="/customer/account/register"  class="f-right">
                {{ $t("message.register") }}
            </router-link>
        </div>
        <div class="fecshop_message" v-if="errormsg">
            <div class="error-msg">
                <div>
                    {{errormsg}}
                </div>
            </div>
		</div>
        <div class="list-block customer-login">
            <div  id="login-form" class="account-form">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon icon-form-email"></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="email" name="editForm[email]" value="" id="email" type="text" :placeholder="t_email">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon icon-form-password"></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="password" type="password" :placeholder="t_password"  name="editForm[password]" class="input-text required-entry validate-password" id="pass" title="Password" >
                                </div>
                            </div>
                        </div>
                    </li>
                    <li v-if="loginCaptchaActive">
                        <div class="item-content">
                            <div class="item-media"><i class="icon icon-form-password"></i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input v-model="captcha" placeholder="captcha" type="text" name="editForm[captcha]" value="" size=10 class="login-captcha-input">
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
                        <a @click="loginAccount()" href="javascript:void(0)"  id="js_registBtn" class="button button-fill">
                            {{ $t("message.sign_in") }}
                        </a>
                    </p>
                    <router-link to="/customer/account/forgotpassword"  class="f-left">
                        {{ $t("message.forgot_password") }}
                    </router-link>
                </div>
                <div class="clear"></div>
                <!--
                <div class="third_login" >
                    <div class="fago_login">
                        <img @click="facebookLogin()" src="//img.fancyecommerce.com/images/facebook.jpg" /><br/>
                        <img @click="googleLogin()"src="//img.fancyecommerce.com/images/google.jpg" /><br/>
                    </div>
                    <div class="col2-set">
                        <div class="col-1 new-users">
                            <div class="buttons-set">
                                
                            </div>
                        </div>
                        <div class="col-2 registered-users">
                            
                        </div>
                    </div>
                </div>
                -->
            </div>
        </div>	  
    </div>	
</template>

<script>

var root = process.env.API_ROOT;
var website_root = process.env.WEBSITE_ROOT;

export default {
    data () {
        return {
            getCaptchaUrl: root + '/customer/site/captcha' ,
            pageInitUrl: root + '/customer/login/index' ,
            accountLoginUrl: root + '/customer/login/account' ,
            googleLoginUrl:'',
            facebookLoginUrl:'',
            captchaFile:'',
            email:'',
            captcha:'',
            password:'',
            errormsg:'',
            isLogin:false,
            refer_url: '',
            t_phone: '',
            t_email: '',
            t_password: '',
            loginCaptchaActive:false  // 是否开启登录验证码
        }
    },
    created: function(){
        this.pageInit();
        this.t_phone = this.$i18n.t("message.t_phone");
        this.t_email = this.$i18n.t("message.t_e_mail");
        this.t_password = this.$i18n.t("message.t_password");
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
    methods:{
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
                    googleRedirectUrl:website_root+'/customer/google/loginv',
                    facebookRedirectUrl:website_root+'/customer/facebook/loginv'
                    
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    if(reponseData.code == 1100006){
                        self.isLogin = reponseData.data.isLogin;
                        self.$router.push('/customer/account/index');
                        return;
                    }else if(reponseData.code == 200){
                        //如果用户登录，则跳转到账户中心页面
                        self.loginCaptchaActive = reponseData.data.loginCaptchaActive;
                        self.googleLoginUrl = reponseData.data.googleLoginUrl;
                        self.facebookLoginUrl = reponseData.data.facebookLoginUrl;
                        var traceData = {"refer_url": self.refer_url};
                        var routerQ = self.$route.query
                        for (var k in routerQ) {
                            traceData[k] = routerQ[k]
                        }
                        self.reloadTraceJs(traceData);
                        self.saveReponseHeader(request); 
                        console.log(self.loginCaptchaActive);
                        if(self.loginCaptchaActive){
                            console.log('begin get login captcha');
                            self.getLoginCaptcha();
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
        googleLogin: function(){
            var self = this;
            var screenX     = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
			var screenY     = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
			var outerWidth  = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth;
			var outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22);
			var width    = 800;
			var height   = 450;
			var left     = parseInt(screenX + ((outerWidth - width) / 2), 10);
			var top      = parseInt(screenY + ((outerHeight - height) / 2.5), 10);
			var features = (
				'width=' + width +
				',height=' + height +
				',left=' + left +
				',top=' + top
			);
            console.log('googleUrl'+self.googleLoginUrl);  
            var newwindow = window.open(self.googleLoginUrl,'Login_by_facebook',features);
            if (window.focus) {
                newwindow.focus()
            }
            return false;
        },
        facebookLogin: function(){
            var self = this;
            var screenX     = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
			var screenY     = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
			var outerWidth  = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth;
            var outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22);
            var width    = 800;
			var height   = 450;
			var left     = parseInt(screenX + ((outerWidth - width) / 2), 10);
			var top      = parseInt(screenY + ((outerHeight - height) / 2.5), 10);
			var features = (
				'width=' + width +
				',height=' + height +
				',left=' + left +
				',top=' + top
			);
            console.log('facebookUrl'+self.facebookLoginUrl);  
            var newwindow=window.open(self.facebookLoginUrl,'Login_by_facebook',features);
            if (window.focus) {
                newwindow.focus()
            }
            return false;
        },
        loginAccount: function(){
            var self = this;
            var email = self.email;
            var password = self.password;
            var msgArr = [];
            self.errormsg = '';
            var captcha = self.captcha;
            if(self.loginCaptchaActive){
                if(!captcha){
                    msgArr.push(self.$i18n.t("message.captcha_cannot_blank"));
                }
            }
            if(!email){
                msgArr.push(self.$i18n.t("message.email_cannot_blank"));
            }
            if(!password){
                msgArr.push(self.$i18n.t("message.password_cannot_blank"));
            }
            if(msgArr.length > 0){
                self.errormsg = msgArr.join(",");
                return;
            }
            var cookies = self.getTraceAllCookie();
            $.showIndicator();
            $.ajax({
                url: self.accountLoginUrl,
                async: true,
                timeout: 120000,
                type: 'post',
                headers: self.getRequestHeader(),
                data:{ 
                    email: email,
                    password: password,
                    captcha: captcha,
                    cookies: cookies
                },
                success:function(reponseData, textStatus,request){
                    $.hideIndicator();
                    var code = reponseData.code;
                    self.$emit('update-cart-count', reponseData.data.cart_qty);
                    if(code == 200){
                        console.log('account login success');
                        self.saveReponseHeader(request); 
                        var loginSuccessUrl = self.getLoginSuccessRedirectUrl();
                        if(loginSuccessUrl){
                            self.$router.push(loginSuccessUrl);
                        }else{
                            self.$router.push('/customer/account/index');
                        }
                    }else if(code == 3000011){    
                        $.toast(self.$i18n.t("message.user_account_need_enable"));
                    }else if(code == 1100006){
                        console.log('account has login');
                        self.saveReponseHeader(request); 
                        self.$router.push('/customer/account/index');
                    }else if(code == 1000007){
                        msgArr.push(self.$i18n.t("message.captcha_is_not_right"));
                    }else if(code == 1100002){
                        msgArr.push(self.$i18n.t("message.phone_or_password_is_not_right"));
                    }else{
                        msgArr.push(self.$i18n.t("message.login_error"));
                    }
                    if(msgArr.length > 0){
                        self.errormsg = msgArr.join(",");
                    }
                    self.saveReponseHeader(request); 
                    
                },
                error:function(){
                    $.toast(self.$i18n.t("message.system_error"));
                    $.hideIndicator();
                    console.log('login account error');
                }
            });
           
        },
        reflushCaptcha: function(){
            this.getLoginCaptcha();
        },
        redirectRegisterPage: function(){
            this.$router.push('/customer/account/register');
        }, 
        
        getLoginCaptcha: function(){
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
                    $.toast(self.$i18n.t("message.system_error"));
                    $.hideIndicator();
                    console.log('get get Category info error');
                }
            });
        
        }
    }
}
</script>
