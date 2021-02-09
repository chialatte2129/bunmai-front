<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.view_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.view_work_hours')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeTabs" type="border-card" @tab-click="handleTabClick">
                <el-tab-pane :label="$t('menus.view_work_hours')" name="view_work_hours" :disabled="table_loading" :key="tabKey">
                    <div v-if="activeTabs=='view_work_hours'">
                    <div class="mgb10">
                        <el-input v-model="filter.dept_name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('employee.dept')" 
                        :disabled="table_loading" @change="search"/>
                        <el-input v-model="filter.p_name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('employee.name')" 
                        :disabled="table_loading" @change="search"/>
                        <el-date-picker v-model="filter.work_date" class="mgr10" type="daterange" align="right" value-format="yyyy-MM-dd" size="large" unlink-panels
                        :disabled="table_loading" :picker-options="pickerOptions" :clearable="false" @change="search" 
                        :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                        <el-button size=large type=info class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
                        <el-button size=large type=warning style="float:right;" plain @click="openBlackList" :disabled="table_loading"
                        v-if="black_list_action" v-html="$t('actions.workhour_view_black_list')"/>
                    </div>
                    <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" height="625" v-loading="table_loading" 
                    :span-method="dateCellMerge" :cell-style="getCellStyle" :header-cell-style="getHeaderCellStyle" :key="tbKey">
                        <el-table-column v-if="tableData" prop="dept_name" :label="$t('employee.dept')" width="125" fixed="left" show-overflow-tooltip/>
                        <el-table-column v-if="tableData" prop="p_name" :label="$t('employee.name')" width="85" fixed="left" show-overflow-tooltip/>
                        <el-table-column v-if="tableData" :label="row.label" v-for="row in logCols">
                            <el-table-column :label="$t(`employee.dayofweek.${weekday_dict[row.prop]}`)" :key="row.prop" :prop="row.prop" width="100" headerAlign="center" align="right"/>
                        </el-table-column>
                    </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('menus.issue_work_hours')" name="issue_work_hours" :disabled="table_loading" :key="tabKey+1000">
                    <div v-if="activeTabs=='issue_work_hours'">
                    <div>
                        <span style="float:left;" class="mgb10">
                            <el-input v-model="filter.dept_name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('employee.dept')" 
                            :disabled="table_loading" @change="search"/>
                            <el-input v-model="filter.p_name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('employee.name')" 
                            :disabled="table_loading" @change="search"/>
                            <el-date-picker v-model="filter.work_date" class="mgr10" type="daterange" align="right" value-format="yyyy-MM-dd" size="large" unlink-panels
                            :disabled="table_loading" :picker-options="pickerOptions" :clearable="false" @change="search" 
                            :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                            <el-button size=large type=info class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
                        </span>
                        <span class="mgb10" style="color:red;width:400px;float:left;">{{$t("employee.issue_work_hours_tip")}}</span>
                    </div>
                    <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" height="625" v-loading="table_loading" 
                    :span-method="dateCellMerge" :cell-style="getCellStyle" :key="tbKey">
                        <el-table-column v-if="tableData" prop="dept_name" :label="$t('employee.dept')" width="125" fixed="left" show-overflow-tooltip/>
                        <el-table-column v-if="tableData" prop="p_name" :label="$t('employee.name')" width="85" fixed="left" show-overflow-tooltip/>
                        <el-table-column v-if="tableData" prop="total" :label="$t('employee.total_hour')" width="80" headerAlign="left" align="right" fixed="left" show-overflow-tooltip/>
                        <el-table-column v-if="tableData" prop="under_8" :label="$t('employee.under_8')" width="105" headerAlign="left" align="right" fixed="left" show-overflow-tooltip/>
                        <el-table-column v-if="tableData" :label="row.label" v-for="row in logCols">
                            <el-table-column :label="$t(`employee.dayofweek.${weekday_dict[row.prop]}`)" :key="row.prop" :prop="row.prop" width="100" headerAlign="center" align="right"/>
                        </el-table-column>
                    </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog :title="$t('actions.workhour_view_black_list')" :visible.sync="blacklistView" :key="dlKey"
            :before-close="closeBlackList" :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true">
            <div v-loading.lock="dl_loading">
                <el-select size=large class="handle-select" v-model="black_list" filterable multiple :placeholder="$t('employee.name')">
                    <el-option-group v-for="group in dept_tree" :key="group.id" :label="group.complete_name">
                        <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
                            <span class="mgl10">{{item.name}}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { reportService } from "@/_services";
export default {
    name: "view_work_hours",
    data(){
        return {
            tbKey:0,
            dlKey:0,
            tabKey:0,
            table_loading:false,
            dl_loading:false,
            logCols:[],
            tableData:[],
            totalRow:0,
            weekday_dict:{},
            spanArr:[],
            pos:0,
            sort_column:"dept_name",
            sort:"desc",
            blacklistView:false,
            black_list:[],
            bk_black_list:[],
            dept_tree:[],
            black_list_action:localStorage.getItem("ms_user_actions").includes("workhour_view_black_list"),
            activeTabs:("tabs" in this.$route.query)?this.$route.query.tabs:"view_work_hours",
            filter:{
                p_name:"",
                dept_name:"",
                work_date:[
                    new Date(new Date().getTime()-3600*1000*24*7).getFullYear()+'-'
                    +String(new Date(new Date().getTime()-3600*1000*24*7).getMonth()+1).padStart(2, "0")+'-'
                    +String(new Date(new Date().getTime()-3600*1000*24*7).getDate()).padStart(2, "0"),
                    new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2, "0")+'-'+String(new Date().getDate()).padStart(2, "0")
                ],
            },
            day_mileseconds:86400000,
            pickerOptions:{
                disabledDate(time){
                    return time.getTime() > Date.now()+86400000*31;
                },
                shortcuts:[
                    {
                        text: this.$t('employee.yesterday'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('employee.week'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('employee.two_week'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('employee.month'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
        }
    },

    async created(){
        this.$router.replace({ path:"view_work_hours", query:this.getQuery() }).catch(err => {});
        this.get_dept_tree();
        await this.getData();
    },

    watch:{
        
    },

    computed:{
        
    },    
    
    methods:{
        getQuery(){
            var query = Object.assign({}, this.$route.query);
            query.tabs = this.activeTabs;
            return query
        },

        handleTabClick(tab, event){
            this.activeTabs=tab.name;
            this.tableData=[];
            this.tabKey++;
            this.tbKey++;
            this.cancelSearch();
            this.$router.replace({ path:"view_work_hours", query:this.getQuery() }).catch(err => {});
        },

        async get_dept_tree(){
            await reportService.handle_work_hour_blacklist({action:"getDeptTree"}).then(res =>{ 
                if(res.code==1){
                    this.dept_tree=res.dept_list;
                    this.dept_tree.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
                }else{
                    this.$message.error(this.$t(res.msg));
                };
            });
        },

        async openBlackList(){
            this.dl_loading=true;
            await reportService.handle_work_hour_blacklist({action:"getData"}).then(res =>{ 
                if(res.code==1){
                    this.black_list=res.black_list;
                    this.bk_black_list=res.black_list;
                    this.blacklistView=true;
                }else{
                    this.$message.error(this.$t(res.msg));
                };
            });
            this.dl_loading=false;
        },

        async closeBlackList(){
            if(this.black_list.sort()!=this.bk_black_list.sort()){
                await reportService.handle_work_hour_blacklist({action:"saveData", black_list:this.black_list}).then(res =>{});
                await this.getData();
            };
            this.dlKey++;
            this.blacklistView=false;
            this.black_list=[];
            this.bk_black_list=[];
        },

        getHeaderCellStyle({row, column}){
            var return_dict = {};
            if([6, 7].includes(this.weekday_dict[column.property])){
                return_dict["color"]="#FF4F4F";
            };
            return return_dict;
        },

        getCellStyle({row, column}){
            const tempWidth=column.realWidth||column.width;
            var return_dict = {};
            return_dict["minWidth"]=`${tempWidth-2}px`;
            return_dict["maxWidth"]=`${tempWidth-2}px`;
            return_dict["padding"]="4px";
            return_dict["height"]="20px";
            return_dict["fontSize"]="14px";
            if(!["dept_name",  "dept_name","p_name", "pid", "under_8", "total"].includes(column.property)){
                if(row[column.property]>=8){
                    return_dict["background"]="#c2e7b0";
                }else if(row[column.property]==0){
                    return_dict["background"]="white";
                }else{
                    return_dict["background"]="#fbc4c4";
                };
            };
            if(column.property=="under_8"){
                return_dict["color"]="red";
            }
            return return_dict;
        },

        getSpanArr(data){
            this.resetSpanArr();
            if(data){
                for(var i=0;i<data.length;i++){
                    if(i===0){ 
                        this.spanArr.push(1);
                        this.pos=0;
                    }else{
                        if(data[i].dept_name===data[i-1].dept_name){
                            this.spanArr[this.pos]+=1;
                            this.spanArr.push(0);
                        }else{ 
                            this.spanArr.push(1); 
                            this.pos=i;
                        }
                    }
                }
            }
        },

        resetSpanArr(){
            this.spanArr=[];
            this.pos=null;
        },

        dateCellMerge({row, column, rowIndex, columnIndex}){
            if(["dept_name"].includes(column.property)){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
        },
        
        async getData(){
            this.table_loading=true;
            var param = {
                action:(this.activeTabs=="view_work_hours")?"table":"issue",
                filter:this.filter
            }
            await reportService.get_daily_workhour(param).then(res =>{ 
                this.weekday_dict=res.weekday_dict;
                this.logCols=res.log_cols;
                this.tableData=res.logs;
                this.tableData.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
                this.getSpanArr(this.tableData);
                this.totalRow=res.total;
                this.tbKey++;
            })
            this.table_loading=false;
        },

        async search(){
            await this.getData();
        },
        
        async cancelSearch(){
            this.filter={
                p_name:"",
                dept_name:"",
                work_date:[
                    new Date(new Date().getTime()-3600*1000*24*7).getFullYear()+'-'
                    +String(new Date(new Date().getTime()-3600*1000*24*7).getMonth()+1).padStart(2, "0")+'-'
                    +String(new Date(new Date().getTime()-3600*1000*24*7).getDate()).padStart(2, "0"),
                    new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2, "0")+'-'+String(new Date().getDate()).padStart(2, "0")
                ],
            };
            this.sort_column="work_date";
            this.sort="desc";
            await this.getData();
        },
    }
}
</script>
<style scoped>
    .handle-input{
        width:200px;
        display:inline-block;
    }
    .handle-select{
        width:100%;
        margin-bottom:20px;
    }
    .table{
        /* width:100%; */
        font-size:13px;
    }
    .mgb10{
        margin-bottom:10px;
    }
    .mgr10{
        margin-right:10px;
    }
    .mgl10{
        margin-left:10px;
    }
    .pdr10{
        padding-right:10px;
    }
    .crumbs >>> .el-breadcrumb{
        font-size:20px;
        height:25px;
    }
    .container{
        background-color:#f0f0f0;
        margin-right:10px;
        padding:15px;
    }
</style>