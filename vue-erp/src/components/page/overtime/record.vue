<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.overtime_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.overtime_person_record')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-input size="large" v-model="filter.form_id" :placeholder="$t('overtime.form_id')" clearable @change="search" class="mgr10 handle-input-form_id" :disabled="table_loading"/>
                <el-select size="large" v-model="filter.status" filterable clearable multiple :placeholder="$t('overtime.process_status')" @change="search" class="mgr10" :disabled="table_loading">
                    <el-option v-for="item in option.status" :key="item.value" :label="item.label" :value="item.value" :disabled="table_loading"/>
                </el-select>
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" :disabled="table_loading"
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="table_loading"
            @sort-change="handleSortChange" :row-class-name="tableRowClassName" :key="tbKey">
                <el-table-column type="expand" width="40">
                    <template slot-scope="props">
                        <el-form label-position="left" label-width="85px">
                            <el-form-item :label="$t('employee.description')">
                                <p style="white-space:pre-wrap;word-break:break-all;">{{props.row.description}}</p>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="115" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="form_id" :label="$t('overtime.form_id')" width="135" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="item_name" :label="$t('project.name')" width="250" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                <el-table-column prop="comp_time" :label="$t('overtime.comp_time')" width="105" align="right" header-align="left"/>
                <el-table-column prop="status" :label="$t('overtime.process_status')" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">{{$t("overtime.status."+scope.row.status)}}</template>
                </el-table-column>
                <el-table-column label="開啟專案" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button type=text size=mini icon="el-icon-edit" @click="handlePersonProject(scope.row)" :disabled="table_loading||['A', 'F'].includes(scope.row.status)"/>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
    </div>
</template>
<script>
import { overtimeService } from "@/_services";
export default {
    name: "day_item_person",
    data(){
        return {
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            fullname:localStorage.getItem("ms_user_fullname"),
            tbKey:0,
            table_loading:false,
            dialog_loading:false,
            tableData:[],
            totalRow:0,
            spanArr:[],
            pos:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[10, 20, 50],
            start_row:0,
            sort_column:"work_date",
            sort:"desc",
            filter:{
                form_id:"",
                status:[],
                work_date:[],
                pid:[localStorage.getItem("ms_odoo_employee_id")],
            },
            option:{
                status:[
                    {"value":"D","label":this.$t("overtime.status.D")},
                    {"value":"O","label":this.$t("overtime.status.O")},
                    {"value":"P","label":this.$t("overtime.status.P")},
                    {"value":"R","label":this.$t("overtime.status.R")},
                    {"value":"F","label":this.$t("overtime.status.F")},
                    {"value":"A","label":this.$t("overtime.status.A")}
                ],
            },
            day_mileseconds:86400000,
            pickerOptions:{
                disabledDate(time){
                    return time.getTime() > Date.now()+86400000*31;
                },
                shortcuts:[
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
    },    
    
    methods:{
        handlePersonProject(row){
            window.open(`${process.env.VUE_APP_HOST}day_item_person?pjid=${row.item_id}&&date=${row.work_date}`);
        },

        tableRowClassName({row, rowIndex}) {
            return `${row.status}-row`;
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
            this.cur_page = currentPage;
            this.count_page;
            this.getData()
        },

        handleSizeChange(size){
            this.page_size = size;
            this.handleCurrentChange(1);
        },

        handleSortChange({prop, order}){
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
            await overtimeService.get_overtime_log(param).then(res =>{ 
                this.tableData=res.logs;
                this.totalRow=res.total;
                this.getSpanArr(this.tableData);
            })
            this.table_loading=false;
        },
        
        async getOption(){

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
    .table >>> .D-row {
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
    }
</style>
<style>
</style>