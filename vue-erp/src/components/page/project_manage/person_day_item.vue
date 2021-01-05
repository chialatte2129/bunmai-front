<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.person_day_item')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button size="large" type="success" icon="el-icon-circle-plus-outline" class="mgr10" @click="handleCreate">{{$t('btn.new')}}</el-button>
                <el-select size="large" v-model="filter.item_id" filterable clearable :placeholder="$t('project.name')" @change="search" class="mgr10">
                    <el-option v-for="item in option.project" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" 
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch"/>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" :key="tbKey">
                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="150" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="item_id" :label="$t('project.name')" width="300" sortable="custom" show-overflow-tooltip>
                    <template slot-scope="scope" v-html="scope.row.item_name"/>
                </el-table-column>
                <el-table-column prop="work_hour" :label="$t('employee.work_hour')" width="150" sortable="custom" align="right" header-align="left" show-overflow-tooltip/>
                <el-table-column prop="description" :label="$t('employee.description')" width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="185" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('btn.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('common_msg.ask_for_delete')}} ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        <!-- <el-dialog :title="showTitle" :visible.sync="showVisible" width="500px" :before-close="cancelDialog" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-form-item :label="$t('shop_manage.area_name')" prop="name">
                    <el-input v-model="form.name" clearable style="width:100%;"/>
                </el-form-item>
                <el-form-item :label="$t('shop_manage.country_name')" prop="country_id">
                    <el-select v-model="form.country_id" filterable clearable style="width:100%;">
                        <el-option v-for="item in option.country" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('shop_manage.i18n_key')" prop="multi_lang_code">
                    <el-input v-model="form.multi_lang_code" maxlength="50" clearable show-word-limit>
                        <template slot="prepend">{{prefix}}</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('shop_manage.note')" prop="note">
                    <el-input v-model="form.note" type="textarea" style="width:100%;"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>
<script>
import { dayItemService } from "@/_services";
export default {
    name: "person_day_item",
    data(){
        return {
            odoo_user_id:localStorage.getItem("ms_odoo_user_id"),
            tbKey:0,
            tableData: [],
            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10, 20, 50],
            start_row:0,
            sort_column:"id",
            sort:"desc",
            deleteInfo:{
                pid:localStorage.getItem("ms_odoo_user_id"),
                item_id:null,
                work_date:"",
            },
            deleteView:false,
            createView:false,
            updateView:false,
            prefix:"AREA_",
            lang:localStorage.getItem("ms_user_lang"),
            filter:{
                item_id:null,
                work_date:[],
            },
            edit_idx:null,
            form:{
                id:null,
                name:"",
                country_id:"",
                multi_lang_code:"",
                note:"",
            },
            option:{
                project:[]
            },
            pickerOptions:{
                shortcuts:[
                    {
                    text: this.$i18n.t('employee.week'),
                    onClick(picker){
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                    text: this.$i18n.t('employee.month'),
                    onClick(picker){
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                    text: this.$i18n.t('employee.three_months'),
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
                name: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                country_id: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                multi_lang_code: [
                    {pattern: /^[A-Z_]+$/, message: `${this.$t('rules.only_english_characters')} [upper]`, trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
            },
        }
    },

    async created(){
        // console.log(this.odoo_user_id)
        // await this.getOption();
        // await this.getData();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        showTitle(){
            if(this.createView) return this.$t("shop_manage.area_add");
            else if(this.updateView) return this.$t("shop_manage.area_edit");
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else return false;
        },
    },    
    
    methods: {
        handleCreate(){
            this.createView=true;
        },

        handleEdit(index, row){
            row.multi_lang_code = row.multi_lang_code.replace(/^AREA_/, "");
            this.form=Object.assign({}, row);
            this.edit_idx=index;
            this.updateView=true;
        },

        handleDelete(index, row){
            this.deleteInfo={
                pid:this.odoo_user_id,
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
                pid:this.odoo_user_id,
                item_id:null,
                work_date:"",
            };
            this.deleteView=false;
        },

        confirmDelete(){
            this.form.id = this.deleteID; 
            var param = {
                action:"delete",
                form:this.deleteInfo
            }
            this.update_day_item(param);
        },

        update_day_item(param){ 
            dayItemService.update_day_item(param).then(res =>{ 
                if(res.code==1){ 
                    this.$message.success(this.$t(res.msg)); 
                    if(param.action=="create"){
                        this.getData();
                    }else if(param.action=="update"){
                        this.tableData[this.edit_idx]=param.form;
                        this.getCountryName(this.tableData[this.edit_idx]);
                        this.tbKey++;
                    }else if(param.action=="delete"){
                        this.cancelDelete()
                        this.handleDeleteChange();
                    }
                    this.cancelDialog();
                }else if(res.code==0){ 
                    this.$message.warning(this.$t(res.msg)); 
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.form);
                    temp_form.multi_lang_code = `${this.prefix}${this.form.multi_lang_code}`;
                    if("country_name" in temp_form) delete temp_form["country_name"];
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
            this.form={
                id:null,
                name:"",
                country_id:"",
                multi_lang_code:"",
                note:"",
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
            var param = {
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                filter:this.filter
            }
            await dayItemService.person_day_list(param).then(res =>{ 
                this.tableData=res.day_items;
                this.totalRow=res.total;
            })
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["project"]}).then(res =>{ 
                this.option.project=res.project; 
            }) 
        },

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                item_id:null,
                work_date:[],
            };
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
</style>