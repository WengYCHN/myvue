<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card -->
        <el-card>
            <!-- Alert -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- Step -->
            <el-steps :space="300" :active="activeStep - 0" finish-status="success" align-center >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- Form -->
            <el-form :rules="addGoodsFormRules" ref="addGoodsFormRef" :model="addGoodsForm" label-width="100px" lable-position="top">
                <!-- Tab -->
                <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTabLeave" @tab-click="tabChicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name" ><el-input v-model="addGoodsForm.goods_name"></el-input></el-form-item>
                        <el-form-item label="商品价格" prop="goods_price" ><el-input v-model.number="addGoodsForm.goods_price" type="number"></el-input></el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight" ><el-input v-model.number="addGoodsForm.goods_weight" type="number"></el-input></el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" ><el-input v-model.number="addGoodsForm.goods_number" type="number"></el-input></el-form-item>
                        <el-form-item label="商品分类">
                            <!-- Cascader -->
                            <el-cascader v-model="addGoodsForm.goods_cat" :options="categoryList" :props="cascaderProps" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item  v-for="item in paramList" :key="item.attr_id">
                            <el-tag type="danger" size="medium"> {{ item.attr_name }} </el-tag>
                            <!-- Checkbox -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="(item,index) in item.attr_vals" :key="index" :label="item"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item  v-for="item in attributeList" :key="item.attr_id">
                            <el-tag type="danger" size="medium">{{ item.attr_name }}</el-tag>
                                <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload action="https://www.liulongbin.top:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObject" :on-success="pictureLoadSuccess">
                                <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- Vue-quill-editor -->
                        <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="submitButton" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- Preview pirctur Dialog -->
        <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
            <img :src="previewPath" />
        </el-dialog>
    </div>
</template>


<script>
import _ from 'loadsh'
export default {
    data(){
        return{
            activeStep: 0,
            addGoodsFormRules: {
                goods_name: [{required: true, message: "请输入商品名称", trigger: 'blur'}],
                goods_price: [{type: 'number', min: 1, required: true, message: "请输入商品价格", trigger: 'blur'}],
                goods_number: [{type: 'number', min: 1, required: true, message: "请输入商品数量", trigger: 'blur'}],
                goods_weight: [{type: 'number', min: 1, required: true, message: "请输入商品重量", trigger: 'blur'}],
                // goods_introduce: [{required: true, message: "请输入", trigger: 'blur'}],
                // attrs: [{required: true, message: "请输入", trigger: 'blur'}],
            },
            addGoodsForm: {
                goods_name: '',  
                goods_cat: [],
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                goods_introduce: '',
                pics: [],
                attrs: [],
            },
            cascaderProps: {expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children'},
            categoryList: [],
            paramList: [],
            attributeList: [],
            headerObject: {Authorization: window.sessionStorage.getItem('token')},
            previewPath: '',
            previewDialogVisible: false,
        }
    },
    created(){this.getCategoryList()},
    methods: {
        handleChange(){
            if(this.addGoodsForm.goods_cat.length !== 3) this.addGoodsForm.goods_cat.splice(0,this.addGoodsForm.goods_cat.length);
        },
        handlePreview(resource){
            this.previewPath = resource.response.data.url;
            this.previewDialogVisible = true;
        },
        handleRemove(resource){
            console.log(resource);
            const resourcePath = resource.response.data.temp_path;
            const index = this.addGoodsForm.pics.findIndex(item => {item.pic == resourcePath});
            this.addGoodsForm.pics.splice(index,1);
            
        },
        pictureLoadSuccess(response){
            console.log(response);
            const pictureInfo = {pic: response.data.temp_path};
            this.addGoodsForm.pics.push(pictureInfo);
        },
        async getCategoryList(){
            const result = await this.$http.get('categories');
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取分类失败');
            this.$message.success('获取分类成功');
            this.categoryList = result.data.data;
        },
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName == 0 && this.addGoodsForm.goods_cat.length !== 3){
                this.activeStep = oldActiveName;
                this.$message.error('请先选择分类');
                return false;
            }
            return true;
        },
        async getAttributeListOrParamList(){
            var info = '';
            var sel = '';
            if(this.activeStep == 1){info = '参数'; sel = 'many'}
            if(this.activeStep == 2){info = '属性'; sel = 'only'}
            var result  = await this.$http.get('categories/' + this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1] +'/attributes',{params:{sel: sel}});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取' + info + '失败');
            this.$message.success('获取' + info + '成功');
            // String to array

            if(sel === 'many') {this.paramList = result.data.data;result.data.data.forEach(item => {item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[];});}
            if(sel === 'only') this.attributeList = result.data.data;
        },
        tabChicked(){
            if(this.activeStep == 1 || this.activeStep == 2){
                this.getAttributeListOrParamList();
            }
        },
        async addGoods(){
            this.$refs.addGoodsFormRef.validate(async valid => {if(!valid){this.$message.error('请填写必要的数据');}})
            const form = _.cloneDeep(this.addGoodsForm);
            form.goods_cat = form.goods_cat.join(',');
            this.paramList.forEach(item => { const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(','),};this.addGoodsForm.attrs.push(newInfo);})
            this.attributeList.forEach(item => {const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals};this.addGoodsForm.attrs.push(newInfo);})
            form.attrs = this.addGoodsForm.attrs;
            const result = await this.$http.post('goods',form);
            console.log(result);
            if(result.data.meta.status !== 201) return this.$message.error('添加商品失败');
            this.$message.success('添加商品成功');
            this.$router.push('/goods');
        },
    },
}
</script>

<style scoped>
    .el-steps{margin: 15px 0px;}
    .submitButton{ margin: 15px 0px;}
</style>