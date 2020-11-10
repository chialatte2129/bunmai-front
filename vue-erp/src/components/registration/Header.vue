<template>
    <div>
        <el-image
        :src="header_img"
        style="width:100%;">
            <div slot="error" class="image-slot">
                <el-image
                src="/image/bg/header_img_sample.jpg"
                style="width:100%;">
                </el-image>
            </div>
        </el-image>
    </div>
</template>
<script>
export default {
    data(){
        return {
            header_img:null,
            // header_img:"",
            
        };
    },

    created(){
        console.log("header")
    }

};
</script>
<style scoped>
</style>