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
            <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
            <!-- Table -->
            <tree-table :data="categoryList" :columns="columns" :selection-type='false' :expand-type='false' show-index>
                <template slot="isOK" slot-scope="score">
                    <i class="el-icon-success" v-if="score.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <template slot="sort" slot-scope="score">
                    <el-tag v-if="score.row.cat_level ==0">一级</el-tag>
                    <el-tag type="success" v-if="score.row.cat_level ==1">二级</el-tag>
                    <el-tag type="warning" v-if="score.row.cat_level ==2">三级</el-tag>
                </template>
                <template slot="operate" slot-scope="score">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCategoryDialog(score.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCategory(score.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- Add category dialog -->
            <el-dialog title="添加分类" :visible.sync="addCategoryDialogVisible" width="40%" @close="addCategoryCloseDialog">
                <el-form :model="addCategoryForm" ref="addCategoryFormRef" :rules="addCategoryRules" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCategoryForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                    <!-- Cascader -->
                    <el-cascader v-model="selectedCategoryId" :options="parentCategoryList" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCategory">确 定</el-button>
                </span>
            </el-dialog>
            <!-- Edit category dialog -->
            <el-dialog title="修改分类" :visible.sync="editCategoryDialogVisible" width="40%" @close="editCategoryCloseDialog">
                <el-form :model="editCategoryForm" ref="editCategoryFormRef" :rules="editCategoryRules" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="editCategoryForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editCategory">确 定</el-button>
                </span>
            </el-dialog>
            <!-- Pagination -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 25, 50]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="categoryListSize">
            </el-pagination>
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
                    {label: '分类名称', prop: 'cat_name',},
                    {label: '是否有效', prop: 'cat_deleted', type: 'template', template:'isOK'},
                    {label: '排序', prop: 'cat_level', type: 'template', template:'sort'},
                    {label: '操作', type: 'template', template:'operate'},
                ],
                addCategoryRules: {
                    cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
                },
                editCategoryRules: {
                    cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
                },
                categoryList: [],
                categoryListSize: 0,
                addCategoryForm: {cat_name: '',cat_pid: 0,cat_level: 0},
                addCategoryDialogVisible: false,
                editCategoryDialogVisible: false,
                parentCategoryList: [],
                selectedCategoryId: [],
                cascaderProps: {value: 'cat_id',label: 'cat_name', children: 'children',expandTrigger: 'hover'},
                editCategoryForm: {cat_name: '',cat_id: 0,},
        }
    },
    created(){this.getCategoryList()},
    methods: {
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCategoryList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCategoryList();
        },
        handleChange(){
            if(this.selectedCategoryId.length > 0){
                this.addCategoryForm.cat_pid = this.selectedCategoryId[this.selectedCategoryId.length - 1];
                this.addCategoryForm.cat_level = this.selectedCategoryId.length;
                console.log(this.addCategoryForm);
                return;
            } else {
                this.addCategoryForm.cat_level = 0;
            }
            console.log(this.addCategoryForm);
        },
        async getCategoryList(){
            const result = await this.$http.get('categories', {params: this.queryInfo});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取分类失败');
            this.$message.success('获取分类成功');
            this.categoryList = result.data.data.result;
            this.categoryListSize = result.data.data.total;
        },
        async showAddCategoryDialog(){
            this.addCategoryDialogVisible = true;
            const result = await this.$http.get('categories',{params: {type :2}});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取父级分类失败');
            this.$message.success('获取父级分类成功');
            this.parentCategoryList = result.data.data;
        },
        addCategoryCloseDialog:function(){
            this.$refs.addCategoryFormRef.resetFields();
            this.selectedCategoryId = [];
            this.addCategoryForm.cat_pid = 0;
            this.addCategoryForm.cat_level = 0;
        },
         addCategory(){
            this.$refs.addCategoryFormRef.validate(async vaild => {
                if(!vaild) return;
                const result = await this.$http.post('categories',this.addCategoryForm);
                console.log(result);
                if(result.data.meta.status !== 201) return this.$message.error('添加分类失败');
                this.$message.success('添加分类成功');
                this.addCategoryDialogVisible = false;
                this.getCategoryList();
            })
        },
        async deleteCategory(categoryId){
             const confirmResult =  await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).catch(err => err);
                if (confirmResult !== 'confirm') return this.$message.info('取消删除分类');
                const result = await this.$http.delete('categories/' + categoryId);
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('删除分类失败');
                this.$message.success('删除分类完毕');
                this.getCategoryList();
        },
        showEditCategoryDialog(category){
            this.editCategoryForm.cat_id = category.cat_id;
            this.editCategoryDialogVisible = true;
        },
        editCategoryCloseDialog(){
            this.$refs.editCategoryFormRef.resetFields();
        },
        editCategory(){
            this.$refs.editCategoryFormRef.validate(async vaild => {
                if(!vaild) return;
                this.editCategoryDialogVisible = false;
                const result = await this.$http.put('categories/' + this.editCategoryForm.cat_id,{cat_name: this.editCategoryForm.cat_name});
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('修改分类失败');
                this.$message.success('修改分类完毕');
                this.getCategoryList();
            })
        }
    }
}
</script>

<style scoped>
    .el-button{margin-bottom: 15px;}
</style>