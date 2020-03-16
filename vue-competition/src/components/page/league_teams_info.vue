<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span style="color:#303133;"><i class="el-icon-collection"></i><b> {{$t('menus.league_teams_info')}}</b></span></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="filter.game_id" :placeholder="$t('game_info.name')" clearable @change="search" class="handle-input mr10">
                    <el-option v-for="item in competitons" :key="item.value" :label="item.label" :value="item.value"></el-option>  
                </el-select>
                <el-input v-model="filter.team_name" :placeholder="$t('game_info.team_name')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.contact_person" :placeholder="$t('game_info.contact_person')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-input v-model="filter.email" :placeholder="$t('game_info.contact_mail')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-button type="info" @click="cancelSearch"> {{$t('btn.clean')}}</el-button>
            </div>
            <el-table :data="teams_info" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="table_loading" :span-method="gameCellMerge" @sort-change="handleSortChange">
                <el-table-column prop="game_name" :label="$t('game_info.name')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="team_name" :label="$t('game_info.team_name')"  width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="contact_person" :label="$t('game_info.contact_person')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="phone" :label="$t('game_info.contact_phone')" width="145" show-overflow-tooltip></el-table-column>
                <el-table-column prop="email" :label="$t('game_info.contact_mail')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="total_players" :label="$t('game_info.teams_players_total')" width="140" align="right" header-align="left" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created_at" :label="$t('game_info.created_at')" width="155" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="pagination">                      
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="cur_page" :page-sizes="page_size_list" :page-size="pagesize" :total="totalRow"
                layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>
        <el-backtop target=".content" :visibility-height="0" :bottom="40" :right="10">
            <div style="{height:100%; width:100%; box-shadow:0 0 6px rgba(0,0,0, .12); border-radius:50%; text-align:center; font-size:15px; font-weight:bold; line-height:40px; color:#000000;}">TOP</div>
        </el-backtop>
    </div>
</template>
<script>
import { infoService, leagueService } from "@/_services";
export default {
    name:"league_teams_info",
    components:{

    },
    data(){
        return{
            start_row:0,
            cur_page:1,
            pagesize:10,
            sort_column:"",
            sort:"",
            page_size_list:[10,20,50],
            totalRow:0,
            spanArr:[],
            pos:0,
            competitons:[],
            teams_info:[],
            table_loading:false,

            filter:{
                game_id:"",
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
        this.getOption();
        this.getData();
    },

    methods:{
        getParam(){
            var param = {
                'sort_column':this.sort_column,
                'sort':this.sort,
                'start_row':this.start_row,
                'page_size':this.pagesize,
                'game_id':this.filter.game_id,
                'team_name':this.filter.team_name,
                'contact_person':this.filter.contact_person,
                'email':this.filter.email
            }
            return param
        },

        getOption(){
            infoService.get_all_competition_info('league')
            .then(res=>{
                this.competitons = res.competitons;
            })
        },

        getData(){
            this.table_loading=true;
            leagueService.get_league_team('all', null, this.getParam())
            .then(res => {
                this.teams_info = res.teams_info;
                this.totalRow = res.total;
                this.$router.replace({path:`/league_teams_info`,query:{page:this.cur_page,row:this.start_row}}).catch(err => {});
                this.getSpanArr(this.teams_info);
            })
            this.table_loading=false;
        },

        getSpanArr(data){
            this.resetSpanArr();
            for(var i=0;i<data.length;i++){
                if(i===0){ this.spanArr.push(1); this.pos=0; }
                else{
                    if(data[i].game_name===data[i-1].game_name){ this.spanArr[this.pos]+=1; this.spanArr.push(0); }
                    else{ this.spanArr.push(1); this.pos = i; }
                }
            }
        },

        gameCellMerge({row, column, rowIndex, columnIndex}){
            if(column.property==="game_name"){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
        },

        resetSpanArr(){
            this.spanArr=[];
            this.pos=null;
        },

        resetFilter(){
            this.filter = {
                game_id:"",
                team_name:"",
                contact_person:"",
                email:""
            }
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
            this.getData();
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