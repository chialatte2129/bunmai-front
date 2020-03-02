<template>
    <div class="scrollBar" style="background-color:#333333;font-size:16px">
        <el-scrollbar
        ref="scroll" 
        wrap-class="list" 
        view-class="view-box" 
        :native="false" 
        style="height:102%;">
        <div class="middle_box">
            <div style="z-index:999;min-width:1000px;align:center;height:3vw;position:fixed;top:0;background:#333333;"></div>
            <div style="z-index:999;max-width:1000px;min-width:320px;align:center;height:auto;position:fixed;top:3vw;background:#333333;">
                <div style="height:100%;">
                    <img width="100%" src="image/league/test.png"> 
                </div>
            </div>
            <div style="visibility:hidden;margin-bottom:4vw;top:3vw;">
                <div style="height:100%;">
                    <img width="100%"  src="image/league/test.png"> 
                </div>
            </div>
            <div>
            </div>
        </div>
        </el-scrollbar>
    </div>
</template>
<script>
import {publicService} from "@/_services";
export default {
    name:"public_league_matches",
    components: {

    },

    data(){
        return{
            
        }
    },

    created(){
        this.getData();
    },

    computed: {
            
    },

    watch:{
        '$route.params.competition':{
            handler(newval, oldval){
                this.getData()
            },
        },

        '$route.params.main_team':{
            handler(newval, oldval){
                this.getData()
            },
        }
    },

    methods:{
        getData(){
            console.log(this.$route.params.competition, this.$route.params.main_team)
            this.$i18n.locale = this.$route.params.lang;
            publicService.get_match_game(this.$route.params.competition, this.$route.params.main_team)
            .then(res => { 
                
            });
        }
    }
}
</script>
<style scoped>
.middle_box{
    max-width:1000px;
    min-width:320px;
    margin:auto;
}
.scrollBar{ 
    /* background-image:url('/image/league/QRCode_BG.png');
    background-repeat:no-repeat;
    background-position:center; */
    height:100%; 
    overflow:hidden;
    position:relative;   
} 
.list{ 
  max-height:10px; 
}
</style>