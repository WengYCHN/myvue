<template>
    <el-container class="home-container">
        <!-- Header -->
        <el-header>
            <span>ABCDEFGHIJ</span>
            <el-button type="info" @click="userLogout">退出</el-button>
        </el-header>
        <el-container>
            <!-- Aside -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- Toggle button -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- Menu -->
                <el-menu background-color="#333744" text-color="#ffffff" :default-active="$route.path" unique-opened router :collapse="isCollapse" :collapse-transition="false" >
                    <!-- Firstary menu -->
                    <el-submenu :index="item.id + ''" v-for="(item,index) in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconList[index]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- Secondary menu -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- Main -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data(){
            return{
                menuList: [],
                iconList: ["el-icon-user","el-icon-set-up","el-icon-goods","el-icon-s-order","el-icon-s-data"],
                isCollapse: false,
            }
        },
        created(){this.getMenuList()},
        methods: {
            userLogout:function(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            async getMenuList(){
                const result = await this.$http.get('menus');
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error(result.data.meta.meg);
                this.menuList = result.data.data;
            },
            toggleCollapse:function(){
                this.isCollapse = !this.isCollapse;
            },
        },
    }
</script>

<style scoped>
    .home-container {width: 100%;height: 100%;}
    .el-header {background-color: #373d41;display: flex;justify-content: space-between;align-items: center;color: #ffffff;font-size: 20px;}
    .el-aside {background-color: #333744;}
    .toggle-button {background-color: #4a5064;font-size: 10px;line-height: 24px;color: #ffffff;text-align: center;letter-spacing: 0.2em;cursor: pointer;}
    .el-menu {border: none;}
    .el-main {background-color: #eaedf1;}
</style>