<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.daily_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.day_item_person')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button size="large" type="success" icon="el-icon-circle-plus-outline" class="mgr10" @click="handleCreate" :disabled="table_loading">{{$t('btn.new')}}</el-button>
                <el-select size="large" v-model="filter.item_id" filterable clearable :placeholder="$t('project.name')" @change="search" class="mgr10" :disabled="table_loading">
                    <el-option v-for="item in option.work_item" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id" :disabled="table_loading"/>
                </el-select>
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" :disabled="table_loading"
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" v-loading="table_loading" :span-method="dateCellMerge" :key="tbKey">
                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="140" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="item_id" :label="$t('project.name')" width="300" sortable="custom" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.item_name}}</template>
                </el-table-column>
                <el-table-column prop="work_hours" :label="$t('employee.work_hour')" width="140" sortable="custom" align="right" header-align="left"/>
                <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="185" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" :disabled="table_loading">{{$t('btn.edit')}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" 
                        :disabled="table_loading||ban_status.includes(scope.row.status)">{{$t('btn.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('common_msg.ask_for_delete')}} ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="600px" :before-close="cancelDialog" :close-on-click-modal="false" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                    <el-form-item :label="$t('employee.work_date')" prop="work_date">
                        <el-date-picker v-model="form.work_date" type="date" unlink-panels value-format="yyyy-MM-dd" :placeholder="$t('common_msg.select_date')" class="handle-input" :disabled="updateView"/>
                    </el-form-item>
                    <el-form-item :label="$t('project.name')" prop="item_id">
                        <el-select v-model="form.item_id" filterable clearable class="handle-input" :disabled="updateView">
                            <el-option v-for="item in option.work_item_now" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('employee.work_hour')" prop="work_hours">
                        <el-input v-model="form.work_hours" clearable maxlength="4" show-word-limit class="handle-input" :readonly="ban_status.includes(form.status)"/>
                    </el-form-item>
                    <el-form-item :label="$t('employee.description')" prop="description">
                        <el-input v-model="form.description" type="textarea" :rows="5" :readonly="ban_status.includes(form.status)" style="width:95%;"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer-loading">
                    <el-button @click="cancelDialog">{{$t('btn.cancel')}}</el-button>
                    <el-button type="primary" @click="confirmDialog" :disabled="ban_status.includes(form.status)">{{$t('btn.confirm')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { dayItemService } from "@/_services";
export default {
    name: "day_item_person",
    data(){
        return {
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            fullname:localStorage.getItem("ms_user_fullname"),
            tbKey:0,
            dlKey:0,
            table_loading:false,
            dialog_loading:false,
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
            },
            deleteView:false,
            createView:false,
            updateView:false,
            filter:{
                item_id:null,
                work_date:[],
                pid:localStorage.getItem("ms_odoo_employee_id"),
            },
            ban_status:["F"],
            edit_idx:null,
            form:{
                pid:localStorage.getItem("ms_odoo_employee_id"),
                p_name:localStorage.getItem("ms_user_fullname"),
                item_id:"",
                work_date:"",
                work_hours:"",
                description:"",
            },
            option:{
                work_item:[],
                work_item_now:[],
            },
            pickerOptions:{
                disabledDate(time){
                    return time.getTime() > Date.now();
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
            
            rules: {
                work_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                item_id: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur", "change"]},
                ],
                work_hours: [
                    {pattern: /^[0-9.]+$/, message: `${this.$t('rules.only_numbers')} [0123456789.]`, trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
            },
        }
    },

    async created(){
        await this.getOption();
        await this.getData();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        showTitle(){
            if(this.createView) return this.$t("employee.create_day_item");
            else if(this.updateView) return this.$t("employee.update_day_item");
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else return false;
        },
    },    
    
    methods: {
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

        handleCreate(){
            var today = new Date();
            this.form.work_date=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            this.createView=true;
        },

        handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.edit_idx=index;
            this.updateView=true;
        },

        handleDelete(index, row){
            this.deleteInfo={
                pid:this.odoo_employee_id,
                item_id:row.item_id,
                work_date:row.work_date,
            };
            this.deleteView=true;
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
            };
            this.deleteView=false;
        },

        confirmDelete(){
            var param = {
                action:"delete",
                form:this.deleteInfo
            }
            this.update_day_item(param);
        },

        async update_day_item(param){ 
            this.dialog_loading=true;
            await dayItemService.update_day_item(param).then(res =>{ 
                if(res.code==1){ 
                    this.$message.success(this.$t(res.msg)); 
                    if(param.action=="create"){
                        this.getData();
                        this.cancelDialog();
                    }else if(param.action=="update"){
                        this.tableData[this.edit_idx]=param.form;
                        this.tbKey++;
                        this.cancelDialog();
                    }else if(param.action=="delete"){
                        this.cancelDelete()
                        this.handleDeleteChange();
                    }
                }else if(res.code==0){ 
                    this.$message.warning(this.$t(res.msg)); 
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
            this.dialog_loading=false;
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.form);
                    var param = {
                        action:this.createView?"create":"update",
                        form:temp_form
                    }
                    this.update_day_item(param);
                }
            })
        },

        cancelDialog(){
            this.resetForm();
            this.createView=false;
            this.updateView=false;
        },

        resetForm(){
            this.dlKey++;
            this.form={
                pid:this.odoo_employee_id,
                p_name:this.fullname,
                item_id:"",
                work_date:"",
                work_hours:"",
                description:"",
            };
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
                action:"table",
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                filter:this.filter
            }
            await dayItemService.person_day_list(param).then(res =>{ 
                this.tableData=res.day_items;
                this.totalRow=res.total;
                this.getSpanArr(this.tableData);
            })
            this.table_loading=false;
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["work_item", "work_item_now"]}).then(res =>{ 
                this.option.work_item=res.work_item;
                this.option.work_item_now=res.work_item_now;
            }) 
        },

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                item_id:null,
                work_date:[],
                pid:this.odoo_employee_id
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
    .crumbs >>> .el-breadcrumb{
        font-size:20px;
        height:25px;
    }
    .dialog-footer-loading{
        text-align:right;
        margin:40px 0 -10px 0;
    }
</style>