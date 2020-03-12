<template>
    <div class="temp">
        <el-dialog :visible.sync="visible" :title="$t('menus.league_teams_matches')" width="1600px" top="60px" :before-close="handleCloseDialog">
            <div class="handle-box">
                <span class="ml30"></span>
                <el-popover placement="right" width="1100" v-model="createVisible" v-if="update_info_auth">
                    <div style="padding:10px 20px;">
                        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width=auto>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item :label="$t('game_info.game_date')" prop="game_date">
                                        <el-date-picker type="date" :placeholder="$t('game_info.game_date')" v-model="form.game_date" clearable @change="form.start_time='',form.end_time=''" value-format="yyyy-MM-dd" 
                                        class="handle-input mr10" :picker-options="{ disabledDate(time){ return parse_game_end_time <= time.getTime()||time.getTime() < parse_game_start_time }}"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="$t('game_info.week')" prop="round">
                                        <el-input-number v-model="form.round" class="handle-input-short mr10" :min="1" :max="99"></el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="$t('game_info.start_time')" prop="start_time">
                                        <el-time-select v-model="form.start_time" :placeholder="$t('game_info.start_time')" clearable filterable class="handle-input-short mr10" :disabled="form.game_date==''"
                                        :picker-options="{ start:'00:00', step:'00:05', end:'23:55', maxTime:form.end_time}"></el-time-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="$t('game_info.end_time')" prop="end_time">
                                        <el-time-select v-model="form.end_time" :placeholder="$t('game_info.end_time')" clearable filterable class="handle-input-short mr10" :disabled="form.game_date==''"
                                        :picker-options="{ start:'00:00', step:'00:05', end:'23:55', minTime:form.start_time }"></el-time-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7">
                                    <el-form-item :label="$t('game_info.home_team')" prop="home_team">
                                        <el-select v-model="form.home_team" :placeholder="$t('game_info.home_team')" class="handle-input mr10" clearable filterable>
                                            <el-option v-for="item in teams" :key="item.id" :label="item.team_name" :value="item.id" :disabled="item.id==form.away_team"></el-option>  
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item :label="$t('game_info.away_team')" prop="away_team">
                                        <el-select v-model="form.away_team" :placeholder="$t('game_info.away_team')" class="handle-input mr10" clearable filterable>
                                            <el-option v-for="item in teams" :key="item.id" :label="item.team_name" :value="item.id" :disabled="item.id==form.home_team"></el-option>  
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item :label="$t('game_info.note')" prop="note">
                                        <el-input v-model="form.note" class="handle-input-long mr10" clearable maxlength="20" show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div style="text-align:center;margin:-10px 0 10px 0;">
                        <el-button size="small" type="primary" @click="handleUpload">{{$t('btn.save')}}</el-button>
                        <el-button size="small" type="info" @click="handleCancelCreate">{{$t('btn.cancel')}}</el-button>
                    </div>
                    <el-button type="success" class="el-icon-circle-plus-outline mr10" slot="reference" :disabled="updateVisible"> {{$t('btn.new')}}</el-button>
                </el-popover>
                <el-input v-model="filter.team_name" :placeholder="$t('game_info.team_name')" clearable @change="search" class="handle-input mr10" :disabled="updateVisible"></el-input>
                <el-select v-model="filter.game_date" :placeholder="$t('game_info.game_date')" class="handle-input-short mr10" 
                clearable filterable @change="filter.start_time='',filter.end_time='',search()" :disabled="updateVisible">
                    <el-option v-for="item in dates" :key="item.game_date" :label="item.game_date" :value="item.game_date"></el-option>  
                </el-select>
                <el-time-select v-model="filter.start_time" :placeholder="$t('game_info.start_time')" clearable filterable class="handle-input-short mr10" 
                :disabled="filter.game_date==''||updateVisible" @change="search"
                :picker-options="{ start:'00:00', step:'00:05', end:'23:55', maxTime:filter.end_time}"></el-time-select>
                <el-time-select v-model="filter.end_time" :placeholder="$t('game_info.end_time')" clearable filterable class="handle-input-short mr10" 
                :disabled="filter.game_date==''||updateVisible" @change="search"
                :picker-options="{ start:'00:00', step:'00:05', end:'23:55', minTime:filter.start_time }"></el-time-select>
                <el-button type="info" @click="cancelSearch" :disabled="updateVisible"> {{$t('btn.clean')}}</el-button>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-position="top" label-width=auto class="table-form" size="mini">
            <el-table
            :data="match_list"
            height="573"
            class="match-table" 
            ref="multipleTable"
            tooltip-effect="light" 
            :cell-class-name="cellClassName"
            :span-method="dateCellMerge"
            :row-class-name="tableRowClassName"
            v-loading="table_loading">
                <el-table-column prop="game_date" :label="$t('game_info.game_date')" width="140" align="center"></el-table-column>
                <el-table-column prop="round" :label="$t('game_info.week')" width="90" align="center"></el-table-column>
                <el-table-column prop="start_time" :label="$t('game_info.start_time')" width="145" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit">
                            <!-- <el-form-item prop="start_time"> -->
                                <el-time-select v-model="form.start_time" :placeholder="$t('game_info.start_time')" clearable class="handle-input-short" size="small"
                                :picker-options="{ start:'00:00', step:'00:05', end:'23:55', maxTime:form.end_time}"></el-time-select>
                            <!-- </el-form-item> -->
                        </span>
                        <span v-else>{{scope.row.start_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="end_time" :label="$t('game_info.end_time')"  width="145" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit">
                            <!-- <el-form-item prop="end_time"> -->
                                <el-time-select v-model="form.end_time" :placeholder="$t('game_info.end_time')" clearable class="handle-input-short" size="small"
                                :picker-options="{ start:'00:00', step:'00:05', end:'23:55', minTime:form.start_time }"></el-time-select>
                            <!-- </el-form-item> -->
                        </span>
                        <span v-else>{{scope.row.end_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="home_team" :label="$t('game_info.home_team')" width="auto" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit">
                            <!-- <el-form-item prop="home_team"> -->
                                <el-select v-model="form.home_team" :placeholder="$t('game_info.home_team')" style="width:100%;" size="small" clearable filterable>
                                    <el-option v-for="item in teams" :key="item.id" :label="item.team_name" :value="item.id" :disabled="item.id==form.away_team"></el-option>  
                                </el-select>
                            <!-- </el-form-item> -->
                        </span>
                        <span v-else>{{scope.row.home_team}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="away_team" :label="$t('game_info.away_team')" width="auto" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit">
                            <!-- <el-form-item prop="away_team"> -->
                                <el-select v-model="form.away_team" :placeholder="$t('game_info.away_team')" style="width:100%;" size="small" clearable filterable>
                                    <el-option v-for="item in teams" :key="item.id" :label="item.team_name" :value="item.id" :disabled="item.id==form.home_team"></el-option>  
                                </el-select>
                            <!-- </el-form-item> -->
                        </span>
                        <span v-else>{{scope.row.away_team}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="note" :label="$t('game_info.note')" width="300" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit">
                            <!-- <el-form-item prop="note"> -->
                                <el-input v-model="form.note" style="width:100%;" size="small" clearable maxlength="20" show-word-limit></el-input>
                            <!-- </el-form-item> -->
                        </span>
                        <span v-else>{{scope.row.note}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('btn.action')" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.edit" type="success" size="small" circle icon="el-icon-check" @click="handleCheck(scope.$index, scope.row)" style="padding:5px;"
                        :disabled="(!update_info_auth||scope.row.btn_disabled==1)&&(!is_admin)"></el-button>
                        <el-button v-else type="warning" size="mini" circle icon="el-icon-edit" @click="scope.row.edit=!scope.row.edit,handleEdit(scope.$index, scope.row)" style="padding:5px;"
                        :disabled="((!delete_info_auth||scope.row.btn_disabled==1)&&(!is_admin))||updateVisible"></el-button>
                        <el-button v-if="scope.row.edit==0" type="danger" size="mini" circle icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" style="padding:5px;"
                        :disabled="((!delete_info_auth||scope.row.btn_disabled==1)&&(!is_admin))||updateVisible"></el-button>
                        <el-button v-else type="info" size="mini" circle icon="el-icon-close" @click="scope.row.edit=!scope.row.edit,handleCancelEdit(scope.$index, scope.row)" style="padding:5px;"
                        :disabled="((!delete_info_auth||scope.row.btn_disabled==1)&&(!is_admin))||!updateVisible"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            </el-form>
            <div class="pagination">                      
                <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :disabled="updateVisible"
                :current-page="cur_page"
                :page-sizes="page_size_list" 
                :page-size="pagesize"         
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalRow">    
                </el-pagination>
            </div>
        </el-dialog>
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="delVisible" width="500px" center>
            <div class="del-dialog-cnt">
                <div><i class="el-icon-warning" style="color:#E6A23C;font-size:20px;"></i>&nbsp;&nbsp;{{$t('common_msg.ask_for_delete')}} ?</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible=false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="deleteRow">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { leagueService } from "@/_services";
export default {
    name:"league_teams_matches",
    components:{},
    props:{
        visible: Boolean,
        game_id: String,
        game_time: Array,
    },
    data(){
        return{
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            table_loading:false,
            match_list:[],
            totalRow:0,
            start_row:0,
            cur_page:1,
            pagesize:50,
            page_size_list:[50,100],
            delInfo:{},
            delVisible:false,
            createVisible:false,
            updateVisible:false,
            spanArr:[],
            pos:0,
            teams:[],
            dates:[],
            game_start_time:"",
            game_end_time:"",
            parse_game_start_time:null,
            date_game_start_time:"",
            time_game_start_time:"",
            parse_game_end_time:null,
            date_game_end_time:"",
            time_game_end_time:"",
            backup_row:{},
            filter:{
                game_date:"",
                start_time:"",
                end_time:"",
                team_name:"",
            },
            form:{
                id:null,
                game_id:this.game_id,
                round:null,
                home_team:"",
                away_team:"",
                game_date:"",
                start_time:"",
                end_time:"",
                note:"",
            },
            rules:{
                game_date:  [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                round:       [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}, {pattern: /^\d{1,2}$/, message: this.$i18n.t("rules.only_numbers"), trigger: "blur"}],
                start_time: [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                end_time:   [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                home_team:  [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                away_team:  [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
            }
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
    },
    watch:{
        
    },

    created(){
        this.getGameTime();
        this.getOption();
        this.getData(this.game_id);
    },

    methods:{
        tableRowClassName({row, rowIndex}){
            if(row.edit==true){
                return "edit-row"
            }else{
                return "'"
            }
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

        getSpanArr(data){
            this.resetSpanArr();
            for(var i=0;i<data.length;i++){
                if(i===0){
                    this.spanArr.push(1);
                    this.pos=0;
                }else{
                    if(data[i].game_date===data[i-1].game_date){
                        this.spanArr[this.pos]+=1;
                        this.spanArr.push(0);
                    }else{
                        this.spanArr.push(1);
                    this.pos = i;
                    }
                }
            }
        },

        resetSpanArr(){
            this.spanArr=[];
            this.pos=null;
        },

        dateCellMerge({row, column, rowIndex, columnIndex}){
            if(column.property==="game_date"){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return {
                    rowspan:_row,
                    colspan:_col
                }
            }
        },

        getParam(){
            var param = {
                'start_row':this.start_row,
                'page_size':this.pagesize,
                'game_date':this.filter.game_date,
                'start_time':this.filter.start_time,
                'end_time':this.filter.end_time,
                'team_name':this.filter.team_name
            }
            return param
        },
        
        getGameTime(){
            this.game_start_time = this.game_time[0];
            var dt = new Date(this.game_start_time)
            this.parse_game_start_time = Date.parse(dt.toString());
            this.date_game_start_time = this.game_start_time.substr(0,10);
            this.time_game_start_time = this.game_start_time.substr(11,5);

            this.game_end_time = this.game_time[1];
            var dt = new Date(this.game_end_time)
            this.parse_game_end_time = Date.parse(dt.toString());
            this.date_game_end_time = this.game_end_time.substr(0,10);
            this.time_game_end_time = this.game_end_time.substr(11,5);
        },

        getData(id){
            this.table_loading=true;
            leagueService.get_league_match_list(id, this.getParam())
            .then(res => { 
                this.match_list = res.match_list;
                this.totalRow = res.total;
                this.getSpanArr(this.match_list);
            })
            this.table_loading=false;
        },

        getOption(){
            leagueService.get_option_league_teams(this.game_id)
            .then(res=>{
                this.teams = res.option_teams;
                this.dates = res.game_date;
            })
        },

        handleCloseDialog(){
            this.cancelSearch();
            this.$emit('closeDialog', false);
        },

        handleUpload(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var action = (this.createVisible)?"create":"update";
                    leagueService.update_league_match_list(action, this.form)
                    .then(res=>{
                        if(res.code==1){
                            this.getData(this.game_id);
                            this.$message.success(this.$t("common_msg.save_ok"));
                            this.createVisible=false;
                            this.updateVisible=false;
                            this.resetForm();
                            if(action=="create"){this.getOption();}
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

        handleCheck(index, row){
            if(row.home_team==""||row.home_team==null){
                this.$message.warning(this.$i18n.t("game_info.home_team")+" "+this.$i18n.t("common_msg.must_fill"));
            }else if(row.away_team==""||row.away_team==null){
                this.$message.warning(this.$i18n.t("game_info.away_team")+" "+this.$i18n.t("common_msg.must_fill"));
            }else if(row.start_time==""||row.start_time==null){
                this.$message.warning(this.$i18n.t("game_info.start_time")+" "+this.$i18n.t("common_msg.must_fill"));
            }else if(row.end_time==""||row.end_time==null){
                this.$message.warning(this.$i18n.t("game_info.end_time")+" "+this.$i18n.t("common_msg.must_fill"));
            }else{
                this.handleUpload();
            }
        },

        handleEdit(index, row){
            this.updateVisible=true;
            this.backup_row = Object.assign({}, row);;
            this.form = row;
            for(var i=0;i<this.teams.length;i++){
                if(this.form.home_team===this.teams[i].team_name){
                    this.form.home_team=this.teams[i].id
                }
                if(this.form.away_team===this.teams[i].team_name){
                    this.form.away_team=this.teams[i].id
                }
            }
        },

        handleCancelEdit(index, row){
            this.updateVisible=false;
            this.match_list[index] = this.backup_row;
            this.match_list[index].edit = 0;
            this.resetForm();
        },

        handleCancelCreate(){
            this.resetForm();
            this.$refs.form.clearValidate()
            this.createVisible=false;
        },

        handleDelete(index, row){
            this.delInfo=row;
            this.delVisible=true;
        },

        deleteRow(){
            var param = {"id":this.delInfo.id,"game_id":this.delInfo.game_id,"round":this.delInfo.round}
            leagueService.delete_league_match_list(param)
            .then(res => {
                if(res.code==1){
                    this.handleDeleteChange();
                    this.getData(this.game_id);
                    this.getOption();
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

        resetForm(){
            this.backup_row = {};
            this.form = {
                id:null,
                game_id:this.game_id,
                round:null,
                home_team:"",
                away_team:"",
                game_date:"",
                start_time:"",
                end_time:"",
                note:""
            }
        },

        resetFilter(){
            this.filter = {
                game_date:"",
                start_time:"",
                end_time:"",
                team_name:"",
            }
        },

        handleCurrentChange(currentPage){
            this.cur_page=parseInt(currentPage);
            this.count_page;
            this.getData(this.game_id);
        },

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){
                this.start_row-=this.pagesize;
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
.match-table{
    width: 100%;
    font-size: 14px;
}
.match-table >>> .success-cell{
    background:#DBFFD8;
}
.temp{
    width: 100%;
}
.del-dialog-cnt{
    font-size: 16px;
    text-align: center;
}
.match-table >>> .edit-row{
    background:#FFF4D8;
}
.el-form >>> .el-table >>> .edit-row >>> .el-form-item.el-form-item--mini{
    margin-bottom:0px;
}
</style>
<style>
/* .el-form-item.el-form-item--mini{
    margin-bottom:0px;
} */
</style>