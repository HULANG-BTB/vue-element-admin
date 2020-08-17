<template>
    <el-form :label-position="labelPosition" label-width="80px" :model="form">
        <el-row>
            <el-col :span="8">
                <el-form-item label="单位ID">
                    <span>{{unitInfo.no}}</span>
                </el-form-item> 
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10">
                <el-form-item label="申请单位" >
                    <span>{{unitInfo.name}}</span>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
export default {
    props: {
        unitInfo: {
            name: {
                type: String,
                default: ""
            },
            no: {
                type: String,
                default: ""
            }
        },
    },
    data() {
        return {
            // 属性区
        }
    },
    methods: {
        // 方法区
        async getData(){
            let params = {
                unitId : unitInfo.no
            }
            const res = await getUnitDetails(params);
            alert(res)
        }
    },

}
</script>

<style>

</style>