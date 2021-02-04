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
                <el-select size="large" v-model="filter.status" filterable clearable multiple placeholder="狀態" @change="search" class="mgr10" :disabled="table_loading">
                    <el-option v-for="item in option.status" :key="item.value" :label="item.label" :value="item.value" :disabled="table_loading"/>
                </el-select>
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" :disabled="table_loading"
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" 
            tooltip-effect="light" @sort-change="handleSortChange" :row-class-name="tableRowClassName" v-loading="table_loading" :key="tbKey">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div style="width:50%;float:left;">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item :label="$t('employee.work_date')">
                                    <span>{{ props.row.work_date }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('project.id')">
                                    <span>{{ props.row.item_id }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('project.name')">
                                    <span>{{ props.row.item_name }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('overtime.comp_time')">
                                    <span>{{ props.row.comp_time }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('overtime.process_status')">
                                    <span>{{$t("overtime.status."+props.row.status)}}</span>
                                </el-form-item>
                                <el-form-item :label="$t('employee.description')">
                                    <p style="white-space:pre-wrap;word-break:break-all;">{{props.row.description}}</p>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div style="width:50%;float:left;">
                            <el-button style="float:right;" type="primary" @click="handlePersonProject(props.row)">開啟專案設定</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="form_id" :label="$t('overtime.form_id')" width="200" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="item_name" :label="$t('project.name')" width="auto" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="comp_time" :label="$t('overtime.comp_time')" width="150" sortable="custom" align="right" header-align="center"/>
                <el-table-column prop="status" :label="$t('overtime.process_status')" width="150" sortable="custom" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">{{$t("overtime.status."+scope.row.status)}}</template>
                </el-table-column>
                <!-- <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/> -->
                <!-- <el-table-column :label="$t('btn.action')" width="275" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" icon="el-icon-view" @click="handleView(scope.$index, scope.row)" :disabled="table_loading">{{$t('btn.view')}}</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        <el-dialog :title="form.form_id" :visible.sync="showVisible" width="600px" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                    
                </el-form>
                <div slot="footer" class="dialog-footer-loading">
                    <el-button type="info" @click="cancelDialog">{{$t("btn.close")}}</el-button>
                </div>
            </div>
        </el-dialog>
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
            dlKey:0,
            desKey:0,
            tagDlKey:1000,
            table_loading:false,
            dialog_loading:false,
            showVisible:false,
            tableData:[],
            totalRow:0,
            spanArr:[],
            pos:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10, 20, 50],
            start_row:0,
            sort_column:"work_date",
            sort:"desc",
            deleteView:false,
            createView:false,
            updateView:false,
            copyView:false,
            tagView:false,
            tagVisible:false,
            tagValue:"",
            regetTag:false,
            des_flag:false,
            filter:{
                status:[],
                work_date:[],
                pid:[localStorage.getItem("ms_odoo_employee_id")],
            },
            ban_status:["F"],
            overtime_ban_status:["F", "A"],
            edit_idx:null,
            form:{},
            isRemove:false,
            filterProjText:"",
            filterPersText:"",
            proj_tree:[],
            pers_tree:[],            
            defaultProps: {
                children:"children",
                label:"label",
                level:"level",
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
            
            rules_org: {
                work_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                copy_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                item_id: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur", "change"]},
                ],
                work_hours: [
                    {pattern: /^[0-9.]+$/, message: `${this.$t('rules.only_numbers')} [0123456789.]`, trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                comp_time:[
                    {pattern: /^[0-9.]+$/, message: `${this.$t('rules.only_numbers')} [0123456789.]`, trigger: ["blur", "change"]},
                ],
            },

            rules_com:{
                description:[
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
            }
        }
    },

    async created(){
        await this.getOption();
        await this.getData();
    },

    watch:{
        filterProjText(val){
            this.$refs.proj_tree.filter(val);
        },

        filterPersText(val){
            this.$refs.pers_tree.filter(val);
        },
    },

    computed:{

        rules(){
            var output_rules = this.rules_org;
            var com_key = Object.keys(this.rules_com);
            if(this.des_flag){
                for(var key of com_key){
                    output_rules[key] = this.rules_com[key];
                };
            }else{
                for(var key of com_key){
                    delete output_rules[key];
                };
            };
            this.desKey++;
            return output_rules;
        },

        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },
    },    
    
    methods:{
        handlePersonProject(row){
            console.log(row);
            window.open(`${process.env.VUE_APP_HOST}day_item_person?pjid=${row.item_id}&&date=${row.work_date}`);
        },
        tableRowClassName({row, rowIndex}) {
            return row.status+'-row';
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

        dateCellMerge({row, column, rowIndex, columnIndex}){
            if(column.property==="work_date"){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
        },

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){ this.start_row-=this.page_size }
            this.getData();
        },

        cancelDelete(){
            this.deleteInfo={
                pid:this.odoo_employee_id,
                item_id:null,
                work_date:"",
                tag1:"",
                overtime_application_udid:null,
            };
            this.deleteView=false;
        },

        cancelDialog(){
            this.resetForm();
            this.showVisible=false;
        },

        resetForm(){
            this.dlKey++;
            this.form={};
            this.edit_idx=null;
            this.$refs.form.clearValidate();
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

        // async get_filter_tag(){
        //     this.dialog_loading=true;
        //     await dayItemService.get_option_list({action:["tags"], param:{item_id:this.form.item_id, pid:this.odoo_employee_id}}).then(res =>{ 
        //         this.option.tags=res.tags;
        //     });
        //     this.dialog_loading=false;
        // },

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
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
        width: 300px;
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
</style>
<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        margin-top: 10px;
        width: 100%;
    }
    .el-table .D-row {
        background: white;
    }
    .el-table .O-row {
        background: gainsboro;
    }
    .el-table .P-row {
        background: aliceblue;
    }
    .el-table .R-row {
        background: #FFEFEE;
    }
    .el-table .F-row {
        background: #FCFFF7;
    }
    .el-table .A-row {
        background: #FCFFF7;
    }
</style>