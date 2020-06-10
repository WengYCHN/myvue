<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
          <!-- Card -->
        <el-card>
            <!-- Input -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @keyup.enter.native="getUserList" @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- Table -->
            <el-table :data="userList" stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- Switch -->
                        <el-switch v-model="scope.row.mg_state" @change="changeUserStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                            <!-- Button -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                            <!-- Tooltip -->
                            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- Pagination -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 25, 50]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="userListSize">
            </el-pagination>
        </el-card>
        <!-- Add user dialog -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addUserCloseDialog">
            <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username" @keyup.enter.native="addUser"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password" @keyup.enter.native="addUser" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email" @keyup.enter.native="addUser"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addUserForm.mobile"  @keyup.enter.native="addUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- Edit user dialog -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%" @close="editUserCloseDialog">
            <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserForm.email" @keyup.enter.native="editUser"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editUserForm.mobile"  @keyup.enter.native="editUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- Set role dialog -->
        <el-dialog title="分配角色" :visible.sync="setRoleDgialogVisible" width="40%" @close="setRoleCloseDialog">
            <el-form>
                <p>当前的用户：{{ userInfo.username}}</p>
                <p>当前的角色：{{ userInfo.role_name}}</p>
                <p>请选择新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
                    </el-select>
                </p>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDgialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRole">确 定</el-button>
            </span>
        </el-dialog>
    </div> 
</template>

<script>
    export default {
        data(){
            var checkEmail = (rules,value,callback) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                if(regEmail.test(value)) return callback();
                callback(new Error('请输入合法的邮箱'))
            }
            var checkMobile = (rules,value,callback) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9])[0-9]{8}$/;
                if(regMobile.test(value)) return callback();
                callback(new Error('请输入合法的号码'))
            }
            return{
                queryInfo: {
                    params: '',
                    pagenum: 1,
                    pagesize: 10,
                },
                addUserForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                },
                editUserForm: {
                    username: '',
                    email: '',
                    mobile: '',
                },
                addUserRules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},{min: 3, max: 10, message: '用户名的长度在3到10个字符之间', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'},{min: 6, max: 16, message: '密码的长度在6到16个字符之间', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱', trigger: 'blur'},{validator: checkEmail, trigger: 'blur'}],
                    mobile: [{required: true, message: '请输入电话', trigger: 'blur'},{validator: checkMobile, trigger: 'blur'}],
                },
                editUserRules: {
                    email: [{required: true, message: '请输入邮箱', trigger: 'blur'},{validator: checkEmail, trigger: 'blur'}],
                    mobile: [{required: true, message: '请输入电话', trigger: 'blur'},{validator: checkMobile, trigger: 'blur'}],
                },
                userList: [],
                userInfo: {},
                roleList: [],
                userListSize: 0,
                addDialogVisible: false,
                editDialogVisible: false,
                setRoleDgialogVisible: false,
                selectedRoleId: '',
            }
        },
        created(){this.getUserList()},
        methods: {
            async getUserList(){
                var result = await this.$http.get('users',{params:this.queryInfo});
                console.log(result.data);
                if(result.data.meta.status !==200) return this.$message.error("获取数据失败");
                this.userList = result.data.data.users;
                this.userListSize = result.data.data.total;
            },
            handleSizeChange:function(newSize){
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            handleCurrentChange:function(newPage){
                this.queryInfo.pagenum = newPage;
                this.getUserList();
            },
            async changeUserStatus(userInfo){
                const result = await this.$http.put('users/'+userInfo.id+'/state/'+userInfo.mg_state);
                console.log(result);
                if(result.data.meta.status !== 200){
                    userInfo.mg_state = !userInfo.mg_state;
                    return this.$message.error("用户状态更新失败");
                }
                this.$message.success("用户状态更新成功");
            },
            addUserCloseDialog:function(){
                this.$refs.addUserFormRef.resetFields();
            },
            editUserCloseDialog:function(){
                this.$refs.editUserFormRef.resetFields();
            },
            setRoleCloseDialog:function(){
                this.selectedRoleId = '';
                this.userInfo = {};
            },
            addUser(){
                this.$refs.addUserFormRef.validate(async valid => {
                    if(!valid) return;
                    const result = await this.$http.post('users',this.addUserForm);
                    console.log(result);
                    if(result.data.meta.status !== 201) return this.$message.error('新增用户失败');
                    this.$message.success('新增用户成功');
                    this.addDialogVisible = false;
                    this.getUserList();
                })
            },
            async showEditDialog(userId){
                this.editDialogVisible = true;
                const result = await this.$http.get('users/' + userId);
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error("获取失败");
                this.$message.success("获取成功");
                this.editUserForm = result.data.data;
            },
            editUser(){
                this.$refs.editUserFormRef.validate(async valid => {
                    if(!valid) return;
                    const result = await this.$http.put('users/'+ this.editUserForm.id, {email: this.editUserForm.email, mobile: this.editUserForm.mobile});
                    console.log(result);
                    if(result.data.meta.status !== 200) return this.$message.error('修改用户失败');
                    this.$message.success('修改用户成功');
                    this.editDialogVisible = false;
                    this.getUserList();
                })
            },
            async deleteUser(userId){
                const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).catch(err => err);
                if (confirmResult !== 'confirm') return this.$message.info('取消删除用户');
                const result = await this.$http.delete('users/' + userId);
                if(result.data.meta.status !== 200) return this.$message.error('删除用户失败');
                this.$message.success('删除用户完毕');
                this.getUserList();

            },
            async showSetRoleDialog(userInfo){
                this.userInfo = userInfo;
                this.setRoleDgialogVisible = true;
                const result = await this.$http.get('roles');
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('获取角色失败');
                this.$message.success('获取角色成功');
                this.roleList = result.data.data;
            },
            async setRole(){
                if(!this.selectedRoleId) return this.$message.error('未选择角色');
                const result = await this.$http.put('users/' + this.userInfo.id + '/role',{rid: this.selectedRoleId});
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('更改角色失败');
                this.$message.success('更改角色成功');
                this.setRoleDgialogVisible = false;
                this.getUserList();
            }
        },
    }
</script>

<style scoped>
</style>