<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item v-if="$route.query.type=='create'" :to="{path:`/league_teams?table_type=${$route.query.table_type}&game_id=${$route.query.game_id}`, query:pushTable()}">
                <i class="el-icon-info"></i><span> {{$t('menus.league_teams')}} </span><span style="font-size:16px;">{{$route.query.game_id}}</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-else :to="{path:`/league_teams?table_type=${$route.query.table_type}&game_id=${$route.query.game_id}&team_id=${$route.query.team_id}`, query:pushTable()}"><i class="el-icon-info"></i>
                    <span> {{$t('menus.league_teams')}} </span><span style="font-size:16px;">{{$route.query.game_id}}</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-if="$route.query.type=='create'">{{$t('menus.league_teams_create')}}</el-breadcrumb-item>
                <el-breadcrumb-item v-else>{{$t('menus.league_teams_edit')}}&nbsp;&nbsp;&nbsp;&nbsp;<b>{{$route.query.team_id}}. {{form.team_name}}</b></el-breadcrumb-item>
            </el-breadcrumb>
            <span style="float:right;margin-top:-38px">
                <el-button type="primary" v-if="$route.query.table_type=='single'" icon="el-icon-edit" @click="handleUpdate" size=large :disabled="!this.update_info_auth">{{$t('btn.save')}}</el-button>
                <el-button type="info" v-if="$route.query.table_type=='single'" icon="el-icon-back" @click="handleCancel" size=large> {{$t('btn.leave')}}</el-button>
            </span>   
        </div>
        <div class="container">
            <el-row>
                <el-form ref="form" :model="form" :rules="rules" label-width="auto" label-position="right">
                    <el-col :span="12" class="pdr10">
                        <el-card shadow="hover" style="min-height:320px;height:auto;" class="mb10">
                            <div slot="header" class="clearfix"><span>{{$t('game_info.team_information')}}</span></div>
                            <div>
                                <el-form-item :label="$t('game_info.team_name')" prop="team_name">
                                    <el-input v-model="form.team_name" class="handle-input" maxlength="12" show-word-limit></el-input>
                                </el-form-item>
                                <el-row>
                                    <el-col :span="10" class="pdr10">
                                        <el-form-item :label="$t('game_info.status')" prop="status">
                                            <el-select v-model="form.status" :placeholder="$t('game_info.status')" class="handle-select" clearable filterable @change="statusChange" :disabled="!is_admin">
                                                <el-option v-for="item in options.team_status" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="14">                                       
                                        <el-form-item :label="$t('game_info.closed_at')" prop="closed_at">
                                            <el-date-picker type="datetime" :placeholder="$t('game_info.closed_at')" v-model="form.closed_at" clearable
                                            @change="closeChange" :disabled="form.status!='closed'" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item :label="$t('game_info.slogan')" prop="slogan">
                                    <el-input type="textarea" :rows="1" v-model="form.slogan" class="handle-input"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.note')" prop="note">
                                    <el-input type="textarea" :rows="2" v-model="form.note" class="handle-input"></el-input>
                                </el-form-item>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" style="min-height:320px;height:auto;" class="mb10">
                            <div slot="header" class="clearfix"><span>{{$t('game_info.team_contact_person_information')}}</span></div>
                            <div>
                                <el-form-item :label="$t('game_info.contact_person_name')" prop="contact_person">
                                    <el-input v-model="form.contact_person" class="handle-input" maxlength="40"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.phone')" prop="phone">
                                    <el-input v-model="form.phone" class="handle-input" maxlength="20"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.mail')" prop="email">
                                    <el-input v-model="form.email" class="handle-input" maxlength="200"></el-input>
                                </el-form-item>
                                <el-row>
                                    <el-col :span="10" class="pdr10">
                                        <el-form-item :label="$t('game_info.gender')" prop="gender">
                                            <el-select v-model="form.gender" :placeholder="$t('game_info.gender')" class="handle-select" clearable filterable>
                                                <el-option v-for="item in options.gender" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="14">                                       
                                        <el-form-item :label="$t('game_info.birthday')" prop="birthday">
                                            <el-date-picker type="date" :placeholder="$t('game_info.birthday')" v-model="form.birthday" clearable value-format="yyyy-MM-dd"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-card>
                    </el-col>
                </el-form>
            </el-row>
            <el-row v-if="form.team_id">
                <leaguePlayers :team_id="form.team_id" :game_id="form.game_id" :table_type="'single'"></leaguePlayers>
            </el-row>
        </div>
        <el-backtop target=".content" :visibility-height="0" :bottom="40" :right="10">
            <div style="{height:100%; width:100%; box-shadow:0 0 6px rgba(0,0,0, .12); border-radius:50%; text-align:center; font-size:15px; font-weight:bold; line-height:40px; color:#000000;}">TOP</div>
        </el-backtop>
    </div>
</template>
<script>
import { infoService, leagueService } from "@/_services";
import leaguePlayers from "@/components/page/league_players.vue";
export default {
    name:"league_teams_edit",
    components:{
        leaguePlayers
    },
    data(){
        return{
            form:{
                game_id:this.$route.query.game_id,
                team_id:"",
                team_name:"",
                logo:null,
                slogan:"",
                is_major:1,
                contact_person:"",
                email:"",
                phone:"",
                gender:"",
                birthday:"",
                note:"",
                status:"Operation",
                closed_at:null,
                member_count:null,
            },
            options:{
                team_status:[],
                gender:[],
            },
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            
            rules:{
                team_name:          [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                contact_person:     [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                email:              [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}, {type:"email", message:this.$i18n.t("rules.invalidate_email"), trigger:"blur"}],
                phone:              [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                // gender:             [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: ["blur", "change"]}],
                status:             [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: ["blur", "change"]}],
            }
        }
    },
    computed:{
        update_info_auth(){
            return localStorage.getItem("ms_user_actions").includes("update_league_competition")
        },

    },
    watch:{
        
        
    },
    created(){
        this.getOption();
        this.getData(this.$route.query.team_id);
    },

    methods:{
        statusChange(){
            this.form.closed_at=(this.form.status!="closed")?null:this.form.closed_at;
        },

        closeChange(){
            this.form.closed_at=(this.form.closed_at=="")?null:this.form.closed_at;
        },

        disabledTime(time){
            var d = new Date(time);
            var timestamp = d.valueOf();
            return timestamp
        },

        getData(id){
            leagueService.get_single_league_team(id)
            .then(res=>{ 
                this.form = (res.code==1)?res.team_info:this.form;
            })
        },

        getOption(){
            var option_keys = ["gender", "team_status"]
            infoService.get_info_option(option_keys)
            .then(res=>{
                if(res.code==1){
                    this.options.gender = res.options.gender;
                    this.options.team_status = res.options.team_status;
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
                if(valid){
                    var action = (this.form.team_id=="")?"create":"update";
                    leagueService.update_league_team_info(action, this.form)
                    .then(res=>{
                        if(res.code==1){
                            this.getData(res.team_id);
                            this.$message.success(this.$t("common_msg.save_ok"));
                            if(action=="create"){
                                this.$router.replace({path:`/league_teams_edit?table_type=single&game_id=${this.$route.query.game_id}&type=update&team_id=${res.team_id}`}).catch(err => {});
                            }else{
                                this.$router.replace({path:`/league_teams_edit`,query:this.pushTable()}).catch(err => {});
                            }
                        }else if(res.code==0){
                            this.$message.warning(this.$t(res.msg));
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                    this.$refs.form.clearValidate()
                }
            })
        },

        handleCancel(){
            this.goBackTable();
        },

        goBackTable(){
            if(this.$route.query.type=="create"){
                this.$router.push({path:`/league_teams?table_type=${this.$route.query.table_type}&game_id=${this.$route.query.game_id}&page=1&row=0`});
            }else{
                this.$router.push({path:`/league_teams`,query:this.pushTable()});
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
    width:98%;
}
.handle-input-number{
    width:250px;
}
.handle-select-time{
    width:95%;
}
.handle-select{
    width:98%;
}
</style>
<style>
.el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
</style>