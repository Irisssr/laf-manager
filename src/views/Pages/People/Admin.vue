<template>
    <div>
        <transition name="loading">
            <Loading v-if="isLoad"></Loading>
        </transition>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-bank-card"></i>{{ this.$route.meta.title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <div class="container">
            <div class="handle-box">
                <!-- 搜索 -->
                <el-input placeholder="账号" clearable class="handle-input mr10" v-model="searchNum"></el-input>
                <span class="fontColor mr10">用户状态</span>
                <el-select v-model="value" class="handle-input mr10">
                    <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search"
                    size="big" 
                    @click="handleSearch">搜索</el-button>
                <el-button type="danger"
                    v-show="isCancle"
                    size="big" 
                    @click="handleCancel">取消</el-button>
            </div>
            <div class="handle-box">
                <!-- 删除 -->
                <el-button type="primary" size="small"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="deleteSelection">
                    批量删除
                </el-button>
                <el-button type="primary" size="small"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addUser">
                    添加
                </el-button>
                <el-button type="success" size="small"
                    icon="el-icon-document"
                    class="handle-del mr10"
                    :loading="downloadLoading"
                    @click="handleDownload">
                    导出Excel
                </el-button>
            </div>
            
            <!-- 表格 -->
            <el-table
                height="350"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="drak"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column align="center" label="管理员id" prop="id"></el-table-column>
                <el-table-column align="center" label="账号" prop="admId"></el-table-column>
                <el-table-column align="center" label="密码" prop="admPass"></el-table-column>
                <el-table-column align="center" label="姓名" prop="realName"></el-table-column>
                <el-table-column align="center" label="电话" prop="telephone"></el-table-column>
                <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="{row}">
                        <el-tag :type="row.status | typeFilter">{{ row.status | statusFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部导航页 -->
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="query.pageIndex"
                    :page-sizes="[10,50, 100]"
                    :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="query.totalMsg ">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑管理员 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible"
            @close="closeDialog">
            <el-form v-model="oneData">
                <el-form-item label="管理员id" :label-width="formLabelWidth">
                    {{oneData.id}}
                </el-form-item>
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="oneData.admId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="oneData.admPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="oneData.realName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="oneData.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="oneData.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="oneData.status" placeholder="状态">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="超管" value="super"></el-option>
                        <el-option label="禁止登录" value="no"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary"  @click="update">确认修改</el-button>
            </div>
        </el-dialog>
        <!-- 添加管理员 -->
        <el-dialog :title="title2" :visible.sync="dialogFormVisible2">
            <el-form>
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input clearable v-model="admId" autocomplete="off" @blur="outInput"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input clearable v-model="admPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" :label-width="formLabelWidth">
                    <el-input clearable v-model="realName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input clearable v-model="telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input clearable v-model="email" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible2=false">取 消</el-button>
                <el-button type="primary"  @click="addAdmin">添 加</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Loading from '@/components/Loading.vue'

export default {
    filters:{
        typeFilter(status){
            const typeMap={
                super:'',
                no:'info',
                admin:'success'
            }
            return typeMap[status];
        },
        statusFilter(status){
            const statusMap={
                super:'超管',
                admin:'管理员',
                no:'禁止登录'
            }
            return statusMap[status]
        }
    },
    components:{
        Loading
    },
    computed:{
        ...mapState({
            userInfo:state=>state.userInfo
        })
    },
    data(){
        return{
            isLoad:true,
            searchNum:'',
            value:'',
            isCancle:false,
            query:{
                totalMsg:null,
                pageIndex:1,
                pageSize:10
            },
            tableData:[],
            options:[
                {label:'不限',value:''},
                {label:'管理员',value:'admin'},
                {label:'超管',value:'super'},
                {label:'禁止登录',value:'no'},
            ],
            multipleSelection:[],
            formLabelWidth:'120px',
            downloadLoading:false,
            dialogFormVisible:false,
            dialogFormVisible2:false,
            oneData:{},
            title:'管理员编辑',
            title2:'添加管理员',
            admId:'',
            admPass:'',
            telephone:'',
            realName:'',
            email:'',
            list:[]
        }
    },
    created(){
        this.isLoad=true;
        this.getAdminList();
    },
    methods:{
        //获取信息
        getAdminList(){
            let that=this;
            that.$api.admins({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.value
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.admins;
                that.isLoad=false;
            })
        },
        //搜索
        handleSearch(){
            let that=this;
            that.$api.admins({
                username:that.searchNum,
                status:that.value
            }).then(res=>{
                that.isCancle=true;
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.admins;
            })
        },
        handleCancel(){
            this.getAdminList();
            this.isCancle=false;
        },
        //单项删除
        handleDelete(info){
            let that=this;
            this.$confirm('确定要删除吗?','提示',{
                type:'warning'
                }).then(()=>{
                that.$api.del({
                    ids:info.id
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                        that.getAdminList();
                    }
                    that.$message(res.message);
                })
            }).catch(()=>{})
        },
        //多项删除
        handleSelectionChange(val){
            this.multipleSelection=val;
        },
        deleteSelection(){
            let that=this,str='';
            if(this.multipleSelection.length === 0) return this.$message('至少选择一项');
            that.multipleSelection.forEach(item=>{
                str=str+item.id+',';
            })
            this.$confirm('确定要删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.del({
                    ids:str
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                    }
                    that.getAdminList();
                })
            }).catch(()=>{})
        },
        //添加管理员
        addUser(){
            this.admId='';
            this.email='';
            this.telephone='';
            this.email='';
            this.admPass='';
            this.realName='';
            this.dialogFormVisible2=true;
        },
        outInput(){//检查用户是否已存在
            let that=this;
            this.$api.check({
                id:that.admId
            }).then(res=>{
                if(res.code === 0){
                    return that.$message("该用户已存在");
                }
            })
        },
        addAdmin(){
            let that=this;
            that.$api.add({
                admId:that.admId,
                admPass:that.admPass,
                telephone:that.telephone,
                realName:that.realName,
                email:that.email
            }).then(res=>{
                that.$message(res.message);
                that.dialogFormVisible2=false;
                that.getAdminList();
            })
        },
        //编辑信息
        handleEdit(info){
            this.dialogFormVisible=true;
            this.oneData=info;
        },
        closeDialog(){
            this.getAdminList();
        },
        update(){
            let that=this;
            that.$api.update({
                admId:that.oneData.admId,
                admPass:that.oneData.admPass,
                email:that.oneData.email,
                realName:that.oneData.realName,
                status:that.oneData.status,
                telephone:that.oneData.telephone
            }).then(res=>{
                that.$message(res.message);
                that.dialogFormVisible=false;
            })
        },
        //打印
        handleDownload() {
            let that=this;
            if(this.multipleSelection.length === 0){
                that.list =that.tableData;
            }else{
                that.list = that.multipleSelection;
            }
            this.downloadLoading=true;
            import("@/excel/Export2Excel").then(excel=>{
                const tHeader=['账号','密码','姓名','电话','邮箱','用户状态'];
                const filterVal =["admId","admPass","realName","telephone","email","status"];
                const data=this.formatJson(filterVal,that.list);
                excel.export_json_to_excel(tHeader,data,"后台管理用户");
                this.downloadLoading=false;
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v=>filterVal.map(j=>{
                return v[j];
            }))
        },
        //底部跳转页数
        handleSizeChange(val){
            this.query.pageSize=val;
        },
        handleCurrentChange(val){
            let that=this;
            this.query.pageIndex=val;
            that.$api.admins({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.value
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.admins;
            })
        }
    }
}
</script>
<style lang="scss">
    .mask{
        position: absolute;
        top:0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4);
        z-index: 99;
    }
</style>