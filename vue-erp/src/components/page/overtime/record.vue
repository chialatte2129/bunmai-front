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
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" v-loading="table_loading" :span-method="dateCellMerge" :key="tbKey">
                <el-table-column prop="form_id" :label="$t('overtime.form_id')" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="comp_time" :label="$t('overtime.comp_time')" width="150" sortable="custom" align="right" header-align="center"/>
                <el-table-column prop="status" :label="$t('overtime.process_status')" width="150" sortable="custom" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">{{$t("overtime.status."+scope.row.status)}}</template>
                </el-table-column>
                <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="275" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" icon="el-icon-view" @click="handleView(scope.$index, scope.row)" :disabled="table_loading">{{$t('btn.view')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        <el-dialog title="View Overtime" :visible.sync="showVisible" width="600px" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                    
                </el-form>
                <div slot="footer" class="dialog-footer-loading">
                    <el-button @click="cancelDialog">{{$t("btn.cancel")}}</el-button>
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
            tag_dl_loading:false,
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
            deleteInfo:{
                pid:localStorage.getItem("ms_odoo_employee_id"),
                item_id:null,
                work_date:"",
                tag1:"",
                overtime_application_udid:null,
            },
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
            // form:{
            //     pid:localStorage.getItem("ms_odoo_employee_id"),
            //     p_name:localStorage.getItem("ms_user_fullname"),
            //     item_id:"",
            //     work_date:"",
            //     work_hours:"",
            //     description:"",
            //     tag1:"",
            //     comp_time:null,
            //     overtime_status:"",
            //     overtime_application_udid:null,
            // },
            // tag_form:{
            //     item_id:"",
            //     pid:localStorage.getItem("ms_odoo_employee_id"),
            //     tags:[],
            // },
            // edit_tag_info:{
            //     label:"",
            // },
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


        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else if(this.copyView) return this.copyView;
            else return false;
        },
    },    
    
    methods:{
        handleView(){

        },
        // compTimeInput(){
        //     if((/^[0-9.]+$/.test(this.form.comp_time))&&parseFloat(this.form.comp_time)>0){
        //         if(parseFloat(this.form.comp_time)>100){
        //             this.form.comp_time=99.99;
        //         };
        //         return this.des_flag=true;
        //     };
        //     return this.des_flag=false;
        // },


        // async handleClose(tag){
        //     await this.tag_form.tags.splice(this.tag_form.tags.indexOf(tag), 1);
        //     await this.saveTags();
        // },

        // async handleInputConfirm(){
        //     let inputValue=this.tagValue;
        //     if(inputValue){
        //         if(!this.tag_form.tags.includes(inputValue)){
        //             await this.tag_form.tags.push(inputValue);
        //             await this.saveTags();
        //         };
        //     };
        //     this.tagVisible=false;
        //     this.tagValue="";
        // },

        // showInput(){
        //     this.tagVisible=true;
        //     this.$nextTick(_ => {
        //         this.$refs.saveTagInput.$refs.input.focus();
        //     });
        // },

        // resetTagForm(){
        //     this.tag_form={
        //         item_id:"",
        //         pid:localStorage.getItem("ms_odoo_employee_id"),
        //         tags:[],
        //     };
        //     this.edit_tag_info={
        //         label:"",
        //     };
        // },

        // async cancelTagDialog(){
        //     if(this.regetTag) await this.get_filter_tag();
        //     this.tagView=false;
        //     this.resetTagForm();
        //     this.regetTag=false;
        // },
        
        // activeStyle(status){
        //     if(status==1){
        //         return "background:#FFEDED;";
        //     }
        //     return "background:#FCFFF7;";
        // },

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

        // confirmDelete(){
        //     var param = {
        //         action:"delete",
        //         form:this.deleteInfo
        //     }
        //     this.update_day_item(param);
        // },

        // async update_day_item(param){ 
        //     this.dialog_loading=true;
        //     await dayItemService.update_day_item(param).then(res =>{ 
        //         if(res.code==1){ 
        //             this.$message.success(this.$t(res.msg)); 
        //             if(["create", "copy"].includes(param.action)){
        //                 this.getData();
        //                 this.cancelDialog();
        //             }else if(param.action=="update"){
        //                 delete param.form["org_tag1"];
        //                 this.tableData[this.edit_idx]=param.form;
        //                 this.tbKey++;
        //                 this.getData();
        //                 this.cancelDialog();
        //             }else if(param.action=="delete"){
        //                 this.cancelDelete()
        //                 this.handleDeleteChange();
        //             }
        //         }else if(res.code==0){ 
        //             this.$message.warning(this.$t(res.msg)); 
        //         }else{ 
        //             this.$message.error(this.$t(res.msg)); 
        //         } 
        //     }) 
        //     this.dialog_loading=false;
        // },

        cancelDialog(){
            this.resetForm();
            this.createView=false;
            this.updateView=false;
            this.copyView=false;
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
    .tree_filter{
        margin:0px 0px 10px 2px;
        min-width:100px;
        width:100%;
    }
    .node_icon >>> .el-button--primary.el-button--mini.is-circle{
        padding:3px;
        position:absolute;
    }
    .node_icon >>> .el-button--danger.el-button--mini.is-circle{
        padding:3px;
        position:absolute;
    }
    .node_plus{
        margin-right:20px;
        z-index:2;
    }
    .tag-dialog >>> .el-divider--horizontal{
        margin:10px 0;
    }
    .tag-dialog >>> .el-divider--horizontal.tag-group{
        margin:10px 0 5px 0;
    }
</style>