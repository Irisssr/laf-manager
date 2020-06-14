<template>
    <div class="login">
        <el-form class="logForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <h2>注册</h2>
            <el-form-item label="用户账号" prop="admin">
                <el-input v-model="ruleForm.admin"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="ruleForm.realName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="admPass">
                <el-input v-model="ruleForm.admPass"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="telephone">
                <div class="telP">
                    <el-input v-model="ruleForm.telephone"></el-input>
                    <el-button @click="sendCode" :disabled="isCode">
                        <span v-show="isCode"><i class="el-icon-loading" ></i>{{ retime+'s' }}</span>
                        <span v-show="!isCode">获取手机验证码</span>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="验证码" prop="phcode">
                <el-input v-model="ruleForm.phcode"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <el-form-item>
                <router-link ref="span" to="/login">已有账号?去登录</router-link>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default{
    data(){
        const validateAdmin=(rule,value,callback)=>{
            this.$api.check({
                id:value
            }).then(res=>{
                if(res.code === 0){
                    callback(new Error('该用户已存在'))
                }else{
                    callback();
                }
            })
        };
        const validateTel=(rule,value,callback)=>{
            var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if(!myreg.test(value)){
                callback(new Error('手机号格式错误'));
            }else{
                callback();
            }            
        };
        const validateEmail=(rule,value,callback)=>{
            var myreg = new RegExp("^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$");
            if(!myreg.test(value)){
                callback(new Error('邮箱格式错误'));
            }else{
                callback();
            }
        };
        return{
            ruleForm:{
                admin:'',
                realName:'',
                admPass:'',
                email:'',
                telephone:'',
                phcode:''
            },
            rules:{
                admin:[
                    { required:true,message:'请输入账号',trigger:'blur'},
                    { validator:validateAdmin,trigger:'blur' }
                ],
                realName:[
                    { required:true,message:'请输入真实名',trigger:'blur'},
                ],
                admPass:[
                    { required:true,message:'请输入密码',trigger:'blur'},
                ],
                telephone:[
                    { required:true,message:'请输入手机号',trigger:'blur'},
                    { validator:validateTel,trigger:'blur' }
                ],
                email:[
                    { required:true,message:'请输入邮箱',trigger:'blur'},
                    { validator:validateEmail,trigger:'blur' }
                ],
                phcode:[
                    { required:true,message:'请输入验证码',trigger:'blur'},
                ]
            },
            isCode:false,
            retime:'30'
        }
    },
    methods:{
        submitForm(formName){
            let that=this;
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.$api.register({
                        admId:that.ruleForm.admin,
                        admPass:that.ruleForm.admPass,
                        code:that.ruleForm.phcode,
                        email:that.ruleForm.email,
                        realName:that.ruleForm.realName,
                        telephone:that.ruleForm.telephone
                    }).then(res=>{
                        if(res.code === 1){
                            that.$message(res.message);
                            that.$router.push('/login');
                        }else{
                            return that.$message('注册失败');
                        }
                    });
                }else{
                    return that.$message("未按要求填写,无法注册");
                }
            })
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        sendCode(){
            let that=this;
            if(!that.ruleForm.telephone){
                return that.$message("请填写手机号");
            }
            this.$message('验证码已发送至手机'+`${this.ruleForm.telephone}`+',请注意查收');
            this.isCode=true;
            this.reTime();
            this.$api.code({
                phone:that.ruleForm.telephone
            })
        },
        reTime(){
            // 倒计时
            let timer=setInterval(()=>{
                if(this.retime==0){
                    clearInterval(timer);
                    this.isCode=false;
                }else{
                    this.isCode=true;
                    this.retime--;
                }
            },1000)
        }
    }
}
</script>

<style lang="scss">
    .logForm{
        width: 400px;
        display: flex;
        flex-direction: column;
        // text-align: center;
        padding: 40px;
        position: relative;
        z-index: 100;
        background: inherit;
        overflow: hidden;
        border-radius: 10px;

        .el-form-item{
            .el-input{
                border:none;
                border-radius: 5px;
            }
            .telP{
                display:flex;
                align-items: center;
                justify-content: space-between;
                button{
                    margin:0 5px;
                }
            }
            label{
                color:#333;
            }
        }
    }
    .logForm::before{
        content:"";
        width: calc(100% + 20px);
        height: calc(100% + 20px);
        background: inherit;
        box-shadow: inset 0 0 0 200px rgba(255,255,255,0.25);
        position: absolute;
        top:-10px;
        left:-10px;
        z-index: -1;
        filter: blur(2px);
        overflow: hidden;
    }
</style>