<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.task_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.day_item_review')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="5">
                    <el-card shadow="hover" body-style="padding:10px" class="mgr10" style="height:710px;">
                        <div slot="header" class="clearfix">
                            <span><b>{{$t('employee.dept_tree')}}</b></span>
                        </div>
                        <div class="tree_filter">
                            <el-input :placeholder="$t('btn.search')" v-model="filterText" style="width:50%;" clearable :disabled="tree_loading"/>
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
                <el-col :span="19">
                    <el-tabs v-model="activeTabs" type="border-card" @tab-click="handleTabClick" style="min-height:710px;">
                        <el-tab-pane :label="$t('employee.daily_details')" name="daily_details">
                            <div v-if="activeTabs=='daily_details'">
                            <el-select size="large" class="mgr10 handle-input" v-model="filter.pid" filterable clearable multiple collapse-tags
                            :placeholder="$t('employee.name')" :disabled="table_loading||tree_loading" @change="search">
                                <el-option-group v-for="group in option.employee" :key="group.id" :label="group.name">
                                    <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
                                        <span class="mgl10">{{item.name}}</span>
                                    </el-option>
                                </el-option-group>
                            </el-select>
                            <el-select size="large" class="mgr10 handle-input" v-model="filter.item_id" filterable clearable multiple collapse-tags
                            :placeholder="$t('project.name')" :disabled="table_loading||tree_loading" @change="search">
                                <el-option v-for="item in option.work_item" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                            </el-select>
                            <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" 
                            :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"
                            :disabled="table_loading||tree_loading" @change="search" class="mgr10" size="large"/>
                            <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading||tree_loading"/>
                            <el-table :data="tableData" border class="table mgt10" ref="multipleTable" tooltip-effect="light" height="521" v-loading="table_loading"
                            @sort-change="handleSortChange" :span-method="dateCellMerge" :cell-style="getCellStyle" :key="tbKey">
                                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="150" show-overflow-tooltip>
                                    <template slot-scope="scope">{{scope.row.work_date}} ({{$t(`employee.dayofweek.${scope.row.day_of_week}`)}})</template>
                                </el-table-column>
                                <el-table-column prop="p_name" :label="$t('employee.name')" width="90" show-overflow-tooltip/>
                                <el-table-column prop="dept_name" :label="$t('employee.dept')" width="120" show-overflow-tooltip/>
                                <el-table-column prop="item_id" :label="$t('project.name')" width="200" show-overflow-tooltip>
                                    <template slot-scope="scope">{{scope.row.item_name}}</template>
                                </el-table-column>
                                <el-table-column prop="description" :label="$t('employee.description')" width="auto">
                                    <template slot-scope="scope">
                                        <el-tooltip effect="light" placement="top">
                                            <div v-html="scope.row.description.replaceAll('\n', '<br/>')" slot="content"></div>
                                            <div class="one-line">{{scope.row.description}}</div>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="work_hours" :label="$t('employee.table_work_hour')" width="100" align="right" header-align="left"/>
                                <el-table-column prop="total_work_hour" :label="$t('employee.table_total_work_hour')" width="120" align="right" header-align="left"/>
                                <el-table-column prop="comp_time" :label="$t('overtime.table_comp_time')" width="100" align="right" header-align="left">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.comp_time>0">{{scope.row.comp_time}}</span><span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="total_comp_time" :label="$t('overtime.table_total_comp_time')" width="120" align="right" header-align="left"/>
                            </el-table>
                            <div class="pagination">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                                :disabled="table_loading||tree_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
                            </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { dayItemService } from "@/_services";
export default {
    name: "day_item_review",
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

            activeTabs:"daily_details",
            get_data_sig:false,
            node_click_sig:false,
            reset_sig:false,
            all_sig:false,

            table_loading:false,
            tableData:[],
            totalRow:0,
            spanArr:[],
            pos:null,
            tbKey:0,
            cur_page:1,
            page_size:20,
            page_size_list:[20, 50, 100],
            start_row:0,
            sort_column:"work_date",
            sort:"desc",
            filter:{
                item_id:null,
                work_date:[],
                dept_id:[],
                pid:[],
            },
            option:{
                work_item:[],
                employee:[],
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
        await this.get_dept_tree();
        await this.getOption();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
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
                    if(
                        (data[i].work_date===data[i-1].work_date)
                        &&
                        (data[i].p_name===data[i-1].p_name)
                        &&
                        (data[i].dept_name===data[i-1].dept_name)
                    ){
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
            if(["work_date", "p_name", "dept_name", "total_work_hour", "total_comp_time"].includes(column.property)){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
        },

        getCellStyle({row, column}){
            const tempWidth=column.realWidth||column.width;
            var return_dict = {};
            return_dict["minWidth"]=`${tempWidth}px`;
            return_dict["maxWidth"]=`${tempWidth}px`;
            if(column.property=="total_work_hour"){
                return_dict["color"]="green";
                if(row.total_work_hour<8){
                    return_dict["color"]="red";
                };
            };
            return return_dict;
        },

        async handleTabClick(tab, event){
            // if(this.activeTabs!=tab.name) this.activeTabs=tab.name;
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
                // for(var dept of this.tree_data){
                //     dept.disabled=true;
                // };
            })
            await this.allCheckBox();
            this.tree_loading=false;
        },
        
        async getData(){
            console.log("get data !")
            this.table_loading=true;
            var param = {
                action:"table",
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                username:this.username,
                odoo_employee_id:this.odoo_employee_id,
                filter:this.filter
            }
            await dayItemService.review_day_list(param).then(res =>{ 
                this.tableData=res.day_items;
                this.totalRow=res.total;
                this.getSpanArr(this.tableData);
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
    .container{
        background-color:#f0f0f0;
        padding:15px;
    }
    .handle-input{
        width:280px;
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
    .pagination{
        margin:15px 0;
        text-align:right;
    }
    .container{
        margin-right:10px;
    }
    .one-line{
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }
</style>