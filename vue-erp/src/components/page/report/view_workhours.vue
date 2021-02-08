<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.view_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.view_work_hours')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-input v-model="filter.dept_name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('employee.dept')" :disabled="table_loading" @change="search"/>
                <el-input v-model="filter.p_name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('employee.name')" :disabled="table_loading" @change="search"/>
                <el-date-picker v-model="filter.work_date" class="mgr10" type="daterange" align="right" value-format="yyyy-MM-dd" size="large" unlink-panels
                :disabled="table_loading" :picker-options="pickerOptions" @change="search" 
                :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
                <el-button size="large" type="success" style="float:right;" plain @click="" :disabled="table_loading"
                v-if="black_list_action" v-html="$t('actions.workhour_view_black_list')"/>
            </div>
            <!-- <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" v-loading="table_loading" 
            :span-method="dateCellMerge" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
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
                <el-table-column prop="work_hours" :label="$t('employee.table_work_hour')" width="80" align="right" header-align="left"/>
                <el-table-column prop="total_work_hour" :label="$t('employee.table_total_work_hour')" width="80" align="right" header-align="left"/>
                <el-table-column prop="comp_time" :label="$t('overtime.table_comp_time')" width="80" align="right" header-align="left">
                    <template slot-scope="scope">
                        <span v-if="scope.row.comp_time">{{scope.row.comp_time}}</span><span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total_comp_time" :label="$t('overtime.table_total_comp_time')" width="80" align="right" header-align="left"/>
                <el-table-column prop="tag1" :label="$t('project.tag1')" width="115" show-overflow-tooltip/>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div> -->
        </div>
    </div>
</template>
<script>
import { dayItemService, personTagService } from "@/_services";
export default {
    name: "view_work_hours",
    data(){
        return {
            tbKey:0,
            table_loading:false,
            tableData:[],
            totalRow:0,
            spanArr:[],
            pos:0,
            cur_page: 1,
            page_size:100,
            page_size_list:[100, 300, 500],
            start_row:0,
            sort_column:"dept_name",
            sort:"desc",
            createView:false,
            updateView:false,
            black_list_action:localStorage.getItem("ms_user_actions").includes("workhour_view_black_list"),
            filter:{
                p_name:"",
                dept_name:"",
                work_date:[],
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

    async created(){
        // await this.getData();
    },

    watch:{
        
    },

    computed:{
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        showTitle(){
            if(this.createView) return this.$t("employee.create_day_item");
            else if(this.updateView) return this.$t("employee.update_day_item");
            else if(this.copyView) return this.$t("employee.copy_day_item");
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else if(this.copyView) return this.copyView;
            else return false;
        },
    },    
    
    methods:{
        getCellStyle({row, column}){
            const tempWidth=column.realWidth||column.width;
            var return_dict = {};
            return_dict["minWidth"]=`${tempWidth}px`;
            return_dict["maxWidth"]=`${tempWidth}px`;
            return return_dict;
        },

        getSpanArr(data){
            this.resetSpanArr();
            for(var i=0;i<data.length;i++){
                if(i===0){ 
                    this.spanArr.push(1);
                    this.pos=0;
                }else{
                    if(data[i].work_date===data[i-1].work_date){
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
            if(["work_date", "total_work_hour", "total_comp_time"].includes(column.property)){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
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
        

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                item_id:null,
                work_date:[],
                pid:this.odoo_employee_id
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
    .handle-input{
        width: 200px;
        display:inline-block;
    }
    .table{
        width:100%;
        font-size:12px;
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
    .crumbs >>> .el-breadcrumb{
        font-size:20px;
        height:25px;
    }
    .dialog-footer-loading{
        text-align:right;
        margin:40px 0 -10px 0;
    }
    .container{
        margin-right:10px;
        padding:15px;
    }
    .one-line{
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }
</style>