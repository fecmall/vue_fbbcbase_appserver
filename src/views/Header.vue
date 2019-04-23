<template>
  <header class="bar bar-nav">
    
    <router-link to="/catalog/allcategory/list"  >
        <span class="icon icon-menu"></span>
    </router-link>
      
	
    <form @submit.prevent="searchSubmit" class="js_topSeachForm" >
            <div class="search-input">
              <label class="icon icon-search" for="search"></label>
              <input v-model="searchText" type="search" id="search" placeholder="Products keyword" value="" />
            </div>
        </form>
	<div class="pull-right top-login-s">
	  <router-link style="padding-right:0.4rem" to="/customer/account/login"  >
            <span class="icon icon-me"></span>
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {
    
    }
  },
  methods: { 
        searchSubmit: function(){
            this.$router.push('/search/'+this.searchText);
        },
  }
}
</script>

<style scoped>


.js_topSeachForm{
        display: inline-block;
    margin-left: 1rem;
    width: auto;
    min-width: 70%;
}

.top-login-s{
    display: inline-block;
    line-height: 2.1rem;
    font-size: 0.7rem;
}
</style>
