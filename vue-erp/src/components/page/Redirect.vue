<template>
  <div class="login-wrap">
    <div class="ms-login">
      Redirecting.....
    </div>
  </div>
</template>

<script>


export default {
  data: function() {
    return {     
    }
  },
  methods: { 
    
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image:url('/image/bg/Bg.png');
  background-repeat:repeat-x;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: rgb(2, 1, 17);
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
  background: #875a7b;
  border-color: #875a7b;
  color: #FFF;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>