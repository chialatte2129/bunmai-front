<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.work_item_pay')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="我的請款單" name="mine">
                    <span slot="label">
                        <i class="el-icon-document"> 我的請款單</i>
                    </span>
                    <paymentAll></paymentAll>
                </el-tab-pane>

                <el-tab-pane label="待審請款單" name="waiting" :key="tbKey">
                    <span slot="label">
                        <i class="el-icon-message"> 待審請款單</i>
                        <el-badge :value="todo" v-if="todo>0" size="mini" class="item"></el-badge>
                    </span>
                    <keep-alive><paymentWaiting :tbKey="tbKey" @SyncTodo="handleSyncTodo"></paymentWaiting></keep-alive>
                </el-tab-pane>
                
                <el-tab-pane v-if="is_accountant" label="請款單撥款" name="accountant">
                    <span slot="label">
                        <i class="el-icon-coin"> 請款單撥款</i>
                    </span>
                    <paymentAccountant></paymentAccountant>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import { accountService } from "@/_services";
import paymentAll from "./work_item_pay_sub/all.vue";
import paymentWaiting from "./work_item_pay_sub/waiting.vue";
import paymentAccountant from "./work_item_pay_sub/accountant.vue";
export default {
    name: "pay_order",
    components: {
        paymentAll,
        paymentWaiting,
        paymentAccountant
    },
    data(){
        return {
            activeName: 'mine',
            todo:0,
            tbKey:0
        }
    },

    async created(){
        this.init();
    },

    computed: {
        is_accountant(){
            if(accountService.get_user_menus().includes("accountant")){
                return true
            }else{
                return false
            }
        },
    }, 
    methods: {
        handleClick(data){
            this.tbKey++;
            console.log(this.tbKey);
        },
        handleSyncTodo(data){
            this.todo = data.count;
        },
        init(){
            if(this.$route.query.key){
                console.log(this.$route.query.key);
                this.activeName = this.$route.query.key;
            }
        }
    }
}
</script>
<style scoped>
.crumbs >>> .el-breadcrumb{
    font-size:20px;
    height:25px;
}
</style>