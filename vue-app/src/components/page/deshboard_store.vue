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
            <el-row>
              <el-card style="height:300px;">
                <highcharts style="width:100%; height:300px;" :options="chartOptions"></highcharts>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="9">
            <el-row class="mgb10">
              <el-card>
                <highcharts style="width:100%;" :options="pieChartOption"></highcharts>
              </el-card>
            </el-row>
            <el-row>
              <el-card>
                <highcharts style="width:100%;" :options="scoreBarChartOption"></highcharts>
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
        {title:"總流量", icon:"el-icon-s-data", start: 0, end: 102400, duration:2600},
        {title:"本週流量", icon:"el-icon-s-custom", start: 0, end: 102400, duration:2600},
        {title:"成交筆數", icon:"el-icon-s-goods", start: 0, end: 102400, duration:2600},
        {title:"合作網紅", icon:"el-icon-video-camera", start: 0, end: 102400, duration:2600},
      ],

      chartOptions: {
        title: {
          text: "流量趨勢"
        },
        credits: {
          //去掉水印
          enabled: false
        },
        xAxis: {
          categories:["5-10", "6-10", "7-10", "8-10", "9-10", "10-10", "11-10"]
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
            name: "活跃度",
            data: [0, 0, 0, 0, 0, 1, 9]
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
        title: {
          text: '銷售產品占比, 2021'
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
          name: 'Brands',
          colorByPoint: true,
          data: [{
            name: 'Chrome',
            y: 61.41,
            sliced: true,
            selected: true
          }, {
            name: 'Internet Explorer',
            y: 11.84
          }, {
            name: 'Firefox',
            y: 10.85
          }, {
            name: 'Edge',
            y: 4.67
          }, {
            name: 'Safari',
            y: 4.18
          }, {
            name: 'Sogou Explorer',
            y: 1.64
          }, {
            name: 'Opera',
            y: 1.6
          }, {
            name: 'QQ',
            y: 1.2
          }, {
            name: 'Other',
            y: 2.61
          }]
        }]
      },

      scoreBarChartOption:{
        chart: {
            type: 'bar'
        },
        title: {
            text: 'KOL產品銷售排行'
        },
        credits: {
          //去掉水印
          enabled: false
        },
        xAxis: {
            categories: ['日月潭大閘蟹', '蒙恩咖啡', '聖母峰葡萄', '逆齡回春水', '虎虎生風年菜組']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
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
          name: '得得',
          data: [5, 3, 4, 7, 2]
        }, 
        {
          name: 'Iris',
          data: [0, 2, 3, 2, 1]
        }, 
        {
          name: '主委',
          data: [0, 0, 4, 2, 5]
        },
        {
          name: 'York',
          data: [0, 0, 4, 2, 5]
        }, 
        {
          name: 'Cindy',
          data: [0, 0, 4, 2, 5]
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