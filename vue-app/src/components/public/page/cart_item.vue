<template>
  <div>
    <div style="color:white; cursor:pointer; width:150px; height:30px; line-height:30px; text-align:center;" @click="handleCartClick">
      <i class="el-icon-shopping-cart-2" style="font-size:20px;" />
      <span style="font-size:20px;font-weight:bold;"> 購物車<span v-if="item_count">({{item_count}})</span></span>
    </div>  

    <el-dialog :visible.sync="cartVisible" width="100%" :before-close="handleClose" :append-to-body="true">
      <div>
        <div>
          <span style="font-size:30px; font-weight:bolder;">我的購物車</span>
        </div>
        <div v-if="item_count">
          <el-row  v-for="item,index in current_cart_item" :key="index" style="margin-bottom:10px;">
            <el-card >
              <el-row style="margin-bottom:20px;">
                <el-col :span="22"><span style="font-size:16px;font-weight:bolder;">{{item.name}}</span></el-col>
                <el-col :span="2"><div style="text-align:right; cursor:pointer;" @click="handleRemove(index)"><i class="el-icon-close" style="font-size:20px;"/></div></el-col>
              </el-row>
              <el-row>
                <!--<el-col :span="10">
                  <div style="text-align:right;font-size:16px;">數量: {{item.number}}</div>
                </el-col>-->
                <el-col :span="24">
                  <div style="text-align:right;font-size:16px;">金額: {{item.price * item.number}} 元</div>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
          <el-row>
            <div style="text-align:center;font-size:30px;font-weight:bolder;color:#ae0000;"><span>總金額 {{total_amount}}元</span></div>
          </el-row>
        </div>
        <div v-else style="height:100px;line-height:100px;background-color:#eee; text-align:center" class="justify-content-center">
          <span style="margin:auto;">您未選購任何商品</span>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align:center; margin-top:20px;">
          <el-button type="primary" style="width:150px;height:40px;font-size:20px;font-weight:bolder;margin-right:20px;" @click="handleClose">繼續購物</el-button>
          <el-button v-if="item_count" type="success" style="width:150px;height:40px;font-size:20px;font-weight:bolder;" @click="handlePay">結帳</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import {payService} from "@/_services";
export default {
  name: "cart_item",
  components: {
    
  },
  props:{
    openCart:{
      type:Boolean,
      default:false,
    },
    tbkey:{
      type:Number,
      default:0,
    }
  },
  data() {
    return {
      cartVisible:false,
      item_count:0,
      current_cart_item:{},
      total_amount:0,
      client_id:""
    };
  },
  created() {
    this.init();
    this.getFingetPrint();
  },
  destroyed () {},
  computed: {},
  watch: {
    openCart(val){
      if(val==true){
        this.handleCartClick();
      }
    },
    tbkey(val){
      this.init();
    }
  },
  methods: {
    async getFingetPrint(){
      const fpPromise = await FingerprintJS.load();
      await (async () => {
          const res = await fpPromise.get();
          this.client_id = res.visitorId;
      })();
    },

    init(){
      console.log("handle Recount Number")
      this.total_amount = 0;
      var kol_id = sessionStorage.getItem("kol_id");
      var cart_item = sessionStorage.getItem("cart");
      if(cart_item){
        var temp_item = JSON.parse(cart_item); 
        this.item_count = temp_item.length;
        temp_item.forEach(item=>{
          this.total_amount+=item.price;
        })
      }else{
        this.item_count = 0;
      };
    },

    handleCaculate(){
      var cart_item = sessionStorage.getItem("cart");
      console.log(cart_item)
      if(cart_item){
        this.current_cart_item = JSON.parse(cart_item)
      }else{
        this.current_cart_item = []
      }
    },

    handleCartClick(){
      this.handleCaculate();
      this.cartVisible = true;
    },

    async handleRemove(id){
      console.log("remove");
      await this.current_cart_item.splice(id,1);
      await sessionStorage.setItem("cart", JSON.stringify(this.current_cart_item));
      this.init();
    },

    handleClose(){
      this.cartVisible = false;
    },

    async handlePay(){
      var cart_item = sessionStorage.getItem("cart");
      var kol_id = sessionStorage.getItem("kol_id");
      if(cart_item && kol_id){
        var temp = JSON.parse(cart_item);
        for await (const item of temp){
          var params = {
            device_id:this.client_id,
            code:kol_id,
            price:item.price,
            count:1
          };
          await payService.handle_pay(params)
          .then(res=>{
            console.log(res)
          })
        }
      };
      await sessionStorage.removeItem("cart");
      await this.init();
      await this.handleClose();
      await this.$message.success("訂單完成!")
      // await this.handleBack();
    },

    handleBack(){
      this.$router.push("/products")
    }
  }
};
</script>
<style scope>

</style>

