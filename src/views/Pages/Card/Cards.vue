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
                <el-input placeholder="证件号" clearable v-model="searchs.cardNum" class="handle-input mr10"></el-input>
                <span class="fontColor mr10">证件类型</span>
                <el-select class="handle-input mr10" filterable  v-model="searchs.type">
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
            <el-table height="350" ref="multipleTable"
                :data="tableData"
                tooltip-effect="drak"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column align="center" label="证件id" prop="id"></el-table-column>
                <el-table-column align="center" label="证件类型">
                    <template slot-scope="{row}">
                        <el-tag :type="row.cardType | typeFilter">{{ row.cardType | cardFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="证件卡号" prop="cardNum"></el-table-column>
                <el-table-column align="center" label="证件姓名" prop="cardName"></el-table-column>
                <el-table-column align="center" label="联系方式" prop="relation"></el-table-column>
                <el-table-column align="center" label="发布时间" prop="cardTime" sortable width="100"></el-table-column>
                <el-table-column align="center" label="认领状态" width="200">
                    <template slot-scope="{row}">
                        <el-tag :type="row.cardStatus | statusType">{{ row.cardStatus|statusFilter}}</el-tag> 
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部导航栏 -->
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="query.pageIndex"
                    :page-sizes="[10,50, 100]"
                    :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="query.totalMsg">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible"
            @close="closeDialog">
            <el-form v-model="oneData">
                <el-form-item label="证件id" :label-width="formLabelWidth">
                    {{oneData.id}}
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth">
                <el-select v-model="oneData.cardType" placeholder="证件状态">
                    <el-option label="学生卡" value="stuCard"></el-option>
                    <el-option label="身份证" value="idCard"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="证件卡号" :label-width="formLabelWidth">
                    <el-input v-model="oneData.cardNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="证件姓名" :label-width="formLabelWidth">
                    <el-input v-model="oneData.cardName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发布时间" :label-width="formLabelWidth">
                    <el-input v-model="oneData.cardTime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth">
                    <el-input v-model="oneData.relation" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="认领状态" :label-width="formLabelWidth">
                    <el-select @change="myhand"
                        v-model="oneData.cardStatus">
                        <el-option label="已认领" value="ok"></el-option>
                        <el-option label="未认领" value="no"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="认领学号" v-show="isNum" :label-width="formLabelWidth">
                    <el-input v-model="regNum" autocomplete="off"></el-input>
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
        typeFilter(card){
            const typeMap={
                stuCard:'',
                idCard:'success'
            }
            return typeMap[card];
        },
        cardFilter(card){
            const cardMap={
                stuCard:'学生卡',
                idCard:'身份证'
            }
            return cardMap[card];
        },
        statusType(status){
            if(status==='no'){
                return 'info'
            }else{
                return 'danger'
            }
        },
        statusFilter(status){
            if(status==='no'){
                return "未认领"
            }else{
                return `已被学号${status}认领`
            }
        }
    },
    components:{
        Loading
    },
    data(){
        return{
            isLoad:true,
            options:[
                {label:'不限', value:''},
                {label:'身份证',value:'idCard'},
                {label:'学生卡',value:'stuCard'}
            ],
            query:{
                pageSize:10,
                pageIndex:1,
                totalMsg:null
            },
            searchs:{
                type:'',
                cardNum:''
            },
            regNum:'',
            isNum:false,
            isCan:false,
            tableData:[],
            multipleSelection:[],
            downloadLoading:false,
            dialogFormVisible:false,
            formLabelWidth:'120px',
            oneData:{},
            title:'证件信息',
            list:[]
        }
    },
    methods:{
        //获取信息
        getCardList(){
            let that=this;
            that.$api.cards({
                limit:that.pageSize,
                page:that.pageIndex
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.cards;
                that.isLoad=false;
            })
        },
        //单项删除
        handleDelete(info){
            let that=this;
            this.$confirm('确定删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.delcard({
                    ids:info.id
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                        that.getCardList();
                    }
                })
            }).catch(()=>{})
        },
        //编辑
        closeDialog(){
           this.getCardList(); 
           this.isNum=false;
        },
        handleEdit(index,row){
            this.dialogFormVisible=true;
            this.oneData=row;
        },
        myhand(val){
            let that=this;
            if(val === 'ok'){
                that.isNum=true;
            }else{
                that.regNum='';
                that.isNum=false;
            }
        },
        editSuccess(){
            let that=this,oneData=this.oneData;
            let cardStatus='';
            if(that.regNum){
                cardStatus=that.regNum;
            }else{
                cardStatus='no';
                that.regNum='';
            }
            that.$api.updatecard({
                id:oneData.id,
                cardName:oneData.cardName,
                cardNum:oneData.cardNum,
                cardStatus:cardStatus,
                cardTime:oneData.cardTime,
                cardType:oneData.cardType,
                relation:oneData.relation
            }).then(res=>{
                if(res.code === 100){
                    that.getCardList();
                    that.$message(res.message);
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
                that.$api.delcard({
                    ids:str
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                        that.getCardList();
                    }
                })
            }).catch(()=>{})
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
                const tHeader=['发布人','证件类型','证件卡号','证件姓名','联系方式','发布时间','认领状态'];
                const filterVal=["user","cardtype","cardNum","cardName","relation","cardTime","cardStatus"];
                const data=this.formatJson(filterVal,that.list);
                excel.export_json_to_excel(tHeader,data,"证件信息");
                this.downloadLoading=false;
            })
        },
        formatJson(filterVal,jsonData){
            return jsonData.map(v=>filterVal.map(j=>{
                return v[j];
            }))
        },
        //搜索
        handleSearch(){
            let that=this;
            this.isCan=true;
            this.$api.cards({
                cardNum:that.searchs.cardNum,
                cardType:that.searchs.type,
                limit:that.query.pageSize,
                page:that.query.pageIndex
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.cards;
            })
        },
        handleCancel(){
            this.isCan=false;
            this.searchs.cardNum='';
            this.getCardList();
        },
        //底部导航页
        handleSizeChange(val){
            this.query.pageSize=val;
        },
        handleCurrentChange(val){
            let that=this;
            this.query.pageIndex=val;
            that.$api.cards({
                limit:that.query.pageSize,
                page:that.query.pageIndex
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.cards;
            })
        }
    },
    created(){
        this.getCardList();
    }
}
</script>