<template>
  <div style="width:100%;height:100%;background-color:#0070C0;">
    <div  style="margin:auto;width:auto;text-align:center">
      <span style="font-size:100px;color:#fff;">KOL</span>
    </div>
    <div  style="margin:auto;width:auto;text-align:center">
      <i style="color:#fff;font-size:150px;" class="el-icon-loading"/>
    </div>
    <div  style="margin:auto;width:auto;text-align:center">
      <span style="font-size:100px;color:#fff;">BunMai</span>
    </div>
  </div>
</template>

<script>
import {redirectService} from "@/_services";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
export default {
  name: "gps_intro",
  components: {
    
  },
  data() {
    return {
      isUserScrolling: false,
      isOpen: false,
      buy_number:0,
      code:this.$route.params.code,
      client_id:"",
    };
  },
  async created() {
    const fpPromise = await FingerprintJS.load();
    await (async () => {
        const res = await fpPromise.get();
        this.client_id = res.visitorId;
    })();
    await this.handleInit();
  },

  computed: {},

  methods: {
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return "mobile";
      } else {
        return "pc";
      }
    },

    async handleInit(){
      console.log(this.client_id);
      console.log(this.code);
      console.log(this.isMobile());
      console.log("Run init");
      await redirectService.get_redirect_url({client_id:this.client_id, code:this.code, device:this.isMobile()})
      .then(res =>{ 
          console.log(res);
          if(res.code==1){ 
            console.log(res.data.target);
            window.location.href = res.data.target;
          }else if(res.code==0){ 
              this.$message.warning(this.$t(res.msg)); 
          }else{ 
              this.$message.error(this.$t(res.msg)); 
          } 
      });
    }
   
  }
};
</script>
<style scope>

</style>

