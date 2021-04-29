<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.task_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.day_item_report_project')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <!-- <el-input size="large" v-model="filter.form_id" :placeholder="$t('overtime.form_id')" clearable @change="search" class="mgr10 handle-input-form_id" :disabled="table_loading"/> -->
                <el-select size="large" class="mgr10 handle-input" v-model="filter.project" filterable clearable multiple collapse-tags
                :placeholder="$t('project.name')"  @change="search">
                    <el-option v-for="item in option.project" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                </el-select>
                <el-select size="large" v-model="filter.status" filterable clearable multiple :placeholder="$t('project.status')" @change="search" class="mgr10" :disabled="table_loading">
                    <el-option v-for="item in option.status" :key="item.id" :label="item.name" :value="item.id" :disabled="table_loading"/>
                </el-select>
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" :disabled="table_loading"
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
            </div>
            <!-- <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="table_loading"
            @sort-change="handleSortChange" :row-class-name="tableRowClassName" :cell-style="getCellStyle" :key="tbKey"> -->
            
            <el-table
            :data="tableData"
            :row-class-name="mainTableClass"
            :cell-style="getCellStyle"
            border
            @expand-change="handleExpand"
            @sort-change="handleSortChange"
            style="width: 100%">
                <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table
                        :data="props.row.children"
                        :row-class-name="deptTableClass" 
                        :cell-style="getCellStyle"
                        row-key="complete_name"
                        v-loading="handleTableLoading(props.$index)"
                        border
                        style="width: 100%">
                        <el-table-column :label="$t('employee.dept')" prop="dept_name" width="200px"></el-table-column>
                        <el-table-column :label="$t('employee.complete_name')" prop="complete_name" width="auto"></el-table-column>
                        <el-table-column :label="$t('project.total_work_hours')" prop="work_hours" align="right" width="100px">
                            <template slot-scope="scope">
                                <span style="font-size:16px">{{scope.row.work_hours.toFixed(1)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('common_column.action')" prop="total" align="center" width="120px">
                            <template slot-scope="scope">
                                <el-button  @click="handleViewClick(props.row,scope.row)">檢視細項</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                </el-table-column>
                <el-table-column
                :label="$t('project.id')"
                prop="item_id"
                width="150px">
                </el-table-column>
                <el-table-column
                :label="$t('project.name')"
                prop="item_name"
                width="auto">
                </el-table-column>
                <el-table-column
                :label="$t('project.description')"
                prop="description"
                width="auto">
                </el-table-column>
                <el-table-column
                :label="$t('project.status')"
                prop="status"
                align="center"
                sortable="customer"
                width="100px">
                    <template slot-scope="scope">{{$t("project.status_tag."+scope.row.status)}}</template>
                </el-table-column>
                <el-table-column
                :label="$t('employee.start_date')"
                prop="start_date"
                align="center"
                sortable="customer"
                width="120px">
                </el-table-column>
                <el-table-column
                :label="$t('employee.end_date')"
                prop="end_date"
                align="center"
                sortable="customer"
                width="120px">
                </el-table-column>
                <el-table-column
                :label="$t('project.total_work_hours')"
                prop="work_hours"
                align="right"
                sortable="customer"
                width="120px">
                    <template slot-scope="scope">
                        <span style="font-size:16px">{{scope.row.work_hours.toFixed(1)}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        <el-dialog :title="handleDialogTitle()" :visible.sync="showVisible" width="80%" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <el-form label-position="left" label-width="200px">
                <el-form-item :label="$t('employee.complete_name')"><span><b>{{select_dept_name}}</b></span></el-form-item>
                <el-form-item v-show="filter.work_date.length==2" :label="$t('employee.work_date')"><span ><b>{{filter.work_date[0]}}</b>  {{$t("employee.date_range")}}  <b>{{filter.work_date[1]}}</b></span></el-form-item>
            </el-form>
            <div v-loading.lock="false">
                <el-table :data="subTableData" border class="table mgt10" ref="multipleTable" tooltip-effect="light" height="532" v-loading="table_loading"
                @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                    <el-table-column prop="work_date" :label="$t('employee.work_date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                    <el-table-column prop="p_name" :label="$t('employee.name')" width="100" show-overflow-tooltip/>
                    <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                    <el-table-column prop="work_hours" :label="$t('employee.work_hour')" width="100" align="right" header-align="left"/>
                    <el-table-column type="expand" width="40">
                        <template slot-scope="props">
                            <el-form label-position="left" label-width="85px">
                                <el-form-item :label="$t('project.tag1')">{{props.row.tag1}}</el-form-item>
                                <el-form-item :label="$t('employee.description')"><p style="white-space:pre-wrap;word-break:break-all;">{{props.row.description}}</p></el-form-item>
                            </el-form >
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @size-change="subHandleSizeChange" @current-change="subHandleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                    :current-page="sub_cur_page" :page-sizes="sub_page_size_list" :page-size="sub_page_size" :total="subTotalRow" background/>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { dayItemService } from "@/_services";
import { workItemService } from "@/_services";
import { Loading } from 'element-ui';
import { overtimeService } from "@/_services";
export default {
    name: "day_item_person",
    data(){
        return {
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            username:localStorage.getItem("ms_username"),
            fullname:localStorage.getItem("ms_user_fullname"),
            tbKey:0,
            dlKey:0,
            table_loading:false,
            dialog_loading:false,
            showVisible:false,
            
            tableData:[],
            totalRow:0,
            spanArr:[],
            pos:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[10, 20, 50],
            start_row:0,
            sort_column:"work_hours",
            sort:"desc",

            subTableData:[],
            subTotalRow:0,
            sub_cur_page: 1,
            sub_page_size:10,
            sub_page_size_list:[10, 20, 50],
            sub_start_row:0,
            sub_sort_column:"work_date",
            sub_sort:"desc",

            select_dept_id:-1,
            select_pid:-1,
            select_pname:"",
            select_dept_name:"",

            loading:false,
            expand_index:[],
            expand_row_count:0,
            filter:{
                status:[],
                project:[],
                work_date:[]
            },
            option:{
                projects:[],
                status:[],
            },
            day_mileseconds:86400000,
            pickerOptions:{
                disabledDate(time){
                    return time.getTime() > Date.now()+86400000*31;
                },
                shortcuts:[
                    {
                        text: this.$t('employee.today'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
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
                        text: this.$t('employee.month'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: this.$t('employee.three_months'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
        }
    },

    async created(){
        await this.getOption();
        await this.getData();
    },

    watch:{

    },

    computed:{
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        sub_count_page(){
            this.sub_start_row=(this.sub_cur_page-1)*this.sub_page_size;
        },
    },    
    
    methods:{
        handleDialogTitle(){
            return this.select_pid+" - "+this.select_pname
        },
        handleTableLoading(index){
            if(this.expand_index.includes(index)){
                if(this.loading){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            };
        },
        cancelDialog(){
            this.dlKey++;
            this.subTableData=[]
            this.subTotalRow=0;
            this.sub_cur_page=1;
            this.sub_page_size=10;
            this.sub_count_page;
            this.showVisible = false;
        },
        handleViewClick(project_row,dept_row){
            this.select_dept_id = dept_row.dept_id;
            this.select_pid = project_row.item_id;
            this.select_pname = project_row.item_name;
            this.select_dept_name = dept_row.complete_name;
            this.getSubData();
            this.showVisible = true;
        },
        getCellStyle({ column }){
            const tempWidth=column.realWidth||column.width;
            if(column.showOverflowTooltip){
                return {
                    minWidth:`${tempWidth}px`,
                    maxWidth:`${tempWidth}px`
                }
            };
            return {};
        },
        mainTableClass({row, rowIndex}) {
            return `main-table-row`;
        },
        deptTableClass({row, rowIndex}) {
            return `dept-table-row`;
        },
        handlePersonProject(row){
            window.open(`${process.env.VUE_APP_HOST}day_item_person?pjid=${row.item_id}&&date=${row.work_date}`);
        },

        tableRowClassName({row, rowIndex}) {
            return `${row.status}-row`;
        },
        handleExpand(row,expandedRows) {
            console.log("row expand");
            
            if(expandedRows.length > this.expand_row_count){
                console.log("get dept data");
                
                this.expand_row_count = expandedRows.length;
                var working_row = this.tableData.map(x => x.item_id).indexOf(row.item_id)
                this.loading = true;
                this.expand_index.push(working_row);
                
                dayItemService.get_project_dept_totals({item_id:row.item_id,work_date:this.filter.work_date}).then(res =>{ 
                    if(res.data){
                        this.tableData[working_row].children = res.data
                    }
                    this.loading = false;
                    this.expand_index.splice(this.expand_index.indexOf(working_row),1);
                    console.log(row.children);
                })
            }else{
                console.log("pass");
                
                this.expand_row_count = expandedRows.length;
            }
        },
        getSpanArr(data){
            this.resetSpanArr();
            for(var i=0;i<data.length;i++){
                if(i===0){ 
                    this.spanArr.push(1);
                    this.pos=0;
                }else{
                    if(data[i].work_date===data[i-1].work_date){
                        this.spanArr[this.pos]+=1;
                        this.spanArr.push(0);
                    }else{ 
                        this.spanArr.push(1); 
                        this.pos=i;
                    }
                }
            }
        },

        resetSpanArr(){
            this.spanArr=[];
            this.pos=null;
        },

        handleCurrentChange(currentPage){
            this.expand_row_count = 0;
            this.expand_index = [];
            this.cur_page = currentPage;
            this.count_page;
            this.getData()
        },

        subHandleCurrentChange(currentPage){
            this.sub_cur_page = currentPage;
            this.sub_count_page;
            this.getSubData()
        },

        subHandleSizeChange(size){
            this.sub_page_size = size;
            this.subHandleCurrentChange(1);
        },

        handleSizeChange(size){
            this.page_size = size;
            this.handleCurrentChange(1);
        },

        handleSortChange({prop, order}){
            console.log(prop,order);
            
            this.sort_column = prop;
            this.sort = order;
            this.handleCurrentChange(1);
        },
        
        async getData(){
            this.table_loading=true;
            var param = {
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                filter:this.filter
            }
            await dayItemService.get_project_totals(param).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
            this.table_loading=false;
        },
        async getSubData(){
            console.log("get data !")
            this.table_loading=true;
            var param = {
                action:"table",
                sort_column:this.sub_sort_column,
                sort:this.sub_sort,
                start_row:this.sub_start_row,
                page_size:this.sub_page_size,
                username:this.username,
                odoo_employee_id:this.odoo_employee_id,
                filter:{
                    item_id:[this.select_pid],
                    work_date:this.filter.work_date,
                    dept_id:[this.select_dept_id],
                    pid:[],
                }
            }
            await dayItemService.review_day_list(param).then(res =>{ 
                console.log(res);
                
                this.subTableData=res.day_items;
                this.subTotalRow=res.total;
            })
            this.table_loading=false;
        },
        
        async getOption(){
            await workItemService.get_options({}).then(res =>{ 
                this.option.status=res.status; 
            });
            await dayItemService.get_option_list({action:["work_item"]}).then(res =>{ 
                this.option.project=res.work_item;
            });
        },
        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                form_id:"",
                status:[],
                work_date:[],
                pid:[this.odoo_employee_id]
            };
            this.tbKey++;
            this.sort_column="work_date";
            this.sort="desc";
            this.handleCurrentChange(1);
        },
    }
}
</script>
<style scoped>
    .handle-input{
        width:300px;
        display:inline-block;
    }
    .handle-input-form_id{
        width:160px;
        display:inline-block;
    }
    .del-dialog-cnt{
        font-size:16px;
        text-align:center;
        color:#FF4242;
    }
    .table{
        width:100%;
        font-size:14px;
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
    .dialog-footer-loading{
        text-align:right;
        margin:40px 0 -10px 0;
    }
    .clearfix{
        position:relative;
        line-height:1.23;
        font-size: 16px;
    }
    .custom-tree-node{
        flex:1;
        display:flex;
        align-items:center;
        justify-content:space-between;
        font-size:14px;
        padding-right:15px;
    }
    .scrollBar{ 
        height:440px; 
        overflow:hidden; 
    } 
    .list{ 
        max-height:10px; 
    }
    .custom-tree-node >>> .node_label_1{
        width:150px;
        line-height:26px;
    }
    .custom-tree-node >>> .node_plus{
        line-height:20px;
    }
    .filtered-tree >>> .el-tree-node__expand-icon.is-leaf{
        display:none;
    }
    .filtered-tree{
        margin-left:3px;
    }
    /* .table >>> .D-row {
        background: white;
    }
    .table >>> .O-row {
        background: gainsboro;
    }
    .table >>> .P-row {
        background: aliceblue;
    }
    .table >>> .R-row {
        background: #FFEFEE;
    }
    .table >>> .F-row {
        background: #FCFFF7;
    }
    .table >>> .A-row {
        background: #FCFFF7;
    } */
    .table >>> .main-table-row {
        background: aliceblue;
    }
    .table >>> .dept-table-row {
        background: #FFF8DC;
    }
    
</style>