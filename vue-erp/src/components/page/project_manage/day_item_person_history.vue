<template>
    <div>
        <el-collapse v-model="activeNames" accordion>
            <el-collapse-item  name="history" class="tag-collapse">
                <template slot="title">
                    <div class="mgl10">{{$t('common_msg.change_record')}}</div>
                </template>
                    <el-table
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="recorded_at"
                        :label="$t('common_msg.recorded_at')"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="change"
                        :label="$t('common_msg.changes')"
                        align="left"
                        width="auto">
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import { dayItemService} from "@/_services";
export default {
    name: "day_item_person",
    props: {
        day_item_id: Number,
    },
    data(){
        return {
            activeNames:"",
            loading:false,
            tableData:[]
        }
    },

    async created(){
        await this.init();
    },

    watch:{
        day_item_id(val){
            this.init();
        }
    },

    computed:{},    
    
    methods:{
        init(){
            if(this.day_item_id){
                this.getData()
            }else{
                this.tableData=[]
            }
        },

        async getData(){
            this.loading=true;
            var param = {
                action:"history",
                id:this.day_item_id
            }
            await dayItemService.person_day_list(param).then(res =>{ 
                if(res.code==1){
                    this.tableData = res.data;
                }else{
                    console.log(res.msg);
                }
            })
            this.loading=false;
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