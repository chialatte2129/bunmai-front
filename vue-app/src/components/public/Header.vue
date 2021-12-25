<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div align="middle">
       <el-image
      style="width: 50px; height: 50px; margin-top:10px;"
      src="/image/logo/vrlive_logo.png"
      fit='scale-down'></el-image>
    </div>
  </div>
</template>
<script>
import bus from "../common/bus";
import { accountService } from "@/_services";
import { Message } from "element-ui";

export default {
  data() {
    return {
    }
  },
  computed: {
    
  },
  methods: {
      
  },
  mounted() {
    
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #000000;
}
</style>
