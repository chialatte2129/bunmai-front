<template>
    <div class="temp">
        <el-dialog :visible.sync="visible" :title="$t('menus.league_live_channel')" width="1600px" top="60px" :before-close="handleCloseDialog" :close-on-click-modal="false">
            <div class="handle-box">
                <span class="ml30"></span>
                <el-popover placement="right" width="1100" v-model="createVisible" v-if="update_info_auth">
                    <div style="padding:10px 20px;">
                        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width=auto>
                            <el-row style="margin:0 0 30px 5px;">
                                <p style="font-size:20px;"><b>{{$t('game_info.competition_time')}} : {{game_start_time}} ~ {{game_end_time}}</b></p>
                            </el-row>
                            <el-row>
                                <el-col :span="7">
                                    <el-form-item :label="$t('game_info.live_date')" prop="game_date">
                                        <el-select v-model="form.game_date" :placeholder="$t('game_info.game_date')" class="handle-input mr10" clearable filterable @change="filter.start_time='', handleTeamSelect()">
                                            <el-option v-for="item in dates" :key="item.game_date" :label="item.game_date" :value="item.game_date"></el-option>  
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item :label="$t('game_info.team_name')" prop="team_id">
                                        <el-select v-model="form.team_id" :placeholder="$t('game_info.team_name')" class="mr10" clearable filterable :disabled="form.game_date==''">
                                            <el-option v-for="item in teams" :key="item.id" :label="item.team_name" :value="item.team_id"></el-option>  
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="$t('game_info.start_time')" prop="start_time">
                                        <el-time-select v-model="form.start_time" :placeholder="$t('game_info.start_time')" clearable filterable class="handle-input-short mr10" :disabled="form.game_date==''"
                                        :picker-options="{ start:'00:00', step:'00:05', end:'23:55', maxTime:form.end_time}"></el-time-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item :label="$t('menus.league_live_channel')" prop="channels">
                                        <div v-for='(row,index) in form.channels'>
                                            <el-input v-model="row.value" :placeholder="$t('game_info.live_channel')" clearable style="width:90%;" class="mb10"></el-input>
                                            <el-button v-if="index!=0" type="danger" plain circle icon="el-icon-delete" @click="delChannelRow(index)" style="padding:5px;" class="ml10"></el-button>
                                        </div>
                                        <el-button :disabled="addRowDisabled()" type="success" plain size=mini class="el-icon-circle-plus-outline" v-if="form.channels.length<4"
                                        @click="addChannelRow"> {{$t('game_info.add_channels')}}</el-button>
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
                clearable filterable @change="filter.start_time='',search()" :disabled="updateVisible">
                    <el-option v-for="item in dates" :key="item.game_date" :label="item.game_date" :value="item.game_date"></el-option>  
                </el-select>
                <el-time-select v-model="filter.start_time" :placeholder="$t('game_info.start_time')" clearable filterable class="handle-input-short mr10" 
                :disabled="filter.game_date==''||updateVisible" @change="search"
                :picker-options="{ start:'00:00', step:'00:05', end:'23:55' }"></el-time-select>
                <el-button type="info" @click="cancelSearch" :disabled="updateVisible"> {{$t('btn.clean')}}</el-button>
                <el-button type="primary"size="medium" @click="goToMatch" style="float:right;" class="el-icon-back mr10" :disabled="updateVisible"> {{$t('menus.league_teams_matches')}}</el-button>
            </div>
            <el-table :data="channel_list" height="573" class="channel-table" ref="multipleTable" tooltip-effect="light" 
            :cell-class-name="cellClassName" :span-method="dateCellMerge" :row-class-name="tableRowClassName" v-loading="table_loading">
                <el-table-column prop="game_date" :label="$t('game_info.live_date')" width="140" align="center"></el-table-column>
                <el-table-column prop="team_name" :label="$t('game_info.team_name')" width="225" show-overflow-tooltip></el-table-column>
                <el-table-column prop="start_time" :label="$t('game_info.start_time')" width="145" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit">
                            <el-time-select v-model="form.start_time" :placeholder="$t('game_info.start_time')" clearable class="handle-input-short" size="small"
                            :picker-options="{ start:'00:00', step:'00:05', end:'23:55' }"></el-time-select>
                        </span>
                        <span v-else>{{scope.row.start_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="channels" :label="$t('game_info.live_channel')" width="auto">
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit">
                            <div v-for='(row,index) in form.channels'>
                                <el-input v-model="row.value" :placeholder="$t('game_info.live_channel')" clearable style="width:90%;margin:3px 0;"></el-input>
                                <el-button v-if="index!=0" type="danger" plain circle icon="el-icon-delete" @click="delChannelRow(index)" style="padding:5px;margin:3px 10px;"></el-button>
                            </div>
                            <el-button :disabled="addRowDisabled()" type="success" plain size=mini class="el-icon-circle-plus-outline" v-if="form.channels.length<4" style="margin:3px 0;"
                            @click="addChannelRow"> {{$t('game_info.add_channels')}}</el-button>
                        </span>
                        <span v-else>
                            <span v-for='(row,index) in scope.row.channels'>
                                <el-button size="mini" plain type="primary" @click="openTag(row)" style="padding:4px;margin:2px 5px 2px 0;">{{row}}</el-button>
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="channel_id" :label="$t('game_info.ID')" width="65" align="center"></el-table-column>
                <el-table-column :label="$t('btn.action')" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.edit" type="primary" size="small" circle icon="el-icon-check" @click="handleCheck(scope.$index, scope.row)" style="padding:5px;"
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
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="updateVisible" :current-page="cur_page" :page-sizes="page_size_list" :page-size="pagesize" :total="totalRow">    
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
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="tagVisible" width="500px" center>
            <div class="del-dialog-cnt">
                <div class="mb10"><i class="el-icon-warning" style="color:#E6A23C;font-size:20px;"></i>&nbsp;&nbsp;{{$t('common_msg.go_to_foreign_url')}} : </div>
                <div>{{tagURL}}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tagVisible=false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="tagDirect">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { leagueService } from "@/_services";
export default {
    name:"league_live_channel",
    components:{},
    props:{
        visible: Boolean,
        game_id: String,
        game_time : Array,
    },
    data(){
        return{
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            table_loading:false,
            totalRow:0,
            start_row:0,
            cur_page:1,
            pagesize:50,
            page_size_list:[50,100],
            delInfo:{},
            delVisible:false,
            createVisible:false,
            updateVisible:false,
            tagVisible:false,
            tagURL:"",
            spanArr:[],
            pos:0,
            channel_list:[],
            teams:[],
            dates:[],
            game_start_time:"",
            game_end_time:"",
            parse_game_start_time:"",
            parse_game_end_time:"",
            backup_row:{},
            backup_form:{},
            filter:{
                game_date:"",
                start_time:"",
                team_name:"",
            },
            form:{
                id:null,
                game_id:this.game_id,
                game_date:"",
                team_id:"",
                start_time:"",
                channels:[{"value":""}],
            },
            rules:{
                game_date:  [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                start_time: [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                team_id:    [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
                channels:   [{required: true, message: this.$i18n.t("common_msg.must_fill"), trigger: "blur"}],
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
        goToMatch(){
            this.$emit('goToMatch', true);
        },

        tagDirect(){
            window.open(this.tagURL);
            this.tagVisible=false,
            this.tagURL="";
        },

        openTag(tag){
            this.tagVisible=true;
            this.tagURL=tag;
        },

        addRowDisabled(){
            if(this.form.channels.length>=4){ return true }
            if(this.form.channels[this.form.channels.length-1].value==""){ return true }
            return false
        },
        
        delChannelRow(index){
            this.form.channels.splice(index, 1);
        },

        addChannelRow(){
            this.form.channels.push({"value":""},);
        },

        checkFormChannels(){
            if((this.form.channels[this.form.channels.length-1].value=="")){
                this.$message.warning(this.$i18n.t("game_info.live_channel")+" "+this.$i18n.t("common_msg.must_fill"));
                return false
            }
            return true
        },

        handleTeamSelect(){
            if(this.form.game_date!=""){
                for(var i=0;i<this.dates.length;i++){
                    if(this.form.game_date==this.dates[i].game_date){ this.teams = this.dates[i].date_teams; }
                }
            }
        },

        tableRowClassName({row, rowIndex}){
            if(row.edit==true){
                return "edit-row"
            }else{
                return ""
            }
        },

        cellClassName({row, column, rowIndex, columnIndex}){
            if(row.team_name==this.filter.team_name&&column.property=='team_name'&&row.team_name!=""&&row.team_name!=null){
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
                'team_name':this.filter.team_name
            }
            return param
        },
        
        getData(id){
            this.table_loading=true;
            leagueService.get_league_channel_list(id, this.getParam())
            .then(res => { 
                this.channel_list = res.channel_list;
                this.totalRow = res.total;
                this.getSpanArr(this.channel_list);
            })
            this.table_loading=false;
        },

        getOption(){
            leagueService.get_option_matches(this.game_id)
            .then(res=>{
                this.dates = res.option_teams;
            })
        },

        getGameTime(){
            this.game_start_time = this.game_time[0];
            var dt = new Date(this.game_start_time)
            this.parse_game_start_time = Date.parse(dt.toString());

            this.game_end_time = this.game_time[1];
            var dt = new Date(this.game_end_time)
            this.parse_game_end_time = Date.parse(dt.toString());
        },

        handleCloseDialog(){
            this.$emit('closeDialog', false);
        },

        handleUpload(){
            this.$refs.form.validate(valid => {
                if(valid&&this.checkFormChannels()){
                    var action = (this.createVisible)?"create":"update";
                    var channels = [];
                    for(var i=0;i<this.form.channels.length;i++){
                        if(this.form.channels[i].value!=""||this.form.channels[i].value!=null){ channels.push(this.form.channels[i].value) }
                    }
                    this.form.channels = channels;
                    leagueService.update_league_channel_list(action, this.form)
                    .then(res=>{
                        if(res.code==1){
                            this.getData(this.game_id);
                            this.$message.success(this.$t("common_msg.save_ok"));
                            this.createVisible=false;
                            this.updateVisible=false;
                            this.resetForm();
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
            if(row.start_time==""||row.start_time==null){
                this.$message.warning(this.$i18n.t("game_info.start_time")+" "+this.$i18n.t("common_msg.must_fill"));
            }else if(row.channels[row.channels.length-1].value==""){
                this.$message.warning(this.$i18n.t("game_info.live_channel")+" "+this.$i18n.t("common_msg.must_fill"));
            }else{
                this.handleUpload();
            }
        },

        handleEdit(index, row){
            this.updateVisible=true;
            this.backup_row = Object.assign({}, row);
            this.form = row;
            var channels = [];
            for(var i=0;i<this.form.channels.length;i++){
                channels.push({"value":this.form.channels[i]});
            }
            this.form.channels = channels;
            this.form.team_name += " ";
            this.backup_form = Object.assign({}, this.form);
        },

        handleCancelEdit(index, row){
            this.updateVisible=false;
            this.channel_list[index] = this.backup_row;
            this.channel_list[index].edit = 0;
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
            var param = {"id":this.delInfo.id,"game_id":this.delInfo.game_id,"game_date":this.delInfo.game_date}
            leagueService.delete_league_channel_list(param)
            .then(res => {
                if(res.code==1){
                    this.handleDeleteChange();
                    this.getData(this.game_id);
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
            this.backup_form = {};
            this.form = {
                id:null,
                game_id:this.game_id,
                game_date:"",
                team_id:"",
                start_time:"",
                channels:[{"value":""}],
            }
        },

        resetFilter(){
            this.filter = {
                game_date:"",
                start_time:"",
                team_name:""
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
.ml10{
    margin-left:10px;
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
.temp{
    width: 100%;
}
.del-dialog-cnt{
    font-size: 16px;
    text-align: center;
}
.channel-table{
    width: 100%;
    font-size: 14px;
}
.channel-table >>> .edit-row{
    background:#FFF4D8;
}
.channel-table >>> .success-cell{
    background:#DBFFD8;
}
</style>
<style>
</style>