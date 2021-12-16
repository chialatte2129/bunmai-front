<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.daily_jobs')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.daily_jobs_person')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button size="large" type="success" icon="el-icon-circle-plus-outline" class="mgr10" @click="handleCreate" :disabled="table_loading">{{$t('btn.new')}}</el-button>
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" :disabled="table_loading"
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
                <el-checkbox v-model="filter.hide_void"  class="mgr10" @change="search">{{$t('todo_list.hide_abandon')}}</el-checkbox>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" v-loading="table_loading" 
            :span-method="dateCellMerge" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="work_date" :label="$t('todo_list.date')" width="150" sortable="custom" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.work_date}} ({{$t(`employee.dayofweek.${scope.row.day_of_week}`)}})</template>
                </el-table-column>
                <el-table-column prop="description" :label="$t('todo_list.task_name')" width="auto">
                    <template slot-scope="scope">
                        <div class="one-line">{{scope.row.content}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="note" :label="$t('todo_list.result')" width="auto">
                    <template slot-scope="scope">
                        <div class="one-line">{{scope.row.note}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('todo_list.status')" width="120" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status=='F'" type="success" style="width:80px">{{$t('todo_list.status_item.F')}}</el-button>
                        <el-button v-if="scope.row.status=='P' && today<=scope.row.work_date" type="primary" style="width:80px" @click="handleFinish(scope.row)">{{$t('todo_list.status_item.P')}}</el-button>
                        <el-button v-if="scope.row.status=='P' && today>scope.row.work_date" type="danger" style="width:80px" @click="handleFinish(scope.row)">{{$t('todo_list.status_item.P_over')}}</el-button>
                        <el-button v-if="scope.row.status=='O'" type="info" style="width:80px">{{$t('todo_list.status_item.A')}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('btn.action')" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button  class="el-icon-edit" type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)" :disabled="table_loading">{{$t('btn.edit')}}</el-button>
                        <!-- <el-button type="primary" size="mini" @click="handleCopy(scope.$index, scope.row)"
                        :disabled="table_loading||ban_status.includes(scope.row.status)||overtime_ban_status.includes(scope.row.overtime_status)">{{$t('btn.copy')}}</el-button> -->
                        <!-- <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)" 
                        :disabled="table_loading||ban_status.includes(scope.row.status)||overtime_ban_status.includes(scope.row.overtime_status)">{{$t('btn.delete')}}</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="300px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('common_msg.ask_for_delete')}} ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t("btn.cancel")}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t("btn.confirm")}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('todo_list.finish_task')" :visible.sync="finishVisible" width="300px" center :before-close="cancelFinish">
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelFinish()">{{$t("btn.cancel")}}</el-button>
                <el-button type="primary" @click="confirmFinish">{{$t("btn.confirm")}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="600px" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                    <el-form-item :label="$t('todo_list.date')" prop="work_date">
                        <el-date-picker v-model="form.work_date" type="date" unlink-panels value-format="yyyy-MM-dd" class="handle-input" 
                        :placeholder="$t('common_msg.select_date')" :disabled="updateView||copyView" :picker-options="{
                            disabledDate(time){ 
                                return time.getTime()>Date.now()+day_mileseconds*31;
                            }
                        }"/>
                    </el-form-item>
                    <el-form-item :label="$t('todo_list.member')" prop="item_id">
                        <span >{{form.p_name}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('todo_list.task_name')" prop="content">
                        <el-input v-model="form.content" type="textarea" :rows="5" style="width:95%;"/>
                    </el-form-item>
                    <el-form-item v-if="!createView" :label="$t('todo_list.result')" prop="note">
                        <el-input v-model="form.note" type="textarea" :rows="3" style="width:95%;"/>
                    </el-form-item>
                    <el-form-item :label="$t('todo_list.status')" prop="status">
                        <el-select v-model="form.status" class="handle-input" >
                            <el-option value="F" :label="$t('todo_list.status_item.F')"/>
                            <el-option value="P" :label="$t('todo_list.status_item.P')"/>
                            <el-option value="O" :label="$t('todo_list.status_item.A')"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('todo_list.create_by')" prop="status">
                        <span style="color:blue;">{{form.created_by}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('todo_list.create_at')" prop="status">
                       <span style="color:blue;">{{form.created_at}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer-loading">
                    <el-button @click="cancelDialog">{{$t("btn.cancel")}}</el-button>
                    <el-button type="primary" @click="confirmDialog">{{$t("btn.confirm")}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { dailyJobsService } from "@/_services";
import { accountService } from "@/_services";
export default {
    name: "daily_jobs_person",
    data(){
        return {
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            fullname:localStorage.getItem("ms_user_fullname"),
            today:"",
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
            finish_info:{
                id:"",
                status:""
            },
            deleteInfo:{
                pid:accountService.get_user_info("ms_odoo_employee_id"),
                item_id:null,
                work_date:"",
                tag1:"",
                overtime_application_udid:null,
            },
            deleteView:false,
            createView:false,
            updateView:false,
            copyView:false,
            
            finishVisible:false,

            des_flag:false,
            filter:{
                item_id:null,
                work_date:[],
                hide_void:true,
                pid:accountService.get_user_info("ms_odoo_employee_id"),
            },
            ban_status:["F"],
            overtime_ban_status:["F", "A"],
            edit_idx:null,
            form:{
                pid:accountService.get_user_info("ms_odoo_employee_id"),
                p_name:localStorage.getItem("ms_user_fullname"),
                work_date:"",
                content:"",
                note:"",
                status:"P",
                created_by:localStorage.getItem("ms_user_fullname"),


            },
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
                work_item:[],
                work_item_now:[],
                tags:[],
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
            
            rules_org: {
                work_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                copy_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                content: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ]
            },

            rules_com:{
                description:[
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
            }
        }
    },

    async created(){
        await this.connectFromOtherPlace();
        // await this.getOption();
        await this.getData();
        await this.getToday();
    },

    watch:{
       
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

        showTitle(){
            if(this.createView) return this.$t('todo_list.create_task');
            else if(this.updateView) return this.$t('todo_list.update_task');
            else if(this.copyView) return "複製待辦事項";
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else if(this.copyView) return this.copyView;
            else return false;
        },
    },    
    
    methods:{
        handleFinish(row){
            this.finish_info={
                id:row.id,
                status:"F",
                pid:row.pid,
                work_date:row.work_date,
                updated_by:this.odoo_employee_id
            }
            this.finishVisible=true;
        },

        confirmFinish(){
            var param = {
                action:"update",
                form:this.finish_info
            };
            this.update_day_item(param);
            this.finishVisible=false;
            
        },

        cancelFinish(){
            this.finishVisible=false;
        },

        getToday(){
            let time =new Date();
            this.today = time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        getCellStyle({row, column}){
            const tempWidth=column.realWidth||column.width;
            var return_dict = {};
            return_dict["minWidth"]=`${tempWidth}px`;
            return_dict["maxWidth"]=`${tempWidth}px`;
            return return_dict;
        },

        connectFromOtherPlace(){
            if(this.$route.query.pjid){
                this.filter.item_id=this.$route.query.pjid;
            };
            if(this.$route.query.date){
                this.filter.work_date=[this.$route.query.date, this.$route.query.date];
            };
            this.$router.replace("daily_jobs_person").catch(err => {});
        },

        compTimeInput(){
            if((/^[0-9.]+$/.test(this.form.comp_time))&&parseFloat(this.form.comp_time)>0){
                if(parseFloat(this.form.comp_time)>100){
                    this.form.comp_time=99.99;
                };
                return this.des_flag=true;
            };
            return this.des_flag=false;
        },

        async handleClose(tag){
            await this.tag_form.tags.splice(this.tag_form.tags.indexOf(tag), 1);
            await this.saveTags();
        },

        

        activeStyle(status){
            if(status==1){
                return "background:#FFEDED;";
            }
            return "background:#FCFFF7;";
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
            if(["work_date"].includes(column.property)){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
        },

        handleCopy(index, row){
            var today = new Date();
            var temp_form=Object.assign({}, row);
            temp_form.copy_date=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2, "0")+'-'+String(today.getDate()).padStart(2, "0");
            if(temp_form.work_date==temp_form.copy_date){
                temp_form.copy_date="";
            };
            this.form = temp_form;
            this.form.work_person = this.fullname;
            this.edit_idx=index;
            this.copyView=true;
        },

        async handleCreate(){
            var today = new Date();
            // this.form.work_date=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+1);
            this.form.work_date="";
            this.form.p_name=this.fullname;
            this.form.created_by=this.fullname;
            this.form.updated_by=this.odoo_employee_id;
            this.form.created_at=new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});
            this.form.status="P";
            this.createView=true;
        },

        async handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.updated_by = this.odoo_employee_id;
            this.edit_idx=index;
            this.updateView=true;
        },

        handleDelete(index, row){
            // this.deleteInfo={
            //     id:row.id
            // };
            this.deleteView=true;
        },

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){ this.start_row-=this.page_size }
            this.getData();
        },

        cancelDelete(){
            this.deleteInfo={
                id:null
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
            await dailyJobsService.update_daily_jobs(param).then(res =>{ 
                console.log(res);
                if(res.code==1){ 
                    this.$message.success(this.$t(res.msg)); 
                    if(["create", "copy", "update"].includes(param.action)){
                        console.log("Finish");
                        this.tbKey++;
                        this.getData();
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
                        action:this.createView?"create":(this.updateView?"update":"copy"),
                        form:temp_form
                    };
                    this.update_day_item(param);
                }
            })
        },

        cancelDialog(){
            this.resetForm();
            this.createView=false;
            this.updateView=false;
            this.copyView=false;
        },

        resetForm(){
            this.dlKey++;
            this.form={
                pid:this.odoo_employee_id,
                p_name:this.fullname,
                work_date:"",
                content:"",
                note:"",
                created_by:this.fullname
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
            await dailyJobsService.person_daily_jobs_list(param).then(res =>{ 
                this.tableData=res.day_items;
                console.log(res);
                this.totalRow=res.total;
                this.getSpanArr(this.tableData);
            })
            this.table_loading=false;
        },
        
        // async getOption(){
            
        // },

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
    .pdr10{
        padding-right:10px;
    }
    .wd250{
        width:250px;
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
    .container{
        margin-right:150px;
    }
    .one-line{
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }
</style>