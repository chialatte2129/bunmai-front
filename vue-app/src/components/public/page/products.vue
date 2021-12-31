<template>
  <div id="body" style="font-family:'Yeseva One',sans-serif;" >
    <b-navbar toggleable="lg" type="light" variant="faded" fixed="top" v-bind:class="{'bg-success': true}">
      <b-navbar-brand href="#" ><span style="font-size:30px;font-weight:bold;color:#fff;">我的賣場</span></b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item>
          <cartItem />
        </b-nav-item>          
      </b-navbar-nav>
    </b-navbar>
    <div style="position:related;height:300px;width:100%;background-image:url('/image/welcome/gress_land.jpg');background-repeat: no-repeat;background-position: center;background-size: 100% 100%"></div>
    
    <div style="width:100%;text-align:center">
      <span style="font-size:60px;">推薦商品</span>
    </div>
    <div style="width:100%;height:50px;"></div>
    <el-row :gutter="20" class="row d-flex justify-content-center" >
      <el-col v-for="item in products"  :xs="24" :sm="8" :md="4" :lg="4" :xl="4">
        <el-card :body-style="{ padding: '0px' }" style="cursor:pointer;margin-bottom:20px;" @click.native="handleClick(item.id)">
          <div class="image-box" >
            <img :src="item.image_url" intrinsicsize="16x9" class="image">
          </div> 
          <div style="padding: 14px;">
            <div style="height:80px;">
              <span style="font-size:20px">{{item.title}}</span>
            </div>
            <div style="height:auto;text-align:right;">
              <span style="color:red; ">$ <span style="color:red; font-weight:bolder;font-size:30px;">{{item.sale_price}}</span></span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="width:100%;height:50px;"></div>
    <div class="d-flex justify-content-center footer-bg" style="padding-top:75px;padding-bottom:100px;position:relative;">
      <div class="row justify-content-center">
        <div class="col-lg-12 align-self-center" >
          <div class="row justify-content-center" style="margin-top:20px;"  >
            <div class="text-center">
              <img src="/image/logo/logo_fall.png" width="200px;">
            </div>
          </div>
          <div class="row justify-content-center" style="margin-top:30px;" >
            <span style="font-size:18px; font-weight:540; color:#fff;">Contact Us: <a href="mailto:bunmai@example.com" style="color:#ccc" >bunmai@example.com</a></span>
          </div>
          <div class="row justify-content-center" style="margin-top:20px;" >
            <span style="font-size:10px; color:#ccc;">Copyright © 2021 KOL幫賣. All rights reserved.</span><br/>
          </div>
        </div>
      </div>
      
    </div>
  </div>
  
</template>

<script>
import cartItem from "./cart_item.vue"
export default {
  name: "products",
  components: {
    cartItem
  },
  data() {
    return {
      isUserScrolling: false,
      isOpen: false,
      buy_number:0,
      products:[
        {
          id:"CRAB",  
          title:"【正宗老饕級】日月潭吮指大閘蟹x6隻(5兩九-6兩半/隻)",
          sale_price:"3,718",
          image_url:"/image/product/crab.jpg"
        },
        {
          id:"COFFEE",  
          title:"【蒙恩咖啡】耶路撒冷手工烘焙咖啡豆",
          sale_price:"2,580",
          image_url:"/image/product/coffee_1.jpg"
        },
        {
          id:"GRAPE",  
          title:"【法國貴族晚宴必備】冰川淬煉洗禮聖母峰葡萄 600公克/箱",
          sale_price:"1,888",
          image_url:"/image/product/grape_1.jpeg"
        },
        {
          id:"MEAL",
          title:"【米其林一星激推】虎虎生風猛虎垂涎年菜組",
          sale_price:"3,688",
          image_url:"/image/product/MEAL_2.png"
        },
        {
          id:"LOTION",
          title:"【限量100瓶】28逆齡回春水 100ml/瓶",
          sale_price:"2,699",
          image_url:"/image/product/water.jpg"
        }
      ]
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll,true);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    
  },
  methods: {
    

    handleScroll (event) {
      this.isUserScrolling = (event.srcElement.scrollTop > 0);
    },

    handleClick(id){
      console.log(id);
      this.$router.push("products/"+id)
    }
   
  }
};
</script>
<style scope>
.image-box{
  width:100%;
  overflow: hidden;
}

.image{
  width:100%;
  height:auto;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.section-title{
  font-size:45.2px; 
  font-weight:600; 
  color:#000;
}
.feature-title{
  font-size:40px; 
  font-weight:620; 
  color:#9E2227;
}
.feature-parag{
  font-weight: bold;
  font-size:18.08px;

}

.navbar-custom {
  height: 80px;
}


.nav-item{
  padding-left: 20px;
  padding-right: 20px;
}
.top{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.footer-bg{
  background-color:#2F4F4F
}
</style>

