<template >
    <div class="table" >
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-data"></i>
            <b> 推廣成效-廣告商</b>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bg-container">
        <deshboardStorePanel/>
      </div>
    </div>
</template>

<script>
import deshboardStorePanel from "./deshboard_comp/KOL"
export default {
  name: "role_table",
  components: {
   deshboardStorePanel
  },
  data() {
    return {};
  },
  created() {
   
  },
  computed: {
    
  },
  methods: {
    
    
  }
};
</script>

<style scoped>
.bg-container {
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
.mr10 {
  margin-right: 10px;
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