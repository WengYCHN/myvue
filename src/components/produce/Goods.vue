<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card -->
        <el-card>
            <el-row :gutter="20">
                <!-- Input -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getGoodsList" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <!-- Button -->
                <el-col :span="4"><el-button type="primary" @click="redirectToAddGoodsPage">添加商品</el-button></el-col>
            </el-row>
            <!-- Table -->
            <el-table :data="goodsList" stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="价格（元）" prop="goods_price"></el-table-column>
                <el-table-column label="重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" >
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditGoodsDialog(scope.row)"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 25, 50]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="goodsListSize">
            </el-pagination>
        </el-card>
        <!-- Edit good dialog -->
        <el-dialog title="修改商品" :visible.sync="editGoodsDialogVisible" width="40%" @close="editGoodsCloseDialog">
            <el-form :model="editGoodsForm" ref="editGoodsFormRef" :rules="editGoodsRules" label-width="80px">
                <el-form-item label="商品名称" prop="goods_name"><el-input v-model="editGoodsForm.goods_name" @keyup.enter.native="editGoods" ></el-input></el-form-item>
                <el-form-item label="商品价格" prop="goods_price"><el-input v-model.number="editGoodsForm.goods_price" type="number" @keyup.enter.native="editGoods" ></el-input></el-form-item>
                <el-form-item label="商品数量" prop="goods_number"><el-input v-model.number="editGoodsForm.goods_number" @keyup.enter.native="editGoods" ></el-input></el-form-item>
                <el-form-item label="商品重量" prop="goods_weight"><el-input v-model.number="editGoodsForm.goods_weight" @keyup.enter.native="editGoods" ></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editGoods">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10,

            },
            editGoodsForm: {
                goods_id: 0,
                goods_name: '',
                goofs_cat: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                goods_introduce: '',
                pics: {},
                attrs: [],
            },
            editGoodsRules:{
                goods_name: [{required: true,  message: '请填写商品名称', trigger: 'blur' }],
                goods_price: [{type: 'number', required: true,  message: '请填写商品价格', trigger: 'blur' }],
                goods_number: [{type: 'number', required: true,  message: '请填写商品数量', trigger: 'blur' }],
                goods_weight: [{type: 'number', required: true,  message: '请填写商品重量', trigger: 'blur' }],
            },
            goodsList: [],
            goodsListSize: 0,
            editGoodsDialogVisible: false,
        }
    },
    created(){this.getGoodsList()},
    methods: {
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },
        async getGoodsList(){
            const result = await this.$http.get('goods',{params: this.queryInfo});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取商品失败');
            this.$message.success('获取商品成功');
            this.goodsList = result.data.data.goods;
            this.goodsListSize = result.data.data.total;
        },
        async deleteGoods(goods_id){
            const confirmResult =  await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).catch(err => err);
            if (confirmResult !== 'confirm') return this.$message.info('取消删除商品');
            const result = await this.$http.delete('goods/' + goods_id);
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('删除商品失败');
            this.$message.success('删除商品成功');
            this.getGoodsList();
        },
        showEditGoodsDialog(item){
            this.editGoodsDialogVisible = true;
            this.editGoodsForm.goods_name = item.goods_name;
            this.editGoodsForm.goofs_cat = item.goods_cat;
            this.editGoodsForm.goods_price = item.goods_price;
            this.editGoodsForm.goods_number = item.goods_number;
            this.editGoodsForm.goods_weight = item.goods_weight;
            this.editGoodsForm.goods_id = item.goods_id;
            this.editGoodsForm.goods_introduce = item.goods_introduce;
            this.editGoodsForm.pics = item.pics;
            this.editGoodsForm.attrs = item.attrs;
        },
        editGoodsCloseDialog(){
            this.$refs.editGoodsFormRef.resetFields();
            this.editGoodsForm.goods_id = 0;
        },
        async editGoods(){
            const result = await this.$http.put('goods/' + this.editGoodsForm.goods_id,this.editGoodsForm);
            console.log(result);
            if(result.data.meta.status !== 201) return this.$message.error('修改商品失败');
            this.$message.success('修改商品成功');
            this.getGoodsList();
            this.editGoodsDialogVisible = false;
        },
        redirectToAddGoodsPage(){
            this.$router.push('/goods/add');
        },
    },
}
</script>

<style scoped>

</style>