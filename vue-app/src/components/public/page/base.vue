<template>
  <div id="body" style="font-family:'Yeseva One',sans-serif;" >
    <b-navbar toggleable="lg" type="dark" variant="faded" fixed="top" v-bind:class="{'bg-primary': isUserScrolling || isOpen}">
      <b-navbar-brand style="position:absolute;top:0px;" href="#" ><span style="font-size:30px;font-weight:bold;color:#fff;">KOL幫賣</span></b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" class="ml-auto"></b-navbar-toggle>
      <b-collapse style="margin:auto;" v-model="isOpen" id="nav-collapse" is-nav>
        <b-navbar-nav class="m-auto" >
          <b-nav-item @click="handleClick('about')" ><span style="font-weight:bold;color:#fff;">關於我們</span></b-nav-item>
          <b-nav-item @click="handleClick('feature')" ><span style="font-weight:bold;color:#fff;">服務提供</span></b-nav-item>
          <b-nav-item>
            <el-button type="primary" size="mini" style="margin-top:-5px;" @click="$router.push('admin/login');">商家登入</el-button>
          </b-nav-item>
          <b-nav-item >
            <el-button type="success" size="mini" style="margin-top:-5px;" @click="$router.push('admin/login');">KOL登入</el-button>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="position:related;height:30vw;min-height:150px;width:100%;background-image:url('/image/welcome/hand_shake.jpg');background-repeat: no-repeat;background-position: center;background-size: 100% auto"></div>
    <div id="about" style="width:100%;height:50px;"></div>
    <el-row style="margin-top:20px;" class="row d-flex justify-content-center" >
      <div class="text-center" style="width:100%;margin-bottom:20px;">
        <span class="section-title">最強KOL陣容</span>
      </div>
    </el-row>
    <el-row class="row d-flex justify-content-center" >
      <el-col :xs="24" :sm="8" :md="4" :lg="4" :xl="4">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>網紅1號</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">幫我賣</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="8" :md="4" :lg="4" :xl="4">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>網紅2號</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">幫我賣</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="8" :md="4" :lg="4" :xl="4">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>網紅3號</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">幫我賣</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="8" :md="4" :lg="4" :xl="4">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>網紅4號</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">幫我賣</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="8" :md="4" :lg="4" :xl="4">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>網紅5號</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">幫我賣</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
     
    </el-row>
    <div id="feature" style="width:100%;height:50px;"></div>
    <div class="d-flex justify-content-center content1-bg">
      <div class="content-bg-filter">
        <div class="row d-flex justify-content-center" style="height:100%">
          <div class="col-lg-9 align-self-center" >
            <div class="row">
              <div class="text-center" style="width:100%;margin-bottom:20px;">
                <span class="section-title">我們的服務</span>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-lg-7 pt-4 pt-lg-0 align-self-center">
                <div class="p-3">
                  <span style="font-size:45px; font-weight:620; color:#9E2227;">第一項服務</span>
                  <p class="feature-parag">
                    Pick one of the 3 abilities offered to you at the beginning of every wave! Form your own ability tree and take on waves of relentless zombie attacks.
                  </p>
                </div>
              </div>
              <div class="col-lg-5 align-self-center">
                  <div style="background-color:none">
                    <img src="/image/logo/logo_fall.png" width="100%">
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center content2-bg">
      <div class="content-bg-filter">
        <div class="row d-flex justify-content-center" style="height:100%">
          <div class="col-lg-9 align-self-center" >
            <div class="row">
              <div class="col-lg-5">
                <img src="/image/logo/logo_fall.png" width="100%">
              </div>
              <div class="col-lg-7 pt-4 pt-lg-0 align-self-center">
                <div class="p-3">
                  <span class="feature-title">第二項服務</span>
                  <p class="feature-parag">
                    Eliminate zombies crawling all over the city, loot the undead to get money and chips to upgrade your weapons and equipment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center content3-bg">
       <div class="content-bg-filter">
        <div class="row d-flex justify-content-center" style="height:100%">
          <div class="col-lg-9 align-self-center" >
            <div class="row justify-content-center">
              <div class="col-lg-7 pt-4 pt-lg-0 align-self-center">
                <div class="p-3">
                  <span style="font-size:45px; font-weight:620; color:#9E2227;">第三項服務</span>
                  <p class="feature-parag">
                    Pick one of the 3 abilities offered to you at the beginning of every wave! Form your own ability tree and take on waves of relentless zombie attacks.
                  </p>
                </div>
              </div>
              <div class="col-lg-5 align-self-center">
                  <div style="background-color:none">
                    <img src="/image/logo/logo_fall.png" width="100%">
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    <!-- <div id="media" class="d-flex justify-content-center content6-bg" style="margin-top:50px">
      <div class="content-bg-filter">
        <div class="row d-flex justify-content-center" style="height:100%">
          <div class="col-lg-8 align-self-center" >
            <div class="row">
              <div class="text-center" style="width:100%">
                <span class="section-title">Media</span>
              </div>
            </div>
            <div class="row">
              <div class="col-12" >
                <el-carousel :interval="4000" type="card" :height="bannerHeight + 'px'" width="100%">
                  <el-carousel-item v-for="item in media_array" :key="item.image">
                    <img :src="item.image" width="100%">
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="d-flex justify-content-center footer-bg" style="padding-top:75px;padding-bottom:100px;position:relative;">
      <div class="row justify-content-center">
        <div class="col-lg-12 align-self-center" >
          <div class="row justify-content-center" style="margin-top:20px;"  >
            <div class="text-center">
              <img src="/image/logo/logo_fall.png" width="200px;">
            </div>
          </div>
          <div class="row justify-content-center" style="margin-top:20px;"  >
            <div class="text-center">
              <span style="font-size:45px; font-weight:540; color:#fff;">JOIN THE COMMUNITY</span>
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
</style>
