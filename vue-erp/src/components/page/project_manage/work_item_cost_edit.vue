<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item @click="handleLeave"> {{$t('menus.work_item_cost')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{form.item_name}}</b></el-breadcrumb-item>
            </el-breadcrumb>
            <span style="float:right;margin:-37px 0px 0px 250px;">
                <el-button type="info" icon="el-icon-back" size="large" @click="handleLeave">{{$t('btn.leave')}}</el-button>
            </span>
        </div>
        <div class="container">
            <el-card shadow="hover" class="mgb10" v-loading.lock="loading">
                <div slot="header" class="clearfix">
                    <span>{{form.item_name}}</span>
                    <el-button type=primary size=large icon="el-icon-files" class="card-header-r-btn" @click="handleUpdate"> {{$t('btn.save')}}</el-button>
                </div>
                <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="auto">
                    <el-collapse v-model="collapseName">
                        <el-col :span="24" style="padding-right:10px;">
                            <el-collapse-item name="base_info" title="專案資訊" disabled>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="專案ID">
                                            <span>{{form.id}}</span>
                                        </el-form-item>
                                        <el-form-item label="專案名稱">
                                            <span>{{form.name}}</span>
                                        </el-form-item>
                                        <el-form-item label="專案狀態">
                                            <span>{{form.status}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="預估工時">
                                            <span>{{form.pre_work_time}} 小時</span>
                                        </el-form-item>
                                        <el-form-item label="已執行工時">
                                            <span>{{form.work_time}} 小時</span>
                                        </el-form-item>
                                        <el-form-item label="工時執行比例">
                                            <span v-if="form.work_progress>=80" style="color:red;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress>=50&&form.work_progress<80"  style="color:orange;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress<50" style="color:green;">{{form.work_progress}} %</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" title="請款單" disabled>
                                <el-row  style="padding:20px;">
                                    <el-col :span="24">
                                        <el-table :data="tableData_pay_order" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey1">
                                            <el-table-column prop="id" label="單號" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="status" label="狀態" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="date" label="日期" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="description" label="說明" width="auto" sortable="custom" show-overflow-tooltip/>
                                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column :label="$t('btn.action')" width="100" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                                                    <!-- <el-button :disabled="allowDelete(scope.row)" type="info" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('project.delete')}}</el-button> -->
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" title="預計收入" disabled>
                                <el-row  style="padding:20px;">
                                    <el-col :span="24">
                                        <el-table :data="tableData_income" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey1">
                                            <el-table-column prop="date" label="日期" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                            <el-table-column prop="description" label="項目" width="auto" sortable="custom" show-overflow-tooltip/>
                                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column :label="$t('btn.action')" width="100" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                                                    <!-- <el-button :disabled="allowDelete(scope.row)" type="info" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('project.delete')}}</el-button> -->
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div style="float:right;color:red;">
                                            <span><h1>Total {{stateFormat("","",form.total_income)}} 元</h1></span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="cost" title="預計支出" disabled>
                                <el-row style="padding:20px;">
                                    <el-col :span="24">
                                        <el-table :data="tableData_cost" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey2">
                                            <el-table-column prop="date" label="日期" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                            <el-table-column prop="description" label="項目" width="auto" sortable="custom" show-overflow-tooltip/>
                                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column :label="$t('btn.action')" width="100" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                                                    <!-- <el-button :disabled="allowDelete(scope.row)" type="info" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('project.delete')}}</el-button> -->
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div style="float:right;color:red;">
                                            <span><h1>Total {{stateFormat("","",form.total_cost)}} 元</h1></span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-col>
                    </el-collapse>
                </el-form>
            </el-card>
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
            collapseName:["base_info", "income", "cost"],

            activeNames:"",
            tbKey1:0,
            tbKey2:0,
            tbKey3:0,
            
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
            
            tableData_cost: [
                {date:"2021-05-31",description:"支出項目ㄧ",amount:1000},
                {date:"2021-05-31",description:"支出項目二",amount:30000},
                {date:"2021-05-31",description:"支出項目三",amount:340},
                {date:"2021-05-31",description:"支出項目四",amount:1430},
                {date:"2021-05-31",description:"支出項目五",amount:500}
            ],
            tableData_income: [
                {date:"2021-05-31",description:"收入項目一",amount:100000},
                {date:"2021-05-31",description:"收入項目二",amount:20000},
                {date:"2021-05-31",description:"收入項目三",amount:3000000},
                {date:"2021-05-31",description:"收入項目四",amount:30000},
                {date:"2021-05-31",description:"收入項目五",amount:4000}
            ],
            tableData_pay_order: [
                {id:"P0001-ASUDE",date:"2021-04-21",status:"待審",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-LIEKD",date:"2021-04-20",status:"待審",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-IUYRJ",date:"2021-04-19",status:"通過",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-SKEID",date:"2021-04-18",status:"通過",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-POEIS",date:"2021-04-20",status:"通過",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-RUEJD",date:"2021-04-16",status:"退回",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-IEKWE",date:"2021-04-17",status:"退回",description:"請款說明內容一",owner:"王家得",amount:2000},
            ],
            form:{
                item_name:"VAR APP v2.3.0",
                id:"P0009527",
                name:"VAR APP v2.3.0",
                status:"進行中",
                pre_work_time:1000,
                work_time:540,
                work_progress:54,
                total_cost:33270,
                total_income:3154000
                
            },

            option:{
                categories:[],
                status:[]
            },
            tree_data:[],
           
            rules: {}
               
        }
    },

    async created(){
        // await this.get_dept_employee();
        // await this.getOption();
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
        handleUpdate(){
            this.$router.push("/work_item_cost");
        },
        handleLeave(){
            this.$router.push("/work_item_cost");
        },
        stateFormat(row, column, cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
		},
        getCellStyle({row, column}){
            const tempWidth=column.realWidth||column.width;
            var return_dict = {};
            if(column.showOverflowTooltip){
                return_dict["minWidth"]=`${tempWidth}px`;
                return_dict["maxWidth"]=`${tempWidth}px`;
            };
            return return_dict;
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

        handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.employ_id = localStorage.getItem("ms_odoo_employee_id");
            this.tag_form=Object.assign({}, {
                item_id:this.form.id,
                pid:"",
                
            });
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
               
            };
            this.$refs.form.clearValidate();
        },

        resetTagForm(){
            this.activeNames="";
            this.tag_form={
                item_id:"",
                pid:"",
                
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
            // var param = {
            //     sort_column:this.sort_column,
            //     sort:this.sort,
            //     start_row:this.start_row,
            //     pagesize:this.page_size,
            //     key_word:this.filter.name,
            //     status:this.filter.status,
            //     category:this.filter.category,
            //     owner:this.filter.owner,
            // }
            // await workItemService.get_work_items(param).then(res =>{ 
            //     this.tableData=res.data;
                
            //     this.totalRow=res.total;
            // })

            
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
        width:300px;
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
    .container{
        background-color:#f0f0f0;
        padding:10px;
    }
   
    .w100pa{
        width:100%;  
    }
    .w90pa{
        width:90%;  
    }
    .clearfix{
        line-height:1.23;
    }
    .card-header-r-btn{
        position:relative;
        float:right;
        margin-top:-10px;
    }
    .container >>> .el-card__header{
        padding-right:10px;
    }
    .container >>> .el-collapse-item__header{
        font-size:15px;
        background-color:#e4e4e4;
        padding:0px 20px;
    }
    .container >>> .el-collapse-item__header.is-active{
        margin-bottom:20px;
    }
    .container >>> .el-collapse-item__content{
        padding-bottom:0px;
    }
    .container>>>.el-collapse-item.is-disabled .el-collapse-item__header{
        color:#303133;
        cursor:default;
    }
    .container>>>.el-collapse-item__arrow{
        display:None;
    }
    .container >>> .el-collapse {
        border-top:0px solid #EBEEF5;
        border-bottom:0px solid #EBEEF5;
    }
    .container >>> .el-collapse-item__wrap{
        border-bottom:0px solid #EBEEF5;
    }
    .upload-demo>>>.el-upload{
        width:100%;
    }
    .upload-demo>>>.el-upload-list--picture .el-upload-list__item-thumbnail{
        width:auto;
        margin-right:10px;
    }
    .image-btn>>>.el-form-item__label{
        height:42px;
    }
    .dl-class>>>.el-dialog{
        background:none;
        border-radius:0px;  
        box-shadow:none;
        padding:0px;
    }
    .dl-class>>>.el-dialog__header{
        padding:0px;
    }
    .dl-class>>>.el-dialog__body{
        padding:0px;
    }
    .dl-class>>>.el-dialog__headerbtn{
        top:-25px;
        right:0px;
    }
    .el-backtop, .el-calendar-table td.is-today{
        color:#008800;
    }
</style>
