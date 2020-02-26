<template>

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
            publicService.get_match_game(this.$route.params.competition, this.$route.params.main_team)
            .then(res => { 
                
            });
        }
    }
}
</script>
<style scoped>
</style>