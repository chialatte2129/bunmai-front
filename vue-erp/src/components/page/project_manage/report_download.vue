<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.task_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.project_report_download')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="6">
                    <el-card shadow="hover" body-style="padding:10px" class="mgr10" style="height:710px;">
                        <div slot="header" class="clearfix">
                            <span><b>專案清單</b></span>
                        </div>
                        <div class="tree_filter">
                            <el-input :placeholder="$t('btn.search')" v-model="filterText" style="width:60%;" clearable :disabled="tree_loading"/>
                            <el-button type=primary plain v-html="$t('btn.all_select')" class="mgl10" :disabled="tree_loading" @click="allCheckBox"/>
                            <el-button type=info plain v-html="$t('btn.reset')" :disabled="tree_loading" @click="resetCheckBox"/>
                        </div>
                        <div class="scrollBar" v-loading="tree_loading">
                            <el-scrollbar ref="scroll" wrap-class="list" view-class="view-box" :native="false" style="height:610px;">
                                <el-tree class="filtered-tree" 
                                node-key="value" 
                                ref="tree_data" 
                                highlight-current 
                                show-checkbox 
                                :expand-on-click-node="false"
                                :data="tree_data" 
                                :props="defaultProps" 
                                :filter-node-method="filterNode" 
                                :default-expanded-keys="this.expand_key"
                                :render-content="renderContent"
                                @node-click="handleNodeClick" 
                                @check-change="handleCheckChange">
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="6">
                    <varDeptTree @result_change="handleDeptChange"/>
                </el-col>

                <el-col :span="12">
                    <el-tabs v-model="activeTabs" type="border-card" @tab-click="handleTabClick" style="min-height:710px;">
                        <el-tab-pane label="月份" name="month">
                            <div style="margin-left:20px;">
                                <div style="margin-top:20px;">
                                    <el-select v-model="select_month" 
                                    filterable
                                    :default-first-option="true"
                                    placeholder="請選擇報表月份">
                                        <el-option
                                            v-for="item in month_options"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                                <el-button type="primary" style="margin-top:20px;width:200px;" @click="handleGetReport('month')">產生報表</el-button>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="自訂期間" name="custome">
                            <div style="margin-left:20px;">
                                <div style="margin-top:20px;">
                                    <el-date-picker
                                    v-model="select_date_range"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="開始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions">
                                    </el-date-picker>
                                </div>
                                <el-button type="primary" style="margin-top:20px;width:200px;" @click="handleGetReport('custome')">產生報表</el-button>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="全部" name="all">
                            <div style="margin-left:20px;">
                                <div style="margin-top:20px;">
                                    <span style="font-size:16px;color:red;">
                                        產生指定專案的所有彙報紀錄(不限時間)
                                    </span>
                                </div>
                                <div style="margin-top:20px;">
                                    <el-button type="primary" style="width:200px;" @click="handleGetReport('all')">產生報表</el-button>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </div>
        <el-dialog :title="'預覽 - Total '+ totalRow" width="90%"
        :visible.sync="previewView"  :before-close="cancelDialog" :close-on-click-modal="false" :key="dlKey">
            <download-excel
            class="el-button el-button--success el-button--small is-plain"
            :before-generate="startDownload" 
            :before-finish="finishDownload"
            :fetch="fetchData"
            :name="getToday()+'_'+download_name">{{$t('btn.download_excel')}}</download-excel>
            <el-button type="primary" plain style="margin-top:20px;width:200px;" @click="handleDownlaodCostReport()">下載成本結算表</el-button>
            <el-table
            :data="tableData"
            @sort-change="sortChange"
            style="width: 100%">
                <el-table-column prop="Project ID" label="專案ID" sortable width="100"></el-table-column>
                <el-table-column prop="Project Name" label="專案名稱" sortable width="200"></el-table-column>
                <el-table-column prop="Work Date" label="工作日期" sortable width="120"></el-table-column>
                <el-table-column prop="Dept Name" label="部門名稱" width="180"></el-table-column>
                <el-table-column prop="Worker Name" label="員工名稱"  width="100"></el-table-column>
                <el-table-column prop="Work Hours" label="工作時數"  align="right" width="100"></el-table-column>
                <el-table-column prop="Description" label="備註"  width="auto"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { dayItemService } from "@/_services";
import { workItemService } from "@/_services";
import varDeptTree from "./var_dept_tree.vue";
import { Loading } from 'element-ui';

export default {
    name: "report_download",
    components:{
        varDeptTree
    },
    
    data(){
        return {
            download_name:"專案細項報表",
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            username:localStorage.getItem("ms_username"),
            tree_loading:false,
            expand_key:["F","P","A","D"],
            tree_data:[],

            current_type:"",
            month_options:[],
            select_month:"",
            select_date_range:"",

            filterText:"",
            dlKey:1,
            defaultProps: {
                children:"children",
                label:"label",
                level:"level",
                value:"value"
            },

            activeTabs:"month",
            get_data_sig:false,
            node_click_sig:false,
            reset_sig:false,
            all_sig:false,
            proptype:"",
            table_loading:false,
            tableData:[],
            totalRow:0,
            filter:{
                project_id:[],
                dept_id:[]
            },
            option:{
                work_item:[],
                employee:[],
            },
            previewView:false,
            form:{},
            pickerOptions:{
                disabledDate(time){
                    return time.getTime() > Date.now();
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
        }
    },

    watch:{
        filterText(val){
            this.$refs.tree_data.filter(val);
        }
    },

    async created(){
        await this.get_tree();
        await this.getOption();
        await this.genLast12Month();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },
        
    },    
    
    methods: {

        
        getToday(){
            var Today=new Date();
            return  Today.getFullYear()+"-"+(Today.getMonth()+1)+"-"+Today.getDate() 
        },
        //排序触发事件
        sortChange(column){
            if(column.prop){
                this.proptype = column.prop;// 将键名prop赋值给变量proptype
            }else{
                this.defaultSortData()
            };
            if(column.order === 'ascending'){
                this.tableData.sort(this.ascSortFun)
            }else if(column.order === 'descending'){
                this.tableData.sort(this.desSortFun)
            }else{
                //取消排序則重新获取列表，恢复默認状态。
                this.defaultSortData()
            };
        },
        //升序排列方法
        ascSortFun(a, b) {
            if(this.proptype=="Project ID"){
                return ('' + a[this.proptype]).localeCompare(b[this.proptype]);
            }else if(this.proptype=="Work Date"){
                return ('' + a[this.proptype]).localeCompare(b[this.proptype]);
            }else if(this.proptype=="Project Name"){
                return ('' + a[this.proptype]).localeCompare(b[this.proptype]);
            }else if(this.proptype=="Dept Name"){
                return ('' + a[this.proptype]).localeCompare(b[this.proptype]);
            }else{
                return a[this.proptype] - b[this.proptype];
            }
        },
        //降序排列方法
        desSortFun(a,b){
            if(this.proptype=="Project ID"){
                return ('' + b[this.proptype]).localeCompare(a[this.proptype]);
            }else if(this.proptype=="Work Date"){
                return ('' + b[this.proptype]).localeCompare(a[this.proptype]);
            }else if(this.proptype=="Project Name"){
                return ('' + b[this.proptype]).localeCompare(a[this.proptype]);
            }else if(this.proptype=="Dept Name"){
                return ('' + b[this.proptype]).localeCompare(a[this.proptype]);
            }else{
                return b[this.proptype] - a[this.proptype];
            }
        },
        genLast12Month(){
            var today = new Date();
            var month_count = 24;
            var end_year = today.getFullYear();
            var end_month = today.getMonth()+1;

            var month_list = [];
            for(var i=0;i<month_count;i++){
                var year_month =String(end_year)+'-'+String(end_month).padStart(2,"0")
                month_list.push(year_month)
                if(end_month==1){
                    end_month=12;
                    end_year-=1;
                }else{
                    end_month-=1;
                }
            };
            this.month_options = month_list;
        },
        async startDownload(){
            this.download_data=[];
        },
        finishDownload(){
            this.download_data=[];
        },
        fetchData(){
            return this.tableData
        },

        handleGetReport(type){
            if(!this.filter.project_id.length){
                return this.$message.error("請選擇專案"); 
            };
            if(!this.filter.dept_id.length){
                return this.$message.error("請選擇部門"); 
            };
            this.getData(type);
        },
        async handleTabClick(tab, event){
            // if(this.activeTabs!=tab.name) this.activeTabs=tab.name;
        },

        resetCheckBox(){
            console.log("reset checklist");
            this.filterText="";
            this.filter.project_id=[];
            this.$refs.tree_data.setCheckedKeys([]);
        },

        allCheckBox(){
            this.filterText="";
            for(var item of this.$refs.tree_data.data){
                if(!this.$refs.tree_data.getNode(item).checked){
                    this.$refs.tree_data.setChecked(item, true);
                    if(item.children){
                        item.children.forEach(element => {
                            this.$refs.tree_data.setChecked(element, true);
                            this.handleCheckChange(element,true,"");
                        });
                    }
                }
            };
        },

        handleCheckChange(data, checked, indeterminate){
           
            if(checked){
                if(!this.filter.project_id.includes(data.value)){
                    if(data.level==2 ){
                        if(this.filterText){
                            if(data.label.includes(this.filterText)){
                                
                                this.filter.project_id.push(data.value);
                            }
                        }else{
                            this.filter.project_id.push(data.value);
                        }
                    }
                };
            }else{
                var pos = this.filter.project_id.indexOf(data.value);
                if(pos != -1) this.filter.project_id.splice(pos, 1);
            };                        
        },

        handleNodeClick(data){
            this.$refs.tree_data.setChecked(data, !this.$refs.tree_data.getNode(data).checked);            
            if(data.children){
                data.children.forEach(element => {
                    if(this.filterText){
                        if(data.label.includes(this.filterText)){
                            this.$refs.tree_data.setChecked(element, !this.$refs.tree_data.getNode(element).checked);
                        }
                    }else{
                        this.$refs.tree_data.setChecked(element, !this.$refs.tree_data.getNode(element).checked);
                    }
                });
            }
        },

        filterNode(value, data){
            if(!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        handleView(index, row){
            this.form=Object.assign({}, row);
            this.previewView=true;
        },

        cancelDialog(){
            this.dlKey++;
            this.form={};
            this.previewView=false;
        },

        async get_tree(){
            this.tree_loading=true;
            await workItemService.get_tree().then(res =>{ 
                this.tree_data=res.data;
            })
            // await this.allCheckBox();
            this.tree_loading=false;
        },
        
        async defaultSortData(){
            console.log("Default Sort Data");
            await workItemService.downlaod_data(this.last_params).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
        },
        async getData(type){
            console.log(type);
            this.current_type = type;
            this.last_params={};
            var filter = {
                projects:this.filter.project_id,
                dept:this.filter.dept_id
            };
            if(type=="month"){
                if(this.select_month){
                    filter.time=this.select_month;
                }else{
                    return this.$message.error("請選擇月份");
                }
            }else if(type=="custome"){
                if(this.select_date_range.length){
                    filter.time=this.select_date_range;
                }else{
                    return this.$message.error("請選擇日期");
                }
            }else{
                filter.time="";
            }
            console.log(filter);

            let loadingInstance = Loading.service({
                lock: true,
                text: '產生報表中.....',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.last_params = {"type":type,"filter":filter}
            console.log(this.last_params.filter.time);   
            await workItemService.downlaod_data({"type":type,"filter":filter}).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
            });
            this.previewView = true;
            console.log(this.handleGenFileName());
        },
        handleGenFileName(){
            var fileInfo = "";
            if(this.current_type=="month"){
                fileInfo = this.last_params.filter.time+"-";
            }else if(this.current_type=="custome"){
                fileInfo = "["+this.last_params.filter.time.join("-")+"]-";
            }else{
                fileInfo = "ALL-"
            }
            var filename = "ProjectCostReport"
            return fileInfo+filename+".xlsx"
        },
        async handleDownlaodCostReport(){   
            let loadingInstance = Loading.service({
                lock: true,
                text: '產生報表中.....',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            await workItemService.downlaod_cost_data(this.last_params)
            .then(response => {
                console.log(response);
                const link = document.createElement('a');
                let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'});
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);//创建url对象
                link.download = this.handleGenFileName()
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);//销毁url对象
            }).catch(err => {
                console.log(err);
            })

            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
            });
            
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["work_item"]}).then(res =>{ 
                this.option.work_item=res.work_item;
            }) 
        },

      
        search(){
            this.handleCurrentChange(1);
        },
        
        renderContent(h, { node, data, store }) {            
            if(node.level == 2){
                return (
                    <span class="custom-tree-node">
                        <span>{data.label}</span>
                    </span>
                );
            }else{
                return (
                    <span class="custom-tree-node">
                        <span style="font-size:16px"><b>{data.label}</b></span>
                    </span>
                );
            }
        },
        handleDeptChange(data){
            this.filter.dept_id = data.checked_id;
        },
    }
}
</script>
<style scoped>
    .container{
        background-color:#f0f0f0;
        padding:15px;
    }
    .handle-input{
        width: 280px;
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
        height:593px; 
        overflow:hidden; 
    } 
    .list{ 
        max-height:10px; 
    }
    .custom-tree-node >>> .node_label_1{
        width:150px;
        line-height:26px;
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
</style>