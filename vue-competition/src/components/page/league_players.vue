<template>
    <div class="temp">
        <el-card shadow="hover" style="min-height:300px;height:auto;">
            <div slot="header" class="clearfix"><span>{{$t('game_info.team_players')}}</span></div>
            <div style="padding:0 7px;">
            <div class="handle-box">
                <el-button type="success" class="el-icon-circle-plus-outline mr10" @click="handleCreate" v-if="update_info_auth&&table_type=='single'"> {{$t('btn.new')}}</el-button>
                <el-input v-model="filter.member_id" :placeholder="$t('game_info.member_id')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.name" :placeholder="$t('game_info.contact_person_name')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.nickname" :placeholder="$t('game_info.nickname')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.email" :placeholder="$t('game_info.mail')" clearable @change="search" class="handle-input-long mr10"></el-input>
                <el-button type="info" @click="cancelSearch"> {{$t('btn.clean')}}</el-button>
            </div>
            <el-table
            :data="players_info"
            border class="table" 
            ref="multipleTable"
            tooltip-effect="light" 
            v-loading="table_loading"
            @sort-change="handleSortChange">
                <el-table-column prop="member_id" :label="$t('game_info.member_id')" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" :label="$t('game_info.contact_person_name')"  width="auto" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="nickname" :label="$t('game_info.nickname')"  width="auto" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="email" :label="$t('game_info.mail')" width="auto" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="phone" :label="$t('game_info.phone')" width="145" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created_at" :label="$t('game_info.created_at')" width="155" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('btn.action')" width="165" align="center" v-if="table_type=='single'">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" style="padding:5px 10px;" :disabled="!view_info_auth">{{$t('btn.edit')}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" style="padding:5px 10px;"
                        :disabled="(!delete_info_auth||scope.row.del_disabled==1)&&(!is_admin)">{{$t('btn.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">                      
                <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="cur_page"
                :page-sizes="page_size_list" 
                :page-size="pagesize"         
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalRow">    
                </el-pagination>
            </div>
            </div>
        </el-card>
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="delVisible" width="500px" center>
            <div class="del-dialog-cnt">
                <div><i class="el-icon-warning" style="color:#E6A23C;font-size:20px;"></i>&nbsp;&nbsp;{{$t('common_msg.ask_for_delete')}} ?</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible=false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="deleteRow">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="editVisible" :title="this.showTitle" width="900px" :before-close="handleCancelEdit" :close-on-click-modal="false">
            <el-col :span="24">
                <div style="padding:0 15px;">
                    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width=auto>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="$t('game_info.member_id')" prop="member_id">
                                    <el-input v-model="form.member_id" class="handle-input-form" :disabled="updateVisible" maxlength="16" show-word-limit @change="memberValid"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.contact_person_name')" prop="name">
                                    <el-input v-model="form.name" class="handle-input-form" maxlength="40" :disabled="createLock"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.nickname')" prop="nickname">
                                    <el-input v-model="form.nickname" class="handle-input-form" maxlength="40" :disabled="createLock"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.status')" prop="status">
                                    <el-select v-model="form.status" :placeholder="$t('game_info.status')" class="handle-input-form" clearable filterable :disabled="(!is_admin)||createLock">
                                        <el-option v-for="item in options.players_status" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('game_info.mail')" prop="email">
                                    <el-input v-model="form.email" class="handle-input-form" maxlength="200" :disabled="createLock"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.phone')" prop="phone">
                                    <el-input v-model="form.phone" class="handle-input-form" maxlength="20" :disabled="createLock"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.gender')" prop="gender">
                                    <el-select v-model="form.gender" :placeholder="$t('game_info.gender')" class="handle-input-form" clearable filterable :disabled="createLock">
                                        <el-option v-for="item in options.gender" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('game_info.birthday')" prop="birthday">
                                    <el-date-picker type="date" :placeholder="$t('game_info.birthday')" v-model="form.birthday" 
                                    clearable value-format="yyyy-MM-dd" class="handle-input-form" :disabled="createLock"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item :label="$t('game_info.note')" prop="note">
                                    <el-input type="textarea" :rows="6" v-model="form.note" class="handle-input-form-note mb10" :disabled="createLock"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancelEdit">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="handleUpload()" v-if="editVisible" :disabled="createLock">{{$t('btn.save')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { infoService, leagueService } from "@/_services";
export default {
    name:"league_players",
    components:{},
    props:{
        team_id: String,
        game_id: String,
        table_type: String,
    },
    data(){
        return{
            start_row:0,
            cur_page:1,
            pagesize:10,
            sort_column:"",
            sort:"",
            page_size_list:[10,20],
            totalRow:0,
            delInfo:{},
            delVisible:false,
            players_info:[],
            table_loading:false,
            createVisible:false,
            updateVisible:false,
            createLock:true,

            filter:{
                member_id:"",
                nickname:"",
                name:"",
                email:"",
                status:""
            },

            options:{
                players_status:[],
                gender:[],
            },

            form:{
                game_id:"",
                member_id:"",
                team_id:"",
                avatar:null,
                role:"Start",
                nickname:"",
                name:"",
                email:"",
                phone:"",
                gender:"",
                birthday:"",
                note:"",
                status:"ON-line",
                retire_at:null,
            },
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            rules:{
                member_id:   [
                    {required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}, 
                    {pattern: /^\d{16}$/, message: this.$i18n.t("rules.only_numbers"), trigger: "blur"}
                    ],
                nickname:    [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                name:        [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                email:       [
                    // {required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}, 
                    {type:"email", message:this.$i18n.t("rules.invalidate_email"), trigger:"blur"}
                    ],
                // phone:       [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                status:      [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: ["blur", "change"]}],
            }
        }
    },
    computed:{
        count_page(){
            this.start_row=(this.cur_page-1)*this.pagesize
        },

        editVisible(){
            if(this.createVisible==true){
                return this.createVisible;
            }else if(this.updateVisible==true){
                return this.updateVisible;
            }else{
                return false
            }
        }, 

        showTitle(){
            if(this.createVisible==true){
                return this.$i18n.t("game_info.create_player")
            }else if(this.updateVisible==true){
                return this.$i18n.t("game_info.update_player")
            }
        },

        update_info_auth(){
            return localStorage.getItem("ms_user_actions").includes("update_league_competition")
        },

        view_info_auth(){
            return localStorage.getItem("ms_user_actions").includes("view_league_competition")
        },

        delete_info_auth(){
            return localStorage.getItem("ms_user_actions").includes("delete_league_competition")
        },
    },
    watch:{
        
        
    },
    created(){
        this.getOption();
        this.getData(this.$route.query.team_id);
    },

    methods:{
        memberValid(){
            if(this.createVisible&&this.form.member_id.length==16){
                leagueService.member_valid(this.form.member_id)
                .then(res => { 
                    if(res.code==1){
                        this.$message.success(res.msg);
                        this.createLock=false;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            }else{
                this.createLock=true;
            }
        },

        getParam(){
            var param = {
                'sort_column':this.sort_column,
                'sort':this.sort,
                'start_row':this.start_row,
                'page_size':this.pagesize,
                'member_id':this.filter.member_id,
                'nickname':this.filter.nickname,
                'name':this.filter.name,
                'status':this.filter.status,
                'email':this.filter.email
            }
            return param
        },

        getData(id){
            this.table_loading=true;
            leagueService.get_league_player(this.table_type, id, this.getParam())
            .then(res => { 
                this.players_info = res.players_info;
                this.totalRow = res.total;
            })
            this.table_loading=false;
        },

        getOption(){
            var option_keys = ["gender", "players_status"]
            infoService.get_info_option(option_keys)
            .then(res=>{
                if(res.code==1){
                    this.options.gender = res.options.gender;
                    this.options.players_status = res.options.players_status;
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

        resetFilter(){
            this.filter = {
                member_id:"",
                nickname:"",
                name:"",
                email:"",
                status:""
            }
        },

        resetForm(){
            this.form = {
                game_id:"",
                member_id:"",
                team_id:"",
                avatar:null,
                role:"Start",
                nickname:"",
                name:"",
                email:"",
                phone:"",
                gender:"",
                birthday:"",
                note:"",
                status:"ON-line",
                retire_at:null
            }
        },

        handleCancelEdit(){
            this.createVisible=false;
            this.updateVisible=false;
            this.resetForm();
            this.$refs.form.clearValidate();
        },


        handleCreate(){
            this.createVisible=true;
            this.createLock=true;
            this.form.game_id=this.$route.query.game_id;
            this.form.team_id=this.$route.query.team_id;
        },

        handleEdit(index, row){
            leagueService.get_single_league_player(row.team_id, row.member_id)
            .then(res=>{ 
                this.form = (res.code==1)?res.player_info:this.form;
            })
            this.updateVisible=true;
            this.createLock=false;
        },

        handleUpload(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var action = (this.createVisible)?"create":"update";
                    leagueService.update_league_player(action, this.form)
                    .then(res=>{
                        if(res.code==1){
                            this.getData(this.$route.query.team_id);
                            this.$message.success(this.$t("common_msg.save_ok"));
                            this.createVisible=false;
                            if(action=="create"){this.handleEdit(null,res.row)}
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

        handleDelete(index, row){
            this.delInfo=row;
            this.delVisible=true;
        },

        deleteRow(){
            var param = {"team_id":this.delInfo.team_id,"member_id":this.delInfo.member_id,"game_id":this.delInfo.game_id}
            leagueService.delete_league_player(param)
            .then(res => {
                if(res.code==1){
                    this.handleDeleteChange();
                    this.getData(this.$route.query.team_id);
                    this.$message.success(this.$t(res.msg));
                }else if(res.code==0){
                    this.$message.warning(this.$t(res.msg));
                }else{
                    this.$message.error(res.msg);
                }
                this.delVisible=false;
                this.delInfo={};
            }); 
        },

        search(){
            this.handleCurrentChange(1);
        },

        cancelSearch(){
            this.resetFilter();
            this.handleCurrentChange(1);
        },

        handleSortChange({prop, order}){
            this.sort_column=prop;
            this.sort=order;
            this.handleCurrentChange(1);
        },

        handleCurrentChange(currentPage){
            this.cur_page=parseInt(currentPage);
            this.count_page;
            this.getData(this.$route.query.team_id);
        },

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){
                this.start_row-=this.pagesize
            }
        },

        handleSizeChange(size){
            this.pagesize = size;
            this.handleCurrentChange(1);
        },

        show_label(item){
            return localStorage.getItem("ms_user_lang")=='zh_TW'?item.label:(item.label_i18n==undefined?item.label:item.label_i18n);
        },

    }
}
</script>
<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.mb10{
    margin-bottom:10px;
}
.mr10{
    margin-right:10px;
}
.handle-input{
    width: 200px;
    display: inline-block;
}
.handle-input-long{
    width: 300px;
    display: inline-block;
}
.handle-input-form{
    width: 90%;
    display: inline-block;
}
.handle-input-form-note{
    width: 95.5%;
    display: inline-block;
}
.temp{
    width: 100%;
}
.table{
    width: 100%;
    font-size: 14px;
}
.del-dialog-cnt{
    font-size: 16px;
    text-align: center;
}
</style>
<style>
</style>