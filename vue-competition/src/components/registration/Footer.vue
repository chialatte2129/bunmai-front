<template>
    <!-- <div :class="this.footer_+this.res_status"> -->
    <div class="footer_true"></div>
    </div>
</template>
<script>
export default {
    props:{
        status :Boolean,
    },
    data(){
        return {
            footer_:"footer_",
            res_status:true
        };
    },
    // watch:{
    //     status(val){
    //         console.log(val)
    //         this.created();
    //     }
    // },
    created(){
        this.res_status = this.status;
        console.log("footer")
    },
    mounted(){
        
    }
};
</script>
<style scoped>
.footer_true{
    width:100%;
    height:40px;
    background-color:#39CE7B;
}
.footer_false{
    /* width:100%;
    height:40px;
    background-color:#39CE7B;
    position: absolute; 
    left:0;
    right:0;
    bottom:0; */
}
</style>