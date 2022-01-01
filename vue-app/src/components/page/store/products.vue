<template>
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-shop"></i>
            <b> 廣告商</b>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i>
            <b> 我的產品</b>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container" >
        <el-row :gutter="20" >
          
          <el-col v-for="product in products" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-card :body-style="{ padding: '0px' }" class="mgb20">
              <div class="image-box" style="text-align:center;padding-top:20px;">
                <img :src="product.image" intrinsicsize="16x9" class="image"/>
              </div>
              <div class="mgb10" style="padding: 14px;">
                <div style="font-size:20px;">
                  <span style="font-weight:bolder;">{{product.name}}</span>
                </div>
                <div style="font-size:14px">
                  <span style="color:#888;">{{product.standard}}</span>
                </div>
                <div style="margin-top:10px;">
                  <div class=""><el-tag v-for="cate in product.category" :key="cate" type="primary" class="mgr10" style="font-size:14px;">{{cate}}</el-tag></div>
                </div>
              </div>
              <div style="padding: 14px;">
                <div class="mgb10 bottom clearfix">
                  <el-button type="info" style="width:100%;height:50px;font-size:20px;" class="button" @click="handleViewProduct(product)"><b>產品資訊</b></el-button>
                </div>
                <div class="mgb10 bottom clearfix">
                  <el-button type="primary" style="width:100%;height:50px;font-size:20px;" class="button" @click="pushToPair('')"><b>搜尋KOL</b></el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row> 
      </div>

      <el-dialog :title="select_form.name" :visible.sync="productView" width="1000px" :before-close="cancelViewProduct" :append-to-body="true">
        <el-row>
          <el-col :span="8">
            <el-form v-model="select_form" label-position="right" label-width='100px'>
              <el-form-item label="商品縮圖">
                <img :src="select_form.image" style="width:150px;"/>
              </el-form-item>
              <el-form-item label="商品名稱">
                <el-input v-model="select_form.name" />
              </el-form-item>
              <el-form-item label="商品規格">
                <el-input v-model="select_form.standard" />
              </el-form-item>
              <el-form-item label="商品類別">
                <el-select v-model="select_form.category" multiple placeholder="请选择">
                  <el-option
                    v-for="item in options.category"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品連結">
                <el-input v-model="select_form.url" />
              </el-form-item>
              <el-form-item label="商品售價">
                <el-input v-model="select_form.price" > 
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="預設分潤">
                <el-input v-model="select_form.percent"> 
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="16" style="padding-left:20px;">
            <el-row>
              <div><span style="font-size:24px;font-weight:bolder;">合作KOL</span></div>
            </el-row>
            
            <el-row style="padding:10px; font-size:16px; font-weight:bolder;">
              <el-col :span="4">
                <div style="text-align:center;">
                  <span>開始日期</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div style="text-align:center;">
                  <span>KOL</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div style="text-align:right;">
                  <span>總流量</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div style="text-align:right;">
                  <span>銷售量</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div style="text-align:right;">
                  <span>轉換率</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div style="text-align:center;">
                  <span>合約</span>
                </div>
              </el-col>
            </el-row>
            
            <el-row >
              <el-card v-for="kol in select_form.kol_list" class=" mgb5 "  style="height:50px;" :body-style="{ padding: '0px' }" >
                <el-col :span="4">
                  <div style="text-align:center;line-height:50px;">
                    <span>{{kol.date}}</span>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div style="text-align:left;line-height:50px;">
                    <img :src="kol.img_url" style="width:40px;border-radius:50%;"/>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="text-align:left;line-height:50px;">
                    <span>{{kol.name}}</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div style="text-align:right;line-height:50px;">
                    <span>{{kol.total_click}}</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div style="text-align:right;line-height:50px;">
                    <span>{{kol.total_sale}}</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div style="text-align:right;line-height:50px;">
                    <span>{{Math.round((kol.total_sale/kol.total_click)*100)}}%</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div style="text-align:center;line-height:50px;cursor:pointer;">
                    <i class="el-icon-document" style="font-size:20px;"/>
                  </div>
                </el-col>
              </el-card>
            </el-row>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer" style="text-align:center; margin-top:20px;">
          <el-button type="info" style="width:150px;height:40px;font-size:20px;font-weight:bolder;margin-right:20px;" @click="cancelViewProduct">關閉</el-button>
          <el-button type="primary" style="width:150px;height:40px;font-size:20px;font-weight:bolder;" @click="cancelViewProduct">儲存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: "role_table",
  components: {},
  data() {
    return {
      fullscreenLoading: false,
      products:[
        {
          id:1,
          name:"日月潭大閘蟹", 
          url:"http://bunmai.cosmetics-mask.com/products/CRAB", 
          price:3718, 
          percent:4.2,
          standard:"6隻(5兩九-6兩半/隻)" ,
          category:["食品", "水產"],
          image:"/image/product/crab.jpg",
          kol_list:[
            {date:"2022-04-23", name:"得得廚房", img_url:"/image/kol/MARK_SQR.jpeg", total_click:1314520, total_sale:549524},
            {date:"2021-03-22", name:"扎伊登‧富爾頓", img_url:"/image/kol/kol-1.jfif", total_click:2038, total_sale:403},
            {date:"2021-01-22", name:"瑪德琳‧薩利納斯", img_url:"/image/kol/kol-2.jfif", total_click:340, total_sale:2},
          ]
        },
        {
          id:2,
          name:"聖母峰葡萄", 
          url:"http://bunmai.cosmetics-mask.com/products/GRAPE", 
          price:1888, 
          percent:4,
          standard:"600公克/箱" ,
          category:["食品", "蔬果"],
          image:"/image/product/grape_1.jpeg",
          kol_list:[
            {date:"2022-04-23", name:"葡萄主委", img_url:"/image/kol/JUWAI_SQR.jpeg", total_click:345220, total_sale:532495},
            {date:"2021-03-22", name:"帕克‧鮑爾斯", img_url:"/image/kol/kol-3.jfif", total_click:3034, total_sale:783},
            {date:"2021-01-22", name:"約翰娜‧倫納德", img_url:"/image/kol/kol-4.jfif", total_click:340, total_sale:2},
            {date:"2021-12-21", name:"莉蓮‧特雷維諾", img_url:"/image/kol/kol-5.jfif", total_click:200, total_sale:0},
          ]
        },
        {
          id:3,
          name:"蒙恩咖啡", 
          url:"http://bunmai.cosmetics-mask.com/products/COFFEE", 
          price:2580, 
          percent:3,
          standard:"半磅" ,
          category:["食品", "咖啡"],
          image:"/image/product/coffee_1.jpg",
          kol_list:[
            {date:"2022-04-23", name:"Cindy酥", img_url:"/image/kol/CINDY_SQR.jpg", total_click:1314520, total_sale:549524},
            {date:"2021-03-22", name:"達妮埃拉‧杭特", img_url:"/image/kol/kol-6.jfif", total_click:2038, total_sale:403},
            {date:"2021-01-22", name:"布蘭東‧門德斯", img_url:"/image/kol/kol-7.jfif", total_click:340, total_sale:2},
          ]
        },
        {
          id:4,
          name:"28逆齡回春水", 
          url:"http://bunmai.cosmetics-mask.com/products/LOTION", 
          price:2699, 
          percent:3,
          standard:"100ml/瓶" ,
          category:["保養品"],image:"/image/product/water.jpg",
          kol_list:[
            {date:"2022-04-23", name:"美妝女王JOY", img_url:"/image/kol/JOY_SQR.jpg", total_click:1314520, total_sale:549524},
            {date:"2021-03-22", name:"羅伊斯‧霍奇", img_url:"/image/kol/kol-8.jfif", total_click:2038, total_sale:403},
            {date:"2021-01-22", name:"布理傑‧巴拉德", img_url:"/image/kol/kol-9.jfif", total_click:340, total_sale:2},
          ]        
        },
        {
          id:5,
          name:"虎虎生風猛虎垂涎年菜組", 
          url:"http://bunmai.cosmetics-mask.com/products/MEAL", 
          price:3688, 
          percent:2.5,
          standard:"一組" ,
          category:["食品", "年節特選"],
          image:"/image/product/MEAL_2.png",
          kol_list:[
            {date:"2022-04-23", name:"特級吃貨王", img_url:"/image/kol/YORK_SQR.jpg", total_click:1314520, total_sale:549524},
            {date:"2021-03-22", name:"戴米安‧杭特", img_url:"/image/kol/kol-10.jfif", total_click:2038, total_sale:403},
            {date:"2021-01-22", name:"安娜利‧泰特", img_url:"/image/kol/kol-11.jfif", total_click:340, total_sale:2},
            {date:"2021-01-22", name:"安吉麗娜‧洛", img_url:"/image/kol/kol-12.jfif", total_click:340, total_sale:2},
          ]
        }
      ],
      select_form:{},
      productView:false,
      options:{
        category:[
          "食品", "水產", "蔬果", "保養品", "咖啡", "年節特選"
        ]
      }
    }
  },
  created() {
   
  },
  computed: {

  },
  methods: {
    handleViewProduct(row){
      this.select_form = row;
      this.productView = true;
    },
    
    cancelViewProduct(){
      this.select_form = {};
      this.productView = false;
    },

    openFullScreen() {
      const loading = this.$loading({
        lock: true,
        text: '正在為您配對KOL',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.$router.push("/admin/product_pair");
      }, 10000);
    },

    pushToPair(){
      this.openFullScreen();
    },
    
  }
};
</script>

<style scoped>
.box-item{
  height:30px !important;
  line-height:30px;
  padding:10px;
}

.box-shadow {
box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}

.image-box{
  width:100%;
  overflow: hidden;
}

.image{
  width:80%;
  height:auto;
}
.container {
  border:0px;
  padding:10px;
}

.handle-box {
  margin-bottom: 15px;
  float:left;
}

.pagination-up{
  float:right;
}
.pagination-down{
  margin-top:10px;
  text-align:right;
}
.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.menus-select-input {
  width: 99%;
  display: inline-block;
}

.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mgr10 {
  margin-right: 10px;
}
.mgb10{
  margin-bottom:10px;
}
.mgb5{
  margin-bottom:5px;
}
.mgb20 {
  margin-bottom: 20px;
}

.handle-filter-role{
  width: 150px;
  display: inline-block;
}
.handle-filter-description{
  width: 250px;
  display: inline-block;
}
</style>

<style>
  .el-breadcrumb {
      font-size: 20px;
      height: 25px;
  }
</style>