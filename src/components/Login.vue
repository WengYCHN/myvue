<template>
    <div class="login_container">
        <div class="login_box">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_from">
                <!-- Title -->
                <h1 class="login_title">公路港后台管理系统</h1>
                <!-- Account -->
                <el-form-item prop="username">
                    <el-input @keyup.enter.native="verifyLoginInfo()" v-model="loginForm.username" prefix-icon="el-icon-user" ></el-input>
                </el-form-item>
                <!-- Password -->
                <el-form-item prop="password">
                    <el-input @keyup.enter.native="verifyLoginInfo()" v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" ></el-input>
                </el-form-item>
                <!-- Button -->
                <el-form-item class="buttons">
                    <el-button type="primary" @click="verifyLoginInfo">Login</el-button>
                    <el-button type="info" @click="resetLoginFrom">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default{
        data() {
            return{
                loginForm: {
                    username: "",
                    password: "",
                },
                loginFormRules: {
                    username: [
                        {required: true, message: "请输入登录名称", trigger: "blur"},
                        {min: 3,max: 10, message: "长度在3到10个字符区间", trigger: "blur"},
                    ],
                    password: [
                        {required: true, message: "请输入登录密码", trigger: "blur"},
                        {min: 6,max: 16, message: "长度在6到16个字符区间", trigger: "blur"},
                    ],
                }
            }
        },
        methods: {
            // Reset loginFrom
            resetLoginFrom:function(){this.$refs.loginFormRef.resetFields();},
            // Verify LoginInfo
            verifyLoginInfo:function(){
                this.$refs.loginFormRef.validate(async (vaild) => {
                    if(!vaild) return;
                    const result = await this.$http.post('login',this.loginForm);
                    console.log(result);
                    // Login failed
                    if(result.data.meta.status !== 200) return this.$message.error('登陆失败');
                    // Login successed
                    window.sessionStorage.setItem("token",result.data.data.token);  // Save token info
                    this.$router.push('/home'); // Redirect
                    this.$message.success("登录成功");
                })
            },
        },
    }
</script>

<style type="text/css" scoped="true">
    .login_container{background-color: #2b4b6b;height: 100%;}
    .login_box{width: 450px;height: 300px;background-color: #ffffff;border-radius:3px;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);}
    .login_title{text-align: center;}
    .login_from{width: 100%;padding: 0px 20px;box-sizing: border-box;position: absolute;bottom:0;}
    .buttons{display: flex;justify-content: flex-end;}
</style>