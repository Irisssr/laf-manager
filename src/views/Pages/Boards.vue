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
                <span class="fontColor mr10">公告状态</span>
                <el-select class="handle-input mr10" v-model="searchs.status">
                    <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search"
                    size="big" 
                    @click="handleSearch">搜索</el-button>
                <el-button type="danger"
                    size="big"
                    v-show="isCan"
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
                <el-button type="warning" size="small"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addBoard">
                    添加公告
                </el-button>
            </div>
            <!-- 内容 -->
            <el-table
                height="350"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="drak"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column align="center" label="公告id" prop="id"></el-table-column>
                <el-table-column align="center" label="公告内容" width="250" prop="context"></el-table-column>
                <el-table-column align="center" label="更新人账号" width="100" prop="admId"></el-table-column>
                <el-table-column align="center" label="更新时间" width="200" sortable prop="updateTime"></el-table-column>
                <el-table-column align="center" label="公告状态">
                    <template slot-scope="{row}">
                        <el-tag :type="row.noticeStatus | typeStatus">{{ row.noticeStatus|statusFilter}}</el-tag>  
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 导航 -->
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="query.pageIndex"
                    :page-sizes="[10,50, 100]"
                    :page-size="query.paegSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="query.totalMsg">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible"
            @close="closeDialog">
            <el-form v-model="oneData">
                <el-form-item label="公告id" :label-width="formLabelWidth">
                    {{oneData.id}}
                </el-form-item>
                <el-form-item label="发布人账号" :label-width="formLabelWidth">
                    {{oneData.admId}}
                </el-form-item>
                <el-form-item label="公告内容" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        rows="5"
                        placeholder="请输入内容"
                        v-model="oneData.context">
                    </el-input>
                </el-form-item>
                <el-form-item label="发布时间" :label-width="formLabelWidth">
                    {{ oneData.updateTime }}
                </el-form-item>
                <el-form-item label="公告状态" :label-width="formLabelWidth">
                    <el-select v-model="oneData.noticeStatus">
                        <el-option label="显示" value="ok"></el-option>
                        <el-option label="不显示" value="no"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary"  @click="editSuccess">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 添加公告 -->
        <el-dialog :title="title2" :visible.sync="dialogFormVisible2">
            <el-form>
                <el-form-item label="公告内容" :label-width="formLabelWidth">                
                    <el-input
                        type="textarea"
                        rows="10"
                        placeholder="请输入内容"
                        v-model="noticeText">
                    </el-input>
                </el-form-item>
                <el-form-item label="公告状态" :label-width="formLabelWidth">
                    <el-select class="handle-input mr10"
                        filterable
                        v-model="noticeStatus"
                        @change="selectStatus">
                        <el-option v-for="item in noticeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>          
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible2=false">取 消</el-button>
                <el-button type="primary"  @click="addNotice">添 加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue'

export default {
    filters:{
        typeStatus(type){
            const typeMap={
                ok:'success',
                no:'info'
            }
            return typeMap[type];
        },
        statusFilter(status){
            const statusMap={
                no:'不显示',
                ok:'显示'
            }
            return statusMap[status]
        }
    },
    components:{
      Loading
    },
    data(){
        return{
            noticeText:'',
            isCan:false,
            isLoad:true,
            tableData:[],
            options:[
                { label:'显示',value:'ok'},
                { label:'不显示',value:'no'},
            ],
            query:{
                pageIndex:1,
                pageSize:10,
                totalMsg:null
            },
            searchs:{
                status:''
            },
            noticeStatus:'',
            noticeOption:[
                { label:'显示',value:'ok'},
                { label:'不显示',value:'no'},
            ],
            oneData:{},
            dialogFormVisible:false,
            dialogFormVisible2:false,
            formLabelWidth:'120px',
            title:'公告信息编辑',
            title2:'添加公告',
            multipleSelection:[]
        }
    },
    methods:{
        getNoticeList(){
            let that=this;
            that.$api.notices({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.notices;
                that.isLoad=false;
            })
        },
        //单项删除
        handleDelete(info){
            let that=this;
            this.$confirm('确定删除吗','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.delnotice({
                    ids:info.id
                }).then(res=>{
                    if(res.code === 100){
                        that.getNoticeList();
                        that.$message(res.message);
                    }
                })
            }).catch(()=>{})
        },
        //编辑
        closeDialog(){
            this.getNoticeList();
        },
        handleEdit(index,row){
            this.oneData=row;
            this.dialogFormVisible=true;
        },
        editSuccess(){
            let that = this,oneData=that.oneData;
            this.$api.updatenotice({
                id:oneData.id,
                context:oneData.context,
                noticeStatus:oneData.noticeStatus
            }).then(res=>{
                if(res.code === 100){
                    that.getNoticeList();
                    that.$message(res.message);
                    that.dialogFormVisible=false;
                }
            })
        },
        //多项删除
        handleSelectionChange(val){
            this.multipleSelection=val
        },
        deleteSelection(){
            if(this.multipleSelection.length === 0) return this.$message('至少选择一项');
            let that=this,str='';
            that.multipleSelection.forEach(item=>{
                str=str+item.id+','
            })
            this.$confirm('确定删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.delnotice({
                    ids:str
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                        that.getNoticeList();
                    }
                })
            }).catch(()=>{})
        },
        //搜索
        handleSearch(){
            this.isCan=true;
            let that=this;
            this.$api.notices({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.notices;
            })
        },
        handleCancel(){
            this.isCan=false;
            this.searchs.status='';
        },
        //底部导航页
        handleSizeChange(val){
            this.query.pageSize=val;
        },
        handleCurrentChange(val){
            this.query.pageIndex=val;
            let that=this;
            that.$api.notices({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.notices;
            })
        },
        //添加
        addBoard(){
            this.dialogFormVisible2=true;
            this.noticeStatus='';
            this.noticeText='';
        },
        selectStatus(val){
            this.noticeStatus=val;
        },
        addNotice(){
            let that=this;
            that.$api.addNotice({
                context:that.noticeText,
                noticeStatus:that.noticeStatus
            }).then(res=>{
                if(res.code === 100){
                    that.$message(res.message);
                    that.getNoticeList();
                    that.dialogFormVisible2=false;
                }
            })
        }
    },
    created(){
        this.getNoticeList();
    }
}
</script>