<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user"></i> {{$t('menus.hr_setting')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.calendar_setting')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-scrollbar>
                <FullCalendar ref="fullCalendar" :style="dynamicStyle" :options="calendarOptions" />
            </el-scrollbar>
        </div>

        <el-dialog title="" :visible.sync="dateVisible" width="400px" @close="cancelDate" v-loading="loading">
            <el-form :model="form"  ref="form" label-width="50px" label-position="left">
                <el-form-item label="日期">
                    <span style="font-size:18px;">{{form.date}}</span>
                </el-form-item>
                <el-form-item label="假別">
                    <el-select size="large" v-model="form.date_type" clearable placeholder="請選擇假別" class="mgr10">
                        <el-option v-for="item in options.date_types" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="備註">
                    <el-input v-model="form.description" size="large" type="text" clearable style="width:250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="form.action=='update'" type="danger" style="float:left;" @click="deleteDate()">{{$t('btn.delete')}}</el-button>
                <el-button @click="dateVisible = false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDate()">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { calendarService } from "@/_services";
export default {
    name: "view_work_hours",
    components:{
        FullCalendar
    },
    data(){
        return {
            loading:false,
            dynamicStyle:"",
            calendarOptions: {
                plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin ],
                initialView: 'dayGridMonth',
                headerToolbar:{
                    left:"prevYear prev",
                    center:"title",
                    right:"today dayGridMonth,listMonth next nextYear",
                },
                
                height:650,
                locale:this.$i18n.locale.replace("_", "-"),
                selectable:false,
                dateClick: this.handleDateClick,
                eventClick:this.handleEventClick,
                events:this.handleGetEvent,
                eventTimeFormat:{
                    hour:"2-digit",
                    minute:"2-digit",
                },
                eventColor:"",
                buttonText:{
                    today:"本月",
                    dayGridMonth:"月份",
                    listMonth:"清單",
                },
            },
            dateVisible:false,
            form:{
                date:"",
                date_type:"",
                description:""
            },
            options:{
                date_types:[
                    {label:"國定假日",value:"public_holiday"},
                    {label:"例假日",value:"mandatory_day_off"},
                    {label:"休假日",value:"flexible_rest"}
                ]
            },
            color_map:{
                public_holiday:"#7C86A1",
                mandatory_day_off:"#1A252F",
                flexible_rest:"#856B5A",
            }       
        }           
    },

    async created(){},
    watch:{},

    computed:{},    
    
    methods:{

        handleDateClick(arg) {
            var params = {
                action:"info",
                filter:{
                    date:arg.dateStr
                }
            }
            calendarService.update_public_holiday(params).then(res =>{ 
                if(res.code==1){
                    this.form = res.data;
                    this.dateVisible = true;
                }else{
                    console.error(this.$t(res.msg));
                };
            });
            this.dateVisible = true;
        },

        handleEventClick(info) {
            var params = {
                action:"info",
                filter:{
                    date:info.event.startStr.slice(0, 10)
                }
            }
            calendarService.update_public_holiday(params).then(res =>{ 
                if(res.code==1){
                    this.form = res.data;
                    this.dateVisible = true;
                }else{
                    console.error(this.$t(res.msg));
                };
            });
        },

        async deleteDate(){
            this.form.date_type = null;
            await this.confirmDate();
        },

        confirmDate(){
            this.loading = true
            var params = {
                action:"update",
                filter:{},
                form:this.form
            }
            calendarService.update_public_holiday(params).then(async res =>{ 
                this.loading = false;
                if(res.code==1){
                    await this.$refs.fullCalendar.getApi().refetchEvents();
                    this.$message.success("成功");
                    this.dateVisible = false;
                    
                }else{
                    console.error(this.$t(res.msg));
                };
            });
        },

        cancelDate(){
            this.dateVisible = false;
            this.form = {}
        },

        async handleGetEvent(info, successCallback, failureCallback){
            var param={
                event_types:["public_holiday"],
                filter:{
                    start_date:info.startStr.slice(0, 10),
                    end_date:info.endStr.slice(0, 10)
                },
            };
            await calendarService.get_calendar_event(param).then(async res =>{ 
                if(res.code==1){
                    this.events=res.events
                    this.events.forEach(element => {
                        element.color = this.color_map[element.date_type]
                    });
                    const events=[
                        ...this.events,
                    ];
                    this.page_loading=false;
                    await successCallback(events);
                }else if(res.code==0){
                    // this.$message.warning(this.$t(res.msg))
                    console.warn(this.$t(res.msg));
                    await successCallback([]);
                }else{
                    // this.$message.error(this.$t(res.msg))
                    console.error(this.$t(res.msg));
                    await successCallback([]);
                };
            });
        },
    }
}
</script>
<style scoped>
.crumbs >>> .el-breadcrumb{
    font-size:20px;
    height:25px;
}


</style>