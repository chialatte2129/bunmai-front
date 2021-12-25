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
          
          <el-col v-for="product in products" :key="product.id" :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
            <el-card :body-style="{ padding: '0px' }" class="mgb20">
              <div class="image-box" >
                <img :src="product.image" intrinsicsize="16x9" class="image"/>
              </div>
              <div style="padding: 14px;">
                <div class="mgb20" style="height:60px;font-size:18px"><span>{{product.name}}</span></div>
                <div class="mgb10 bottom clearfix">
                  <el-button type="primary" style="width:100%;height:50px;font-size:20px;" class="button" @click="pushToPair('')"><b>搜尋KOL</b></el-button>
                </div>
                <div class="mgb10 bottom clearfix">
                  <el-button type="info" style="width:100%;height:50px;font-size:20px;" class="button" @click="pushToPair('')"><b>產品資訊</b></el-button>
                </div>
              </div>
            </el-card>
          </el-col>

        </el-row> 
      </div>
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
        {id:1,name:"【正宗老饕級】日月潭吮指大閘蟹x6隻(5兩九-6兩半/隻)",url:"",image:"/image/product/crab.jpg"},
        {id:2,name:"【聖母峰葡萄】法國貴族晚宴必備(2斤/箱)",url:"",image:"/image/product/grape_1.jpeg"},
        {id:3,name:"【蒙恩咖啡】耶路撒冷手工烘焙咖啡豆(半磅/包)",url:"",image:"/image/product/coffee_1.jpg"},
        {id:4,name:"【透膚精華】28逆齡回春水 100ml",url:"",image:"/image/product/water.jpg"},
        {id:5,name:"【正宗老饕級】日月潭吮指大閘蟹x6隻(5兩九-6兩半/隻)",url:"",image:"/image/product/IJEU3307.jpg"}
      ]
    }
  },
  created() {
   
  },
  computed: {

  },
  methods: {
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
.image-box{
  width:100%;
  overflow: hidden;
}

.image{
  width:100%;
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