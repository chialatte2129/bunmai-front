<template>
  <div>
    <el-select v-model="menus_select_value" :class="formClass" clearable  :placeholder="$t('btn.select_options')" :multiple="isMultiple"  @change="$emit('select_menu',menus_select_value)">
      <el-option
        v-for="item in all_menus"
        :key="item.value"
        :label="show_label(item)"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { dictService } from "@/_services";
import { Message } from "element-ui";
export default {
  name: "dict_menu",
  props: {
    keystr: String,
    isMultiple : false,
    i18nAsLabel :false,
    formClass: String    
  },
  data() {
    return {
      menus_select_value: [],
      all_menus: []
    };
  },
  computed: {
   
  },
  created() {     
    this.getMenus();
  },
  methods: {
    show_label(item) {      
      //console.log(item.label_i18n,item.label)
      return this.i18nAsLabel ? (item.label_i18n==undefined?item.label:this.$t(item.label_i18n)):item.label;
    },
    beforeMount() {
      //console.log("beforeMount");
    },
    mounted() {
      //console.log("mounted");
    },
    // 获取 menus 的模拟数据
    getMenus() {
      dictService
        .get_setting_by_key(this.keystr)
        .then(result => {
          if (result.msg_code == 1) {
            this.all_menus = JSON.parse(result.data.jsonvalue);
          } else {
            return result;
          }
        })
        .then(rs => {
          if (rs && rs.msg_code == 0) {
            Message({
              type: "error",
              message: this.$t(rs.msg_i18n)
            });
          } else if (rs && rs.msg_code == -1) {
            Message({
              type: "error",
              message: this.$t(rs.msg)
            });
          }
        });
    }
  }
};
</script>


<style>
.menus-select-input {
  width: 99%;
  display: inline-block;
}
</style>
