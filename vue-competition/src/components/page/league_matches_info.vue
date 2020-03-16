<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span style="color:#303133;"><i class="el-icon-c-scale-to-original"></i><b> {{$t('menus.league_matches_info')}}</b></span></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="filter.game_id" :placeholder="$t('game_info.name')" clearable @change="search" class="handle-input-long mr10">
                    <el-option v-for="item in competitons" :key="item.value" :label="item.label" :value="item.value"></el-option>  
                </el-select>
                <el-input v-model="filter.team_name" :placeholder="$t('game_info.team_name')" clearable @change="search" class="handle-input-long mr10"></el-input>
                <el-date-picker type="date" :placeholder="$t('game_info.game_date')" v-model="filter.game_date" clearable @change="search" value-format="yyyy-MM-dd" class="handle-input mr10"></el-date-picker>
                <el-button type="info" @click="cancelSearch"> {{$t('btn.clean')}}</el-button>
            </div>
            <el-table :data="match_list" height="585" class="match-table" ref="multipleTable" tooltip-effect="light" border
            :cell-class-name="cellClassName" :span-method="dateCellMerge" v-loading="table_loading">
                <el-table-column prop="game_name" :label="$t('game_info.name')" width="auto" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="round" :label="$t('game_info.week')" width="90" align="center"></el-table-column>
                <el-table-column prop="game_date" :label="$t('game_info.game_date')" width="110" align="center"></el-table-column>
                <el-table-column prop="start_time" :label="$t('game_info.start_time')" width="110" align="center"></el-table-column>
                <el-table-column prop="end_time" :label="$t('game_info.end_time')"  width="110" align="center"></el-table-column>
                <el-table-column prop="home_team" :label="$t('game_info.home_team')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="away_team" :label="$t('game_info.away_team')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="note" :label="$t('game_info.note')" width="200" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :current-page="cur_page" :page-sizes="page_size_list" :page-size="pagesize" :total="totalRow">    
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { infoService, leagueService } from "@/_services";
export default {
    name:"league_matches_info",
    components:{},
    props:{},
    data(){
        return{
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            table_loading:false,
            match_list:[],
            competitons:[],
            totalRow:0,
            start_row:0,
            cur_page:1,
            pagesize:50,
            page_size_list:[50,100],
            spanArrDate:[],
            posDate:0,
            spanArrName:[],
            posName:0,
            spanArrWeek:[],
            posWeek:0,
            filter:{
                game_id:"",
                game_date:"",
                team_name:"",
            },
        }
    },
    computed:{
        count_page(){
            this.start_row=(this.cur_page-1)*this.pagesize
        },
        
    },
    watch:{
        
    },

    created(){
        this.getOption();
        this.getData(null);
    },

    methods:{
        getOption(){
            infoService.get_all_competition_info('league')
            .then(res=>{
                this.competitons = res.competitons;
            })
        },

        cellClassName({row, column, rowIndex, columnIndex}){
            if(row.home_team==this.filter.team_name&&column.property=='home_team'&&row.home_team!=""&&row.home_team!=null){
                return "success-cell";
            }else if(row.away_team==this.filter.team_name&&column.property=='away_team'&&row.away_team!=""&&row.away_team!=null){
                return "success-cell";
            }else{
                return "";
            }
        },

        getspanArrDate(data){
            this.resetspanArrDate();
            for(var i=0;i<data.length;i++){
                if(i===0){ this.spanArrDate.push(1);this.posDate=0; }
                else{
                    if(data[i].game_date===data[i-1].game_date){ this.spanArrDate[this.posDate]+=1; this.spanArrDate.push(0); }
                    else{ this.spanArrDate.push(1); this.posDate = i; }
                }
                if(i===0){ this.spanArrName.push(1);this.posName=0; }
                else{
                    if(data[i].game_name===data[i-1].game_name){ this.spanArrName[this.posName]+=1; this.spanArrName.push(0); }
                    else{ this.spanArrName.push(1); this.posName = i; }
                }
                if(i===0){ this.spanArrWeek.push(1);this.posWeek=0; }
                else{
                    if(data[i].round===data[i-1].round){ this.spanArrWeek[this.posWeek]+=1; this.spanArrWeek.push(0); }
                    else{ this.spanArrWeek.push(1); this.posWeek = i; }
                }
            }
        },

        resetspanArrDate(){
            this.spanArrDate=[];
            this.posDate=null;
            this.spanArrName=[];
            this.posName=null;
            this.spanArrWeek=[];
            this.posWeek=null;
        },

        dateCellMerge({row, column, rowIndex, columnIndex}){
            if(column.property==="game_date"){
                const _row_date=this.spanArrDate[rowIndex];
                const _col_date=_row_date>0?1:0;
                return { rowspan:_row_date, colspan:_col_date }
            }
            if(column.property==="game_name"){
                const _row_name=this.spanArrName[rowIndex];
                const _col_name=_row_name>0?1:0;
                return { rowspan:_row_name, colspan:_col_name }
            }
            if(column.property==="round"){
                const _row_week=this.spanArrWeek[rowIndex];
                const _col_week=_row_week>0?1:0;
                return { rowspan:_row_week, colspan:_col_week }
            }
        },

        getParam(){
            var param = {
                'start_row':this.start_row,
                'page_size':this.pagesize,
                'game_date':this.filter.game_date==null?"":this.filter.game_date,
                'game_id':this.filter.game_id,
                'team_name':this.filter.team_name
            }
            return param
        },
        
        getData(id){
            this.table_loading=true;
            leagueService.get_league_match_list(id, this.getParam())
            .then(res => {
                this.match_list = res.match_list;
                this.totalRow = res.total;
                this.getspanArrDate(this.match_list);
            })
            this.table_loading=false;
        },

        search(){
            this.handleCurrentChange(1);
        },

        cancelSearch(){
            this.resetFilter();
            this.handleCurrentChange(1);
        },

        resetFilter(){
            this.filter = {
                game_id:"",
                game_date:"",
                team_name:"",
            }
        },

        handleCurrentChange(currentPage){
            this.cur_page=parseInt(currentPage);
            this.count_page;
            this.getData(null);
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
    width: 250px;
    display: inline-block;
}
.match-table{
    width: 100%;
    font-size: 14px;
}
.match-table >>> .success-cell{
    background:#DBFFD8;
}
.match-table >>> .edit-row{
    background:#FFF4D8;
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
.el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
</style>