<template>
    <div>
        <!-- Card -->
        <el-card>
            <el-row :gutter="20">
                <!-- Input -->
                <el-col :span="8">  
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getOrderList" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status == 1" type="success">已付款</el-tag>
                        <el-tag v-if="scope.row.pay_status == 0" type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.is_send == '是'" type="success">已发货</el-tag>
                        <el-tag v-if="scope.row.is_send == '否'" type="danger">未发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditOrderDialog(scope.row)"></el-button>
                        <el-button type="success" icon="el-icon-position" size="mini" @click="showViewLogisticsDialog(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>  
            <!-- Pagination -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 25, 50]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="orderListSize">
            </el-pagination>
        </el-card>
        <!-- Edit order Dialog -->
        <el-dialog title="修改地址" :visible.sync="editOrderDialogVisible" width="40%" @close="editOrderCloseDialog">
            <el-form :model="editOrderForm" ref="editOrderFormRef" :rules="editOrderFormRules">
                <el-form-item label="省市区/县" prop="address1">
                    <el-input v-model="editOrderForm.address1"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="editOrderForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editOrderDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editOrder">确 定</el-button>
            </span>
        </el-dialog>
        <!-- View logistics dialog -->
        <el-dialog title="物流信息" :visible.sync="viewLogisticsDialogVisible" width="40%" @close="viewLogisticsCloseDialog">
            <!-- Timeline -->
            <el-timeline>
                <el-timeline-item   v-for="(item, index) in LogisticsInfo" :key="index"   :timestamp="item.time">
                    {{item.context}}
                </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">                
                <el-button type="primary" @click="viewLogisticsDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            queryInfo: {query: '',pagesize: 10,pagenum: 1},
            orderList: [],
            orderListSize: 0,
            editOrderDialogVisible: false,
            editOrderFormRules: {
                address1: [{required: true,  message: '请填写省市区', trigger: 'blur' },],
                address2: [{required: true,  message: '请填写地址', trigger: 'blur' },]
            },
            editOrderForm: {
                address1: '',
                address2: '',
            },
            currentOrder: {},
            viewLogisticsDialogVisible: false,
            LogisticsInfo: [],

        }
    },
    created(){this.getOrderList()},
    methods: {
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },
        async getOrderList(){
            const result = await this.$http.get('orders',{params: this.queryInfo});
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取订单失败');
            this.$message.success('获取订单成功');
            this.orderList = result.data.data.goods;
            this.orderListSize = result.data.data.total;
        },
        editOrderCloseDialog(){
            this.$refs.editOrderFormRef.resetFields();
            this.editOrderDialogVisible = false;
        },
        showEditOrderDialog(item){
            this.editOrderDialogVisible = true;
            this.currentOrder = item;
        },
        async editOrder(){
            this.$refs.editOrderFormRef.validate(async valid => {
                if(!valid) return;
            // const result = await this.$http('');
            // if(result.data.meta.status !== 200) return this.$message.error('修改地址失败');
            // this.$message.success('修改地址成功');
            // this.getOrderList();
            this.editOrderDialogVisible = false;
            })
        },
        viewLogisticsCloseDialog(){
            this.viewLogisticsDialogVisible = false;
        },
        async showViewLogisticsDialog(item){
            this.viewLogisticsDialogVisible = true;
            const result = await this.$http.get('/kuaidi/1106975712662');
            console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error('获取物流失败');
            this.$message.success('获取物流成功');
            this.LogisticsInfo = result.data.data;

        },
    }
}
</script>

<style scoped>

</style>