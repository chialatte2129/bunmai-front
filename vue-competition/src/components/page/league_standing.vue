<template>
    <div class="temp">
        <el-dialog :visible.sync="visible" width="700px" top="60px" :before-close="handleCloseDialog" :close-on-click-modal="false">
            <span slot="title" class="dialog-title">
                <span style="font-size:18px;">{{$t('menus.league_standing')}}</span>
                <span style="margin-left:30px;"><el-button type="primary" size="small" class="el-icon-upload2" @click="handleSubmitCheck"> {{$t('btn.check_submit')}}</el-button></span>
            </span>
            <el-table :data="standing_list.filter(data => !search || data.team_name.toLowerCase().includes(search.toLowerCase()))" :span-method="nameFilterCellMerge" :row-class-name="tableRowClassNameSetting"
            :cell-class-name="cellClassNameSetting" height="573" class="standing-table" ref="multipleTable" tooltip-effect="light" v-loading="table_loading">
                <el-table-column prop="team_name" :label="$t('game_info.team_name')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column width="210" align="right">
                    <template slot="header" slot-scope="scope">
                        <el-input v-model="search" class="handle-input" size="mini" clearable :placeholder="$t('game_info.team_name')"/>
                    </template>
                </el-table-column>
                <el-table-column prop="rank" :label="$t('game_info.rank')" width="130" align="center">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.rank" style="width:100%;" size="small" :min="0" :max="standing_list.length" @focus="scope.row.edit=1" @blur="scope.row.edit=0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="scores" :label="$t('game_info.scores')" width="150" align="center">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.scores" style="width:100%;" size="small" :min="0" @focus="scope.row.edit=1" @blur="scope.row.edit=0"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :visible.sync="submitVisible" width="500px" top="60px" :before-close="handleCloseSubmit" :close-on-click-modal="false">
            <el-button type="primary" size="small" class="el-icon-edit mb10" @click="handleSubmit"> {{$t('btn.save')}}</el-button>
            <el-table :data="submit_list" :row-class-name="tableRowClassNameRank" :cell-class-name="cellClassNameSetting" :cell-style="cellStyle" :default-sort="{prop:'rank', order:'ascending'}"
            height="500" class="standing-table" ref="multipleTable" tooltip-effect="light">
                <el-table-column prop="rank" :label="$t('game_info.rank')" width="130" align="center"></el-table-column>
                <el-table-column prop="team_name" :label="$t('game_info.team_name')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="scores" :label="$t('game_info.scores')" width="150" align="center"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { leagueService } from "@/_services";
export default {
    name:"league_standing",
    components:{},
    props:{
        visible: Boolean,
        game_id: String,
    },
    data(){
        return{
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            table_loading:false,
            submitVisible:false,
            standing_list:[],
            submit_list:[],
            search:"",
        }
    },
    computed:{
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
        this.getData(this.game_id);
    },

    methods:{
        handleCloseDialog(){
            this.$emit('closeDialog', false);
        },

        getData(id){
            this.table_loading=true;
            leagueService.get_league_standing_list(id)
            .then(res => {
                this.standing_list = res.standing_list;
            })
            this.table_loading=false;
        },

        handleSubmit(){
            leagueService.update_league_standing_list(this.game_id, this.submit_list)
            .then(res=>{
                if(res.code==1){
                    this.getData(this.game_id);
                    this.$message.success(this.$t("common_msg.save_ok"));
                    this.submitVisible=false;
                }else if(res.code==0){
                    this.$message.warning(this.$t(res.msg));
                }else{
                    this.$message.error(res.msg);
                }
            })
        },

        handleSubmitCheck(){ 
            console.log(this.standing_list);
            this.submit_list=Object.assign([], this.standing_list);
            console.log(this.submit_list)
            this.submitVisible=true;
        },
        
        handleCloseSubmit(){ 
            this.submit_list=[];
            this.submitVisible=false;
        },

        tableRowClassNameRank({row, rowIndex}){
            if(row.rank==1){ return "golden-row" }
            else if(row.rank==2){ return "silver-row" }
            else if(row.rank==3){ return "bronze-row" }
            else{ return "" }
        },

        tableRowClassNameSetting({row, rowIndex}){
            if(row.edit==1){ return "warning-row" }
            else if(row.rank==0){ return "error-row" }
            else{ return "" }
        },

        cellClassNameSetting({row, column, rowIndex, columnIndex}){
            if(row.rank==0&&column.property=='rank'){ return "error-cell" }
            else{ return "" }
        },
        
        cellStyle({row, column, rowIndex, columnIndex}){ return "padding:2px" },

        nameFilterCellMerge({row, column, rowIndex, columnIndex}){
            if(columnIndex===0){ return [1, 2] }
            else if(columnIndex===1){ return [0, 0] }
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
.ml30{
    margin-left:30px;
}
.mr10{
    margin-right:10px;
}
.handle-input{
    width: 200px;
    display: inline-block;
}
.handle-input-short{
    width: 125px;
    display: inline-block;
}
.handle-input-long{
    width: 300px;
    display: inline-block;
}
.standing-table{
    width: 100%;
    font-size: 14px;
}
.standing-table >>> .error-row{
    background:#FFCCCC;
}
.standing-table >>> .warning-row{
    background:#FFF4D8;
}
.standing-table >>> .error-cell{
    background:#FFA8A8;
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
.temp{
    width: 100%;
}
.del-dialog-cnt{
    font-size: 16px;
    text-align: center;
}
</style>
<style>
</style>