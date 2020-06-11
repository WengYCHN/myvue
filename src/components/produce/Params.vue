<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card -->
        <el-card>
            <!-- Alert -->
            <el-alert type="warning" title="注意：只允许为第三级分类设置相关参数" :closable='false' show-icon></el-alert>
            <el-row>
                <el-col>
                    <span>选择商品分类</span>
                    <el-cascader v-model="selectedCategoryId" :options="categoryList" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
                </el-col>
            </el-row>
            <!-- Tabs -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- First tab -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isButtonDisable" @click="showAddAttributeOrParamDialog">添加参数</el-button>
                    <el-table :data="paramList" stripe >
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" @close="deleteTag(scope.row,index)" closable > {{ item }}</el-tag>
                                <el-input class="input-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="inputRef" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)"></el-input>
                                <el-button v-else class="button-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini"  icon="el-icon-edit" @click="showEditAttributeOrParamDialog(scope.row.attr_id)">修改</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttributeOrParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- Second tab   -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isButtonDisable" @click="showAddAttributeOrParamDialog">添加属性</el-button>
                    <el-table :data="attributeList" stripe >
                        <el-table-column label="" type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" @close="deleteTag(scope.row,index)" closable > {{ item }}</el-tag>
                                <el-input class="input-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="inputRef" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)"></el-input>
                                <el-button v-else class="button-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name" ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini"  icon="el-icon-edit" @click="showEditAttributeOrParamDialog(scope.row.attr_id)">修改</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttributeOrParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- Add dialog -->
        <el-dialog :title="'添加' + getActiveName" :visible.sync="addAttributeOrParamDialogVisible" width="40%" @close="addAttributeOrParamCloseDialog">
            <el-form :model="addAttributeOrParamForm" ref="addAttributeOrParamFormRef" :rules="addAttributeOrParamFormRules" label-width="80px">
                <el-form-item :label="getActiveName" prop="attr_name">
                    <el-input v-model="addAttributeOrParamForm.attr_name" @keyup.enter.native="addAttributeOrParam" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addAttributeOrParamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAttributeOrParam">确 定</el-button>
            </span>
        </el-dialog>
        <!-- Edit dialog -->
        <el-dialog :title="'修改' + getActiveName" :visible.sync="editAttributeOrParamDialogVisible" width="40%" @close="editAttributeOrParamCloseDialog">
            <el-form :model="editAttributeOrParamForm" ref="editAttributeOrParamFormRef" :rules="editAttributeOrParamFormRules" label-width="80px">
                <el-form-item :label="getActiveName" prop="attr_name">
                    <el-input v-model="editAttributeOrParamForm.attr_name" @keyup.enter.native="editAttributeOrParam" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAttributeOrParamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAttributeOrParam">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            categoryList: [],
            attributeList: [],
            paramList: [],
            cascaderProps: {expandTrigger: 'hover',value: 'cat_id', label: 'cat_name', children:'children',},
            selectedCategoryId: [],
            activeName: 'many',
            addAttributeOrParamDialogVisible: false,
            editAttributeOrParamDialogVisible: false,
            addAttributeOrParamForm: {attr_name:'', attr_sel: '', attr_vals: '',},
            editAttributeOrParamForm:{attr_name:'', attr_sel: '', attr_vals: '',},
            addAttributeOrParamFormRules: {
                attr_name: [{required: true, message: '请输入参数', trigger: 'blur'},],
            },
            editAttributeOrParamFormRules: {
                attr_name: [{required: true, message: '请输入参数', trigger: 'blur'},],
            },
            editAttributeOrParamId: 0,
        }
    },
    created(){this.getCategoryList()},
    methods: {
        handleChange(){
            if(this.selectedCategoryId.length !== 3){
                this.selectedCategoryId.splice(0,this.selectedCategoryId.length);
                this.paramList.splice(0,this.paramList.length);
                this.attributeList.splice(0,this.attributeList.length);
                return;
            }
            this.getAttributeListOrParamList();
        },
        handleTabClick(){
            this.getAttributeListOrParamList();
        },
        // Add tag
        async handleInputConfirm(item){
            if(item.inputValue.trim().length === 0){
                item.inputVisible = false;
                item.inputValue = '';
                return;
            }
            item.attr_vals.push(item.inputValue.trim());
            item.inputVisible = false;
            item.inputValue = '';
            const result = await this.$http.put('categories/' + this.selectedCategoryId[this.selectedCategoryId.length - 1] + '/attributes/' + item.attr_id,{attr_name: item.attr_name, attr_sel: item.attr_sel,attr_vals: item.attr_vals.join(' ')});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('新增标签失败');
            this.$message.success('新增标签成功');
            // this.getAttributeListOrParamList();
            
        },
        async getCategoryList(){
            const result = await this.$http.get('categories');
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取分类失败');
            this.$message.success('获取分类成功');
            this.categoryList = result.data.data;
        },
        async getAttributeListOrParamList(){
            if(this.selectedCategoryId.length == 0)return this.$message.error('请先选择分类');
            var result  = await this.$http.get('categories/' + this.selectedCategoryId[this.selectedCategoryId.length - 1] +'/attributes',{params:{sel: this.activeName}});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取数据失败');
            this.$message.success('获取数据成功');
            // String to array
            result.data.data.forEach(item => {item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[];item.inputVisible = false;item.inputValue = '';});
            if(this.activeName === 'many') this.paramList = result.data.data;
            if(this.activeName === 'only') this.attributeList = result.data.data;
        },
        async deleteAttributeOrParam(attrid){
            var info = '';
            if(this.activeName === 'many') info = '参数';
            if(this.activeName === 'only') info = '属性';
            const confirmResult =  await this.$confirm('此操作将永久删除该' + info + ', 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).catch(err => err);
            if (confirmResult !== 'confirm') return this.$message.info('取消删除' + info);
            const result = await this.$http.delete('categories/' + this.selectedCategoryId[this.selectedCategoryId.length - 1] + '/attributes/' + attrid);
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('删除' + info + '失败');
            this.$message.success('删除' + info + '成功');
            this.getAttributeListOrParamList();
        },
        async addAttributeOrParam(){
            var info = '';
            if(this.activeName === 'many') info = '参数';
            if(this.activeName === 'only') info = '属性';
            this.$refs.addAttributeOrParamFormRef.validate(async valid => {
                if(!valid) return;
                const result = await this.$http.post('categories/'+ this.selectedCategoryId[this.selectedCategoryId.length - 1] + '/attributes',{attr_name: this.addAttributeOrParamForm.attr_name,attr_sel: this.activeName});
                console.log(result);
                if(result.data.meta.status !== 201) return this.$message.error('添加' + info + '失败');
                this.$message.success('添加' + info + '成功');
                this.addAttributeOrParamDialogVisible = false;
                this.getAttributeListOrParamList();
            })
        },
        showAddAttributeOrParamDialog(){
            this.addAttributeOrParamDialogVisible = true;
        },
        addAttributeOrParamCloseDialog(){
            this.$refs.addAttributeOrParamFormRef.resetFields();
        },
        editAttributeOrParamCloseDialog(){
            this.$refs.editAttributeOrParamFormRef.resetFields();

        },
        showEditAttributeOrParamDialog(attr_id){
            this.editAttributeOrParamDialogVisible = true;
            this.editAttributeOrParamId = attr_id;
            console.log(this.editAttributeOrParamId);
        },
        async editAttributeOrParam(){
            var info = '';
            if(this.activeName === 'many') info = '参数';
            if(this.activeName === 'only') info = '属性';
            this.$refs.editAttributeOrParamFormRef.validate(async valid => {
                if(!valid) return;
                const result = await this.$http.put('categories/'+ this.selectedCategoryId[this.selectedCategoryId.length - 1] + '/attributes/' + this.editAttributeOrParamId ,{attr_name: this.editAttributeOrParamForm.attr_name,attr_sel: this.activeName});
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('修改' + info + '失败');
                this.$message.success('修改' + info + '成功');
                this.editAttributeOrParamDialogVisible = false;
                this.getAttributeListOrParamList();
            })
        },
        showInput(item){
            item.inputVisible = true;
            // input get focus
            this.$nextTick(_ => {this.$refs.inputRef.$refs.input.focus();});
        },
        async deleteTag(item,index){
            item.attr_vals.splice(index,1);
            const result = await this.$http.put('categories/' + this.selectedCategoryId[this.selectedCategoryId.length - 1] + '/attributes/' + item.attr_id,{attr_name: item.attr_name, attr_sel: item.attr_sel,attr_vals: item.attr_vals.join(' ')});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('删除标签失败');
            this.$message.success('删除标签成功');
        }
    },
    computed:{
        isButtonDisable(){
            if(this.selectedCategoryId.length !== 3) return true;
            else return false;
        },
        getActiveName(){
            if(this.activeName === 'many') return '动态参数';
            if(this.activeName === 'only') return '静态属性';
        }
    }
}
</script>

<style scoped>
.el-row{margin: 15px 0px;}
.el-tag{margin: 5px;}
.input-tag{width: 120px;}
</style>