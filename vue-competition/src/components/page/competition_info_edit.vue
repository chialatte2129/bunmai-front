<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path:'/competition_info', query:pushTable()}"><i class="el-icon-info"></i> {{$t('menus.competition_info')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.competition_info_edit')}}&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="$route.query.type!='create'"><b>{{$route.query.game_id}}. {{form.name}}</b></span></el-breadcrumb-item>
            </el-breadcrumb>
            <span style="float:right;margin-top:-38px">
                <el-button type="primary" icon="el-icon-edit" @click="handleUpdate" size=large :disabled="disableEdit()">{{$t('btn.save')}}</el-button>
                <el-button type="info" icon="el-icon-back" @click="handleCancel" size=large> {{$t('btn.leave')}}</el-button>
            </span>   
        </div>
        <div class="container">
            <el-form ref="form" :model="form" :rules="rules" label-width="auto">
                <el-row>
                    <el-col :span="6" class="mr10">
                        <el-card shadow="hover" style="min-height:410px;height:auto;">
                            <div slot="header" class="clearfix">
                                <span>{{$t('menus.competition_info_edit')}}</span>
                            </div>
                            <div class="info-area">
                                <el-form-item :label="$t('game_info.name')" prop="name">
                                    <el-input v-model="form.name" class="handle-input"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.country')" prop="country">
                                    <el-select v-model="form.country" :placeholder="$t('game_info.filter_country')" class="handle-select" clearable filterable>
                                        <el-option v-for="item in options.country" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.city')" prop="city">
                                    <el-select v-model="form.city" :placeholder="$t('game_info.filter_city')" class="handle-select" clearable filterable @focus="changeCitySelection" :disabled="form.country==''">
                                        <el-option v-for="item in options.city" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.game')" prop="game">
                                    <el-select v-model="form.game" :placeholder="$t('game_info.filter_game')" class="handle-select" clearable filterable>
                                        <el-option v-for="item in options.esports" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.max_players')" prop="max_players">
                                    <el-input-number v-model="form.max_players" class="handle-input-number" :min="1" :max="10" ></el-input-number>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.min_players')" prop="min_players">
                                    <el-input-number v-model="form.min_players" class="handle-input-number" :min="1" :max="maxplayerNum" ></el-input-number>
                                </el-form-item>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6" class="mr10">
                        <el-card shadow="hover" style="min-height:410px;height:auto;" class="mb10">
                            <div slot="header" class="clearfix">
                                <span>{{$t('game_info.time_setting')}}</span>
                            </div>
                            <div class="info-area">
                                <el-form-item :label="$t('game_info.register_start_time')" prop="register_start_time">
                                    <el-date-picker v-model="form.register_start_time" type="datetime" :placeholder="$t('game_info.register_start_time')" 
                                    class="handle-select" default-time="08:00:00" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="registerStartOptions" @change="test">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.register_end_time')" prop="register_end_time">
                                    <el-date-picker v-model="form.register_end_time" type="datetime" :placeholder="$t('game_info.register_end_time')" 
                                    class="handle-select" default-time="16:00:00"value-format="yyyy-MM-dd HH:mm:ss" :picker-options="registerEndOptions" :disabled="form.register_start_time==null">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.game_start_time')" prop="game_start_time">
                                    <el-date-picker v-model="form.game_start_time" type="datetime" :placeholder="$t('game_info.game_start_time')" 
                                    class="handle-select" default-time="08:00:00" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="gameStartOptions">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.game_end_time')" prop="game_end_time">
                                    <el-date-picker v-model="form.game_end_time" type="datetime" :placeholder="$t('game_info.game_end_time')" 
                                    class="handle-select" default-time="16:00:00" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="gameEndOptions" :disabled="form.game_end_time==null">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.show_timezone')" prop="show_timezone">
                                    <el-select v-model="form.show_timezone" class="handle-select" clearable filterable>
                                        <el-option v-for="item in options.timezone" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6" class="mr10">
                        <el-card shadow="hover" style="min-height:194px;height:auto;" class="mb10">
                            <div slot="header" class="clearfix">
                                <span>{{$t('game_info.payment_mode')}}</span>
                            </div>
                            <div class="info-area">
                                <el-col style="padding-left:0px">
                                    <el-form-item :label="$t('game_info.currency')" prop="currency">
                                        <el-select v-model="form.currency" clearable filterable class="handle-select">
                                            <el-option v-for="item in options.currency" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item :label="$t('game_info.fee')" prop="fee">
                                        <el-input v-model.number="form.fee" class="handle-input"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </el-card>
                        <el-card shadow="hover" style="min-height:204px;height:auto;">
                            <div slot="header" class="clearfix">
                                <span>{{$t('game_info.name_i18n')}}</span>
                            </div>
                            <div class="info-area">
                                
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
import { infoService } from "@/_services";
export default {
    name:"competition_information_edit",
    components:{

    },
    data(){
        return{
            form:{
                game_id:"",
                name:"",
                name_i18n:{},
                country:"",
                city:"",
                game:"",
                min_players:1,
                max_players:1,
                register_start_time:null,
                register_end_time:null,
                game_start_time:null,
                game_end_time:null,
                show_timezone:8,
                fee:0,
                currency:"",
                content:""
            },
            options:{
                country:[],
                city:[],
                backup_city:[],
                esports:[],
                scheduled_step:[],
                match:[],
                timezone:[],
                currency:[],
                language:[]
            },
            registerStartOptions:{
                disabledDate(time){
                    return time.getTime() < Date.now();
                },
            },
            registerEndOptions:{
                disabledDate(time){
                    return time.getTime() < this.disabledTime(form.register_start_time);
                },
            },
            gameStartOptions:{
                disabledDate(time){
                    return time.getTime() < Date.now();
                },
            },
            gameEndOptions:{
                disabledDate(time){
                    return time.getTime() < Date.now();
                },
            },
            rules:{

            }
        }
    },
    computed:{
        update_info_auth(){
            return localStorage.getItem("ms_user_actions").includes("update_competition")
        },

        block_area(){
            if(this.$route.query.type!='create'){
                return 18
            }
        },

        maxplayerNum(){
            return this.form.max_players
        },

    },
    watch:{

    },
    created(){
        console.log(this.$route.query)
        this.getOption();
        this.getData();
    },
    methods:{
        test(){
            var d = new Date(this.form.register_start_time);
            console.log(d)
            var x = d.valueOf();
            console.log(x)
        }, 
        
        disabledTime(time){
            var d = new Date(time);
            var timestamp = d.valueOf();
            return timestamp
        },

        getData(){

        },

        getOption(){
            var option_keys = ["country", "city", "esports", "scheduled_step", "match", "timezone", "currency", "language"]
            infoService.get_info_option(option_keys)
            .then(res=>{
                if(res.code==1){
                    this.options.country = res.options.country;
                    this.options.city = res.options.city;
                    this.options.backup_city = res.options.city;
                    this.options.esports = res.options.esports;
                    this.options.scheduled_step = res.options.scheduled_step;
                    this.options.match = res.options.match;
                    this.options.timezone = res.options.timezone;
                    this.options.currency = res.options.currency;
                    this.options.language = res.options.language;
                    if(res.error_param!=""){
                        this.$message.warning(res.error_param+" "+this.$i18n.t(res.msg));
                    }
                }else if(res.code==0){
                    this.$message.warning(this.$i18n.t(res.msg));
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        disableEdit(){
            // 應該還有時間可能性
            if(!this.update_info_auth){
                return true
            }
        },

        handleUpdate(){
            
        },

        handleCancel(){
            this.goBackTable();
        },

        goBackTable(){
            if(this.$route.query.type=="create"){
                this.$router.push({path:'/competition_info'});
            }else{
                this.$router.push({path:'/competition_info',query:this.pushTable()});
            }
        },

        pushTable(){
            if(this.$route.query.type=="create"){
                var query = {}
            }else{
                var query = {
                    "type":"update",
                    "game_id":this.$route.query.game_id,
                    "position":this.$route.query.position
                }
            }
            return query
        },

        changeCitySelection(){
            this.options.city=this.options.backup_city;
            if(this.form.country!=""){
                var tempCity=[];
                tempCity = this.options.city.filter(el=>{
                    if(this.form.country.includes(el.country)){
                        tempCity.push(el)
                    }
                    this.options.city=tempCity
                })
            }else{
                this.options.city=this.options.backup_city;
            }
        },

        show_label(item){
            return localStorage.getItem("ms_user_lang")=='zh_TW'?item.label:(item.label_i18n==undefined?item.label:item.label_i18n);
        },
    }
}
</script>
<style scoped>
.container{
    background-color:#f0f0f0;
    padding-top:20px
}
.mb10{
    margin-bottom:10px;
}
.mr10{
    margin-right:10px;
}
.info-name{
    float:right;
    margin-right:20px;
    margin-top:3px;
    font-size:16px;
}
.handle-input{
    width:215px;
}
.handle-input-number{
    width:215px;
}
.handle-select{
    width:215px;
}
</style>
<style>
.el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
</style>