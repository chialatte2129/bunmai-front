<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.task_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.day_item_report_project')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="6">
                    <el-card shadow="hover" body-style="padding:10px" class="mgr10" style="min-height:710px;">
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
                <el-col :span="18">
                    <el-card shadow="hover" body-style="padding:10px" class="mgr10" style="min-height:710px;">
                        <div slot="header" class="clearfix">
                            <span><b>專案工時報告</b></span>
                        </div>
                        <div style="padding:20px;">
                            <template>
                                <el-table
                                    :data="tableData"
                                    @expand-change="handleExpand"
                                    style="width: 100%">
                                    <el-table-column type="expand">
                                    <template slot-scope="props">
                                        
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                    label="商品 ID"
                                    prop="id">
                                    </el-table-column>
                                    <el-table-column
                                    label="商品名称"
                                    prop="name">
                                    </el-table-column>
                                    <el-table-column
                                    label="描述"
                                    prop="desc">
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { dayItemService } from "@/_services";
import { workItemService } from "@/_services";
import { Loading } from 'element-ui';
export default {
    name: "day_item_review",
    data(){
        return {
            download_name:"專案細項報表",
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            username:localStorage.getItem("ms_username"),
            tree_loading:false,
            expand_key:["F","P","A","D"],
            tree_data:[],

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
            tableData: [
                {
                    id: '12987122',
                    name: '好滋好味鸡蛋仔',
                    category: '江浙小吃、小吃零食',
                    desc: '荷兰优质淡奶，奶香浓而不腻',
                    address: '上海市普陀区真北路',
                    shop: '王小虎夫妻店',
                    shopId: '10333'
                }, {
                    id: '12987123',
                    name: '好滋好味鸡蛋仔',
                    category: '江浙小吃、小吃零食',
                    desc: '荷兰优质淡奶，奶香浓而不腻',
                    address: '上海市普陀区真北路',
                    shop: '王小虎夫妻店',
                    shopId: '10333'
                }, {
                    id: '12987125',
                    name: '好滋好味鸡蛋仔',
                    category: '江浙小吃、小吃零食',
                    desc: '荷兰优质淡奶，奶香浓而不腻',
                    address: '上海市普陀区真北路',
                    shop: '王小虎夫妻店',
                    shopId: '10333'
                }, {
                    id: '12987126',
                    name: '好滋好味鸡蛋仔',
                    category: '江浙小吃、小吃零食',
                    desc: '荷兰优质淡奶，奶香浓而不腻',
                    address: '上海市普陀区真北路',
                    shop: '王小虎夫妻店',
                    shopId: '10333'
                }
            ],
            totalRow:0,
            filter:{
                project_id:[],
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
        handleExpand(row,expandedRows) {
            console.log(row);
            console.log(expandedRows,"------------------------------------");
            
            setTimeout(() => {console.log("ok")}, 1000)
        },
        
        getToday(){
            var Today=new Date();
            return  Today.getFullYear()+"-"+(Today.getMonth()+1)+"-"+Today.getDate() 
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
       
        fetchData(){
            return this.tableData
        },

        handleGetReport(type){
            if(this.filter.project_id.length){
                this.getData(type);
            }else{
                return this.$message.error("請選擇專案"); 
            }
        },
        async handleTabClick(tab, event){
            
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
            this.last_params={};
            var filter = {
                projects:this.filter.project_id
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
            console.log(this.filter.project_id);

            let loadingInstance = Loading.service({
                lock: true,
                text: '產生報表中.....',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.last_params = {"type":type,"filter":filter}
            await workItemService.downlaod_data({"type":type,"filter":filter}).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
            });
            this.previewView = true;
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
        }
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