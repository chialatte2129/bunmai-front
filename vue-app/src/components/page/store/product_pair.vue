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
        <el-row>
          <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
            <div style="padding: 14px;">
              <span>日月潭大閘蟹</span>
              <div class="bottom clearfix">
                <el-button type="text" class="button" >商品連結</el-button>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
            <el-row :gutter="20">
              <el-col v-for="kol in kol_list" :key="kol.id" :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
                <el-card :body-style="{ padding: '0px' }" style="margin-bottom:20px;">
                  <img :src="kol.image" class="image">
                  <div style="padding: 14px;">
                    <div class="mgb10"><span style="font-size:20px;">{{kol.name}}</span></div>
                    <div class="mgb10"><span>{{kol.description}}</span></div>
                    <div class="mgb10"><el-tag v-for="cate in kol.category" :key="cate" type="info" class="mgr10" style="font-size:14px;">{{cate}}</el-tag></div>
                    <div class="mgb10">
                      <img v-if="kol.platform.includes('FB')"  src="/image/social_media/FB.png" class="mgr10" style="width:25px;height:25px;"/>
                      <img v-if="kol.platform.includes('IG')"  src="/image/social_media/IG.png" class="mgr10" style="width:25px;height:25px;"/>
                      <img v-if="kol.platform.includes('YT')" src="/image/social_media/YT.png" class="mgr10" style="width:25px;height:25px;"/>
                      <img v-if="kol.platform.includes('WEB')"  src="/image/social_media/WEB.png" class="mgr10" style="width:25px;height:25px;/">
                    </div>
                    <div class="bottom clearfix">
                      <el-button type="success" class="button" style="font-size:20px;width:100%;height:50px;" @click="pushToPair('AAAAA')">點我邀請</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
export default {
  name: "role_table",
  components: {
  },
  data() {
    return {
      kol_list:[
        {id:1,image:"/image/kol/kol-1.jfif",name:"扎伊登‧富爾頓",platform:["YT"],category:["水產", "零食"],description:"",url:""},
        {id:2,image:"/image/kol/kol-2.jfif",name:"瑪德琳‧薩利納斯",platform:["FB"],category:["戶外用品"],description:"",url:""},
        {id:3,image:"/image/kol/kol-3.jfif",name:"帕克‧鮑爾斯",platform:["IG", "YT"],category:["日用品"],description:"",url:""},
        {id:4,image:"/image/kol/kol-4.jfif",name:"約翰娜‧倫納德",platform:["FB", "YT"],category:["理財商品"],description:"",url:""},
        {id:5,image:"/image/kol/kol-5.jfif",name:"莉蓮‧特雷維諾",platform:["IG"],category:["日韓"],description:"",url:""},
        {id:6,image:"/image/kol/kol-6.jfif",name:"達妮埃拉‧杭特",platform:["FB", "IG"],category:["食品", "美妝"],description:"",url:""},
        {id:7,image:"/image/kol/kol-7.jfif",name:"布蘭東‧門德斯",platform:["IG"],category:["理財商品", "美妝"],description:"",url:""},
        {id:8,image:"/image/kol/kol-8.jfif",name:"羅伊斯‧霍奇",platform:["IG"],category:["保健品"],description:"",url:""},
        {id:9,image:"/image/kol/kol-9.jfif",name:"布理傑‧巴拉德",platform:["FB", "YT"],category:["書籍"],description:"",url:""},
        {id:10,image:"/image/kol/kol-10.jfif",name:"戴米安‧杭特",platform:["FB", "IG", ],category:["健身", "保健品","肉品"],description:"",url:""},
        {id:11,image:"/image/kol/kol-11.jfif",name:"安娜利‧泰特",platform:["FB", "YT", "WEB"],category:["美妝"],description:"",url:""},
        {id:12,image:"/image/kol/kol-12.jfif",name:"安吉麗娜‧洛",platform:["YT", "WEB"],category:["日用品", "美妝"],description:"",url:""},
      ],
      product_form:{
        name:"",
        description:"",
        share:"",

      },
      pair_invite_form:{
        product_name:"",

      }
    }
  },
  created() {
   
  },
  computed: {

  },
  methods: {
    pushBack(){
      this.$route.push("/admin/products")
    }
    
  }
};
</script>

<style scoped>
.image{
  width:100%;
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