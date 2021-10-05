<template>
    <div class="table">
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
    </div>
</template>
<script>
import { accountService } from "@/_services";
import { dayItemService } from "@/_services";
export default {
    name: "var_dept_tree",
    props: {
    
    },
    data(){
        return {
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            username:accountService.get_user_info("ms_username"),
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

            spanArr:[],
            pos:null,

           
            option:{
                employee:[]
            },
            filter:{
                dept_id:[],
                pid:[],
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
            this.get_data_sig=false;
            this.node_click_sig=false;
            this.reset_sig=false;
            this.all_sig=false;
        },
    },

    async created(){
        await this.get_dept_tree();
    },

    computed: {
        
    },    
    
    methods: {
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
            this.resultChange();
        },

        async handleCheck(data){
            // console.log("check")
            var flag = !this.$refs.tree_data.getNode(data).checked;
            await this.$refs.tree_data.setChecked(data, flag);
            await this.handleNodeClick(data);
        },

        async handleNodeClick(data){
            // console.log("node click");
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

        resultChange(){
            this.$emit('result_change',{"checked_id":this.checked_id})
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