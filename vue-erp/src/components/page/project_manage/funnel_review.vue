<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.task_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.project_funnel_review')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>          
         <div id="funnel" style="height:640px;"></div>       
  <el-dialog :title="showTitle" :visible.sync="showOrgVisible" width="60%" center>
      <el-row :gutter="24">
         <el-col :span="18"> <highcharts :options="show_project_detail()"></highcharts>  </el-col>
         <el-col v-show="isShowSubItemVisible" :span="6"> <highcharts :options="show_subitem_detail()"></highcharts> </el-col>
      </el-row>
  </el-dialog>


    </div>
</template>
<script>
import { accountService } from "@/_services";
import Vue from "vue";
export default {
    name: "day_item_review",
    data(){
        return {
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            username:accountService.get_user_info("ms_username"),
            tree_loading:false, 
            showOrgVisible:false,  
            showSubItemVisible:false,
            dialog_loading:false,    
            showTitle:"",     
            showItemTitle:"",  
            sub_items:[],       
            sub_colors:['#FF530D', '#E82C0C', '#FF0000', '#E80C7A', '#E80C7A'],
        }
    },
    watch:{
      
    },
    async created(){
          console.log("created !")
          await this.initjs();
          await this.show_funnel_chart();
    },
    computed: {
isShowSubItemVisible(){
    return this.showSubItemVisible;
} 
    },        
    methods: {      
        async initjs(){
Vue.loadScript(
  "https://code.highcharts.com/highcharts.js"
).then(() => {
    console.log("highcharts.js loaded");
Vue.loadScript(
  "https://code.highcharts.com/modules/sankey.js"
).then(() => {  
Vue.loadScript(
  "https://code.highcharts.com/modules/exporting.js"
).then(() => {  
Vue.loadScript(
  "https://code.highcharts.com/modules/accessibility.js"
).then(() => {  
 Vue.loadScript(
  "https://code.highcharts.com/highcharts-3d.js"
) .then(() => {   
Vue.loadScript(
  "https://code.highcharts.com/modules/cylinder.js"
).then(() => {
Vue.loadScript(
  "https://code.highcharts.com/modules/funnel3d.js"
).then(() => {
console.log("funnel.js loaded");
});
});
});
});
});
});
});
          },    

async show_funnel_chart(){
// Set up the chart
var self=this;
Highcharts.chart('funnel', {
    chart: {
        type: 'funnel3d',
        options3d: {
            enabled: true,
            alpha: 10,
            depth: 50,
            viewDistance: 50
        }
    },
    title: {
        text: '專案一覽'
    },
    plotOptions: {
        series: {
          point: {
                events: {
                   click:function () {                                                      
                        self.showTitle = this.name +" ("+this.y+")";   
                        self.showOrgVisible=true;                                                                                      
                    }
                }
            },
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b> ({point.y:,.0f})',
                allowOverlap: true,
                y: 10
            },
            neckWidth: '30%',
            neckHeight: '25%',
            width: '80%',
            height: '80%'
        }
    },
    series: [{
        name: '專案數量',
        data: [
            ['客戶辦訪中', 8],
            ['需求合約確認中', 3],
            ['已簽約進行中',4],
            ['已驗收維護中',5],
            ['已結案', 6],
            ['未成案', 4]
        ]
    }]
});


},
  show_project_detail(){     
      var self=this;     
   return {
  chart: {
        type: 'column'
    },
    title: {
        text: '專案收支狀況'
    },
    xAxis: {
        categories: [
            '專案1',
           '專案2',
           '專案3',
          '專案4',
           '專案5'       
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'NTD (K)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} NTD (K): </td>' +
            '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
      series: {
           events: {
                mouseOut: function () {
                    self.showSubItemVisible=false;                      
                }
            },
          point: {
                events: {
                   mouseOver:function () {     
                       console.log("this>",this.category);
                       self.showItemTitle=this.category + this.series.name;
                       self.showSubItemVisible=true;
                       if(this.series.name=="支出"){
                            console.log("show支出");
                       self.sub_items=[{name: '人力成本',color: '#E82C0C',data: [5]},
                        {name: '請款支出',  color: '#E80C7A',data: [2]}];  
                       }else {
                             console.log("show收入");
                       self.sub_items=[{name: '訂金',color: '#2f7ed8',data: [2]},
                       {name: '期中款',color: '#0d233a',data: [3]},
                       {name: '尾款',color: '#910000',data: [4]}];  

                       }
                          
                          
                    }              
                }
            },
            events: {
                mouseOut: function () {
                     self.showItemTitle="";
                    self.showSubItemVisible=false;                      
                }
            }},
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series:
     [{
        name: '支出',
        data: [49, 71, 106, 129, 121]

    }, {
        name: '收入',
        data: [83, 78, 98, 93, 126]

    }]

   }
   },
   show_subitem_detail(){    
       var self=this;            
   return {
    chart: {
        type: 'bar'
    },
    title: {
        text: self.showItemTitle +'細項'
    },
    xAxis: {
        categories: [self.showItemTitle ]
    },
    yAxis: {
        min: 0,
        title: {
            text: 'NTD (K)'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
            }
        }
    },   
    legend: {
       align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: self.sub_items
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