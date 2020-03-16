<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span style="color:#303133;"><i class="el-icon-user"></i><b> {{$t('menus.league_players_info')}}</b></span></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="filter.game_id" :placeholder="$t('game_info.name')" clearable @change="search" class="handle-input mr10">
                    <el-option v-for="item in competitons" :key="item.value" :label="item.label" :value="item.value"></el-option>  
                </el-select>
                <el-input v-model="filter.member_id" :placeholder="$t('game_info.member_id')" clearable @change="search" class="handle-input mr10"></el-input>
                <el-button type="info" @click="cancelSearch"> {{$t('btn.clean')}}</el-button>
            </div>
            <el-table :data="players_info" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="table_loading" @sort-change="handleSortChange">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="top" inline class="demo-table-expand">
                            <el-form-item :label="$t('game_info.entered_game')">
                                <div v-for='(row,index) in props.row.entered_games'>
                                    <el-button type="primary" plain  @click="" style="padding:5px;cursor:default;">{{$t('game_info.name')}} : {{row.game_name}}</el-button>
                                    <el-button type="warning" plain  @click="" style="padding:5px;cursor:default;">{{$t('game_info.team_name')}} : {{row.team_name}}</el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="member_id" :label="$t('game_info.member_id')" width="150"></el-table-column>
                <el-table-column prop="nickname" :label="$t('game_info.nickname')"  width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" :label="$t('game_info.contact_person_name')"  width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mail" :label="$t('game_info.mail')" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="phone" :label="$t('game_info.phone')" width="145" show-overflow-tooltip></el-table-column>
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
    name:"league_players_info",
    components:{

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
            competitons:[],
            players_info:[],
            table_loading:false,

            filter:{
                game_id:"",
                member_id:""
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
                'member_id':this.filter.member_id
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
            leagueService.get_league_player('all', null, this.getParam())
            .then(res => { console.log(res)
                this.players_info = res.players_info;
                this.totalRow = res.total;
                this.$router.replace({path:`/league_players_info`,query:{page:this.cur_page,row:this.start_row}}).catch(err => {});
            })
            this.table_loading=false;
        },

        resetFilter(){
            this.filter = {
                game_id:"",
                member_id:""
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