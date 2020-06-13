<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card -->
        <el-card>
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import _ from 'loadsh'
export default {
    data(){
        return{
            options: {
                title: {text: '用户来源'},
                tooltip: {trigger: 'axis',axisPointer: {type: 'cross',label: {backgroundColor: '#E9EEF3'}}},
                grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                xAxis: [{boundaryGap: false}],
                yAxis: [{type: 'value'}]
            },
        }
    },
    created(){},
    async mounted(){
        var myChart = this.$echarts.init(document.getElementById("main"));
        const result = await this.$http.get('reports/type/1');  
        console.log(result);
        if(result.data.meta.status !== 200) return this.$message.error('获取报表失败');
        this.$message.success('获取报表成功');

        const data = _.merge(result.data.data,this.options);

        myChart.setOption(data);
    },
    methods: {}
}
</script>

<style scoped>

</style>