<template>
    <div class="content" >
        <div class="Z_con2_2">
            <div class="F_wd_top_con2">
                <div class="F_wd_top_con2_l" id="wrapper1">
                    <div class="menu-left-bar">
                        <ul class="sy"  >
                            <li   v-for="(item, index) in menuList" :class="item.current ? 'current' : '' "   @click="showItem(item, index)">
                                    {{item.name}}  
                            </li>
                            
                        </ul>
                    </div>
                </div>
                <div  class="F_wd_top_con2_r" id="wrapper2" >
                    <div v-if="item.child"  class="menu-content" v-for="(item, index) in menuList">
                         <ul   class="by" :style=" item.current ? 'display: block' : '' " >
                            <li v-for="(childItem, childIndex) in item.child"  class="F_wd_top_con2_r_borb1" :class="childItem.current ? 'F_wd_top_con2_r_borb2' : '' "   @click="showItemHover(item.child, childItem, childIndex)">
                                <router-link :to="childItem.url" >
                                    {{childItem.name}}
                                </router-link>    
                            </li>
                            
                         </ul>
                    </div>
                    
                    
                </div>
             </div>
        </div>
    </div>
</template>
<script>
import MugenScroll from 'vue-mugen-scroll'
var root = process.env.API_ROOT;
export default {
  
  data () {
    return {
        menuList:{},  
        getMenuUrl: root + '/general/base/menu'      
    }
  },
  created: function(){
    this.getMenu() ;
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
    getMenu: function(){
        var self = this; 
        $.showIndicator();
        $.ajax({
            url: self.getMenuUrl,
            async: true,
            timeout: 120000,
            dataType: 'json', 
            type: 'get',
            headers: self.getRequestHeader(),
            data:{ 
            },
            success:function(reponseData, textStatus,request){
                $.hideIndicator();
                if(reponseData.code == 200){
                    self.menuList = reponseData.data.menu_list;
                    self.saveReponseHeader(request); 
                }
            },
            error:function(){
                $.hideIndicator();
                $.toast(self.$i18n.t("message.system_error"));
                console.log('get get Category info error');
            }
        });
    },
    showItem: function(item, index){
        var self = this;
        for (var x in self.menuList) {
            self.menuList[x].current = "";
        }
        self.menuList[index].current = 'current';
    
    
    },
    showItemHover(itemChild, childItem, childIndex){
        var self = this;
        for (var x in itemChild) {
            itemChild[x].current = "";
        }
        
        itemChild[childIndex].current = 'current';
    
    }
  }
}
$(document).ready(function(){
    $.init();
    
    //算高度-无头无尾
    $(".Z_con").css("height",($(window).height()/16-3.3)+"em");
    $(".Z_con2").css("height",($(window).height()/16-5.8)+"em");
    $(".Z_con2_2").css("height",($(window).height()/16-5.8)+"em");
    
    $(".F_wd_top_con2_l").css("height",($(window).height()/16-5.4)+"em");
    $(".F_wd_top_con2_r").css("height",($(window).height()/16-5.4)+"em");
    
    $(".F_wd_top_con2_l_2").css("height",($(window).height()/16-8.6)+"em");
    $(".F_wd_top_con2_r_2").css("height",($(window).height()/16-8.6)+"em");

});
</script>

<style scoped>
    *,body,div,p,table,td,input,option,textarea,select{margin:0; padding:0; font-size:1em; color:#666666; font-family:'微软雅黑';}
    body {overflow:hidden;}
    span,b {display:inline-block; font-weight:normal;}
    h1,h2,h3,h4,h5 {font-weight:normal;}
    ul {list-style-type:none; margin:0; padding:0;}
    table {border-collapse:collapse;}
    table tr th {font-weight:normal;}
    small{font-size:inherit;  color:#F00;  }
    .bg_none {background:none;}
    .displayN {display:none;} 
    .clear {clear:both;}

    .float_l {float:left;}
    .float_r {float:right;}

    .txtL {text-align:left;}
    .txtC {text-align:center;}
    .txtR {text-align:right;}

    .height025 {height:.25em; clear:both;}
    .height05 {height:.5em; clear:both;}
    .height1 {height:1em; clear:both;}
    .height15 {height:1.5em; clear:both;}
    .height13 {height:1.3em; clear:both;}
    .height2 {height:2em; clear:both;}
    .height3 {height:3em; clear:both;}
    .height4 {height:4em; clear:both;}
     
    .height10{height:7em; clear:both;}
    .font_07 {font-size:0.7em;}
    .font_08 {font-size:0.8em;}
    .font_1_1 {font-size:1.1em;}
    .bold {font-weight:bold;}
     
    .bg_body {background:#efeff4;}
    .body_over_auto {overflow:auto;}
    /**文字颜色**/

    .txt_blue {color:#007aff;}
    .txt_red {color:#fe0a0b;}
    .txt_org {color:#ff7900;} 

    /*表单样式*/
    input:focus{outline: none;}
     
    .width_100 {width:100%; padding-right:0;} 
    .width_5em {width:5em;}
    .width_6em {width:6em;}
    .width_7em {width:7em;}
    .width_10em {width:10em;}
    .width_11em {width:11em;}
    .width_12em {width:12em;}
    .width_15em {width:15em;}

    
    .F_wd_top_con2{width:100%; min-height:4em; background:#fff; border-top:0.1em solid #ccc;}

    .F_wd_top_con2_l{width:40%; background:#f2f2f2; float:left;}
    .F_wd_top_con2_l ul li{ line-height:3.2em; text-indent:1em; border-bottom:0.1em solid #f2f2f2;}
    .F_wd_top_con2_r{width:60%;  float:right;}
    .F_wd_top_con2_r ul li{ line-height:3.2em; text-indent:1em;}

    .F_wd_top_con2_r_borb1{ border-bottom:0.1em solid #ccc;}
    .F_wd_top_con2_r_borb2{ border-bottom:0.1em solid #0894ec; color:#0894ec;}


    .F_wd_top_con2_l_1{ width:40%; float:left;}
    .F_wd_top_con2_l_1 ul li{ line-height:3.2em; text-indent:1em; }
    .F_wd_top_con2_r_1{ width:55%;  float:right;}
    .F_wd_top_con2_r_1 ul li{ line-height:3.2em; text-indent:1em;}

    .F_wd_top_con2_l_2{width:40%; background:#f2f2f2; float:left;}
    .F_wd_top_con2_l_2 ul li{ line-height:3.2em; text-indent:1em; border-bottom:0.1em solid #f2f2f2;}
    .F_wd_top_con2_r_2{width:55%;  float:right;}
    .F_wd_top_con2_r_2 ul li{ line-height:3.2em; text-indent:1em;}


    .current{background: #fff; color: #0894ec;}
    .by{display: none;}
    .menu-left-bar{
        background:#f2f2f2;
    }
    @media screen and (min-height:660px){}

</style>