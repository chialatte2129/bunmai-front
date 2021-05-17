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
                <!-- <el-select size="large" v-model="filter.item_id" filterable clearable :placeholder="$t('project.name')" @change="search" class="mgr10 wd250" :disabled="table_loading">
                    <el-option v-for="item in option.work_item" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id" :disabled="table_loading"/>
                </el-select> -->
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" :disabled="table_loading"
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
                <!-- <el-button size="large" type="warning" style="float:right;" plain v-html="$t('employee.edit_personal_tags')" @click="openTagManager"/> -->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" v-loading="table_loading" 
            :span-method="dateCellMerge" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="work_date" label="執行日期" width="150" sortable="custom" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.work_date}} ({{$t(`employee.dayofweek.${scope.row.day_of_week}`)}})</template>
                </el-table-column>
                <el-table-column prop="description" label="工作事項" width="auto">
                    <template slot-scope="scope">
                        <el-tooltip effect="light" placement="top">
                            <div v-html="scope.row.description.replaceAll('\n', '<br/>')" slot="content"></div>
                            <div class="one-line">{{scope.row.description}}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="執行狀況" width="auto">
                    <template slot-scope="scope">
                        <el-tooltip effect="light" placement="top">
                            <div v-html="scope.row.description.replaceAll('\n', '<br/>')" slot="content"></div>
                            <div class="one-line">{{scope.row.note}}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="執行狀態" width="120" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status=='F'" type="success" style="width:80px">已完成</el-button>
                        <el-button v-if="scope.row.status=='P' && today<=scope.row.work_date" type="primary" style="width:80px" @click="handleFinish(scope.row)">待辦</el-button>
                        <el-button v-if="scope.row.status=='P' && today>scope.row.work_date" type="danger" style="width:80px" @click="handleFinish(scope.row)">逾期待辦</el-button>
                        <el-button v-if="scope.row.status=='O'" type="info" style="width:80px">作廢</el-button>
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
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('common_msg.ask_for_delete')}} ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t("btn.cancel")}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t("btn.confirm")}}</el-button>
            </span>
        </el-dialog>

        <el-dialog title="完成工作事項" :visible.sync="finishVisible" width="500px" center :before-close="canceFinish">
            <div style="text-align:center;">您要完成這項工作嗎 ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelFinish">{{$t("btn.cancel")}}</el-button>
                <el-button type="primary" @click="confirmFinish">{{$t("btn.confirm")}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="600px" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                    <el-form-item label="執行日期" prop="work_date">
                        <el-date-picker v-model="form.work_date" type="date" unlink-panels value-format="yyyy-MM-dd" class="handle-input" 
                        :placeholder="$t('common_msg.select_date')" :disabled="updateView||copyView" :picker-options="{
                            disabledDate(time){ 
                                return time.getTime()>Date.now()+day_mileseconds*31;
                            }
                        }"/>
                    </el-form-item>
                    <el-form-item label="執行人員" prop="item_id">
                        <el-select v-model="form.work_person" filterable clearable class="handle-input" :disabled="updateView||copyView" >
                            <el-option label="許宸維" value="許宸維"/>
                            <el-option label="巫家毅" value="巫家毅"/>
                            <el-option label="王家得" value="王家得"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="執行事項" prop="work_hours">
                        <el-input v-model="form.description" type="textarea" :rows="5" style="width:95%;"/>
                    </el-form-item>
                    <el-form-item v-if="!createView" label="執行狀況" prop="work_hours">
                        <el-input v-model="form.note" type="textarea" :rows="3" style="width:95%;"/>
                    </el-form-item>
                    <el-form-item label="狀態" prop="status">
                        <el-select v-model="form.status" class="handle-input" >
                            <el-option value="F" label="已完成"/>
                            <el-option value="P" label="待辦"/>
                            <el-option value="O" label="作廢"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="建立人員" prop="status">
                        <span>{{form.created_by}}</span>
                    </el-form-item>
                    <el-form-item label="建立時間" prop="status">
                       <span>{{form.created_at}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer-loading">
                    <el-button @click="cancelDialog">{{$t("btn.cancel")}}</el-button>
                    <el-button type="primary" @click="confirmDialog" 
                    :disabled="ban_status.includes(form.status)||overtime_ban_status.includes(form.overtime_status)">{{$t("btn.confirm")}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { dayItemService, personTagService } from "@/_services";
export default {
    name: "day_item_person",
    data(){
        return {
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
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
            
            finishVisible:false,

            des_flag:false,
            filter:{
                item_id:null,
                work_date:[],
                pid:localStorage.getItem("ms_odoo_employee_id"),
            },
            ban_status:["F"],
            overtime_ban_status:["F", "A"],
            edit_idx:null,
            form:{
                pid:localStorage.getItem("ms_odoo_employee_id"),
                p_name:localStorage.getItem("ms_user_fullname"),
                item_id:"",
                work_date:"",
                work_person:"許宸維",
                work_hours:"",
                description:"",
                tag1:"",
                comp_time:null,
                overtime_status:"",
                overtime_application_udid:null,
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
        await this.connectFromOtherPlace();
        await this.getOption();
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
            if(this.createView) return "新增待辦事項";
            else if(this.updateView) return "編輯待辦事項";
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
            this.finishVisible=true;
        },
        confirmFinish(){
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
            if(column.property=="total_work_hour"){
                return_dict["fontWeight"]="700";
                return_dict["color"]="green";
                if(row.total_work_hour<8){
                    return_dict["color"]="red";
                };
            };
            if(["total_work_hour", "work_hours"].includes(column.property)){
                return_dict["background"]="#FAFAFA";
            };
            if(["total_comp_time", "comp_time"].includes(column.property)){
                return_dict["background"]="#FFFFF5";
            };
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
            if(["work_date", "total_work_hour", "total_comp_time"].includes(column.property)){
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
            this.form.work_date=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            this.form.work_person=this.fullname;
            this.form.status="P";
            this.createView=true;
        },

        async handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.work_person=this.fullname;
            this.edit_idx=index;
            this.updateView=true;
        },

        handleDelete(index, row){
            this.deleteInfo={
                pid:this.odoo_employee_id,
                item_id:row.item_id,
                work_date:row.work_date,
                tag1:row.tag1,
                overtime_application_udid:row.overtime_application_udid,
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
                tag1:"",
                overtime_application_udid:null,
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
            // await dayItemService.update_day_item(param).then(res =>{ 
            //     if(res.code==1){ 
            //         this.$message.success(this.$t(res.msg)); 
            //         if(["create", "copy", "update"].includes(param.action)){
            //             this.tbKey++;
            //             this.getData();
            //             this.cancelDialog();
            //         }else if(param.action=="delete"){
            //             this.cancelDelete()
            //             this.handleDeleteChange();
            //         }
            //     }else if(res.code==0){ 
            //         this.$message.warning(this.$t(res.msg)); 
            //     }else{ 
            //         this.$message.error(this.$t(res.msg)); 
            //     } 
            // }) 
            this.dialog_loading=false;
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.form);
                    delete temp_form["total_comp_time"];
                    delete temp_form["total_work_hour"];
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
                item_id:"",
                work_date:"",
                work_hours:"",
                description:"",
                tag1:"",
                comp_time:null,
                overtime_status:"",
                overtime_application_udid:null,
            };
            this.option.tags=[];
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
                console.log(res);
                this.totalRow=res.total;
                this.getSpanArr(this.tableData);
            })
            // O(作廢)、 P (待辦)、R(退回)、F(完成)
            this.tableData=[
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-19","day_of_week":3,"description":"修正 mysql events schedule 狀況","note":"","status":"P","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-19","day_of_week":3,"description":"steam版本企劃內容整理","note":"","status":"P","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-19","day_of_week":3,"description":"戰損貼圖修改，男一成年版模型製作","note":"","status":"P","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-18","day_of_week":2,"description":"拋物線模組新增 可自訂位置 修改微調拋物線位置與選擇模組","note":"","status":"P","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-18","day_of_week":2,"description":"新增小天使與淡入淡出轉場","note":"","status":"P","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-18","day_of_week":2,"description":"新增多語言與劇本選擇流程","note":"","status":"F","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-18","day_of_week":2,"description":"修改遊戲流程","note":"","status":"F","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-16","day_of_week":1,"description":"選擇16歲以上劇本時,最後一波球會在空中飛舞砍不到","note":"需要支援","status":"P","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-16","day_of_week":1,"description":"選擇UI改為砍擊模組","note":"","status":"F","owner":""},
                {"created_at":"2021-05-16 08:00","created_by":"許宸維","work_date":"2021-05-16","day_of_week":1,"description":"新增場景管理器與轉場流程","note":"","status":"F","owner":""},
            ];
            this.totalRow=10;
            this.getSpanArr(this.tableData);
            this.table_loading=false;
        },
        
        async getOption(){
            
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