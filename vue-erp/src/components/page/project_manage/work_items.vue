<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.work_items')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button v-if="allowCreate" size="large" type="success" 
                icon="el-icon-circle-plus-outline"  @click="handleCreate">
                    {{$t('btn.new')}}
                </el-button>
                <el-button v-if="allowProjectCreate" size="large" type="success" 
                icon="el-icon-circle-plus-outline" class="mgr10" @click="handleProjectCreate">
                    {{$t('project.create_outter_project')}}
                    </el-button>
                <el-select 
                size="large" 
                v-model="filter.category" 
                multiple
                collapse-tags
                filterable 
                clearable 
                :placeholder="$t('project.category')"
                @change="search">
                    <el-option v-for="category in option.categories" :key="category.name" :label="category.name" :value="category.name"/>
                </el-select>
                <el-select 
                class="mgl10"
                size="large" 
                v-model="filter.status" 
                multiple
                collapse-tags
                filterable 
                clearable 
                :placeholder="$t('project.status')"
                @change="search">
                    <el-option v-for="item in option.status" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
                <el-input v-model="filter.name" clearable size="large" class="mgl10 handle-input" :placeholder="$t('project.keyword')" @change="search"/>
                <el-button size="large" type="info" class="mgl10" plain @click="cancelSearch">{{$t('btn.clean')}}</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" :key="tbKey">
                <el-table-column prop="id" :label="$t('common_column.id')" width="150" sortable="custom" align="left"/>
                <el-table-column prop="name" :label="$t('common_column.name')" width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="category" :label="$t('common_column.category')" width="auto" sortable="custom" show-overflow-tooltip/>
                <!-- <el-table-column prop="is_project" label="是否專案" width="120px" sortable="custom" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_project==0">否</span>
                        <span v-if="scope.row.is_project==1">是</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="status_name" :label="$t('common_column.status')" width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="start_date" :label="$t('common_column.start_date')" width="150px" align="center" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="end_date" :label="$t('common_column.end_date')" width="150px" align="center" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="description" :label="$t('project.description')" width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="185" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <el-button :disabled="allowDelete(scope.row)" type="info" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('project.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('project.ask_delete')}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" 
        :visible.sync="showVisible" 
        width="500px" 
        :before-close="cancelDialog" 
        :close-on-click-modal="false" 
        class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-form-item v-if="createView" :label="$t('project.id')" prop="id">
                    <el-input  v-model="form.id" clearable style="width:100%;">
                        <template v-if="form.is_project==0" slot="prepend">INTER-</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="updateView" :label="$t('project.id')" prop="id">
                    <span >{{form.id}}</span>
                </el-form-item>
                <el-form-item :label="$t('project.name')" prop="name">
                    <el-input :readonly="setReadOnly" v-model="form.name" clearable style="width:100%;"/>
                </el-form-item>
                <el-form-item :label="$t('project.category')" prop="category">
                    <el-select v-if="form.is_project==0" :disabled="setReadOnly" v-model="form.category" filterable style="width:100%;">
                        <el-option v-for="category in option.categories" :disabled="category.disable" :key="category.name" :label="category.name" :value="category.name"/>
                    </el-select>
                    <span v-if="form.is_project==1">{{form.category}}</span>
                </el-form-item>
                <el-form-item :label="$t('project.status')" prop="status">
                     <el-select :disabled="setReadOnly" v-model="form.status" filterable style="width:100%;">
                        <el-option v-for="item in option.status" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('project.date')" prop="date_period">
                    <el-date-picker
                    v-model="form.date_period"
                    :readonly="setReadOnly"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    :range-separator="$t('employee.date_range')"
                    :start-placeholder="$t('common_column.start_date')"
                    :end-placeholder="$t('common_column.end_date')">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('project.description')" prop="description">
                    <el-input type="textarea" :readonly="setReadOnly" v-model="form.description" :rows="3" clearable style="width:100%;"/>
                </el-form-item>
            </el-form>
            <div v-if="setReadOnly==false" slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { workItemService } from "@/_services";
export default {
    name: "work_item_manage",
    data(){
        return {
            tbKey:0,
            tableData: [],
            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10],
            start_row:0,
            sort_column:"id",
            sort:"desc",
            action_list:localStorage.getItem("ms_user_actions"),
            deleteID:null,
            deleteView:false,
            createView:false,
            updateView:false,
            filter:{
                name:"",
                status:[],
                category:[]
            },
            edit_idx:null,
            
            form:{
                date_period:[],
                type:"create",
                id:"",
                name:"",
                category:"",
                status:"",
                is_project:"",
                start_date:"",
                end_date:"",
                description:"",
                employ_id:localStorage.getItem("ms_employee_id"),
            },

            option:{
                categories:[],
                status:[]
            },
            
            rules: {
                name: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                id: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                status: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                category: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                date_period: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ]
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
            if(this.createView && this.form.is_project) return this.$t("project.create_outter_project");
            else if(this.createView && !this.form.is_project) return this.$t("project.create_inner_project");
            else if(this.updateView && this.form.is_project) return this.$t("project.edit_outter_project");
            else if(this.updateView && !this.form.is_project) return this.$t("project.edit_inner_project");
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else return false;
        },

        allowProjectCreate(){
            if (this.action_list.includes("create_outer_project")){
                return true
            }else{
                return false
            }
        },

        allowCreate(){
            if (this.action_list.includes("create_inner_project")){
                return true
            }else{
                return false
            }
        },

        setReadOnly(){
            if (this.form.is_project==1 && this.action_list.includes("edit_outer_project")){
                return false
            }else if (this.form.is_project==0 && this.action_list.includes("edit_inner_project")){
                return false
            }else{
                return true
            }
        },

        allowEdit(){
            if (this.action_list.includes("edit_outer_project")){
                return true
            }else{
                return false
            }
        },
        
    },    
    
    methods: {
        allowDelete(row){
            if(row.status == 'A'){
                return true
            };
            if (row.is_project==1 && this.action_list.includes("delete_outer_project")){
                return false
            }else if (row.is_project==0 && this.action_list.includes("delete_inner_project")){
                return false
            }else{
                return true
            }
        },

        handleCreate(){
            this.form.is_project = 0;
            this.createView=true;
        },

        handleProjectCreate(){
            this.form.is_project = 1;
            this.form.category = "外部專案";
            this.createView=true;
        },

        handleEdit(index, row){
            row["employ_id"] = localStorage.getItem("ms_employee_id");
            console.log(row);
            this.form=row;
            this.form.date_period = [row.start_date,row.end_date]
            this.edit_idx=index;
            this.updateView=true;
        },

        handleDelete(index, row){
            this.deleteID=row.id;
            this.deleteView=true;
        },

        cancelDelete(){
            console.log("cancel delete");
            this.deleteID=null;
            this.deleteView=false;
        },

        confirmDelete(){
            this.form.id = this.deleteID; 
            var param = {
                type:"delete",
                form:this.form
            }
            this.update_work_items(param);
        },

        update_work_items(param){ 
            workItemService.update_work_items(param).then(res =>{ 
                if(res.success){ 
                    this.$message.success("success"); 
                    if(param.type=="create"){
                        this.handleCurrentChange(1);
                        this.cancelDialog();
                    }else if(param.type=="update"){
                        this.getData();
                        this.cancelDialog();
                    }else if(param.type=="delete"){
                        console.log("finish delete");
                        
                        this.cancelDelete();
                        this.getData();
                    }else{
                        this.getData();
                    }
                    
                
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    this.form.start_date = this.form.date_period[0];
                    this.form.end_date = this.form.date_period[1];
                    var temp_form = Object.assign({}, this.form);
                    var param = {
                        type:this.createView?"create":"update",
                        form:temp_form
                    }
                    this.update_work_items(param);
                }
            })
        },

        cancelDialog(){
            this.resetForm();
            this.showVisible-false;
            this.createView=false;
            this.updateView=false;
        },

        resetForm(){
            this.form.date_period = [];
            this.form={
                type:"create",
                id:"",
                name:"",
                category:"",
                status:"",
                is_project:"",
                start_date:"",
                end_date:"",
                employ_id:localStorage.getItem("ms_employee_id"),
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
                pagesize:this.page_size,
                key_word:this.filter.name,
                status:this.filter.status,
                category:this.filter.category
            }
            await workItemService.get_work_items(param).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
        },
        
        async getOption(){
            await workItemService.get_options({}).then(res =>{ 
                this.option.categories=res.categories; 
                this.option.status=res.status; 
            }) 
        },

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                name:"",
                status:[],
                category:[]
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