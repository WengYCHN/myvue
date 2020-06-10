<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card -->
        <!-- Button -->
        <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
        <!-- Table -->
        <el-table :data="roleList" stripe>
            <el-table-column label=" " type="expand">
                <template slot-scope="scope">
                    <el-row :class="['borderBottom',index1===0?'borderTop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                        <!-- Left for expand -->
                        <!-- Firstary -->
                        <el-col :span="5">
                            <el-tag @close="deleteRight(scope.row,item1.id)" closable>{{ item1.authName }}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- Right for expand -->
                        <el-col :span="19">
                            <el-row :class="[index2===0?'':'borderTop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                <!-- Secondart -->
                                <el-col :span="6">
                                    <el-tag type="success" @close="deleteRight(scope.row,item2.id)" closable>{{ item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- Thirdary -->
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" @close="deleteRight(scope.row,item3.id)" closable>
                                        {{ item3.authName }}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- Add role dialog -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%" @close="addRoleCloseDialog">
            <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName" @keyup.enter.native="addRole"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc" @keyup.enter.native="addRole"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- Edit role dialog -->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%" @close="editRoleCloseDialog">
            <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName" @keyup.enter.native="editRole"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc" @keyup.enter.native="editRole"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- Set role dialog -->
        <el-dialog title="分配权限" :visible.sync="setDialogVisible" width="40%" @close="setRightCloseDialog">
            <!-- Tree -->
            <el-tree :data="rightList" ref="treeRef" :props="treeProps" node-key="id" :default-checked-keys="checkedKeys" show-checkbox default-expand-all></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                roleList: [],
                rightList: [],
                checkedKeys: [],
                addRoleForm: {
                    roleName: '',
                    roleDesc: '',
                },
                addRoleFormRules: {
                    roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                    roleDesc: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
                },
                editRoleForm: {},
                editRoleFormRules: {
                    roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                    roleDesc: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
                },
                treeProps: {
                    children: 'children',
                    label: 'authName',
                },
                addDialogVisible: false,
                editDialogVisible: false,
                setDialogVisible: false,
                currentRoleId: 0,
            }
        },
        created(){this.getRoleList()},
        methods: {
            async getRoleList(){
                const result = await this.$http.get('roles');
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('获取角色失败');
                this.$message.success('获取角色成功');
                this.roleList = result.data.data;
            },
            showAddRoleDialog(){
                this.addDialogVisible = true;
            },
            addRoleCloseDialog(){
                this.$refs.addRoleFormRef.resetFields();
            },
            setRightCloseDialog(){
                this.checkedKeys.splice(0,this.checkedKeys.length);
            },
            addRole(){
                this.$refs.addRoleFormRef.validate(async valid => {
                    if(!valid) return;
                    const result = await this.$http.post('roles',this.addRoleForm);
                    console.log(result);
                    if(result.data.meta.status !== 201) return this.$message.error('创建角色失败');
                    this.$message.success('创建角色成功');
                    this.addDialogVisible = false;
                    this.getRoleList();
                })
            },
            async showEditRoleDialog(roleId){
                this.editDialogVisible = true;
                const result = await this.$http.get('roles/' + roleId);
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('获取角色失败');
                this.$message.success('获取角色成功');
                this.editRoleForm = result.data.data;
            },
            editRoleCloseDialog(){
                this.$refs.editRoleFormRef.resetFields();
            },
            editRole(){
                this.$refs.editRoleFormRef.validate(async valid => {
                    if(!valid) return;
                    const result = await this.$http.put('roles/' + this.editRoleForm.roleId,{roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc});
                    console.log(result);
                    if(result.data.meta.status !== 200) return this.$message.error('修改角色失败');
                    this.$message.success('修改角色成功');
                    this.editDialogVisible = false;
                    this.getRoleList();
                })
            },
            async deleteRole(roleId){
                const confirmResult =  await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).catch(err => err);
                if (confirmResult !== 'confirm') return this.$message.info('取消删除角色');
                const result = await this.$http.delete('roles/' + roleId);
                if(result.data.meta.status !== 200) return this.$message.error('删除角色失败');
                this.$message.success('删除角色完毕');
                this.getRoleList();
            },
            async deleteRight(role,rightId){
                const confirmResult =  await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).catch(err => err);
                if (confirmResult !== 'confirm') return this.$message.info('取消删除权限');
                const result = await this.$http.delete('roles/' + role.id +'/rights/' + rightId);
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('删除权限失败');
                this.$message.success('删除权限成功');
                role.children = result.data.data;
            },
            async showSetRightDialog(role){
                 this.currentRoleId = role.id;
                this.getLeafKeys(role,this.checkedKeys);
                this.setDialogVisible = true;
                const result = await this.$http.get('rights/tree');
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('获取权限失败');
                this.$message.success('获取权限成功');
                this.rightList = result.data.data;
            },
            async setRight(){
                const keys = [
                    this.$refs.treeRef.getCheckedKeys(),this.$refs.treeRef.getHalfCheckedKeys()
                ];
                const idStr = keys.join(',');
                const result = await this.$http.post('roles/' + this.currentRoleId + '/rights', {rids: idStr})
                console.log(result);
                if(result.data.meta.status !== 200) return this.$message.error('修改权限失败');
                this.$message.success('修改权限成功');
                this.setDialogVisible = false;
                this.getRoleList();
                
            },
            getLeafKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id);
                }
                node.children.forEach(item => this.getLeafKeys(item,arr));
            }
        }
    }
</script>

<style scoped>
.el-tag{margin: 8px;}
.borderBottom{border-bottom:1px solid #eeeeee;}
.borderTop{border-top: 1px solid #eeeeee;}
.vcenter{display: flex;align-items: center;}
</style>