<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.daily_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.day_item_review')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="5">
                    <el-card shadow="hover" body-style="padding:10px" class="mgb10 mgr10" style="height:705px;">
                        <div slot="header" class="clearfix">
                            <span>{{$t('employee.dept_tree')}}</span>
                        </div>
                        <div class="tree_filter">
                            <el-input :placeholder="$t('btn.search')" v-model="filterText" clearable/>
                        </div>
                        <div class="scrollBar">
                            <el-scrollbar ref="scroll" wrap-class="list" view-class="view-box" :native="false" style="height:605px;">
                                <el-tree class="filter-tree" node-key="label" ref="tree_data" highlight-current default-expand-all :expand-on-click-node="false"
                                :data="tree_data" :props="defaultProps" :filter-node-method="filterNode" :default-expanded-keys="this.expand_key"
                                @node-click="handleNodeClick" @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse">
                                    <span class="custom-tree-node" slot-scope="{node, data}">
                                        <span class="node_label_1" v-if="node.level===1">{{node.label}}</span>
                                    </span>
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </el-card>
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
            expand_key:[],
            tree_data:[],
            filterText:"",
            defaultProps: {
                children:"children",
                label:"label",
                level:"level",
            },

            odoo_user_id:localStorage.getItem("ms_odoo_user_id"),
            fullname:localStorage.getItem("ms_user_fullname"),
            deptname:"",
            tbKey:0,
            dlKey:0,
            table_loading:false,
            tableData: [],
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
                pid:localStorage.getItem("ms_odoo_user_id"),
                item_id:null,
                work_date:"",
            },
            deleteView:false,
            createView:false,
            updateView:false,
            filter:{
                item_id:null,
                work_date:[],
                pid:localStorage.getItem("ms_odoo_user_id"),
            },
            edit_idx:null,
            form:{
                pid:localStorage.getItem("ms_odoo_user_id"),
                p_name:localStorage.getItem("ms_user_fullname"),
                item_id:"",
                work_date:"",
                work_hours:"",
                description:"",
            },
            option:{
                work_item:[]
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
                work_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                item_id: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur", "change"]},
                ],
                work_hours: [
                    {pattern: /^[0-9.]+$/, message: `${this.$t('rules.only_numbers')} [0123456789.]`, trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
            },
        }
    },

    async created(){
        // await this.getOption();
        // await this.getData();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },
    },    
    
    methods: {
        filterNode(value, data){
            if(!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        handleNodeExpand(data){
            let flag = false
            this.expand_key.some(item => {
                if(item === data.label){
                    flag = true;
                    return true
                }
            })
            if(!flag){
                this.expand_key.push(data.label);
            }
        },

        handleNodeCollapse(data){
            this.expand_key.some((item, i) => {
                if (item === data.label) {
                    this.expand_key.splice(i, 1);
                }
            })
        },

        handleNodeClick(data){

        },

        cancelDialog(){
            this.resetForm();
            this.createView=false;
            this.updateView=false;
        },

        resetForm(){
            this.dlKey++;
            this.form={
                pid:this.odoo_user_id,
                p_name:this.fullname,
                item_id:"",
                work_date:"",
                work_hours:"",
                description:"",
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
            await dayItemService.person_day_list(param).then(res =>{ 
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

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                item_id:null,
                work_date:[],
                pid:this.odoo_user_id
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
    .clearfix{
        position:relative;
        line-height:1.23;
        font-size: 16px;
    }
    .custom-tree-node{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 15px;
    }
    .scrollBar{ 
        height:588px; 
        overflow:hidden; 
    } 
    .list{ 
        max-height:10px; 
    }
    .custom-tree-node >>> .node_label_1{
        width:150px; 
    }
    .custom-tree-node >>> .node_label_2{
        width:100px; 
    }
    .node_icon >>> .el-button--mini.is-circle{
        padding: 4px;
    }
    .custom-tree-node >>> .node_label_1{
        width:150px; 
    }
    .custom-tree-node >>> .node_icon{
        justify-content: flex-end;
    }
    .node_plus{
        margin-right:-5px;
        z-index:2;
    }
    .filter-tree{
        z-index:1;
    }
    .filter-tree >>> .el-tree-node__content{
        height: 40px;
    }
    .tree_filter{
        margin:0px 0px 10px 10px;
        min-width:100px;
        width:95%;
    }
</style>