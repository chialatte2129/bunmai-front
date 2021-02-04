<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.overtime_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.overtime_process')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="6">
                    <el-card shadow="hover" body-style="padding:10px" class="mgr10" style="height:710px;">
                        <div slot="header" class="clearfix">
                            <span><b>{{$t('employee.dept_tree')}}</b></span>
                        </div>
                        <div class="tree_filter">
                            <el-input :placeholder="$t('btn.search')" v-model="filterText" style="width:60%;" clearable :disabled="tree_loading"/>
                            <el-button type=primary plain v-html="$t('btn.all_select')" class="mgl10" :disabled="tree_loading" @click="allCheckBox"/>
                            <el-button type=info plain v-html="$t('btn.reset')" :disabled="tree_loading" @click="resetCheckBox"/>
                        </div>
                        <div class="scrollBar" v-loading="tree_loading">
                            <el-scrollbar ref="scroll" wrap-class="list" view-class="view-box" :native="false" style="height:610px;">
                                <el-tree class="filtered-tree" node-key="id" ref="tree_data" highlight-current show-checkbox :expand-on-click-node="false"
                                :data="tree_data" :props="defaultProps" :filter-node-method="filterNode" :default-expanded-keys="this.expand_key" @check="handleCheck"
                                @node-click="handleNodeClick" @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse" @check-change="handleCheckChange">
                                    <span class="custom-tree-node" slot-scope="{node, data}">
                                        <span class="node_label_1" v-if="node.level===1">{{node.label}}</span>
                                    </span>
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <el-tabs v-model="activeTabs" type="border-card" @tab-click="handleTabClick" style="min-height:710px;">
                        <el-tab-pane :label="$t('overtime.to_be_processed')" name="to_be_processed" :disabled="count_loading" :key="tabKey">
                            <div v-if="activeTabs=='to_be_processed'">
                            <el-button size="large" type="success" v-html="$t('common_msg.pass')" @click="passVisible=true" :disabled="count_loading||multipleSelection.length==0"/>
                            <el-button size="large" type="danger" class="mgr10" v-html="$t('common_msg.reject')" @click="rejectVisible=true" :disabled="count_loading||multipleSelection.length==0"/>
                            <el-select size="large" class="mgr10 handle-input-pid" v-model="filter.pid" filterable clearable multiple collapse-tags
                            :placeholder="$t('employee.name')" :disabled="count_loading" @change="search">
                                <el-option-group v-for="group in option.employee" :key="group.id" :label="group.name">
                                    <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled||parseInt(odoo_employee_id)==item.id">
                                        <span class="mgl10">{{item.name}}</span>
                                    </el-option>
                                </el-option-group>
                            </el-select>
                            <el-select size="large" class="mgr10 handle-input-item_id" v-model="filter.item_id" filterable clearable multiple collapse-tags
                            :placeholder="$t('project.name')" :disabled="count_loading" @change="search">
                                <el-option v-for="item in option.work_item" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                            </el-select>
                            <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" 
                            :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"
                            :disabled="count_loading" @change="search" class="mgr10" size="large"/>
                            <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="count_loading"/>
                            <el-table :data="tableData" border class="table mgt10" ref="multipleTable" tooltip-effect="light" height="532" v-loading="table_loading"
                            @sort-change="handleSortChange" @selection-change="handleSelectionChange":key="tbKey">
                                <el-table-column type="selection" width="40" align="center"/>
                                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="115" sortable="custom" align="center" show-overflow-tooltip/>
                                <el-table-column prop="form_id" :label="$t('overtime.form_id')" width="135" sortable="custom" show-overflow-tooltip/>
                                <el-table-column prop="p_name" :label="$t('employee.name')" width="100" show-overflow-tooltip/>
                                <el-table-column prop="dept_name" :label="$t('employee.dept')" width="130" show-overflow-tooltip/>
                                <el-table-column prop="item_id" :label="$t('project.name')" width="200" show-overflow-tooltip>
                                    <template slot-scope="scope">{{scope.row.item_name}}</template>
                                </el-table-column>
                                <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                                <el-table-column prop="comp_time" :label="$t('overtime.comp_time')" width="105" align="right" header-align="left"/>
                                <el-table-column type="expand" width="40">
                                    <template slot-scope="props">
                                        <el-form label-position="left" label-width="85px">
                                            <el-form-item :label="$t('employee.description')"><p style="white-space:pre-wrap;word-break:break-all;">{{props.row.description}}</p></el-form-item>
                                        </el-form >
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                                :disabled="count_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
                            </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('overtime.processed')" name="processed" :disabled="count_loading" :key="tabKey+1000">
                            <div v-if="activeTabs=='processed'">
                            <el-select size="large" class="mgr10 handle-input-pid" v-model="temp_status" filterable clearable multiple collapse-tags
                            :placeholder="$t('overtime.overtime_status')" :disabled="count_loading" @change="search">
                                <el-option v-for="item in option.status" :key="item.key" :label="$t(`overtime.status.${item.key}`)" :value="item.key" :style="activeStyle(item.key)"/>
                            </el-select>
                            <el-select size="large" class="mgr10 handle-input-pid" v-model="filter.pid" filterable clearable multiple collapse-tags
                            :placeholder="$t('employee.name')" :disabled="count_loading" @change="search">
                                <el-option-group v-for="group in option.employee" :key="group.id" :label="group.name">
                                    <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled||parseInt(odoo_employee_id)==item.id">
                                        <span class="mgl10">{{item.name}}</span>
                                    </el-option>
                                </el-option-group>
                            </el-select>
                            <el-select size="large" class="mgr10 handle-input-item_id" v-model="filter.item_id" filterable clearable multiple collapse-tags
                            :placeholder="$t('project.name')" :disabled="count_loading" @change="search">
                                <el-option v-for="item in option.work_item" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                            </el-select>
                            <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" 
                            :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"
                            :disabled="count_loading" @change="search" class="mgr10" size="large"/>
                            <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="count_loading"/>
                            <el-table :data="tableData" border class="table mgt10" ref="multipleTable" tooltip-effect="light" height="532" v-loading="table_loading"
                            :row-class-name="tableRowClassName" @sort-change="handleSortChange" @selection-change="handleSelectionChange":key="tbKey">
                                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="115" sortable="custom" align="center" show-overflow-tooltip/>
                                <el-table-column prop="form_id" :label="$t('overtime.form_id')" width="135" sortable="custom" show-overflow-tooltip/>
                                <el-table-column prop="p_name" :label="$t('employee.name')" width="100" show-overflow-tooltip/>
                                <el-table-column prop="dept_name" :label="$t('employee.dept')" width="130" show-overflow-tooltip/>
                                <el-table-column prop="item_id" :label="$t('project.name')" width="200" show-overflow-tooltip>
                                    <template slot-scope="scope">{{scope.row.item_name}}</template>
                                </el-table-column>
                                <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                                <el-table-column prop="comp_time" :label="$t('overtime.comp_time')" width="105" align="right" header-align="left"/>
                                <el-table-column prop="status" :label="$t('overtime.overtime_status')" width="80" show-overflow-tooltip>
                                    <template slot-scope="scope">{{$t(`overtime.status.${scope.row.status}`)}}</template>
                                </el-table-column>
                                <el-table-column type="expand" width="40">
                                    <template slot-scope="props">
                                        <el-form label-position="left" label-width="85px">
                                            <el-form-item :label="$t('employee.description')"><p style="white-space:pre-wrap;word-break:break-all;">{{props.row.description}}</p></el-form-item>
                                        </el-form >
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                                :disabled="count_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
                            </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </div>
        <el-dialog center width="500px" :title="$t('common_msg.warning')" :visible.sync="show_visible" :before-close="handleClose" :close-on-click-modal="false">
            <div class="dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> 
                <span v-if="passVisible"> {{$t('common_msg.ask_for_pass')}} ?</span>
                <span v-else> {{$t('common_msg.ask_for_reject')}} ?</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">{{$t('btn.cancel')}}</el-button>
                <el-button v-if="passVisible" type="primary" @click="handlePass">{{$t('btn.confirm')}}</el-button>
                <el-button v-else type="primary" @click="handleReject">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { dayItemService, overtimeService } from "@/_services";
export default {
    name: "overtime_process",
    data(){
        return {
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            username:localStorage.getItem("ms_username"),
            tree_loading:false,
            checked_id:[],
            expand_key:[],
            tree_data:[],
            filterText:"",
            defaultProps: {
                children:"children",
                label:"complete_name",
                level:"level",
            },

            activeTabs:("tabs" in this.$route.query)?this.$route.query.tabs:"to_be_processed",
            get_data_sig:false,
            node_click_sig:false,
            reset_sig:false,
            all_sig:false,

            table_loading:false,
            passVisible:false,
            rejectVisible:false,
            tableData:[],
            totalRow:0,
            tbKey:0,
            tabKey:0,
            spanArr:[],
            pos:0,
            cur_page:1,
            page_size:50,
            page_size_list:[50, 100],
            start_row:0,
            sort_column:"work_date",
            sort:"desc",
            filter:{
                item_id:null,
                work_date:[],
                dept_id:[],
                pid:[],
                status:[],
                source:["project"],
                category:["compensatory rest"],
            },
            temp_status:[],
            option:{
                work_item:[],
                employee:[],
                status:[
                    {key:"A"}, {key:"F"}, {key:"R"},
                ]
            },
            multipleSelection:[],
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
        }
    },

    watch:{
        filterText(val){
            this.$refs.tree_data.filter(val);
        },

        "filter.dept_id"(val){
            this.filter.pid=[];
        },

        get_data_sig(val){
            if(val){
                this.handleCurrentChange(1);
            }
            this.get_data_sig=false;
            this.node_click_sig=false;
            this.reset_sig=false;
            this.all_sig=false;
        },
    },

    async created(){
        this.$router.replace({ path:"overtime_process", query:this.getQuery() }).catch(err => {});
        await this.get_dept_tree();
        await this.getOption();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        count_loading(){
            return  this.table_loading||this.tree_loading;
        },

        show_visible(){
            if(this.passVisible) return true;
            else if(this.rejectVisible) return true;
            return false;
        },
    },    
    
    methods: {
        handleClose(){
            this.passVisible=false;
            this.rejectVisible=false;
        },

        async handlePass(){
            this.table_loading=true;
            var form_id_list=[];
            for(var row of this.multipleSelection){
                form_id_list.push(row.form_id);
            };
            await overtimeService.handle_pass({form_id_list:form_id_list}).then(res =>{ 
                if(res.code==1){
                    this.$message.success(this.$t("common_msg.pass")); 
                    this.multipleSelection=[];
                    this.handleCurrentChange(1);
                    this.handleClose();
                }else{
                    this.$message.success(this.$t(res.msg)); 
                };
            })
            this.table_loading=false;
        },

        async handleReject(){
            this.table_loading=true;
            var form_id_list=[];
            for(var row of this.multipleSelection){
                form_id_list.push(row.form_id);
            };
            await overtimeService.handle_reject({form_id_list:form_id_list}).then(res =>{ 
                if(res.code==1){
                    this.$message.success(this.$t("common_msg.reject")); 
                    this.multipleSelection=[];
                    this.handleCurrentChange(1);
                    this.handleClose();
                }else{
                    this.$message.error(this.$t(res.msg)); 
                };
            })
            this.table_loading=false;
        },

        activeStyle(status){
            if(status==="A"||status==="F") return "background:#FCFFF7;";
            return "background:#FFEDED;";
        },

        tableRowClassName({row, rowIndex}) {
            return `${row.status}-row`;
        },

        handleSelectionChange(val){
            this.multipleSelection=val;
        },

        getQuery(){
            var query = Object.assign({}, this.$route.query);
            query.tabs = this.activeTabs;
            return query
        },

        handleTabClick(tab, event){
            this.activeTabs=tab.name;
            this.tabKey++;
            this.tbKey++;
            this.cancelSearch();
            this.$router.replace({ path:"overtime_process", query:this.getQuery() }).catch(err => {});
        },

        resetCheckBox(){
            this.filterText="";
            this.checked_id=[];
            this.$refs.tree_data.setCheckedKeys([]);
            this.reset_sig=true;
        },

        allCheckBox(){
            this.filterText="";
            for(var row of this.$refs.tree_data.data){
                if(!this.$refs.tree_data.getNode(row).checked){
                    this.checked_id.push(row.id);
                    this.$refs.tree_data.setChecked(row, true);
                }
            };
            this.all_sig=true;
        },

        handleCheckChange(data, checked, indeterminate){
            // console.log("check change");
            if(checked){
                if(!this.checked_id.includes(data.id)){
                    this.checked_id.push(data.id);
                };
                if(!this.filter.dept_id.includes(data.id)){
                    this.filter.dept_id.push(data.id);
                };
                if(data.members.length==0){
                    data.members.push({id:"-100", name:this.$t("employee.nobody"), disabled:true});
                };
                this.option.employee.push(data);
                this.option.employee.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
            }else{
                var pos = this.checked_id.indexOf(data.id);
                if(pos!=-1) this.checked_id.splice(pos, 1);
                var pos = this.filter.dept_id.indexOf(data.id);
                if(pos!=-1) this.filter.dept_id.splice(pos, 1);
                var pos = this.option.employee.indexOf(data);
                if(pos!=-1) this.option.employee.splice(pos, 1);
            };
            if(this.all_sig&&this.filter.dept_id.length==this.tree_data.length){
                this.get_data_sig=true;
            };
            if(this.node_click_sig&&this.filter.dept_id.length==this.checked_id.length){
                this.get_data_sig=true;
            };
            if(this.reset_sig&&this.filter.dept_id.length==0){
                this.get_data_sig=true;
            };
        },

        async handleCheck(data){
            console.log("check")
            var flag = !this.$refs.tree_data.getNode(data).checked;
            await this.$refs.tree_data.setChecked(data, flag);
            await this.handleNodeClick(data);
        },

        async handleNodeClick(data){
            console.log("node click");
            var flag = !this.$refs.tree_data.getNode(data).checked;
            await this.handleClickSig(flag, data);
        },

        handleClickSig(flag, data){
            var complete_name = data.complete_name;
            var real_data = [];
            for(var row of this.$refs.tree_data.data){
                if(row.complete_name.includes(complete_name)){
                    if(flag){
                        if(!this.checked_id.includes(row.id)){
                            this.checked_id.push(row.id);
                        };
                    }else{
                        var pos = this.checked_id.indexOf(row.id);
                        if(pos!=-1) this.checked_id.splice(pos, 1);
                    };
                };
            };
            for(var row of this.tree_data){
                if(row.complete_name.includes(complete_name)){
                    real_data.push(row);
                };
            };
            for(var row of real_data){
                this.$refs.tree_data.setChecked(row, flag);
            };
            this.node_click_sig=true;
        },

        filterNode(value, data){
            if(!value) return true;
            return data.complete_name.indexOf(value) !== -1;
        },

        handleNodeExpand(data){
            let flag = false
            this.expand_key.some(item => {
                if(item === data.id){
                    flag = true;
                    return true
                }
            })
            if(!flag) this.expand_key.push(data.id);
        },

        handleNodeCollapse(data){
            this.expand_key.some((item, i) => {
                if(item === data.id) this.expand_key.splice(i, 1);
            })
        },

        async get_dept_tree(){
            this.tree_loading=true;
            var param = {
                odoo_employee_id:this.odoo_employee_id,
                username:this.username,
            }
            await dayItemService.get_dept_tree(param).then(res =>{ 
                this.tree_data=res.tree_data;
                this.tree_data.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
            })
            await this.allCheckBox();
            this.tree_loading=false;
        },
        
        async getData(){
            console.log("get data !")
            this.table_loading=true;
            this.filter.status=this.activeTabs=="processed"?(this.temp_status.length==0?["A", "F", "R"]:this.temp_status):["p"];
            var param = {
                action_type:"processing",
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                username:this.username,
                odoo_employee_id:this.odoo_employee_id,
                filter:this.filter
            }
            await overtimeService.get_overtime_log(param).then(res =>{ 
                this.tableData=res.logs;
                this.totalRow=res.total;
            })
            this.table_loading=false;
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["work_item"]}).then(res =>{ 
                this.option.work_item=res.work_item;
            }) 
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

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                item_id:null,
                work_date:[],
                dept_id:this.filter.dept_id,
                pid:[],
                status:this.activeTabs=="to_be_processed"?["p"]:["A", "F", "R"],
                source:["project"],
                category:["compensatory rest"],
            };
            this.temp_status=[];
            this.tbKey++;
            this.sort_column="work_date";
            this.sort="desc";
            this.handleCurrentChange(1);
        },
    }
}
</script>
<style scoped>
    .container{
        background-color:#f0f0f0;
        padding:15px;
    }
    .handle-input-pid{
        width: 175px;
        display:inline-block;
    }
    .handle-input-item_id{
        width: 280px;
        display:inline-block;
    }
    .dialog-cnt{
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
    .table >>> .el-table-column--selection .cell{
        padding-right:10px;
    }
    .table >>> .R-row {
        background:#FFEFEE;
    }
    .table >>> .F-row {
        background:#FCFFF7;
    }
    .table >>> .A-row {
        background:#FCFFF7;
    }
    .pagination{
        margin:10px 0;
        text-align:right;
    }
</style>