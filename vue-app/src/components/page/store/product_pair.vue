<template>
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-shop"></i>
            <b> 廣告商</b>
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/admin/products' }">
            <i class="el-icon-s-goods"></i>
            <b> 我的產品</b>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <b> KOL配對</b>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="5" :md="5" :lg="5" :xl="5">
            <el-card>
              <div slot="header" class="clearfix">
                <span style="font-size:20px;font-weight:bolder;">推廣商品</span>
              </div>
              <el-form v-model="product_form" label-position="top">
                <div><span style="font-size:20px;">{{product_form.name}}</span></div>
                <div><img :src="product_form.image" style="width:90%;"/></div>
                <el-form-item label="商品售價">
                  <el-input v-model="product_form.price" > 
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="分潤比例">
                  <el-input v-model="product_form.percent"> 
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品連結">
                  <a :href="product_form.url">開啟連結</a>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="19" :md="19" :lg="19" :xl="19">
            <el-card>
              <div slot="header" class="clearfix">
                <span style="font-size:20px;font-weight:bolder;">優質KOL推薦</span>
              </div>
              <el-row :gutter="10">
                <el-col v-for="kol,index in kol_list_1" :key="index" :span="6">
                  <el-card :body-style="{ padding: '0px' }" style="margin-bottom:20px;">
                    <div style="text-align:center;margin-top:10xp;width:100%;">
                      <img :src="kol.image" class="image">
                    </div>
                    <div style="padding: 14px;">
                      <div class="mgb10"><span style="font-size:20px;">{{kol.name}}</span></div>
                      <div class="mgb10"><span>{{kol.description}}</span></div>
                      <div class="mgb10"><el-tag v-for="cate in kol.category" :key="cate" type="info" class="mgr10" style="font-size:14px;">{{cate}}</el-tag></div>
                      <div class="mgb10">
                        <img v-if="kol.platform.includes('FB')"  src="/image/social_media/FB.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('IG')"  src="/image/social_media/IG.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('YT')" src="/image/social_media/YT.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('WEB')"  src="/image/social_media/WEB.png" class="mgr10" style="width:25px;height:25px;/">
                        <img v-if="kol.platform.includes('WB')"  src="/image/social_media/WB.png" class="mgr10" style="width:25px;height:25px;/">
                        <img v-if="kol.platform.includes('RED')"  src="/image/social_media/red_book.png" class="mgr10" style="width:25px;height:25px;/">
                      </div>
                      <div class="bottom clearfix">
                        <el-button type="success" class="button" style="font-size:20px;width:100%;height:50px;" @click="handleInviteClick(kol)">點我邀請</el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col v-for="kol,index in kol_list_2" :key="index" :span="6">
                  <el-card :body-style="{ padding: '0px' }" style="margin-bottom:20px;">
                    <div style="text-align:center;margin-top:10xp;width:100%;">
                      <img :src="kol.image" class="image">
                    </div>
                    <div style="padding: 14px;">
                      <div class="mgb10"><span style="font-size:20px;">{{kol.name}}</span></div>
                      <div class="mgb10"><span>{{kol.description}}</span></div>
                      <div class="mgb10"><el-tag v-for="cate in kol.category" :key="cate" type="info" class="mgr10" style="font-size:14px;">{{cate}}</el-tag></div>
                      <div class="mgb10">
                        <img v-if="kol.platform.includes('FB')"  src="/image/social_media/FB.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('IG')"  src="/image/social_media/IG.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('YT')" src="/image/social_media/YT.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('WEB')"  src="/image/social_media/WEB.png" class="mgr10" style="width:25px;height:25px;/">
                        <img v-if="kol.platform.includes('WB')"  src="/image/social_media/WB.png" class="mgr10" style="width:25px;height:25px;/">
                        <img v-if="kol.platform.includes('RED')"  src="/image/social_media/red_book.png" class="mgr10" style="width:25px;height:25px;/">
                      </div>
                      <div class="bottom clearfix">
                        <el-button type="success" class="button" style="font-size:20px;width:100%;height:50px;" @click="handleInviteClick(kol)">點我邀請</el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col v-for="kol,index in kol_list_3" :key="index" :span="6">
                  <el-card :body-style="{ padding: '0px' }" style="margin-bottom:20px;">
                    <div style="text-align:center;margin-top:10xp;width:100%;">
                      <img :src="kol.image" class="image">
                    </div>
                    <div style="padding: 14px;">
                      <div class="mgb10"><span style="font-size:20px;">{{kol.name}}</span></div>
                      <div class="mgb10"><span>{{kol.description}}</span></div>
                      <div class="mgb10"><el-tag v-for="cate in kol.category" :key="cate" type="info" class="mgr10" style="font-size:14px;">{{cate}}</el-tag></div>
                      <div class="mgb10">
                        <img v-if="kol.platform.includes('FB')"  src="/image/social_media/FB.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('IG')"  src="/image/social_media/IG.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('YT')" src="/image/social_media/YT.png" class="mgr10" style="width:25px;height:25px;"/>
                        <img v-if="kol.platform.includes('WEB')"  src="/image/social_media/WEB.png" class="mgr10" style="width:25px;height:25px;/">
                        <img v-if="kol.platform.includes('WB')"  src="/image/social_media/WB.png" class="mgr10" style="width:25px;height:25px;/">
                        <img v-if="kol.platform.includes('RED')"  src="/image/social_media/red_book.png" class="mgr10" style="width:25px;height:25px;/">
                      </div>
                      <div class="bottom clearfix">
                        <el-button type="success" class="button" style="font-size:20px;width:100%;height:50px;" @click="handleInviteClick(kol)">點我邀請</el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-dialog :title="select_kol.name" :visible.sync="inviteVisible" width="1000px" :before-close="cancelInvite" :append-to-body="true">
        <div>
          <el-form label-width="150px" label-position="right">
            <el-form-item label="KOL">
              <span>{{select_kol.name}}</span>
            </el-form-item>
            <el-form-item label="商品售價">
              <span>{{pair_invite_form.price}} 元</span>
            </el-form-item>
            <el-form-item label="分潤比例">
              <el-input v-model="pair_invite_form.percent" style="width:200px;"> 
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="分潤比例">
              <el-input v-model="pair_invite_form.percent" style="width:200px;"> 
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="合作邀約">
              <el-input v-model="note" type="textarea" :rows="7" style="width:90%;"/> 
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer" style="text-align:center; margin-top:20px;">
          <el-button type="info" style="width:150px;height:40px;font-size:20px;font-weight:bolder;margin-right:20px;" @click="cancelInvite">關閉</el-button>
          <el-button type="primary" style="width:150px;height:40px;font-size:20px;font-weight:bolder;" @click="cancelInvite">儲存</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
export default {
  name: "role_table",
  components: {
  },
  data() {
    return {
      kol_list_1:[
        {id:1,image:"/image/kol/MARK_SQR.jpeg",name:"得得廚房",platform:["IG"],category:["水產", "食品"],description:"",url:""},
        {id:2,image:"/image/kol/YORK_SQR.jpg",name:"特級吃貨王",platform:["YT"],category:["水產", "零食"],description:"",url:""},
        {id:3,image:"/image/kol/JUWAI_SQR.jpeg",name:"葡萄主委",platform:["RED", "WB"],category:["水產", "零食"],description:"",url:""},
        {id:4,image:"/image/kol/CINDY_SQR.jpg",name:"Cindy酥",platform:["YT", "IG"],category:["水產", "零食"],description:"",url:""},
      ],
      kol_list_2:[
        {id:5,image:"/image/kol/JOY_SQR.jpg",name:"美妝女王JOY",platform:["WB",  "IG"],category:["水產", "零食"],description:"",url:""},
        {id:1,image:"/image/kol/kol-1.jfif",name:"扎伊登‧富爾頓",platform:["RED"],category:["水產", "零食"],description:"",url:""},
        {id:2,image:"/image/kol/kol-2.jfif",name:"瑪德琳‧薩利納斯",platform:["FB"],category:["戶外用品"],description:"",url:""},
        {id:3,image:"/image/kol/kol-3.jfif",name:"帕克‧鮑爾斯",platform:["IG", "WB"],category:["日用品"],description:"",url:""},
      ],
      kol_list_3:[
        {id:4,image:"/image/kol/kol-4.jfif",name:"約翰娜‧倫納德",platform:["FB", "YT"],category:["理財商品"],description:"",url:""},
        {id:5,image:"/image/kol/kol-5.jfif",name:"莉蓮‧特雷維諾",platform:["IG"],category:["日韓"],description:"",url:""},
        {id:6,image:"/image/kol/kol-6.jfif",name:"達妮埃拉‧杭特",platform:["RED", "IG"],category:["食品", "美妝"],description:"",url:""},
        {id:7,image:"/image/kol/kol-7.jfif",name:"布蘭東‧門德斯",platform:["IG"],category:["理財商品", "美妝"],description:"",url:""},
        {id:8,image:"/image/kol/kol-8.jfif",name:"羅伊斯‧霍奇",platform:["IG"],category:["保健品"],description:"",url:""},
        {id:9,image:"/image/kol/kol-9.jfif",name:"布理傑‧巴拉德",platform:["FB", "YT"],category:["書籍"],description:"",url:""},
        {id:10,image:"/image/kol/kol-10.jfif",name:"戴米安‧杭特",platform:["FB", "IG", ],category:["健身", "保健品","肉品"],description:"",url:""},
        {id:11,image:"/image/kol/kol-11.jfif",name:"安娜利‧泰特",platform:["FB", "YT", "WB"],category:["美妝"],description:"",url:""},
        {id:12,image:"/image/kol/kol-12.jfif",name:"安吉麗娜‧洛",platform:["YT", "WEB"],category:["日用品", "美妝"],description:"",url:""},
      ],
      product_form:{
        name:"",
        description:"",
        share:"",

      },
      pair_invite_form:{
        product_name:"",

      },

      note:"你好，我是好棒棒商城合作負責窗口: 閃亮亮保養品是台灣在地品牌，主打天然植物成分，並通過多種過敏原測試。我們今年推出全新的「純天然裸妝系列唇膏」，預計在 3 月份進行促銷活動，希望能夠同步配合KOL的合作曝光，促進銷售。",

      inviteVisible:false,
      select_kol:{},
      product_form:{
          name:"日月潭大閘蟹", 
          url:"http://bunmai.cosmetics-mask.com/products/CRAB", 
          price:3718, 
          percent:4.2,
          standard:"6隻(5兩九-6兩半/隻)" ,
          category:["食品", "水產"],
          image:"/image/product/crab.jpg"
        },
    }
  },
  created() {
   
  },
  computed: {

  },
  methods: {
    handleInviteClick(row){
      this.select_kol = row;
      this.pair_invite_form = this.product_form;
      this.inviteVisible=true;
    },

    cancelInvite(){
      this.select_kol = {};
      this.inviteVisible=false;
    },

    pushBack(){
      this.$route.push("/admin/products")
    }
    
  }
};
</script>

<style scoped>
.image{
  width:90%;
  border-radius:50%;
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
.mgb10 {
  margin-bottom:10px;
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