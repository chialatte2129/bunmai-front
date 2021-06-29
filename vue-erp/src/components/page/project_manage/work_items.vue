<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.work_items')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button v-if="allowCreate" size="large" type="success" icon="el-icon-circle-plus-outline" :disabled="loading" @click="handleCreate">
                    {{$t('project.create_inner_project')}}
                </el-button>
                <el-button v-if="allowProjectCreate" size="large" type="success" class="mgr10" icon="el-icon-circle-plus-outline" :disabled="loading" 
                @click="handleProjectCreate">
                    {{$t('project.create_outter_project')}}
                </el-button>
                <el-select size="large" class="mgr10" v-model="filter.owner" filterable clearable multiple collapse-tags
                :placeholder="$t('project.owner')" :disabled="loading" @change="search">
                    <el-option-group v-for="group in tree_data" :key="group.id" :label="group.name">
                        <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
                            <span v-if="item.id==-100" class="mgl10">{{$t(item.name)}}</span>
                            <span v-else class="mgl10">{{item.name}}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
                <el-select size="large" v-model="filter.category" class="mgr10" multiple collapse-tags filterable clearable v-if="false"
                :placeholder="$t('project.category')" :disabled="loading" @change="search">
                    <el-option v-for="category in option.categories" :key="category.name" :label="category.name" :value="category.name"/>
                </el-select>
                <el-select class="mgr10" size="large" v-model="filter.status" multiple collapse-tags filterable clearable :placeholder="$t('project.status')"
                :disabled="loading" @change="search">
                    <el-option v-for="item in option.status" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
                <el-input v-model="filter.name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('project.keyword')" :disabled="loading" @change="search"/>
                <el-button size="large" type="info" class="mgr10" plain :disabled="loading" @click="cancelSearch">{{$t('btn.clean')}}</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="id" :label="$t('common_column.id')" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="name" :label="$t('common_column.name')" min-width="300" width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="description" :label="$t('project.description')" min-width="300" width="auto" sortable="custom" show-overflow-tooltip/>
                <!-- <el-table-column prop="category" :label="$t('common_column.category')" width="auto" sortable="custom" show-overflow-tooltip/> -->
                <el-table-column prop="status_name" :label="$t('common_column.status')" width="150" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="owner" :label="$t('project.owner')" width="150" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="start_date" :label="$t('common_column.start_date')" width="150" align="center" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="end_date" :label="$t('common_column.end_date')" width="150" align="center" sortable="custom" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <!-- <el-button :disabled="allowDelete(scope.row)" type="info" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('project.delete')}}</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('project.ask_delete')}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="900px" :before-close="cancelDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="createView" :label="$t('project.id')" prop="id">
                            <el-input v-model="form.id" clearable class="wd80pa">
                                <template v-if="form.is_project==0" slot="prepend">INTER-</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item v-if="updateView" :label="$t('project.id')" prop="id">
                            <span >{{form.id}}</span>
                        </el-form-item>
                        <el-form-item :label="$t('project.name')" prop="name">
                            <el-input :readonly="setReadOnly" v-model="form.name" clearable class="wd80pa"/>
                        </el-form-item>
                        <el-form-item :label="$t('project.category')" prop="category" v-if="false">
                            <el-select v-if="form.is_project==0" :disabled="setReadOnly" v-model="form.category" filterable class="wd80pa">
                                <el-option v-for="category in option.categories" :disabled="category.disable" :key="category.name" :label="category.name" :value="category.name"/>
                            </el-select>
                            <span v-if="form.is_project==1">{{form.category}}</span>
                        </el-form-item>
                        <el-form-item :label="$t('project.status')" prop="status">
                            <el-select :disabled="setReadOnly" v-model="form.status" filterable class="wd80pa">
                                <el-option v-for="item in option.status" :key="item.id" :label="item.name" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('project.owner')" prop="owner">
                            <el-select :disabled="setReadOnly" v-model="form.owner_id" filterable clearable class="wd80pa">
                                <el-option-group v-for="group in tree_data" :key="group.id" :label="group.name">
                                    <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
                                        <span v-if="item.id==-100" class="mgl10">{{$t(item.name)}}</span>
                                        <span v-else class="mgl10">{{item.name}}</span>
                                    </el-option>
                            </el-option-group>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('common_column.start_date')" prop="date_period">
                            <el-date-picker v-model="form.start_date" type="date" :readonly="setReadOnly" value-format="yyyy-MM-dd" :placeholder="$t('common_msg.select')" class="wd80pa"
                            :picker-options="{ disabledDate(time){if(!form.end_date){return ''}else{return time.getTime() > Date.parse(new Date(form.end_date).toString())}}}">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('common_column.end_date')" prop="date_period">
                            <el-date-picker v-model="form.end_date" type="date" :readonly="setReadOnly" value-format="yyyy-MM-dd" :placeholder="$t('common_msg.select')" class="wd80pa"
                            :picker-options="{ disabledDate(time){if(!form.start_date){return ''}else{return time.getTime() <= Date.parse(new Date(form.start_date).toString())}}}">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item :label="$t('project.description')" prop="description">
                        <el-input type="textarea" :readonly="setReadOnly" v-model="form.description" :rows="3" clearable style="width:95.5%;"/>
                    </el-form-item>
                    <div style="font-size:12px;margin:10px;color:rgb(255, 73, 73);"> [ {{$t("common_msg.non_essential")}} ] {{$t("project.tag_tips")}}</div>
                    <el-collapse v-model="activeNames" accordion>
                        <el-collapse-item name="tags" class="tag-collapse">
                            <template slot="title">
                                <div class="mgl10">{{$t("project.tags")}}</div>
                            </template>
                            <el-form-item :label="$t('project.is_open_tags')" prop="is_open_tags" label-width="140px">
                                <el-switch v-model="form.is_open_tags" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"
                                :active-text="$t('common_msg.yes')" :inactive-text="$t('common_msg.no')"/>
                            </el-form-item>
                            <el-form-item :label="$t('project.tags')" prop="tags">
                                <!-- <el-button type="info" plain size="medium" class="mgr10" @click="tag_form.tags=[]">{{$t("btn.reset")}}</el-button> -->
                                <el-input style="width:50%;" v-model="tagValue" clearable ref="saveTagInput" size=medium show-word-limit maxlength="20"
                                @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"/>
                                <!-- <el-button v-else type="warning" plain size="medium" @click="showInput">{{$t("project.add_tags")}}</el-button> -->
                                <el-divider/>
                                <el-tag style="margin:5px 5px 0px 0px;" :key="tag" v-for="tag in tag_form.tags" size=large type=success closable 
                                :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
                            </el-form-item>
                        </el-collapse-item>
                        <el-collapse-item v-if="updateView" name="history" class="tag-collapse">
                            <template slot="title">
                                <div class="mgl10">專案狀態紀錄</div>
                            </template>
                            <el-table
                            v-loading="histable_load"
                            :data="item_history"
                            style="width: 100%">
                            <el-table-column
                                prop="recorded_at"
                                label="更動時間"
                                align="center"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="employee_name"
                                label="操作人員"
                                align="center"
                                width="180">
                            </el-table-column>
                           <el-table-column
                                prop="prev_status"
                                label="操作"
                                align="center"
                                width="200">
                                <template slot-scope="scope">
                                    {{scope.row.prev_status}} → {{scope.row.current_status}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="note"
                                label="說明">
                            </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </el-row>
                
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
            activeNames:"",
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
            loading:false,
            deleteID:null,
            deleteView:false,
            createView:false,
            updateView:false,
            tagVisible:false,
            tagValue:"",
            check_start_time:"",
            check_end_time:"",
            filter:{
                name:"",
                status:[],
                category:[],
                owner:[],
            },
            tree_data:[],
            
            form:{
                date_period:[],
                type:"create",
                id:"",
                name:"",
                category:"",
                status:"",
                is_project:"",
                start_date:null,
                end_date:null,
                description:"",
                owner:"",
                owner_id:"",
                employ_id:localStorage.getItem("ms_odoo_employee_id"),
                is_open_tags:false,
            },

            item_history:[],
            histable_load:false,

            tag_form:{
                item_id:"",
                pid:"",
                tags:[],
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
                    {pattern: /^[\u4e00-\u9fa5A-Za-z0-9. ()-]+$/, message: this.$t("rules.project_id"), trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                status: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                category: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ]
                
            },
        }
    },

    async created(){
        await this.get_dept_employee();
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
            else if(this.updateView && this.form.is_project) return this.$t("project.edit_project");
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
            // if (this.action_list.includes("create_inner_project")){
            //     return true
            // }else{
            //     return false
            // }
            return false
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
        getCellStyle({row, column}){
            const tempWidth=column.realWidth||column.width;
            var return_dict = {};
            if(column.showOverflowTooltip){
                return_dict["minWidth"]=`${tempWidth}px`;
                return_dict["maxWidth"]=`${tempWidth}px`;
            };
            return return_dict;
        },

        handleClose(tag){
            this.tag_form.tags.splice(this.tag_form.tags.indexOf(tag), 1);
        },

        handleInputConfirm(){
            let inputValue=this.tagValue;
            if(inputValue){
                if(!this.tag_form.tags.includes(inputValue)){
                    this.tag_form.tags.push(inputValue);
                };
            };
            this.tagVisible=false;
            this.tagValue="";
        },

        showInput(){
            this.tagVisible=true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        async get_dept_employee(){
            this.loading=true;
            await workItemService.get_dept_employee({}).then(res =>{ 
                this.tree_data=res.tree_data;
                this.tree_data.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
            })
        },
        
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
            console.log(this.tree_data);
            this.form.is_project = 1;
            this.form.category = "預設";
            this.form.status = "D";
            this.createView=true;
        },
        getStatusRecord(item_id){
            this.item_history=[];
            this.histable_load=true;
            workItemService.get_project_status_record({item_id:item_id}).then(res =>{ 
                console.log(res);
                if(res.success){ 
                    this.item_history=res.result;
                    this.histable_load=false;
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                    this.histable_load=false;
                } 
            }) 
            
        },
        handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.employ_id = localStorage.getItem("ms_odoo_employee_id");
            this.tag_form=Object.assign({}, {
                item_id:this.form.id,
                pid:"",
                tags:this.form.tags,
            });
            this.getStatusRecord(row.id);
            this.updateView=true;
        },

        handleDelete(index, row){
            this.deleteID=row.id;
            this.deleteView=true;
        },

        cancelDelete(){
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
                        // console.log("finish delete");
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
                    var temp_form = Object.assign({}, this.form);
                    var temp_tag_form = Object.assign({}, this.tag_form);
                    temp_tag_form.item_id = temp_form.id;
                    var param = {
                        type:this.createView?"create":"update",
                        form:temp_form,
                        tag_form:temp_tag_form,
                    }
                    this.update_work_items(param);
                }
            })
        },

        cancelDialog(){
            this.createView=false;
            this.updateView=false;
            this.resetForm();
            this.resetTagForm();
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
                description:"",
                owner:"",
                employ_id:localStorage.getItem("ms_odoo_employee_id"),
                is_open_tags:false,
            };
            this.$refs.form.clearValidate();
        },

        resetTagForm(){
            this.activeNames="";
            this.tag_form={
                item_id:"",
                pid:"",
                tags:[],
            };
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
            this.loading=true;
            var param = {
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                pagesize:this.page_size,
                key_word:this.filter.name,
                status:this.filter.status,
                category:this.filter.category,
                owner:this.filter.owner,
            }
            await workItemService.get_work_items(param).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
            this.loading=false;
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
                category:[],
                owner:[],
            };
            this.handleCurrentChange(1);
        },
    }
}
</script>
<style scoped>
    .handle-input{
        width:200px;
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
    .mgt10{
        margin-top:10px;
    }
    .crumbs >>> .el-breadcrumb{
        font-size:20px;
        height:25px;
    }
    .wd80pa{
        width:90%;
    }
    .tag-collapse >>> .el-divider--horizontal{
        margin:10px 0 5px 0;
    }
    .container{
        margin-right:150px;
    }
</style>