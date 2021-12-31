<template>
  <div id="body" style="font-family:'Yeseva One',sans-serif;" >
    <b-navbar toggleable="lg" type="dark" variant="faded" fixed="top" v-bind:class="{'bg-primary': isUserScrolling || isOpen}">
      <b-navbar-brand style="position:absolute;top:0px;" href="#" ><span style="font-size:35px;font-weight:bold;color:#fff;">KOL幫賣</span></b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" class="ml-auto"></b-navbar-toggle>
      <b-collapse style="margin:auto;" v-model="isOpen" id="nav-collapse" is-nav>
        <b-navbar-nav class="m-auto" >
          <b-nav-item @click="handleClick('about')" >
            <div style="height:35px;line-height:35px;">
              <span style="font-size:20px; margin:auto;font-weight:bold;color:#fff;">KOL陣容</span>
            </div>
          </b-nav-item>
          <b-nav-item @click="handleClick('feature')" >
            <div style="height:35px;line-height:35px;">
              <span style="font-size:20px; font-weight:bold;color:#fff;">重點特色</span>
            </div>
          </b-nav-item>
          <b-nav-item  @click="$router.push('admin/login');">
            <div class="login-btn" style="background-color:#024E82;">
              <i class="el-icon-s-shop" style="font-size:20px;color:white;"/>
              <span style="font-size:20px; color:white; font-weight:bold;"> 商家登入</span>
            </div>
          </b-nav-item>
          <b-nav-item  @click="$router.push('admin/login');">
            <div class="login-btn" style="background-color:#024E82;">
              <i class="el-icon-s-custom" style="font-size:20px;color:white;"/>
              <span style="font-size:20px; color:white; font-weight:bold;"> KOL登入</span>
            </div>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="position:related;height:30vw;min-height:150px;width:100%;background-image:url('/image/welcome/new_hand_shake.jpg');background-repeat: no-repeat;background-position: center;background-size: 100% auto"></div>
    <div id="about" style="width:100%;height:50px;"></div>
    
    <el-row style="margin-top:20px;" class="row d-flex justify-content-center" >
      <div class="text-center" style="width:100%;margin-bottom:20px;">
        <span class="section-title">最強KOL陣容</span>
      </div>
    </el-row>
    
    <el-row class="row d-flex justify-content-center" >
      <el-col v-for="kol in top_kol_list" :key="kol.name" :xs="24" :sm="8" :md="4" :lg="4" :xl="4">
        <div style="padding:5%;">
          <div style="width:100%;text-align:center;">
            <img :src="kol.image_url" class="image drop-shadow"/>
          </div>
          <div style="padding: 14px;">
            <div style="width:100%;text-align:center;">
              <span style="font-size:20px;font-weight:bolder;">{{kol.name}}</span>
            </div>
            <div style="width:100%;text-align:center;max-height:50px;">
              <span>{{kol.description}}</span>
            </div>
            
            <div style="width:100%;text-align:center;cursor:pointer;" @click="$router.push('admin/login');">
              <span class="blink" style="font-size:25px;font-weight:bolder;" >KOL幫我賣</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div id="feature" style="width:100%;height:50px;"></div>
    <el-row style="margin-top:20px;" class="row d-flex justify-content-center" >
      <div class="text-center" style="width:100%;margin-bottom:20px;">
        <span class="section-title">重點特色</span>
      </div>
    </el-row>

    <div style="width:100%;max-width:1200px;margin:auto;">
      <el-row v-for="feature in features_list" :key="feature.title" style="width:100%;margin-bottom:70px;">
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="">
            <img :src="feature.image_url" class="drop-shadow" width="100%">
          </div>
        </el-col>
        <el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="14">
          <div class="p-3">
            <span class="feature-title">{{feature.title}}</span>
            <p class="feature-parag">
              {{feature.description}}
            </p>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="footer-bg footer-bg-format">
      <el-row>
        <div style="text-align:center">
          <img src="/image/logo/logo_no_bg.png" width="200px;">
        </div>
        <div style="text-align:center">
          <span style="font-size:40px; font-weight:bolder;color:white;font-family:Didot, serif;">KOL BUNMAI</span>
        </div>
      </el-row>
      <el-row>
        <div class="row justify-content-center" style="margin-top:20px;"  >
          <div class="text-center">
            <span style="font-size:45px; font-weight:540; color:#fff;">JOIN THE COMMUNITY</span>
          </div>
        </div>
        <div class="row justify-content-center" style="margin-top:30px;" >
          <span style="font-size:18px; font-weight:540; color:#fff;">Contact Us: <a href="mailto:bunmai@example.com" style="color:#ccc" >bunmai@example.com</a></span>
        </div>
        <div class="row justify-content-center" style="margin-top:20px;" >
          <span style="font-size:10px; color:#ccc;">Copyright © 2022 KOL幫賣. All rights reserved.</span><br/>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      navbarColor:"transparent",
      bannerHeight :1000,
      screenWidth :0,
      isOpen:false,
      isUserScrolling: false,
      activeString:null,
      current_path: this.$route.path ? this.$route.path : "/home",
      top_kol_list:[
        {name:"得得廚房", description:"IG超人氣宅男系廚神", image_url:"/image/kol/MARK_SQR.jpeg"},
        {name:"葡萄主委", description:"小紅書億級葡萄銷售員", image_url:"/image/kol/JUWAI_SQR.jpeg"},
        {name:"保養女王Joy", description:"微博唯一美妝信仰", image_url:"/image/kol/JOY_SQR.jpg"},
        {name:"Cindy酥", description:"旅行美食油土伯", image_url:"/image/kol/CINDY_SQR.jpg"},
        {name:"特級吃貨王", description:"元宇宙認證特級吃貨", image_url:"/image/kol/YORK_SQR.jpg"}
      ],

      features_list:[
        {title:"AI智能配對", description:"透過AI深度學習，根據商品性質、品牌銷售數據，從眾多KOL中篩選出業績優異、品牌連結度高的KOL。", image_url:"/image/welcome/feature1.jpg"},
        {title:"即時業績趨勢", description:"A網紅帶來多少流量? B網紅銷售多少商品? 哪一位網紅績效最優? 雲端資料庫即時呈現，讓您將流量一手掌握。", image_url:"/image/welcome/feature_3.jpg"},
      ]
    };
  },
  computed: {},
  
  created() {
    window.addEventListener('scroll', this.handleScroll,true);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  mounted () {
    this.screenWidth =  window.innerWidth;
    this.setSize();
    // 窗口大小发生改变时,调用一次
    window.onresize = () =>{
      this.screenWidth =  window.innerWidth;
      this.setSize();
    }
  },
  
  methods:{
   
    handleClick(element){
      document.getElementById(element).scrollIntoView()
    },
    setSize:function () {
      // 通过浏览器宽度(图片宽度)计算高度
      this.bannerHeight = 355 / 1920 * this.screenWidth;
    },
    handleNavActive(active_text){
      return this.activeString == active_text
    },
    handleScroll (event) {
      this.isUserScrolling = (event.srcElement.scrollTop > 0);
      // console.log(this.isUserScrolling);
    },
  }
};
</script>
<style scope>

.login-btn {
  height:35px;
  line-height:35px; 
  cursor:pointer; 
  width:150px;
  text-align:center;
  border-radius:5%;
}

.image {
  width:100%;
  max-width:200px;
  border-radius: 50%;
  margin:auto;
}

.drop-shadow {
-webkit-filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.7));
filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.7))
}

.section-title{
  font-size:45.2px; 
  font-weight:600; 
  color:#000;
}
.feature-title{
  font-size:40px; 
  font-weight:620; 
  color:#024E82;
}
.feature-parag{
  font-weight: bold;
  font-size:24px;

}

.navbar-custom {
  height: 80px;
}

.overlay {
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  z-index: 1;
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
  background-color:#024E82
}
.footer-bg-format{
  padding-top:75px;
  padding-bottom:100px;
  position:relative;
}

@keyframes fade {
  from { opacity: 1.0; }
  50% { opacity: 0.4;}
  to {opacity: 1.0;}
}
@-webkit-keyframes fade {
  from { opacity: 1.0; }
  50% { opacity: 0.4; }
  to {  opacity: 1.0; }
}
.blink {
  color: #007BFF;
  padding: 10px;
  font-size: 15px;
  height: 60px;
  animation: fade 600ms infinite;
  -webkit-animation: fade 600ms infinite;
}
</style>
