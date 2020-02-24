<template>
    <div class="wrapper" id="nav-scroller" ref="content">
        <v-HeadRegistration></v-HeadRegistration>
        <v-Detail></v-Detail>
        <v-SignupForm
        :key="form_key"
        @forceRender="forceRenderKey">
        </v-SignupForm>
        <!-- <v-PrivacyPolicy></v-PrivacyPolicy> -->
        <v-FootRegistration></v-FootRegistration>
    </div>
</template>

<script>
import vHeadRegistration from "./Header.vue";
import vFootRegistration from "./Footer.vue";
import vDetail from "./Detail.vue";
import vPrivacyPolicy from "./Privacy_Policy.vue";
import vSignupForm from "./SignupForm.vue";

export default {
    data(){
        return {
            form_key:localStorage.getItem("register_lang"),
        };
    },

    components: {
        vHeadRegistration,
        vFootRegistration,
        vDetail,
        vPrivacyPolicy,
        vSignupForm
    },

    watch:{
        // $route(){
        //     window.location.reload();
        // }
    },

    beforeCreate(){        
    },

    created(){
        console.log("Home");
    },

    methods:{
        forceRenderKey(status){
            this.form_key=status;
        }
    }
};
</script>
<style scoped>
#nav-scroller{
    position:relative; 
    height:100%; 
    overflow-y:scroll;
}
.wrapper{
    /* background-color:black; */
}
</style>
