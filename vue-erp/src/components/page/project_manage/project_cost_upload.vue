<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.project_cost_upload')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button size="large" type="primary" class="mgr10" icon="el-icon-upload" :disabled="loading" 
                @click="handleUpload()">
                    上傳
                    <!-- {{$t('btn.upload')}} -->
                </el-button>
                <el-button size="large" type="success" class="mgr10" icon="el-icon-plus" :disabled="loading" 
                @click="handleCreate()">
                    {{$t('btn.new')}}
                </el-button>
                <el-select size="large" class="mgr10 handle-input" v-model="filter.item_id" filterable clearable multiple collapse-tags
                :placeholder="$t('project.name')" @change="getData()">
                    <el-option v-for="item in option.projects" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                </el-select>
                <el-date-picker
                class="pickerStyle"
                v-model="filter.month"
                type="monthrange"
                value-format="yyyy-MM"
                size="large"
                placeholder="選擇月份"
                range-separator="至"
                start-placeholder="開始月份"
                end-placeholder="结束月份"
                @change="getData()">
                </el-date-picker>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="month" label="月份" width="110" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="project" label="專案" min-width="200px" width="auto" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="normal_hours" label="一般工時"  width="120" sortable="custom" align="right" show-overflow-tooltip/>
                <el-table-column prop="overtime_hours" label="加班工時" width="120" sortable="custom" align="right" show-overflow-tooltip/>
                <el-table-column prop="normal_hours_cost" label="一般工時成本" width="180px" sortable="custom" align="right" show-overflow-tooltip/>
                <el-table-column prop="overtime_hours_cost" label="加班工時成本" width="180px" sortable="custom" align="right" show-overflow-tooltip/>

                <el-table-column :label="$t('btn.action')" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('btn.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
    
        <el-dialog title="上傳專案工時文件" v-if="uploadVisible" :visible.sync="uploadVisible" width="1000px" center :before-close="cancelUpload">
            <div>
               <el-form label-position="left" label-width="100px">
                    <el-form-item label="工時月份">
                       <el-date-picker
                        class="pickerStyle"
                        v-model="upload_month"
                        type="month"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="選擇上傳月份">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="上傳檔案">
                        <div style="width:400px;">
                            <el-upload
                            ref="upload"
                            drag
                            accept=".csv"
                            action
                            :multiple="false"
                            :limit="1"
                            :auto-upload="false"
                            :on-remove="handleUploadRemove"
                            :on-change="handleUploadChange">
                                <el-button size="large"  type="primary" style="width:100%">上傳檔案</el-button>
                            </el-upload>
                            <el-button type="text" @click="handleDownloadSample()">下載範本.csv</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="資料筆數">
                        <span>{{dalen}} 筆</span>
                    </el-form-item>
                </el-form>
                <el-table :data="da" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading" :cell-style="getCellStyle" :key="tbKey">
                    <el-table-column prop="project_name" label="專案名稱" width="auto" align="left" show-overflow-tooltip/>
                    <el-table-column prop="normal_worktime" label="一般工時" width="150px" align="right" show-overflow-tooltip/>
                    <el-table-column prop="over_worktime" label="加班工時"  width="150" align="right" show-overflow-tooltip/>
                    <el-table-column prop="normal_worktime_cost" label="一般總成本" width="150px" align="right" show-overflow-tooltip/>
                    <el-table-column prop="over_worktime_cost" label="加班總成本"  width="150" align="right" show-overflow-tooltip/>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpload">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmUpload">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="300px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('common_msg.ask_for_delete')}} ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t("btn.cancel")}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t("btn.confirm")}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="450px" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="left" label-width="150px">
                    <el-form-item label="月份" prop="month">
                        <span v-if="updateView">{{form.month}}</span>
                        <el-date-picker
                        v-if="createView"
                        class="pickerStyle"
                        v-model="form.month"
                        type="month"
                        value-format="yyyy-MM"
                        size="small"
                        placeholder="選擇上傳月份">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="專案名稱" prop="project">
                        <span v-if="updateView" >{{form.project}}</span>
                        <el-select v-if="createView" size="large" class="mgr10" v-model="form.project_id" filterable clearable collapse-tags
                        :placeholder="$t('project.name')">
                            <el-option v-for="item in option.projects" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="一般工時" >
                        <el-input v-model="form.normal_hours" type="number" style="width:200px;"><template slot="append">小時</template></el-input>
                    </el-form-item>
                    <el-form-item label="加班工時" >
                        <el-input v-model="form.overtime_hours" type="number" style="width:200px;"><template slot="append">小時</template></el-input>
                    </el-form-item>
                    <el-form-item label="一般工時成本" >
                        <el-input v-model="form.normal_hours_cost" type="number" style="width:200px;"><template slot="append">元</template></el-input>
                    </el-form-item>
                    <el-form-item label="加班工時成本" >
                        <el-input v-model="form.overtime_hours_cost" type="number" style="width:200px;"><template slot="append">元</template></el-input>
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
import { dayItemService } from "@/_services";

export default {
    name: "pay_order",
    components: {
    },
    data(){
        return {
            tbkey:0,
            activeNames:"",
            itemKey:0,
            tbKey:0,
            tableData: [],

            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10, 20],
            start_row:0,
            sort_column:"month",
            sort:"desc",
            
            action_list:localStorage.getItem("ms_user_actions"),
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            username:localStorage.getItem("ms_username"),

            loading:false,
            dialog_loading:false,
            
            dlKey:0,
            deleteID:null, 
            deleteView:false,
            createView:false,
            updateView:false,
            copyView:false,

            uploadVisible:false,
            fileTemp:null,
            file:null,
            da:[],
            dalen:0,
            upload_month:"",
            replaceFileList:"",
            filter:{
                item_id:[],
                month:[]
            },
            
         
            form:{
                month:"",
                project_id:"",
                normal_hours:0,
                overtime_hours:0,
                normal_hours_cost:0,
                overtime_hours_cost:0
            },

            pay_order_history:[],

            option:{
                projects:[],
                
            
            },
           
            rules: {
              
            },
        }
    },

    async created(){
        // await this.get_dept_employee();
        await this.getOption();
        await this.getData();
    },

    computed: {
        showTitle(){
            if(this.createView) return "新增專案工時成本";
            else if(this.updateView) return "更新專案工時成本";
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else return false;
        },
        
        today(){
            let time =new Date();
            return time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },
    }, 
    
    methods: {
        handleDownloadSample(){
            this.dialog_loading = true;
            dayItemService.downlaod_cost_sample({}).then(response => {
                // console.log(response);
                const link = document.createElement('a');
                let blob = new Blob([response.data], {type: 'application/pdf'});
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);//创建url对象
                link.download = "專案工時成本上傳範本.csv"
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);//销毁url对象
                // this.cancelQuestDialog();
                this.dialog_loading = false;
            }).catch(err => {
                console.log(err);
                // this.cancelQuestDialog();
                this.dialog_loading = false;
            })
            this.dialog_loading = true;
        },
        handleUploadRemove(file, fileList){
            console.log("Remove");
            this.da = null;
            this.dalen = 0;
            this.fileTemp = null;
            this.file = null;
        },
        handleUploadChange(file, fileList) {
            this.da = [];
            this.dalen = 0;

            this.fileTemp = file.raw;
            if (this.fileTemp) {
                if(this.fileTemp.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || this.fileTemp.type == "application/vnd.ms-excel") {
                    this.importfxx(this.fileTemp);
                }else{
                    this.$message({
                        type: "warning",
                        message: "檔案格式错誤，請重新上傳",
                    });
                }
            }else{
                this.$message({
                    type: "warning",
                    message: "請上傳檔案！",
                });
            }
        },
        importfxx(obj) {
            let _this = this;
            // let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
            this.file = event.currentTarget.files[0];

            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;

            var reader = new FileReader(); //if (!FileReader.prototype.readAsBinaryString) {
            FileReader.prototype.readAsBinaryString = function (f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require("xlsx");
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                            //手动转化
                            type: "base64",
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: "binary",
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                    console.log("上傳數據內文：");
                    console.log(outdata); //此处可对数据进行处理
                    let arr = [];
                    outdata.map((v) => {
                        let obj = {};
                        obj.project_name = v["專案名稱"];
                        obj.normal_worktime = v["一般工時"];
                        obj.over_worktime = v["加班工時"];
                        obj.normal_worktime_cost = v["一般總成本"];
                        obj.over_worktime_cost = v["加班總成本"];
                        arr.push(obj);
                    });
                    _this.da = arr;

                    _this.dalen = arr.length;
                    return arr;
                };
                reader.readAsArrayBuffer(f);
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },

        create_UUID(len) {
            let text = ""
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            for( let i=0; i < len; i++ ) {
                text += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            // console.log(text);
			return text
		},

        stateFormat(row, column, cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
		},
        handleUpload(){
            this.uploadVisible = true;
        },
        confirmUpload(){
            if(!this.upload_month){
                return this.$message.error("請選擇月份")
            };
            if(!this.dalen){
                return this.$message.error("請上傳檔案")
            };
            dayItemService.upload_worktime_cost({month:this.upload_month, data:this.da, odoo_employee_id:this.odoo_employee_id}).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("Success") 
                }else{
                    this.$message.error(res.msg)
                } 
            })
        },
        cancelUpload(){
            this.uploadVisible = false;
            this.handleUploadRemove("","");
            this.upload_month = "";
        },

        async handleCreate(){
            this.form = {
                month:"",
                project_id:"",
                normal_hours:0,
                overtime_hours:0,
                normal_hours_cost:0,
                overtime_hours_cost:0,
                odoo_employee_id: this.odoo_employee_id
            };
            this.createView=true;
        },

        async handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.odoo_employee_id = this.odoo_employee_id;
            this.edit_idx=index;
            this.updateView=true;
        },
        handleDelete(index, row){
            this.deleteInfo={
                month:row.month,
                project_id:row.project_id
            };
            this.deleteView=true;
        },

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){ this.start_row-=this.page_size }
            this.getData();
        },

        cancelDelete(){
            this.deleteInfo={
                month:null,
                project_id:null
            };
            this.deleteView=false;
        },

        confirmDelete(){
            var param = {
                action:"delete",
                form:this.deleteInfo
            }
            this.update_cost_data(param);
        },

        async update_cost_data(param){ 
            this.dialog_loading=true;
            await dayItemService.update_cost_data(param).then(res =>{ 
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
                    this.update_cost_data(param);
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
            this.form={};
            this.edit_idx=null;
            this.$refs.form.clearValidate();
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
                action:"table",
                filter:{
                    sort_column:this.sort_column,
                    sort:this.sort,
                    start_row:this.start_row,
                    page_size:this.page_size,
                    month:this.filter.month,
                    item_id:this.filter.item_id
                }
            }
            await dayItemService.get_project_worktime_cost(param).then(res =>{
                console.log(res); 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
            this.loading=false;
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["work_item_now"]}).then(res =>{ 
                this.option.projects=res.work_item_now;
            });
        }
    }
}
</script>
<style>
    .el-upload {
        border: none;
        background-color: transparent;
        height: 40px;
        width: 150px;
    }
    .el-upload-dragger{
        height: 40px;
        width: 150px;
    }
    .el-upload--text{
        height: 40px;
        width: 150px;
    }
</style>
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
        margin-right:10px;
    }
    .card-header-r-btn{
        position:relative;
        float:right;
        margin-top:-10px;
    }
</style>