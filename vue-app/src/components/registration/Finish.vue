<template>
    <div>
        <div class="success_class" v-if="this.$route.query.status=='success'">
            {{$t('public.sign_up.thx_registration')}}
        </div>
        <div class="success_class" v-else-if="this.$route.query.status=='used'">
            {{$t('public.sign_up.thx_registration')}}
        </div>
        <div class="success_class" v-else-if="this.$route.query.status=='duplicated'">
            {{$t('public.sign_up.thx_registration')}}
        </div>
        <div class="expired_class" v-else-if="this.$route.query.status=='expired'">
            {{$t('public.sign_up.expired_signup')}}
        </div>
        <div class="error_class" v-else-if="this.$route.query.status=='error'" v-html="$t('public.sign_up.error_message')">
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           
        }
    },
    created(){
        console.log(this.$route.query.status)
    },
    methods:{
        
    }
}
</script>
<style scoped>
.success_class{
    position:absolute;
    font-weight:bolder;
    font-size:30px;
    line-height:100%;
    height:100%;
    width:100%;
    top:40%;
    text-align:center;
    color:#549942;
    vertical-align:middle;
}
.expired_class{
    position:absolute;
    font-weight:bolder;
    font-size:30px;
    line-height:100%;
    height:100%;
    width:100%;
    top:40%;
    text-align:center;
    color:#FF8D21;
    vertical-align:middle;
}
.error_class{
    position:absolute;
    font-weight:bolder;
    font-size:30px;
    line-height:100%;
    height:100%;
    width:100%;
    top:40%;
    text-align:center;
    color:#F56C6C;
    vertical-align:middle;
}
</style>