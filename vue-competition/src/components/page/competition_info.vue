<template>
    <div class="temp">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-info"></i>
                    <span v-if="$route.query.ctype=='league'"> {{$t('menus.competition_league_info')}}</span>
                    <span v-else> {{$t('menus.competition_advance_info')}}</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.overview')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="success" class="el-icon-circle-plus-outline mr10" @click="handleCreate" v-if="update_info_auth"> {{$t('btn.new')}}</el-button>
                <el-select v-model="filter.country" :placeholder="$t('game_info.filter_country')" clearable filterable multiple collapse-tags 
                :disabled="filter.city.length>0" @visible-change="handleCountryVisibleChange" class="handle-select-match mr10">
                    <el-option v-for="item in options.country" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                </el-select>
                <el-select v-model="filter.city" :placeholder="$t('game_info.filter_city')" clearable filterable multiple collapse-tags 
                :disabled="filter.country.length==0" @visible-change="handleCityVisibleChange" class="handle-select-match mr10">
                    <el-option-group v-for="group in options.city" :key="options.value" :label="show_label(group)">
                        <el-option v-for="item in group.options" :key="item.value" :label="show_label(item)" :value="item.value" :disabled="item.value==''"></el-option>
                    </el-option-group>
                </el-select>
                <el-select v-model="filter.publish" :placeholder="$t('game_info.publish_status')" clearable filterable @change="search" class="handle-select-basic mr10">
                    <el-option v-for="item in options.publish" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
                </el-select>
                <el-select v-model="filter.esports" :placeholder="$t('game_info.filter_game')" clearable filterable @change="search" class="handle-select-basic mr10">
                    <el-option v-for="item in options.esports" :key="item.value" :label="show_label(item)" :value="item.value"></el-option>  
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
                <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
                <el-table-column prop="name" label="name" sortable="custom"></el-table-column>
                <el-table-column prop="location" label="location" sortable="custom"></el-table-column>
                <el-table-column prop="city" label="city" sortable="custom"></el-table-column>
                <el-table-column prop="game" label="game" sortable="custom"></el-table-column>
                <el-table-column prop="status" label="status" width="110" sortable="custom" align="center">
                    <template slot-scope="scope" style="text-align:center;">
                        <el-button size="mini" plain v-if="scope.row.status=='D'" type="info" @click="" :disabled="!update_info_auth">{{$t('common_msg.draft')}}</el-button>
                        <el-button size="mini" plain v-else-if="scope.row.status=='P'" type="success" @click="" :disabled="!update_info_auth">{{$t('common_msg.publish')}}</el-button>
                        <el-button size="mini" plain v-else :disabled="true">{{$t('common_msg.abandon')}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('btn.action')" width="190" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" :disabled="!view_info_auth">{{$t('btn.edit')}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" :disabled="!delete_info_auth">{{$t('btn.delete')}}</el-button>
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
            <div class="del-dialog-cnt">{{$t('common_msg.ask_for_delete')}} ?</div>
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
            tableData:[
                {
                    "id":"TWN-20200220-Taipei-001",
                    "name":"槍王",
                    "location":"台灣",
                    "city":"台北",
                    "game":"OverKill",
                    "status":"P",
                    
                }
            ],
            start_row:0,
            cur_page:1,
            pagesize:10,
            page_size_list:[10,20],
            totalRow:0,
            delID:null,
            delVisible:false,
            publish_status:"D",
            table_loading:false,
            ctype:"",
            options:{
                country:[],
                city:[],
                backup_city:[],
                esports:[],
                scheduled_step:[],
                match:[],
                publish:[],
            },
            filter:{
                country:[],
                city:[],
                schedule:"",
                esports:"",
                match:"",
                name:"",
                publish:"",
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
                this.redirectCheck();
            },
        }
    },
    created(){
        this.getOption();
        this.getData();
    },
    methods:{
        redirect(){
            var menus = localStorage.getItem("ms_user_menus")
            var path_to = menus.substring(0, menus.search(","))
            if(this.$route.query.ctype=="undefined"||this.$route.query.ctype==undefined){
                if(path_to=="competition_league_info"){
                    this.$route.query.ctype="league";
                }else if(path_to=="competition_advance_info"){
                    this.$route.query.ctype="advance";
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

        getData(){
            this.table_loading=true;
            this.ctype = this.$route.query.ctype;
            this.$router.replace({path:`/competition_info?ctype=${this.ctype}`,query:{page:this.cur_page,row:this.start_row}}).catch(err => {});
            this.table_loading=false;
        },

        getOption(){
            var option_keys = ["country", "city", "esports", "scheduled_step", "match", "publish_status"]
            infoService.get_info_option(option_keys)
            .then(res=>{
                if(res.code==1){
                    this.options.esports = res.options.esports;
                    this.options.scheduled_step = res.options.scheduled_step;
                    this.options.match = res.options.match;
                    this.options.publish = res.options.publish_status;
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
            this.$router.push({path:`/competition_info_edit?ctype=${this.ctype}`, query:{type:"create"}});
        },

        pushEdit(row){
            var query = {
                "type":"update",
                "game_id":row.id,
                "position":{
                    "page":this.cur_page,
                    "row":this.start_row,
                    "col":this.sort_column,
                    "order":this.sort,
                    "filter":{
                        "name":this.filter.name,
                        "match":this.filter.match,
                        "esports":this.filter.esports,
                        "schedule":this.filter.schedule,
                        "city":this.filter.city,
                        "country":this.filter.country
                    }
                }
            }
            return query
        },

        handleEdit(index, row) {
            this.$router.push({path:`/competition_info_edit?ctype=${this.ctype}`, query:this.pushEdit(row)});
        },

        handleDelete(index, row){
            this.delID=row.id;
            this.delVisible=true;
        },

        deleteRow(){

        },

        search(){
            console.log("search ", this.filter);
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
                esports:"",
                match:"",
                name:"",
                publish:"",
            };
        },

        tableRowClassName({row, rowIndex}){
            // show this competition status, ex:
            // before register
            // between register period
            // between after register and before start competition
            // between competition period
            // after competition
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
            this.getData()
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
    text-align: center
}
.handle-input{
    width: 200px;
    display: inline-block;
}
.handle-select-match{
    width: 145px;
}
.handle-select-basic{
    width:130px;
}
.handle-select-schedule{
    width: 200px;
}
</style>  
<style> 
.el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
</style> 