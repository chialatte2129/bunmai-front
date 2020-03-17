<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path:`/competition_info?ctype=${$route.query.ctype}`, query:pushTable()}"><i class="el-icon-warning-outline"></i>
                    <span v-if="$route.query.ctype=='league'"> {{$t('menus.competition_league_info')}}</span>
                    <span v-else> {{$t('menus.competition_advance_info')}}</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-if="$route.query.type=='create'">{{$t('menus.competition_info_create')}}</el-breadcrumb-item>
                <el-breadcrumb-item v-else>{{$t('menus.competition_info_edit')}}&nbsp;&nbsp;&nbsp;&nbsp;<b>{{form.game_id}}. {{form.name}}</b></el-breadcrumb-item>
            </el-breadcrumb>
            <span style="float:right;margin-top:-38px">
                <el-button type="primary" icon="el-icon-edit" @click="handleUpdate" size=large :disabled="disableEdit()">{{$t('btn.save')}}</el-button>
                <el-button type="info" icon="el-icon-back" @click="handleCancel" size=large> {{$t('btn.leave')}}</el-button>
            </span>   
        </div>
        <div class="container">
            <el-form ref="form" :model="form" :rules="rules" label-width="auto" label-position="right">
                <el-row class="mb10">
                    <el-col :span="18" class="pdr10">
                        <el-row>
                            <el-card shadow="hover" style="min-height:251px;height:auto;" class="mb10">
                                <div slot="header" class="clearfix">
                                    <span>{{$t('menus.competition_info_edit')}}</span>
                                </div>
                                <div class="info-area">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item :label="$t('game_info.name')" prop="name">
                                                <el-input v-model="form.name" class="handle-input"></el-input>
                                            </el-form-item>
                                            <el-form-item :label="$t('game_info.country')" prop="country">
                                                <el-select v-model="form.country" :placeholder="$t('game_info.filter_country')" class="handle-select" clearable filterable @change="changeCountrySelection">
                                                    <el-option v-for="item in options.country" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item :label="$t('game_info.city')" prop="city">
                                                <el-select v-model="form.city" :placeholder="$t('game_info.filter_city')" class="handle-select" clearable filterable 
                                                @focus="changeCitySelection" :disabled="form.country==''||form.country=='GLOBAL'">
                                                    <el-option v-for="item in options.city" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="$t('game_info.game')" prop="game">
                                                <el-select v-model="form.game" :placeholder="$t('game_info.filter_game')" class="handle-select" clearable filterable>
                                                    <el-option v-for="item in options.game" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item :label="$t('game_info.max_players')" prop="max_players">
                                                <el-input-number v-model="form.max_players" class="handle-input-number" :min="1" :max="15" @change="maxplayesChange"></el-input-number>
                                            </el-form-item>
                                            <el-form-item :label="$t('game_info.min_players')" prop="min_players">
                                                <el-input-number v-model="form.min_players" class="handle-input-number" :min="1" :max="maxplayerNum" ></el-input-number>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-card>
                        </el-row>
                        <el-row>
                            <el-col :span="12" class="pdr10">
                                <el-card shadow="hover" style="min-height:248px;height:auto;" class="mb10">
                                    <div slot="header" class="clearfix">
                                        <span>{{$t('game_info.time_setting')}}</span>
                                    </div>
                                    <div class="info-area">
                                        <el-form-item :label="$t('game_info.register_time')" prop="register_time">
                                            <el-date-picker v-model="form.register_time" type="datetimerange" class="handle-select-time" @change="resgisterChange" v-if="checkTime" :key="resetDisableTimeKey"
                                            :range-separator="$t('game_info.to')" :start-placeholder="$t('game_info.register_start_time')" :end-placeholder="$t('game_info.register_end_time')"></el-date-picker>
                                            <el-date-picker v-model="form.register_time" type="datetimerange" class="handle-select-time" @change="resgisterChange" v-else
                                            :range-separator="$t('game_info.to')" :start-placeholder="$t('game_info.register_start_time')" :end-placeholder="$t('game_info.register_end_time')"
                                            :picker-options="{ disabledDate(time){ return time.getTime() > check_end_time }}"></el-date-picker>
                                        </el-form-item>
                                        <el-form-item :label="$t('game_info.competition_time')" prop="game_time">
                                            <el-date-picker v-model="form.game_time" type="datetimerange" class="handle-select-time" @change="competitionChange" v-if="check_start_time==null"
                                            :range-separator="$t('game_info.to')" :start-placeholder="$t('game_info.game_start_time')" :end-placeholder="$t('game_info.game_end_time')"
                                            :disabled="form.register_time==null"></el-date-picker>
                                            <el-date-picker v-model="form.game_time" type="datetimerange" class="handle-select-time" @change="competitionChange" v-else
                                            :range-separator="$t('game_info.to')" :start-placeholder="$t('game_info.game_start_time')" :end-placeholder="$t('game_info.game_end_time')"
                                            :disabled="form.register_time==null" :picker-options="{ disabledDate(time){ return time.getTime() < check_start_time }}"></el-date-picker>
                                        </el-form-item>
                                        <el-form-item :label="$t('game_info.show_timezone')" prop="show_timezone">
                                            <el-select v-model="form.show_timezone" clearable filterable class="handle-input-number mr10">
                                                <el-option v-for="item in options.timezone" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                            </el-select>
                                            <el-button size="small" type="info" plain 
                                            @click="resetTime">{{$t('game_info.reset_time')}}</el-button>
                                        </el-form-item>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-card shadow="hover" style="min-height:249px;height:auto;" class="mb10">
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
                                            <el-input v-model="form.fee" class="handle-input-number"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </div>
                            </el-card>
                        </el-row>
                        <el-row>
                            <el-card shadow="hover" style="min-height:347px;height:auto;">
                                <div slot="header" class="clearfix">
                                    <span>{{$t('game_info.content_detail')}}</span>
                                </div>
                                <div class="info-area">
                                    <el-form-item :label="$t('game_info.content')" prop="content" style="margin:10px 20px 0 -40px;">
                                        <el-input type="textarea" :rows="11" v-model="form.content" class="handle-input-texarea"></el-input>
                                    </el-form-item>
                                </div>
                            </el-card>
                        </el-row>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover" style="min-height:251px;height:auto;" class="mb10">
                            <div slot="header" class="clearfix">
                                <span>{{$t('game_info.status')}}</span>
                            </div>
                            <div class="status-area">
                                <el-form-item :label="$t('game_info.filter_schedule')">
                                    <el-button round plain size="medium" class="status-btn" v-if="form.scheduled=='init'" @click="">{{$t('game_info.schedule.init')}}</el-button>
                                    <el-button round plain size="medium" class="status-btn" v-else-if="form.scheduled=='b_r'" @click="">{{$t('game_info.schedule.before_registration')}}</el-button>
                                    <el-button type="info" round plain size="medium" class="status-btn" v-else-if="form.scheduled=='a_r'" @click="">{{$t('game_info.schedule.among_registration')}}</el-button>
                                    <el-button type="warning" round plain size="medium" class="status-btn" v-else-if="form.scheduled=='b_c'" @click="">{{$t('game_info.schedule.between_registration_and_competitions')}}</el-button>
                                    <el-button type="primary" round plain size="medium" class="status-btn" v-else-if="form.scheduled=='a_c'" @click="">{{$t('game_info.schedule.among_competition')}}</el-button>
                                    <el-button type="success" round plain size="medium" class="status-btn" v-else @click="">{{$t('game_info.schedule.finish_competitions')}}</el-button>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.filter_match')">
                                    <el-button type="primary" round plain size="medium" class="status-btn" v-if="form.min_players>1" @click="">{{$t('game_info.team')}}</el-button>
                                    <el-button type="success" round plain size="medium" class="status-btn" v-else @click="">{{$t('game_info.individual')}}</el-button>
                                </el-form-item>
                            </div>
                        </el-card>
                        <el-card shadow="hover" style="min-height:249px;height:auto;" class="mb10" v-if="$route.query.ctype=='league'&&$route.query.game_id">
                            <div slot="header" class="clearfix">
                                <span>{{$t('game_info.setting_link')}}</span>
                            </div>
                            <div class="link-area">
                                <el-form-item :label="$t('menus.league_teams')">
                                    <el-button type="success" round plain size="medium" class="link-btn" @click="leaguePush('league_teams', form.game_id)" 
                                    :disabled="is_admin?!is_admin:form.team_disabled==1||!this.update_info_auth">{{$t('menus.league_teams')}}</el-button>
                                </el-form-item>
                                <el-form-item :label="$t('menus.league_teams_matches')">
                                    <el-button type="warning" round plain size="medium" class="link-btn" @click="matchVisible=true" 
                                    :disabled="is_admin?!is_admin:form.match_disabled==1||!this.update_info_auth">{{$t('menus.league_teams_matches')}}</el-button>
                                </el-form-item>
                                <el-form-item :label="$t('menus.league_live_channel')">
                                    <el-button type="warning" round plain size="medium" class="link-btn" @click="channelVisible=true" 
                                    :disabled="is_admin?!is_admin:form.channel_disabled==1||!this.update_info_auth">{{$t('menus.league_live_channel')}}</el-button>
                                </el-form-item>
                                <el-form-item :label="$t('menus.league_standing')">
                                    <el-button type="danger" round plain size="medium" class="link-btn" @click="standingVisible=true" 
                                    :disabled="is_admin?!is_admin:form.standing_disabled==1||!this.update_info_auth">{{$t('menus.league_standing')}}</el-button>
                                </el-form-item>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>                
            </el-form>
        </div>
        <teamsMatches v-if="matchVisible" :visible="matchVisible" :game_id="form.game_id" :game_time="form.game_time" 
        @closeDialog="matchVisible=false" @goToChannel="channelVisible=true,matchVisible=false"></teamsMatches>
        <liveChannels v-if="channelVisible" :visible="channelVisible" :game_id="form.game_id" :game_time="form.game_time"
        @closeDialog="channelVisible=false" @goToMatch="matchVisible=true,channelVisible=false"></liveChannels>
        <leagueStanding v-if="standingVisible" :visible="standingVisible" :game_id="form.game_id" @closeDialog="standingVisible=false"></leagueStanding>
        <el-backtop target=".content" :visibility-height="0" :bottom="40" :right="10">
            <div style="{height:100%; width:100%; box-shadow:0 0 6px rgba(0,0,0, .12); border-radius:50%; text-align:center; font-size:15px; font-weight:bold; line-height:40px; color:#000000;}">TOP</div>
        </el-backtop>
    </div>
</template>
<script>
import { infoService } from "@/_services";
import teamsMatches from "@/components/page/league_teams_matches.vue";
import liveChannels from "@/components/page/league_live_channel.vue";
import leagueStanding from "@/components/page/league_standing.vue";
export default {
    name:"competition_information_edit",
    components:{
        teamsMatches,
        liveChannels,
        leagueStanding
    },
    data(){
        return{
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            matchVisible:false,
            channelVisible:false,
            standingVisible:false,
            check_start_time:null,
            check_end_time:null,
            resetDisableTimeKey:0,
            form:{
                game_id:"",
                name:"",
                country:"",
                city:"",
                game:"",
                game_type:this.$route.query.ctype,
                min_players:1,
                max_players:1,
                register_time:null,
                game_time:null,
                show_timezone:8,
                fee:0,
                currency:"",
                content:"",
                scheduled:"init",
                match_disabled:0,
                channel_disabled:0,
                standing_disabled:0,
                team_disabled:0,
            },
            options:{
                country:[],
                city:[],
                backup_city:[],
                game:[],
                scheduled_step:[],
                match:[],
                timezone:[],
                currency:[],
                language:[]
            },
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            rules:{
                name:           [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                country:        [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: ["blur", "change"]}],
                city:           [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: ["blur", "change"]}],
                game:           [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: ["blur", "change"]}],
                max_players:    [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                min_players:    [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                register_time:  [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                game_time:      [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                show_timezone:  [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                currency:       [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: ["blur", "change"]}],
                fee:            [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
            }
        }
    },
    computed:{
        update_info_auth(){
            return localStorage.getItem("ms_user_actions").includes(`update_${this.$route.query.ctype}_competition`)
        },

        block_area(){
            if(this.$route.query.type!='create'){
                return 18
            }
        },

        maxplayerNum(){
            return this.form.max_players
        },

        checkTime(){
            if(this.check_start_time==null||this.check_end_time==null){ this.resetDisableTimeKey+=1; return true }
        }
    },
    watch:{
        
        
    },
    created(){
        this.getOption();
        this.getData(this.$route.query.game_id);
    },

    methods:{
        resetTime(){
            this.form.register_time=null;
            this.form.game_time=null;
            this.check_start_time=null;
            this.check_end_time=null;
            this.checkTime;
        },

        resgisterChange(){
            if(this.form.register_time!=null){
                var dt = new Date(this.form.register_time[1])
                this.check_start_time = Date.parse(dt.toString());
            }
        },

        competitionChange(){
            if(this.form.game_time!=null){
                var dt = new Date(this.form.game_time[0])
                this.check_end_time = Date.parse(dt.toString());
            }else{
                this.check_end_time=null;
            }
        },

        leaguePush(page, game_id){
            let to_where = this.$router.resolve({name:page, query: {game_id: game_id, table_type:"single"}});
            window.open(to_where.href, '_blank');
        },

        maxplayesChange(){
            if(this.form.max_players<this.form.min_players){
                this.form.min_players=this.form.max_players;
            }
        },
        
        getData(id){
            infoService.get_single_competition_info(id)
            .then(res=>{ 
                this.form = (res.code==1)?res.game_info:this.form;
                this.resgisterChange();
                this.competitionChange();
            })
        },

        getOption(){
            var option_keys = ["country", "city", "esports", "scheduled_step", "match", "timezone", "currency", "language"]
            infoService.get_info_option(option_keys)
            .then(res=>{
                if(res.code==1){
                    this.options.country = res.options.country;
                    this.options.city = res.options.city;
                    this.options.backup_city = res.options.city;
                    this.options.game = res.options.esports;
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

        checkField(){
            if(this.form.register_time[1]>this.form.game_time[0]){
                this.$message.warning(this.$t("game_info.register_and_game_time_error"));
                return false
            }
            if(!/^[0-9.]+$/.test(this.form.fee)){
                this.$message.warning(this.$t("common_msg.input_number_lgt_0"));
                return false
            }
            return true
        },

        handleUpdate(){
            this.$refs.form.validate(valid => {
                if(this.checkField()){
                    if(valid){
                        var action = (this.form.game_id=="")?"create":"update";
                        infoService.update_competition_info(action, this.form)
                        .then(res=>{
                            if(res.code==1){
                                this.getData(res.game_id);
                                this.$message.success(this.$t("common_msg.save_ok"));
                                if(action=="create"){
                                    this.$router.replace({path:`/competition_info_edit?ctype=${this.form.game_type}&type=update&game_id=${res.game_id}`}).catch(err => {});
                                }else{
                                    this.$router.replace({path:`/competition_info_edit?ctype=${this.form.game_type}`,query:this.pushTable()}).catch(err => {});
                                }
                            }else if(res.code==0){
                                this.$message.warning(this.$t(res.msg));
                            }else{
                                this.$message.error(res.msg);
                            }
                        })
                        this.$refs.form.clearValidate()
                    }
                }
            })
        },

        handleCancel(){
            this.goBackTable();
        },

        goBackTable(){
            if(this.$route.query.type=="create"){
                this.$router.push({path:`/competition_info?ctype=${this.$route.query.ctype}&page=1&row=0`});
            }else{
                this.$router.push({path:`/competition_info?ctype=${this.$route.query.ctype}`,query:this.pushTable()});
            }
        },

        pushTable(){
            if(this.$route.query.type=="create"){
                var query = {}
            }else{
                var query = this.$route.query;
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

        changeCountrySelection(){
            if(this.form.country=="GLOBAL"){
                this.options.city=this.options.backup_city;
                this.form.city="Unlimited";
            }else{
                this.form.city="";
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
.status-btn{
    margin-left:30px;
    cursor:default;
}
.link-btn{
    margin-left:30px;
}
.pdr10{
    padding-right:10px;
}
.info-name{
    float:right;
    margin-right:20px;
    margin-top:3px;
    font-size:16px;
}
.handle-input{
    width:90%;
}
.handle-input-number{
    width:250px;
}
.handle-select-time{
    width:95%;
}
.handle-select{
    width:90%;
}
</style>
<style>
.el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
</style>