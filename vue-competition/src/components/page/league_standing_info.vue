<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span style="color:#303133;"><i class="el-icon-s-operation"></i><b> {{$t('menus.league_standing_info')}}</b></span></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="filter.game_id" :placeholder="$t('game_info.name')" clearable @change="search" class="handle-input mr10">
                    <el-option v-for="item in competitons" :key="item.value" :label="item.label" :value="item.value"></el-option>  
                </el-select>
            </div>
            <el-table :data="standing_list" :row-class-name="tableRowClassNameRank" class="standing-table" ref="multipleTable" tooltip-effect="light" width="370px"
            :default-sort="{prop:'rank', order:'ascending'}" v-if="filter.game_id!=''&&filter.game_id!=null">
                <el-table-column prop="rank" :label="$t('game_info.rank')" width="130" align="center"></el-table-column>
                <el-table-column prop="team_name" :label="$t('game_info.team_name')" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="scores" :label="$t('game_info.scores')" width="150" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { infoService, leagueService } from "@/_services";
export default {
    name:"league_standing_info",
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
            competitons:[],
            standing_list:[],
            table_loading:false,
            filter:{
                game_id:""
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
    },

    methods:{
        getParam(){
            var param = {
                'sort_column':this.sort_column,
                'sort':this.sort,
                'start_row':this.start_row,
                'page_size':this.pagesize,
                'game_id':this.filter.game_id
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
            leagueService.get_league_standing_list(this.filter.game_id)
            .then(res => {
                this.standing_list = res.standing_list;
            })
            this.table_loading=false;
        },

        resetFilter(){
            this.filter = {
                game_id:""
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
            this.getData(this.filter.game_id);
        },

        handleSizeChange(size){
            this.pagesize = size;
            this.handleCurrentChange(1);
        },

        tableRowClassNameRank({row, rowIndex}){
            if(row.rank==1){ return "golden-row" }
            else if(row.rank==2){ return "silver-row" }
            else if(row.rank==3){ return "bronze-row" }
            else{ return "" }
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
    width: 250px;
    display: inline-block;
}
.temp{
    width: 100%;
}
.standing-table{
    font-size: 14px;
}
.standing-table >>> .golden-row{
    background:#FEFBCA;
}
.standing-table >>> .silver-row{
    background:#F5F5F5;
}
.standing-table >>> .bronze-row{
    background:#E5D8C6;
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