<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.work_item_cost')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-select size="large" class="mgr10" v-model="filter.owner" filterable clearable multiple collapse-tags
                :placeholder="$t('project.owner')" :disabled="loading" @change="search">
                    <el-option-group v-for="group in tree_data" :key="group.id" :label="group.name">
                        <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
                            <span v-if="item.id==-100" class="mgl10">{{$t(item.name)}}</span>
                            <span v-else class="mgl10">{{item.name}}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
                <el-select class="mgr10" size="large" v-model="filter.status" multiple collapse-tags filterable clearable :placeholder="$t('project.status')"
                :disabled="loading" @change="search">
                    <el-option v-for="item in option.status" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select> 
                <el-input v-model="filter.key_word" clearable size="large" class="mgr10 handle-input" :placeholder="$t('project.keyword')" :disabled="loading" @change="search"/>
                <el-button size="large" type="info" class="mgr10" plain :disabled="loading" @click="cancelSearch">{{$t('btn.clean')}}</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            :default-sort="{prop:sort_column, order:sort}" @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="id" :label="$t('common_column.id')" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="name" :label="$t('common_column.name')" min-width="300" width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="owner" :label="$t('project.owner')" width="155" align="left" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="status_name" :label="$t('common_column.status')" width="120" align="center" sortable="custom" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{$t('project.status_tag.'+scope.row.status)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="progress" :label="$t('cost.work_hour_percent')" width="150" align="center"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.work_progress>=80" style="color:red;">{{scope.row.work_progress}}%</span>
                        <span v-if="scope.row.work_progress>=50&&scope.row.work_progress<80"  style="color:orange;">{{scope.row.work_progress}}%</span>
                        <span v-if="scope.row.work_progress<50" style="color:green;">{{scope.row.work_progress}}%</span>
                        <span v-if="scope.row.work_progress=='-'" style="color:gray;">{{scope.row.work_progress}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="false" prop="pay_order" label="待審請款單" width="150" align="center" sortable="custom" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <span v-if="scope.row.unprocess_pay" style="color:red;">{{scope.row.pay_order}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="std_amount" :label="$t('cost.predict_net_income')" width="165"  align="right" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                <el-table-column prop="act_amount" :label="$t('cost.actual_net_income')" width="165" align="right" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('btn.action')" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <!-- <el-button :disabled="allowDelete(scope.row)" type="info" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('project.delete')}}</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
    </div>
</template>
<script>
import { workItemService } from "@/_services";
export default {
    name: "work_item_manage",
    data(){
        return {
            action_list:localStorage.getItem("ms_user_actions"),
            username:localStorage.getItem("ms_username"),
            activeNames:"",
            tbKey:0,
            tableData: [],
            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10],
            start_row:0,

            sort_column:"id",
            sort:"desc",

            loading:false,
            filter:{
                key_word:"",
                status:[],
                owner:[],
            },
            tree_data:[],
            option:{
                status:[]
            },
            rules: {},
        }
    },

    async created(){
        await this.get_dept_employee();
        await this.getOption();
        await this.getData();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        }
    }, 
    
    methods: {
        coculateProgress(work_time_total,pre_work_time){
            if (pre_work_time <= 0){
                return 100.00
            }else{
                return ((work_time_total/pre_work_time)*100).toFixed(2)
            }
        },
        stateFormat(row, column, cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
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

        async get_dept_employee(){
            this.loading=true;
            await workItemService.get_dept_employee({}).then(res =>{ 
                this.tree_data=res.tree_data;
                this.tree_data.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
            })
        },
        
        handleEdit(index, row){
            var query=this.router_query();
            query.id=row.id;
            this.$router.push({path:"/work_item_cost_edit", query:query});
        },
     

        router_query(){
            var query={
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                cur_page:this.cur_page,
                key_word:this.filter.key_word,
                status:this.filter.status,
                owner:this.filter.owner
            };
            // console.log(query);
            return query
        },

        handleCurrentChange(currentPage){
            this.cur_page = currentPage;
            this.count_page;
            this.$router.replace({ path:"/work_item_cost", query:this.router_query() }).catch(err => {});
            this.getData()
        },

        handleSizeChange(size){
            this.page_size = size;
            this.handleCurrentChange(1);
        },

        handleSortChange({prop, order}){
            console.log(prop,order);
            this.sort_column = prop;
            this.sort = order;
            this.handleCurrentChange(1);
        },
        getParam(){
            
            this.sort_column=("sort_column" in this.$route.query)?this.$route.query.sort_column:this.sort_column;
            this.sort=("sort" in this.$route.query)?this.$route.query.sort:this.sort;
            this.cur_page=("cur_page" in this.$route.query)?parseInt(this.$route.query.cur_page):parseInt(this.cur_page);
            this.start_row=("start_row" in this.$route.query)?parseInt(this.$route.query.start_row):parseInt(this.start_row);
            this.page_size=("page_size" in this.$route.query)?parseInt(this.$route.query.page_size):parseInt(this.page_size);
            this.tbKey++;
        
            this.filter={
                key_word:("key_word" in this.$route.query)?this.$route.query.key_word:this.filter.key_word,
                status:("status" in this.$route.query)?this.$route.query.status:this.filter.status,
                owner:("owner" in this.$route.query)?this.$route.query.owner:this.filter.owner
            };
            var param={
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                username:this.username,
                key_word:this.filter.key_word,
                status:this.filter.status,
                owner:this.filter.owner
            }
            
            return param
        },
        
        async getData(){
            this.loading=true;
            // var param = {
            //     sort_column:this.sort_column,
            //     sort:this.sort,
            //     start_row:this.start_row,
            //     page_size:this.page_size,
            //     key_word:this.filter.key_word,
            //     username:this.username,
            //     status:this.filter.status,
            //     owner:this.filter.owner
            // }
            await workItemService.work_item_cost_teble(this.getParam()).then(res =>{ 
                // console.log(res);
                if(res.success){
                    this.tableData=res.data;
                    this.totalRow=res.total;
                    this.$router.replace({ path:"/work_item_cost", query:this.router_query() }).catch(err => {});
                }else if(res.code==0){
                    this.$message.warning(this.$t(res.msg));
                }else{
                    this.$message.error(res.msg);
                };
                
            })
            this.loading=false;
        },
        
        async getOption(){
            await workItemService.get_options({}).then(res =>{ 
                this.option.categories=res.categories; 
                this.option.status=res.status; 
            }) 
        },

        search(){
            // console.log(this.filter);
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                name:"",
                status:[],
                category:[],
                owner:[],
            };
            this.handleCurrentChange(1);
        },
    }
}
</script>
<style scoped>
    .handle-input{
        width:200px;
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
</style>