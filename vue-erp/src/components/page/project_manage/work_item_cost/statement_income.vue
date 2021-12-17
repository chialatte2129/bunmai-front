<template>
    <div>
        <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%;font-size:16px;"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
        prop="title"
        :label="$t('cost.item')"
        width="250">
            <template slot-scope="scope">
                <span v-if="scope.row.level==1" style="font-weight:bolder;color:blue;">{{scope.row.title}}</span>
                <span v-if="scope.row.level==2" style="font-weight:bolder;">{{scope.row.title}}</span>
                <span v-if="scope.row.level>2" style="">{{scope.row.title}}</span>
            </template>
        </el-table-column>
        <el-table-column
        prop="amount"
        :label="$t('cost.cost')"
        align="right"
        width="auto">
            <template slot-scope="scope">
                <span v-if="scope.row.level==1 && scope.row.type=='cost'" style="font-weight:bolder;color:blue;">{{stateFormat(scope.row.amount)}}</span>
                <span v-if="scope.row.level==2 && scope.row.type=='cost'" style="font-weight:bolder;">{{stateFormat(scope.row.amount)}}</span>
                <span v-if="scope.row.level>2 && scope.row.type=='cost'" style="">{{stateFormat(scope.row.amount)}}</span>
            </template>
        </el-table-column>
        <el-table-column
        prop="amount"
        :label="$t('cost.income')"
        align="right"
        width="auto">
            <template slot-scope="scope">
                <span v-if="scope.row.level==1 && scope.row.type=='income'" style="font-weight:bolder;color:blue;">{{stateFormat(scope.row.amount)}}</span>
                <span v-if="scope.row.level==2 && scope.row.type=='income'" style="font-weight:bolder;">{{stateFormat(scope.row.amount)}}</span>
                <span v-if="scope.row.level>2 && scope.row.type=='income'" style="">{{stateFormat(scope.row.amount)}}</span>
            </template>
        </el-table-column>
    </el-table>
    
    <div style="width:90%;padding:5px 20px 20px 50px; height:50px;">
        <div style="width:50%;float:left;"><span style="color:red;font-size:25px;font-weight:bolder;">{{$t("cost.total")}}</span></div>
        <div style="width:50%;float:right;text-align:right;"><span style="color:red;font-size:25px;font-weight:bolder;">{{stateFormat(total)}} 元</span></div>
    </div>
    </div>
</template>
<script>
import { workItemService } from "@/_services";
export default {
    name: "income_statement",
    components: {},
    props: {
        item_id: String,
    },
    data(){
        return {
            tbKey:0,
            loading:false,
            tableData: [],
            total:0,
            form:{}
        }
    },

    async created(){
        await this.handleInit();
    },

    computed: {}, 

    watch:{},
    
    methods: {
        stateFormat(cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
		},

        async handleInit(){
            this.loading=true;
            await workItemService.get_project_cost_statement({
                item_id:this.item_id
            }).then(res =>{ 
                this.loading=false;
                if(res.code==1){
                    this.tableData = res.data;
                    this.total = res.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
            
        }
    }
}
</script>
<style scoped>
    
</style>
