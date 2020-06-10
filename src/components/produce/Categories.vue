<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card -->
        <el-card>
            <el-button type="primary">添加分类</el-button>
            <!-- Table -->
            <tree-table :data="categoryList" :columns="columns" :selection-type='false' :expand-type='false' show-index>

            </tree-table>

            <!-- <el-table :data="categoryList">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="分类名称" prop="cat_name"></el-table-column>
                <el-table-column label="是否有效" prop="cat_deleted"></el-table-column>
                <el-table-column label="排序" prop="">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.cat_level == 1">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.cat_level == 2">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="">
                    <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-delete" size="mini" >编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> -->

            <!-- Pagination -->
            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 25, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="10">
            </el-pagination> -->
        </el-card>

    </div>
</template>

<script>
export default {
    data(){
        return{
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 10,
                },
                columns: [
                    {label: '分类名称', prop: "cat_name",},
                    {label: '是否有效', prop: "cat_deleted",},
                    {label: '排序', prop: "cat_level", },
                    {label: '操作', prop: "cat_name", },
                ],
                categoryList: [],
                categoryListSize: 0,
        }
    },
    created(){this.getCategoryList()},
    methods: {
        handleSizeChange(){
            
        },
        handleCurrentChange(){

        },
        async getCategoryList(){
            const result = await this.$http.get('categories',this.queryInfo);
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取分类失败');
            this.$message.success('获取分类成功');
            this.categoryList = result.data.data;
            this.categoryListSize = result.data.data.length;
        }
    }

}
</script>

<style scoped>

</style>