<template>
  <div id="body" style="font-family:'Yeseva One',sans-serif;" >
    <b-navbar toggleable="lg" type="light" variant="faded" v-bind:class="{'bg-success': true}">
      <b-navbar-brand href="/products" ><span style="font-size:30px;font-weight:bold;color:#fff;">我的賣場</span></b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item>
          <cartItem :openCart="cartVisible" :tbkey="tbkey"/>
        </b-nav-item>          
      </b-navbar-nav>
    </b-navbar>
    <div style="padding:10px;width:100%;cursor:pointer;" @click="handleBack()"><span><span style="font-weight:bolder">推薦商品</span> / {{current_item.title}}</span></div>
    
    <div style="width:100%;" class="row d-flex justify-content-center">
      <div class="row d-flex justify-content-center" style="width:100%;max-width:1000px;">
        <el-row class="row d-flex justify-content-center" stype="padding:0px;">
          <el-col :xs="24" :sm="11" :md="11" :lg="11" :xl="11" >
            <div style="padding:20px 0px 20px 20px;">
              <img style="width:100%" :src="current_item.image_url" class="image"/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="13" :md="13" :lg="13" :xl="13">
            <div style="padding:20px 0px 20px 40px;">
              <div><span style="font-size:24px;font-weight:bolder">{{current_item.title}}</span></div>
              <div><span style="font-size:20px;color:#0070C0;">{{current_item.sub_title}}</span></div>
              <div v-for="content in current_item.contents"><span class="content-text">{{content}}</span></div>
              <div style="padding:20px 0px 20px 20px">
                <span>市售價<span style="text-decoration:line-through;">{{current_item.normal_price}}</span>元 促銷價<span style="text-decoration:line-through;">{{current_item.discount_price}}</span>元</span><br/>
                <span>  折扣後價格  <span style="color:red; font-weight:bolder;font-size:40px;">{{current_item.sale_price}}</span>  元</span>
              </div>
              <div style="max-width:500px;width:80%;background-color:#C00053;padding:10px 20px;text-align:center;cursor:pointer;" @click="handleAddToCart(current_item)">
                <span style="font-weight:bolder;color:white;font-size:25px;">我還不買爆</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="width:100%; height:30px;"></div>
    <div class="d-flex justify-content-center footer-bg" style="padding-top:10px;padding-bottom:30px;position:relative;">
      <div class="row justify-content-center">
        <div class="col-lg-12 align-self-center" >
          <div class="row justify-content-center" style="margin-top:30px;" >
            <span style="font-size:18px; font-weight:540; color:#fff;">此頁面僅學術使用，並不成立真實交易行為</span>
          </div>
          <div class="row justify-content-center" style="margin-top:20px;" >
            <span style="font-size:10px; color:#ccc;">Copyright © 2021 KOL幫賣. All rights reserved.</span><br/>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="addToCartVisible" width="100%" :before-close="keepShopping" :append-to-body="true">
      <div style="text-align:center;">
        <span style="color:#000; font-size:20px;font-weight:bolder;">商品已加入購物車</span>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center; margin-top:20px;">
        <el-button type="primary" style="width:150px;height:40px;font-size:20px;font-weight:bolder;margin-right:20px;" @click="keepShopping">繼續購物</el-button>
        <el-button type="success" style="width:150px;height:40px;font-size:20px;font-weight:bolder;" @click="handleOpenCart">我的購物車</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import cartItem from "./cart_item.vue"
export default {
  name: "product_item",
  components: {
    cartItem
  },
  data() {
    return {
      tbkey:0,
      addToCartVisible:false,
      isUserScrolling: false,
      isOpen: false,
      cartVisible:false,
      buy_number:0,
      current_item:{},
      current_in_cart:[],
      item_content:{
        CRAB:{
          title:"【正宗老饕級】日月潭吮指大閘蟹x6隻(5兩九-6兩半/隻)",
          sub_title:"冬季特賣 限時下殺85折",
          contents:["‧正宗日月潭肥美大閘蟹","‧蟹膏香醇肉質鮮美","‧滿滿蟹膏吮指大動"],
          normal_price:"8,400",
          discount_price:"4,374",
          sale_price:"3,718",
          num_sale_price:3718,
          image_url:"/image/product/CRAB_2.jpg"
        },
        COFFEE:{
          title:"【蒙恩咖啡】耶路撒冷手工烘焙咖啡豆",
          sub_title:"耶路撒冷專屬航班空運來台",
          contents:["‧蘊含奶與蜜交融天然香氣","‧虔誠職人咖啡師手工祝禱烘焙而成","‧產量稀少 製作耗時"],
          normal_price:"6,420",
          discount_price:"3,450",
          sale_price:"2,580",
          num_sale_price:2580,
          image_url:"/image/product/coffee_1.jpg"
        },
        GRAPE:{
          title:"【法國貴族晚宴必備】冰川淬煉洗禮聖母峰葡萄 600公克/箱",
          sub_title:"來自海拔八千公尺的美味",
          contents:["‧顆顆果粒飽滿富有彈性、甜度極高","‧深紫色的外皮光滑富含果粉","‧果肉香氣恬和如同漫步在波爾多五大酒莊", "‧咬下迸發香甜果汁 口感細膩終其一生為之痴狂、無憾"],
          normal_price:"2,570",
          discount_price:"2,200",
          sale_price:"1,888",
          num_sale_price:1888,
          image_url:"/image/product/grape_1.jpeg"
        },
        MEAL:{
          title:"【米其林一星激推】虎虎生風猛虎垂涎年菜組",
          sub_title:"超值套組 年節必備",
          contents:[
            "‧稀有天山雪蓮秘製熬煮七七49天【虎嘯龍吟佛跳牆】",
            "‧頂級鮮撈深海大鳳梨裡的【臥虎藏龍大龍蝦】",
            "‧高海拔玉山放養皇家純正血統【虎躍龍騰咕咕人蔘雞】",
            "‧日跑三千穠纖合度只融你口【如虎添翼豬蹄煲】",
            "‧米其林一星主廚漏夜搶購食材，殘酷限量要搶要快！",
          ],
          normal_price:"6,400",
          discount_price:"4,370",
          sale_price:"3,688",
          num_sale_price:3688,
          image_url:"/image/product/MEAL.jpg"
        },
        LOTION:{
          title:"【限量100瓶】28逆齡回春水 100ml/瓶",
          sub_title:"春節強檔 買一送一",
          contents:["‧可以喝 可以抹","‧男人用了回春 女人用了逆齡","‧多種天然植物萃取&玉山封頂雪水經100道工藝萃取提煉製成"],
          normal_price:"5,980",
          discount_price:"3,370",
          sale_price:"2,699",
          num_sale_price:2699,
          image_url:"/image/product/water.jpg"
        }

      },
    };
  },
  created() {
    console.log(this.$route.params.item)
    this.init();
    // window.addEventListener('scroll', this.handleScroll,true);
  },
  destroyed () {
    // window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    
  },
  methods: {
    handleOpenCart(){
      this.addToCartVisible = false;
      this.cartVisible = true;
    },

    async handleAddToCart(){
      var add_value = {
        id:this.$route.params.item,
        name:this.current_item.title,
        number:1,
        price:this.current_item.num_sale_price
      };
      await this.current_in_cart.push(add_value);
      await sessionStorage.setItem("cart",  JSON.stringify(this.current_in_cart));
      this.tbkey++;
      this.cartVisible = false;
      this.addToCartVisible = true;
    },

    keepShopping(){
      this.addToCartVisible = false;
    },

    scrollToTop() {
      window.scrollTo(0,0);
    },

    handleStoreKolID(){
      if(this.$route.query.id){
        sessionStorage.setItem("kol_id", this.$route.query.id)
      }
    },

    init(){
      this.handleStoreKolID()
      
      var temp_val = sessionStorage.getItem("cart")
      if(temp_val){
        this.current_in_cart = JSON.parse(temp_val);
      }else{
        this.current_in_cart = []
      };

      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0)
      if(this.$route.params.item in this.item_content){
        this.current_item = this.item_content[this.$route.params.item]
      };
    },

    handleBack(){
      this.$router.push("/products")
    }
   
  }
};
</script>
<style scoped>
.content-text {
  font-size:16px;
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

