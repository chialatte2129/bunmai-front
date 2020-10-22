<template> 
  <div class="test"> 
      <!-- <el-input v-model="name"></el-input> 
      <el-button @click="handleClick">按我</el-button> --> 
      <div class="d-inline-flex p-4"> 
        <el-alert id="notification"  
            v-show="alert_view" 
            closable 
            @close="alert_view=0"             
            > 
            New notification: {{message}} 
        </el-alert> 
        </div> 
  </div> 
</template> 
 
<script> 
  export default { 
    name : 'test', 
    data() { 
    return { 
      message: "", 
      alert_view:""   
    } 
  }, 
  created(){ 
    this.connect_websocket(); 
  }, 
    methods: { 
        showAlert() { 
            this.alert_view = 1 
        }, 
        connect_websocket(){ 
            try { 
                const ws = new WebSocket("wss://gaming-ws.varlivebox.com/"); 
                ws.onmessage = ({data}) => { 
                    this.message =  data; 
                    console.log("new message "); 
                    this.showAlert(); 
                } 
            } catch(err) { 
                console.log(err); 
            } 
        } 
    }, 
  } 
</script> 
<style lang='less'> 
  
</style>