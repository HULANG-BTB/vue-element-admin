<template>
    <div>
        单位信息+{{unitInfo.name}}+{{unitInfo.no}}
    </div>
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
    },

}
</script>

<style>

</style>