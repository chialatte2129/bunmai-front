<template >
    <div class="table" >
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-data"></i>
            <b> 推廣成效-廣告商</b>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bg-container">
        <el-row :gutter="20">
          <el-col v-for="data in header_data" style="width:300px" :xs="12" :sm="12" :lg="6" class="mgb10">
            <el-card>
              <el-row>
                <el-col :span="12">
                  <i :class="data.icon" style="font-size:40px;"/>
                </el-col>
                <el-col :span="12">
                  <div><span class="card-text card-description">{{data.title}}</span></div>
                  <div><span class="card-text card-description card-number"><count-to :start-val="data.start" :end-val="data.end" :duration="data.duration"  /></span></div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="15">
            <el-row class="mgb10">
              <el-card style="height:330px;">
                <div slot="header" class="clearfix">
                  <span>流量趨勢</span>
                </div>
                <highcharts style="width:100%; height:250px;" :options="chartOptions"></highcharts>
              </el-card>
            </el-row>
            <el-row>
              <el-card style="height:525px;">
                <div slot="header" class="clearfix">
                  <span>最新交易資訊</span>
                </div>
                <el-table
                :data="tableData"
                style="width: 100%; height:400px;">
                  <el-table-column
                    prop="date"
                    align="center"
                    label="時間"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="product_name"
                    label="產品名稱"
                    width="auto">
                  </el-table-column>
                  <el-table-column
                    prop="kol_name"
                    label="KOL"
                    align="center"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="count"
                    align="right"
                    label="數量"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    align="right"
                    label="金額"
                    width="80">
                  </el-table-column>
                </el-table>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="9">
            <el-row class="mgb10">
              <el-card style="height:400px;" >
                <div slot="header" class="clearfix">
                  <span>本月銷售品項</span>
                </div>
                <highcharts style="width:100%;height:350px;" :options="pieChartOption"></highcharts>
              </el-card>
            </el-row>
            <el-row>
              <el-card style="height:450px;" >
                <div slot="header" class="clearfix">
                  <span>KOL產品銷售排行</span>
                </div>
                <highcharts style="width:100%;height:350px;" :options="scoreBarChartOption"></highcharts>
              </el-card>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
import deshboardStorePanel from "./deshboard_comp/store"
import CountTo from './deshboard_comp/count-to'
export default {
  name: "role_table",
  components: {
   deshboardStorePanel,
   CountTo
  },
  data() {
    return {
      header_data:[
        {title:"總流量", icon:"el-icon-s-data", start: 0, end: 12457, duration:2600},
        {title:"本週流量", icon:"el-icon-s-custom", start: 0, end: 574, duration:2600},
        {title:"成交筆數", icon:"el-icon-s-goods", start: 0, end: 427, duration:2600},
        {title:"合作網紅", icon:"el-icon-video-camera", start: 0, end: 12, duration:2600},
      ],

      tableData:[
        {date:"2022-01-08 16:12", product_name:"【正宗老饕級】日月潭吮指大閘蟹x6隻(5兩九-6兩半/隻)", kol_name:"得得廚房", count:23, amount:1240},
        {date:"2022-01-08 15:56", product_name:"【正宗老饕級】日月潭吮指大閘蟹x6隻(5兩九-6兩半/隻)", kol_name:"得得廚房", count:55, amount:1240},
        {date:"2022-01-08 15:50", product_name:"【法國貴族晚宴必備】冰川淬煉洗禮聖母峰葡萄 600公克/箱", kol_name:"葡萄主委", count:18, amount:1240},
        {date:"2022-01-08 14:15", product_name:"【限量100瓶】28逆齡回春水 100ml/瓶", kol_name:"美妝女王Joy", count:17, amount:1240},
        {date:"2022-01-08 14:05", product_name:"【蒙恩咖啡】耶路撒冷手工烘焙咖啡豆", kol_name:"Cindy酥", count:3, amount:1240},
        {date:"2022-01-08 14:03", product_name:"【米其林一星激推】虎虎生風猛虎垂涎年菜組", kol_name:"特級吃貨王", count:5, amount:1240},
        {date:"2022-01-07 08:47", product_name:"【法國貴族晚宴必備】冰川淬煉洗禮聖母峰葡萄 600公克/箱", kol_name:"葡萄主委", count:2, amount:1240},
        {date:"2022-01-07 05:53", product_name:"【蒙恩咖啡】耶路撒冷手工烘焙咖啡豆", kol_name:"Cindy酥", count:13, amount:1240},
        {date:"2022-01-07 01:57", product_name:"【米其林一星激推】虎虎生風猛虎垂涎年菜組", kol_name:"特級吃貨王", count:25, amount:1240},
        {date:"2022-01-06 12:50", product_name:"日月潭【限量100瓶】28逆齡回春水 100ml/瓶大閘蟹", kol_name:"美妝女王Joy", count:7, amount:1240}

      ],

      chartOptions: {
        title: {
          text: ""
        },
        credits: {
          //去掉水印
          enabled: false
        },
        xAxis: {
          categories:["07-08", "08-08", "09-08", "10-08", "11-08", "12-08", "01-08"]
        },
        yAxis: {
          title: { text: "" }
        },
        credits: {
          //去掉水印
          enabled: false
        },
        plotOptions: {
          line: {
            //设置颜色，显示点
            color: "#0e6145",
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [
          {
            name: "流量紀錄",
            data: [187, 215, 574, 324, 423, 782, 574]
          }
        ]
      },

      pieChartOption:{
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        credits: {
          //去掉水印
          enabled: false
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Products',
          colorByPoint: true,
          data: [{
            name: '日月潭大閘蟹',
            y: 40,
            sliced: true,
            selected: true
          }, {
            name: '虎虎生風年菜組',
            y: 24
          }, {
            name: '聖母峰葡萄',
            y: 24
          }, {
            name: '28逆齡回春水',
            y: 15
          }, {
            name: '蒙恩咖啡',
            y: 15
          }]
        }]
      },

      scoreBarChartOption:{
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        credits: {
          //去掉水印
          enabled: false
        },
        xAxis: {
            categories: ['日月潭大閘蟹', '聖母峰葡萄', '虎虎生風年菜組', '蒙恩咖啡', '逆齡回春水']
        },
        yAxis: {
            min: 0,
            title: {
                text: '商品銷售量'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [
        {
          name: '得得廚房',
          data: [30, 13, 4, 5, 2]
        }, 
        {
          name: '美妝女王Joy',
          data: [1, 4, 7, 1, 20]
        }, 
        {
          name: '葡萄主委',
          data: [5, 25, 5, 2, 5]
        },
        {
          name: '特級吃貨王',
          data: [10, 0, 20, 2, 0]
        }, 
        {
          name: 'Cindy酥',
          data: [5, 0, 4, 25, 8]
        }
      ]
    }
    };
  },
  created() {
   
  },
  computed: {
    
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
};
</script>

<style scoped>
.bg-container {
  border:0px;
  padding:10px;
}
.mgb10 {
  margin-bottom:10px;
}
.panel-icon {
  font-size: 48px;
}

.card-description {
  font-weight: bold;
}
.card-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.card-number {
  line-height: 30px;
  font-size: 20px;
}

</style>

<style>
    .el-breadcrumb {
        font-size: 20px;
        height: 25px;
    }
</style>