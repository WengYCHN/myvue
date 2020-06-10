<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card -->
        <el-card>
            <!-- Table -->
            <el-table :data="rightsList" stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rightsList: [],
        }
    },
    created(){this.getRightsList()},
    methods: {
        async getRightsList(){
            const result = await this.$http.get('rights/list');
            if(result.data.meta.status !== 200) return this.$message.error('获取权限列表失败');
            console.log(result);
            this.rightsList = result.data.data;
        },
    },
}
</script>

<style scoped>

</style>