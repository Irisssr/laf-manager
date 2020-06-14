<template>
    <div class="login">
        <transition name="loading">
            <Loading v-if="isLoad"></Loading>
        </transition>
        
        <el-form class="logForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <h2>登录</h2>
            <el-form-item label="用户账号" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="width:100%" type="primary" @click="toLogin('ruleForm')">登录</el-button>
            </el-form-item>
            <el-form-item>
                <p class="toHref"><router-link ref="span" to="/register">没有账号?去注册</router-link></p>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue'

export default {
    components:{
        Loading
    },
    data(){
        return{
            isLoad:false,
            ruleForm:{
                username:'',
                password:''
            },
            rules:{
                username:[
                    { required:true,message:'请输入账号',trigger:'blur'}
                ],
                password:[
                    { required:true,message:'请输入密码',trigger:'blur'}
                ]
            },
        }
    },
    methods:{
        toLogin(formName){
            // 管理员登录
            let that=this;
            that.isLoad=true;
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    that.$api.login({
                        username:that.ruleForm.username,
                        password:that.ruleForm.password
                    }).then(res=>{
                        if(res.code === -1){
                            that.isLoad=false;
                            that.$message('无此用户');
                        }
                        if(res.code === 0){
                            that.isLoad=false;
                            that.$message('密码错误');
                        }
                        if(res.code === 2){
                            that.isLoad=false;
                            that.$message("对不起,此用户无权登录,请联系管理员");
                        }
                        if(res.code === 1){
                            localStorage.setItem('token',res.data.token);
                            localStorage.setItem('log',JSON.stringify(res.data.log));
                            localStorage.setItem('username',JSON.stringify(res.data.username));
                            this.$router.push('/dashboard');
                            that.isLoad=false;
                        }
                    })
                }else{
                    that.isLoad=false;
                    that.$message('请按要求填写信息');
                }
            })
        }
    }
}
</script>

<style lang="scss">
</style>