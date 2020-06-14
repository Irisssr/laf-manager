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
                <el-input clearable placeholder="证件号" v-model="searchs.lisNum" class="handle-input mr10"></el-input>
                <span class="fontColor mr10">监听状态</span>
                <el-select class="handle-input mr10" v-model="searchs.status">
                    <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
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
                <el-button type="success" size="small"
                    icon="el-icon-document"
                    class="handle-del mr10"
                    :loading="downloadLoading"
                    @click="handleDownload">
                    导出Excel
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
                <el-table-column align="center" label="监听id" prop="id"></el-table-column>
                <el-table-column align="center" label="证件类型">
                    <template slot-scope="{row}">
                        <el-tag :type="row.lisType | carType">{{ row.lisType| lisFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="证件号码" prop="lisNum"></el-table-column>
                <el-table-column align="center" label="预留手机号" prop="telephone"></el-table-column>
                <el-table-column align="center" label="监听时间" prop="lisTime" sortable></el-table-column>
                <el-table-column align="center" label="监听状态">
                    <template slot-scope="{row}">
                        <el-tag :type="row.lisStatus | typeFilter">{{ row.lisStatus| statusFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="query.pageIndex"
                    :page-sizes="[10,50,100]"
                    :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="query.total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible"
            @close="closeDialog">
            <el-form v-model="oneData">
                <el-form-item label="监听id" :label-width="formLabelWidth">
                    {{oneData.id}}
                </el-form-item>
                <el-form-item label="formId" :label-width="formLabelWidth">
                    {{oneData.formId}}
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth">
                    <el-select v-model="oneData.lisType">
                        <el-option label="身份证" value="idCard"></el-option>
                        <el-option label="学生卡" value="stuCard"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件卡号" :label-width="formLabelWidth">
                    <el-input v-model="oneData.lisNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="预留手机号" :label-width="formLabelWidth">
                    <el-input v-model="oneData.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="监听时间" :label-width="formLabelWidth">
                    <el-input v-model="oneData.lisTime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="监听状态" :label-width="formLabelWidth">
                    <el-select v-model="oneData.lisStatus" placeholder="证件状态">
                        <el-option label="已认领" value="ok"></el-option>
                        <el-option label="未认领" value="no"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary"  @click="editSuccess">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Loading from '@/components/Loading.vue'
export default {
    filters:{
        typeFilter(type){
            const typeMap={
                no:'info',
                ok:'danger'
            }
            return typeMap[type];
        },
        statusFilter(status){
            const statusMap={
                no:'未认领',
                ok:'已认领'
            }
            return statusMap[status];
        },
        lisFilter(lis){
            const lisMap={
                idCard:'身份证',
                stuCard:'学生卡'
            }
            return lisMap[lis];
        },
        carType(type){
            const typeMap={
                idCard:'success',
                stuCard:''
            }
            return typeMap[type];
        }
    },
    components:{
        Loading
    },
    data(){
        return{
            downloadLoading:false,
            isLoad:true,
            options:[
                {label:'未认领',value:'no'},
                {label:'已认领',value:'ok'}
            ],
            query:{
                totalMsg:null,
                pageIndex:1,
                pageSize:10
            },
            searchs:{
                lisNum:'',
                status:'no'
            },
            isCan:false,
            tableData:[],
            value:'noLimit',
            multipleSelection:[],
            oneData:{},
            formLabelWidth:'120px',
            dialogFormVisible:false,
            title:'证件监听',
            list:[]
        }
    },
    methods:{
        getListenList(){
            let that=this;
            this.$api.listens({
                page:that.query.pageIndex,
                limit:that.query.pageSize,
                lisNum:that.searchs.lisNum,
                status:that.searchs.status
            }).then(res=>{
                that.tableData=res.data.listens;
                that.query.totalMsg=res.data.count;
                that.isLoad=false;
            })
        },
        //单项删除
        handleDelete(info){
            let that=this;
            this.$confirm('确定删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.dellisten({
                    ids:info.id
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                        that.getListenList();
                    }
                })
            }).catch(()=>{})
        },
        //编辑
        handleEdit(index,row){
            this.oneData=row;
            this.dialogFormVisible=true;
        },
        closeDialog(){
            this.getListenList();
        },
        editSuccess(){
            let that=this,oneData=that.oneData;
            that.$api.updatelisten({
                formId:oneData.formId,
                id:oneData.id,
                lisStatus:oneData.lisStatus,
                lisNum:oneData.lisNum,
                lisTime:oneData.lisTime,
                openid:oneData.openid,
                telephone:oneData.telephone,
                lisType:oneData.lisType
            }).then(res=>{
                if(res.code === 100){
                    that.getListenList();
                    that.$message('更新成功');
                    that.dialogFormVisible=false;
                }
            })
        },
        //多项删除
        handleSelectionChange(val){
            this.multipleSelection=val;
        },
        deleteSelection(){
            if(this.multipleSelection.length === 0) return this.$message('至少选择一项');
            let that=this,str='';
            that.multipleSelection.forEach(item=>{
                str=str+item.id+',';
            })
            this.$confirm('确定删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.dellisten({
                    ids:str
                }).then(res=>{
                    if(res.code === 100){
                        that.getListenList();
                        that.$message(res.message);
                    }
                })
            }).catch(()=>{})
            
        },
        // 搜索
        handleSearch(){
            let that=this;
            this.isCan=true;
            that.$api.listens({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                lisNum:that.searchs.lisNum,
                status:that.searchs.status
            }).then(res=>{
                that.tableData=res.data.listens;
                that.query.totalMsg=res.data.count;
            })
        },
        handleCancel(){
            this.isCan=false;
            this.searchs.lisNum='';
            this.getListenList();
        },
        //导航
        handleSizeChange(val){
            this.query.pageSize=val;
        },
        handleCurrentChange(val){
            let that=this;
            this.pageIndex=val;
            this.$api.listens({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.tableData=res.data.listens;
                that.query.totalMsg=res.data.count;
                that.isLoad=false;
            })
        },
        //打印
        handleDownload(){
            this.downloadLoading=true;
            let that=this;
            if(this.multipleSelection.length === 0){
                that.list =that.tableData;
            }else{
                that.list = that.multipleSelection;
            }
            import("@/excel/Export2Excel").then(excel=>{
                const tHeader=['证件类型','证件号码','监听时间','监听状态'];
                const filterVal=["lisType","lisNum","lisTime","lisStatus"];
                const data=this.formatJson(filterVal,that.list);
                excel.export_json_to_excel(tHeader,data,"监听证件信息");
                this.downloadLoading=false;
            })
        },
        formatJson(filterVal,jsonData){
            return jsonData.map(v=>filterVal.map(j=>{
                return v[j];
            }))
        },
    },
    created(){
        this.getListenList();
    }
}
</script>