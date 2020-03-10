<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span style="color:#303133;"><i class="el-icon-info"></i><b> {{$t('menus.league_teams')}}</b></span></el-breadcrumb-item>
                <el-breadcrumb-item><span><b>{{$route.query.game_id}}. {{teams.game_name}}</b></span></el-breadcrumb-item>
            </el-breadcrumb>
            <span style="float:right;margin-top:-30px;margin-right:10px;font-size:18px;"><b>
                <span>{{$t('game_info.enter_game_teams_total')}}<span style="font-size:24px;color:#FF074A;">{{teams.teams_total}}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>{{$t('game_info.enter_game_players_total')}}<span style="font-size:24px;color:#FF074A;">{{teams.players_total}}</span></span></b>
            </span>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="success" class="el-icon-circle-plus-outline mr10" @click="handleCreate" v-if="update_info_auth"> {{$t('btn.new')}}</el-button>
                <el-input v-model="filter.team_id" :placeholder="$t('game_info.team_id')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.team_name" :placeholder="$t('game_info.team_name')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.contact_person" :placeholder="$t('game_info.contact_person')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.email" :placeholder="$t('game_info.contact_mail')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-button type="info" @click="cancelSearch"> {{$t('btn.clean')}}</el-button>
            </div>
            <el-table
            :data="teams.teams_info"
            border class="table" 
            ref="multipleTable"
            tooltip-effect="light" 
            v-loading="table_loading"
            @sort-change="handleSortChange">
                <el-table-column prop="team_id" :label="$t('game_info.team_id')" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="team_name" :label="$t('game_info.team_name')"  width="auto" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="contact_person" :label="$t('game_info.contact_person')" width="auto" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="phone" :label="$t('game_info.contact_phone')" width="145" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="email" :label="$t('game_info.contact_mail')" width="auto" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="total_players" :label="$t('game_info.teams_players_total')" width="140" sortable="custom" align="right" header-align="left" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created_at" :label="$t('game_info.created_at')" width="155" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('btn.action')" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" style="padding:5px 10px;" :disabled="!view_info_auth">{{$t('btn.edit')}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" style="padding:5px 10px;"
                        :disabled="(!delete_info_auth)&&(!is_admin)">{{$t('btn.delete')}}</el-button>
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
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="delVisible" width="500px" center>
            <div class="del-dialog-cnt">
                <div><i class="el-icon-warning" style="color:#E6A23C;font-size:20px;"></i>&nbsp;&nbsp;{{$t('common_msg.delete_team_tips')}}</div>
                <div><i class="el-icon-warning" style="color:#E6A23C;font-size:20px;"></i>&nbsp;&nbsp;{{$t('common_msg.ask_for_delete')}} ?</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible=false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="deleteRow">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        <el-backtop target=".content" :visibility-height="0" :bottom="40" :right="10">
            <div style="{height:100%; width:100%; box-shadow:0 0 6px rgba(0,0,0, .12); border-radius:50%; text-align:center; font-size:15px; font-weight:bold; line-height:40px; color:#000000;}">TOP</div>
        </el-backtop>
    </div>
</template>
<script>
import { infoService } from "@/_services";
export default {
    name:"league_teams",
    components:{

    },
    data(){
        return{
            start_row:0,
            cur_page:1,
            pagesize:10,
            sort_column:"",
            sort:"",
            page_size_list:[5,10,20],
            totalRow:0,
            delID:null,
            delVisible:false,

            teams:{
                teams_total:0,
                players_total:0,
                game_name:"",
                teams_info:[]
            },
            table_loading:false,

            filter:{
                team_id:"",
                team_name:"",
                contact_person:"",
                email:""
            },
        }
    },
    computed:{
        count_page(){
            this.start_row=(this.cur_page-1)*this.pagesize
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

        is_admin(){
            return !!localStorage.getItem("ms_is_admin")
        },

    },
    watch:{
        
        
    },
    created(){
        this.getData(this.$route.query.game_id);
    },

    methods:{
        getParam(){
            this.cur_page=('position' in this.$route.query)?parseInt(this.$route.query.position.page):this.cur_page;
            this.totalRow=('position' in this.$route.query)?parseInt(this.$route.query.position.total):this.totalRow;
            this.sort_column=('position' in this.$route.query)?this.$route.query.position.col:this.sort_column;
            this.sort=('position' in this.$route.query)?this.$route.query.position.order:this.sort;
            this.start_row=('position' in this.$route.query)?(
                (this.$route.query.position.row==(this.totalRow-1)&&this.$route.query.position.row!=0)?this.$route.query.position.row-this.pagesize:this.$route.query.position.row):this.start_row;
            this.filter.team_id=('position' in this.$route.query)?this.$route.query.position.filter.team_id:this.filter.team_id;
            this.filter.team_name=('position' in this.$route.query)?this.$route.query.position.filter.team_name:this.filter.team_name;
            this.filter.contact_person=('position' in this.$route.query)?this.$route.query.position.filter.contact_person:this.filter.contact_person;
            this.filter.email=('position' in this.$route.query)?this.$route.query.position.filter.email:this.filter.email;
            var param = {
                'sort_column':this.sort_column,
                'sort':this.sort,
                'start_row':this.start_row,
                'page_size':this.pagesize,
                'team_id':this.filter.team_id,
                'team_name':this.filter.team_name,
                'contact_person':this.filter.contact_person,
                'email':this.filter.email
            }
            return param
        },

        getData(id){
            this.table_loading=true;
            infoService.get_league_team(id, this.getParam())
            .then(res => { console.log(res)
                this.teams = res.teams;
                this.totalRow = res.total;
                this.$router.replace({path:`/league_teams?game_id=${this.$route.query.game_id}`,query:{page:this.cur_page,row:this.start_row}}).catch(err => {});
            })
            this.table_loading=false;
        },

        resetFilter(){
            this.filter = {
                team_id:"",
                team_name:"",
                contact_person:"",
                email:""
            }
        },

        handleCreate(){
            this.$router.push({path:`/league_teams_edit?game_id=${this.$route.query.game_id}`, query:{type:"create"}});
        },

        pushEdit(row){
            var query = {
                "type":"update",
                "game_id":row.game_id,
                "team_id":row.team_id,
                "position":{
                    "page":this.cur_page,
                    "row":this.start_row,
                    "col":this.sort_column,
                    "order":this.sort,
                    "total":this.totalRow,
                    "filter":{
                        "team_id":this.filter.team_id,
                        "team_name":this.filter.team_name,
                        "contact_person":this.filter.contact_person,
                        "email":this.filter.email
                    }
                }
            }
            return query
        },

        handleEdit(index, row){
            this.$router.push({path:`/league_teams_edit?game_id=${this.$route.query.game_id}`, query:this.pushEdit(row)});
        },

        handleDelete(index, row){
            this.delID=row.team_id;
            this.delVisible=true;
        },

        deleteRow(){
            var param = {"team_id":this.delID}
            infoService.delete_league_team(param)
            .then(res => {
                if(res.code==1){
                    this.handleDeleteChange();
                    this.getData(this.$route.query.game_id);
                    this.$message.success(this.$t(res.msg));
                }else if(res.code==0){
                    this.$message.warning(this.$t(res.msg));
                }else{
                    this.$message.error(res.msg);
                }
                this.delVisible=false;
            }); 
        },

        search(){
            // console.log("search ", this.filter);
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
            // console.log('sort-change',  this.sort_column , this.sort)
        },

        handleCurrentChange(currentPage){
            this.cur_page=parseInt(currentPage);
            this.count_page;
            this.getData(this.$route.query.game_id);
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
.el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
</style>