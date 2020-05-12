<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-warning-outline"></i>
                    <span v-if="$route.query.ctype=='league'"> {{$t('menus.competition_league_info')}}</span>
                    <span v-else> {{$t('menus.competition_advance_info')}}</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.overview')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="success" class="el-icon-circle-plus-outline mr10" @click="handleCreate" v-if="update_info_auth"> {{$t('btn.new')}}</el-button>
                <el-select v-model="filter.country" :placeholder="$t('game_info.filter_country')" clearable filterable multiple collapse-tags @clear="search" @remove-tag="search"
                :disabled="filter.city.length>0" @visible-change="handleCountryVisibleChange" class="handle-select-match mr10">
                    <el-option v-for="item in options.country" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                </el-select>
                <el-select v-model="filter.city" :placeholder="$t('game_info.filter_city')" clearable filterable multiple collapse-tags @clear="search" @remove-tag="search"
                :disabled="filter.country.length==0" @visible-change="handleCityVisibleChange" class="handle-select-match mr10">
                    <el-option-group v-for="group in options.city" :key="options.value" :label="show_label(group)">
                        <el-option v-for="item in group.options" :key="item.value" :label="show_label(item)" :value="item.value" :disabled="item.value==''"></el-option>
                    </el-option-group>
                </el-select>
                <el-select v-model="filter.game" :placeholder="$t('game_info.filter_game')" clearable filterable @change="search" class="handle-select-basic mr10">
                    <el-option v-for="item in options.game" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                </el-select>
                <el-select v-model="filter.match" :placeholder="$t('game_info.filter_match')" clearable filterable @change="search" class="handle-select-match mr10">
                    <el-option v-for="item in options.match" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                </el-select>
                <el-select v-model="filter.schedule" :placeholder="$t('game_info.filter_schedule')" clearable filterable @change="search" class="handle-select-schedule mr10">
                    <el-option v-for="item in options.scheduled_step" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                </el-select>
                <el-input v-model="filter.name" :placeholder="$t('game_info.filter_name')" @change="search" class="handle-input mr10"></el-input>
                <el-button type="info" @click="cancelSearch"> {{$t('btn.clean')}}</el-button>
            </div>
            <el-table
            :data="tableData"
            border class="table" 
            ref="multipleTable"
            tooltip-effect="light" 
            v-loading="table_loading"
            @sort-change="handleSortChange"
            :row-class-name="tableRowClassName">
                <el-table-column prop="game_id" :label="$t('game_info.game_id')" width="230" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" :label="$t('game_info.name')"  width="auto" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="location" :label="$t('game_info.country')" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="city" :label="$t('game_info.city')" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="game" :label="$t('game_info.game')" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="register_time" :label="$t('game_info.register_time')" width="300" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="game_time" :label="$t('game_info.competition_time')" width="300" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('btn.action')" width="205" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" circle icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" :disabled="!view_info_auth"></el-button>
                        <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" :disabled="(!delete_info_auth||scope.row.del_disabled==1)&&(!is_admin)"></el-button>
                        <el-tooltip class="item" effect="light" :content="$t('game_info.foreign.match_map')" placement="top">
                            <el-button type="info" size="mini" circle plain icon="el-icon-c-scale-to-original" @click="publicPush('league_matches', scope.row.game_id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" :content="$t('game_info.foreign.live_channel')" placement="top">
                            <el-button type="info" size="mini" circle plain icon="el-icon-video-play" @click="publicPush('league_live_channels', scope.row.game_id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" :content="$t('game_info.foreign.standing')" placement="top">
                            <el-button type="info" size="mini" circle plain icon="el-icon-s-operation" @click="publicPush('league_standings', scope.row.game_id)"></el-button>
                        </el-tooltip>
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
                <div><i class="el-icon-warning" style="color:#E6A23C;font-size:20px;"></i>&nbsp;&nbsp;{{$t('common_msg.delete_game_tips')}}</div>
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
    name:"competition_information_table",
    components:{

    },
    data(){
        return{
            tableData:[],
            start_row:0,
            cur_page:1,
            pagesize:10,
            sort_column:"",
            sort:"",
            page_size_list:[10,20],
            totalRow:0,
            delID:null,
            delVisible:false,
            table_loading:false,
            public_host:process.env.VUE_APP_HOST+"public/",
            game_type:"",
            options:{
                country:[],
                city:[],
                backup_city:[],
                game:[],
                scheduled_step:[],
                match:[],
            },
            is_admin:localStorage.getItem("ms_is_admin")=='true'?true:false,
            filter:{
                country:[],
                city:[],
                schedule:"",
                game:"",
                match:"",
                name:"",
            }
        }
    },
    computed:{
        count_page(){
            this.start_row=(this.cur_page-1)*this.pagesize
        },

        view_info_auth(){
            return localStorage.getItem("ms_user_actions").includes(`view_${this.$route.query.ctype}_competition`)
        },

        update_info_auth(){
            return localStorage.getItem("ms_user_actions").includes(`update_${this.$route.query.ctype}_competition`)
        },

        delete_info_auth(){
            return localStorage.getItem("ms_user_actions").includes(`delete_${this.$route.query.ctype}_competition`)
        },
    },
    watch:{
        '$route.query.ctype':{
            handler(newval, oldval){
                this.redirect();
                this.getData();
                // this.redirectCheck();
            },
        }
    },
    created(){
        this.getOption();
        this.getData();
    },
    methods:{
        publicPush(page, game_id){
            let to_where = this.public_host+page+"/"+game_id+"/"+localStorage.getItem("ms_user_lang");
            window.open(to_where, '_blank');
        },

        redirect(){
            var menus = localStorage.getItem("ms_user_menus")
            var path_to = menus.substring(0, menus.search(","))
            if(this.$route.query.ctype=="undefined"||this.$route.query.ctype==undefined){
                if(path_to=="competition_league_info"){
                    this.$router.replace({path:`/competition_info?ctype=league`,query:{page:this.cur_page,row:this.start_row}}).catch(err => {});
                }else if(path_to=="competition_advance_info"){
                    this.$router.replace({path:`/competition_info?ctype=advance`,query:{page:this.cur_page,row:this.start_row}}).catch(err => {});
                }else{
                    this.$router.push({path:"login"});
                }
            }
        },

        redirectCheck(){
            if(this.$route.query.ctype!="league"||this.$route.query.ctype!="advance"){
                this.$router.push({path:"login"});
            }
        },

        handleCountryVisibleChange(callback){
            if(!callback&&this.filter.country.length>0){
                this.changeCitySelection();
                this.search();
            }
        },

        handleCityVisibleChange(callback){
            if(!callback&&this.filter.city.length>0){
                this.search();
            }
        },

        getParam(){
            this.cur_page=('position' in this.$route.query&&typeof this.$route.query.position==='object')?parseInt(this.$route.query.position.page):this.cur_page;
            this.totalRow=('position' in this.$route.query&&typeof this.$route.query.position==='object')?parseInt(this.$route.query.position.total):this.totalRow;
            this.sort_column=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.col:this.sort_column;
            this.sort=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.order:this.sort;
            this.start_row=('position' in this.$route.query&&typeof this.$route.query.position==='object')?(
                (this.$route.query.position.row==(this.totalRow-1)&&this.$route.query.position.row!=0)?this.$route.query.position.row-this.pagesize:this.$route.query.position.row):this.start_row;
            this.filter.match=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.filter.match:this.filter.match;
            this.filter.schedule=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.filter.schedule:this.filter.schedule;
            this.filter.name=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.filter.name:this.filter.name;
            this.filter.game=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.filter.game:this.filter.game;
            this.filter.country=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.filter.country:this.filter.country;
            this.filter.city=('position' in this.$route.query&&typeof this.$route.query.position==='object')?this.$route.query.position.filter.city:this.filter.city;
            var param = {
                'sort_column':this.sort_column,
                'sort':this.sort,
                'start_row':this.start_row,
                'page_size':this.pagesize,
                'match':this.filter.match,
                'schedule':this.filter.schedule,
                'name':this.filter.name,
                'game':this.filter.game,
                'country':this.filter.country,
                'city':this.filter.city,
                'game_type':this.$route.query.ctype
            }
            return param
        },

        getData(){
            this.table_loading=true;
            this.game_type = this.$route.query.ctype;
            infoService.get_competition_info_table(this.getParam())
            .then(res => {
                this.tableData = res.tableData;
                this.totalRow = res.total;
                this.$router.replace({path:`/competition_info?ctype=${this.game_type}`,query:{page:this.cur_page,row:this.start_row}}).catch(err => {});
            })
            this.table_loading=false;
        },

        getOption(){
            var option_keys = ["country", "city", "esports", "scheduled_step", "match"]
            infoService.get_info_option(option_keys)
            .then(res=>{
                if(res.code==1){
                    this.options.game = res.options.esports;
                    this.options.scheduled_step = res.options.scheduled_step;
                    this.options.match = res.options.match;
                    // this.options.publish = res.options.publish_status;
                    this.options.country = res.options.country;
                    this.options.city = res.options.city;
                    for(var i=0;i<this.options.country.length;i++){
                        this.options.country[i]["options"]=[];
                        for(var j=0;j<this.options.city.length;j++){
                            if(this.options.city[j].country==this.options.country[i].value){
                                this.options.country[i]["options"].push(this.options.city[j])
                            }
                        }
                        if(this.options.country[i]["options"].length==0){
                            this.options.country[i]["options"].push({"label":this.$i18n.t('common_msg.no_data'),"value":"","country":""})
                        }
                    }
                    this.options.city = this.options.country;
                    this.options.backup_city = this.options.city;
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

        handleCreate(){
            this.$router.push({path:`/competition_info_edit?ctype=${this.game_type}`, query:{type:"create"}});
        },

        pushEdit(row){
            var query = {
                "type":"update",
                "game_id":row.game_id,
                "position":{
                    "page":this.cur_page,
                    "row":this.start_row,
                    "col":this.sort_column,
                    "order":this.sort,
                    "total":this.totalRow,
                    "filter":{
                        "name":this.filter.name,
                        "match":this.filter.match,
                        "game":this.filter.game,
                        "schedule":this.filter.schedule,
                        "city":this.filter.city,
                        "country":this.filter.country
                    }
                }
            }
            return query
        },

        handleEdit(index, row){
            this.$router.push({path:`/competition_info_edit?ctype=${this.game_type}`, query:this.pushEdit(row)});
        },

        handleDelete(index, row){
            this.delID=row.game_id;
            this.delVisible=true;
        },

        deleteRow(){
            var param = {"game_id":this.delID,"game_type":this.game_type}
            infoService.delete_competition_info(param)
            .then(res => {
                if(res.code==1){
                    this.handleDeleteChange();
                    this.getData();
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
            this.handleCurrentChange(1);
        },

        cancelSearch(){
            this.resetFilter();
            this.handleCurrentChange(1);
        },

        resetFilter(){
            this.filter = {
                country:[],
                city:[],
                schedule:"",
                game:"",
                match:"",
                name:"",
                publish:"",
            };
        },

        tableRowClassName({row, rowIndex}){
            if(row.schedule=='a_r'){
                return 'info-row';
            }else if(row.schedule=='b_c'){
                return 'warning-row';
            }else if(row.schedule=='a_c'){
                return 'primary-row';
            }else if(row.schedule=='f_c'){
                return 'success-row';
            }
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

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){
                this.start_row-=this.pagesize
            }
        },

        handleSizeChange(size){
            this.pagesize = size;
            this.handleCurrentChange(1);
        },

        changeCitySelection(){
            this.options.city=this.options.backup_city;
            if(this.filter.country.length!=0){
                var tempCity=[];
                tempCity = this.options.city.filter(el=>{
                    if(this.filter.country.includes(el.value)){
                        tempCity.push(el)
                    }
                    this.options.city=tempCity;
                })
            }else{
                this.options.city=this.options.backup_city;
            }
        },

        show_label(item){
            return localStorage.getItem("ms_user_lang")=='zh_TW'?item.label:(item.label_i18n==undefined?item.label:item.label_i18n);
        },
    }
}
</script>
<style scoped>
.mb10{
    margin-bottom:10px;
}
.mt10{
    margin-top:10px;
}
.mr10{
    margin-right:10px;
}
.handle-box{
    margin-bottom: 20px;
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
.handle-input{
    width: 200px;
    display: inline-block;
}
.handle-select-match{
    width: 180px;
}
.handle-select-basic{
    width:130px;
}
.handle-select-schedule{
    width: 200px;
}
.table >>> .info-row{
    background:#DCDCDC;
}
.table >>> .warning-row{
    background:#FFF4D8;
}
.table >>> .primary-row{
    background:#D8F5FF;
}
.table >>> .success-row{
    background:#DBFFD8;
}
</style>  
<style> 
.el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
</style> 