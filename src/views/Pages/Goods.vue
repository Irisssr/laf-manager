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
                <span class="fontColor mr10">分类查找</span>
                <el-select v-model="searchs.classmethod" 
                    @change="handleClass"
                    class="handle-input mr10">
                    <el-option v-for="(item,index) in options"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 按学号 -->
                <el-input v-if="searchs.name==='stuNum'"
                    placeholder="学号"
                    clearable
                    class="handle-input mr10" 
                    v-model="searchs.val"></el-input>
                <!-- 按关键字 -->
                <el-input v-if="searchs.name==='keywords'"
                    placeholder="物品关键字"
                    clearable
                    class="handle-input mr10"
                    v-model="searchs.val"></el-input>
                <!-- 按物品分类 -->
                <el-select
                    v-if="searchs.name==='class'" 
                    v-model="searchs.val"
                    @change="classFind"
                    class="handle-input mr10">
                    <el-option v-for="(item,index) in optionsClass"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 按状态 -->
                <el-select
                    v-if="searchs.name==='status'" 
                    v-model="searchs.val"
                    @change="statusFind"
                    class="handle-input mr10">
                    <el-option v-for="(item,index) in optionsStatus"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 搜索按钮 -->
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
                <el-table-column align="center" label="物品id" prop="id"></el-table-column>
                <el-table-column align="center" label="发布人" prop="user.userName"></el-table-column>
                <el-table-column align="center" label="发布者学号" prop="user.stuNum"></el-table-column>
                <el-table-column align="center" label="标题" prop="goodTitle"></el-table-column>
                <el-table-column align="center" label="描述(可选)" prop="goodTexts" width="150"></el-table-column>
                <el-table-column align="center" label="图片">
                    <template slot-scope="{ row }">
                         <el-image
                            fit="cover"
                            style="width:50px;height:50px;"
                            :preview-src-list="srcList"
                            :src="row.goodImage | vimage"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物品分类">
                    <template slot-scope="{ row }">
                        <el-tag :type="row.goodClass|typeFilter">{{ row.goodClass|classFilter }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="联系方式" prop="relation"></el-table-column>
                <el-table-column align="center" label="丢失分类">
                    <template slot-scope="{row}">
                        <el-tag :type="row.goodType| gtypeFilter">{{ row.goodType | goodFilter}}</el-tag> 
                    </template> 
                </el-table-column>
                <el-table-column align="center" label="发布时间" prop="time" sortable width="100"></el-table-column>
                <el-table-column align="center" label="认领状态">
                    <template slot-scope="{row}">
                        <el-tag :type="row.goodStatus|statusFilter">{{ row.goodStatus | textFilter}}</el-tag> 
                    </template>   
                </el-table-column>
                <el-table-column align="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部分页导航 -->
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
                <el-form-item label="物品id" :label-width="formLabelWidth">
                    {{oneData.id}}
                </el-form-item>
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="oneData.goodTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述(可选)" :label-width="formLabelWidth">
                    <el-input v-model="oneData.goodTexts" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <div class="goodImag">
                        <el-image
                            fit="cover"
                            style="width:50px;height:50px;" 
                            :src="oneData.goodImage | vimage"></el-image>
                    </div>
                </el-form-item>
                <el-form-item label="物品分类" :label-width="formLabelWidth">
                    <el-select v-model="oneData.goodClass">
                        <el-option label="学习类" value="learn"></el-option>
                        <el-option label="生活类" value="daily"></el-option>
                        <el-option label="电子类" value="elec"></el-option>
                        <el-option label="其他" value="other"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="丢失分类" :label-width="formLabelWidth">
                    <el-select v-model="oneData.goodType">
                        <el-option label="失物" value="lost"></el-option>
                        <el-option label="招领" value="found"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth">
                    <div class="select-relation">
                        <el-select v-model="relationType">
                            <el-option label="地点" value="place"></el-option>
                            <el-option label="手机号" value="tel"></el-option>
                            <el-option label="QQ" value="qq"></el-option>
                        </el-select>
                        <el-input v-model="relationTitle" clearable autocomplete="off"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="发布时间" :label-width="formLabelWidth">
                    {{ oneData.time }}
                </el-form-item>
                <el-form-item label="物品认领状态" :label-width="formLabelWidth">
                    <el-select v-model="oneData.goodStatus">
                        <el-option label="已认领" value="success"></el-option>
                        <el-option label="未认领" value="no"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary"  @click="editSuccess">确 定</el-button>
            </div>
        </el-dialog>

        <Preview v-show="isPrev" :preImg="preImg"></Preview>
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import Preview from '@/components/Preview.vue';

export default {
    filters:{
        classFilter(clss){
            const classMap={
                learn:'学习类',
                daily:'生活类',
                elec:'电子类',
                other:'其他'
            }
            return classMap[clss];
        },
        typeFilter(type){
            const typeMap={
                learn:'',
                daily:'success',
                elec:'warning',
                other:'danger'
            }
            return typeMap[type];
        },
        statusFilter(status){
            const statusMap={
                no:'info',
                ok:'danger'
            }
            return statusMap[status]
        },
        textFilter(status){
            const textMap={
                no:'未认领',
                success:'已认领'
            }
            return textMap[status];
        },
        gtypeFilter(type){
            const typeMap={
                lost:'',
                found:'success'
            }
            return typeMap[type];
        },
        goodFilter(type){
            const goodMap={
                lost:'失物',
                found:'招领'
            }
            return goodMap[type];
        },
        vimage(image){
            return 'https://www.gongsir.club:8081/'+image;
        }
    },
    components:{
      Loading,
      Preview
    },
    data(){
        return{
            isPrev:false,
            preImg:'',
            srcList:[],
            relationType:'',
            relationTitle:'',
            isLoad:false,
            isCan:false,
            searchs:{
                name:'all',
                classmethod:'all',
                val:''
            },
            value:'',
            tableData:[],
            query:{
                totalMsg:null,
                pageSize:10,
                pageIndex:1
            },
            options:[
                {label:'不限',value:'all'},
                {label:'按学号',value:'stuNum'},
                {label:'按分类',value:'class'},
                {label:'按关键字',value:'keywords'},
                {label:'按状态',value:'status'}
            ],
            optionsClass:[
                { label:'学习类',value:'learn'},
                { label:'生活类',value:'daily'},
                { label:'电子类',value:'elec'},
                { label:'其他',value:'other'}
            ],
            optionsStatus:[
                { label:'未认领',value:'no'},
                { label:'已认领',value:'ok'},
            ],
            multipleSelection:[],
            downloadLoading:false,
            dialogFormVisible:false,
            formLabelWidth:'120px',
            oneData:{},
            title:'物品信息',
            list:[]
        }
    },
    methods:{
        //获取物品信息
        getGoodList(){
            let that=this;
            that.$api.goods({
                key:that.searchs.name,
                limit:that.pageSize,
                page:that.pageIndex,
                value:that.searchs.val
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.goods;
                that.isLoad=false;
            })
        },
        //单项删除
        handleDelete(info){
            let that=this;
            this.$confirm('确定删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.delgood({
                    ids:info.id
                }).then(res=>{
                    if(res.code === 100){
                        that.getGoodList();
                        that.$message(res.message);
                    }
                })
            }).catch(()=>{})
        },
        //编辑
        closeDialog(){
            this.relationTitle='';
            this.relationType='';
            this.getGoodList();
        },
        handleEdit(index,row){
            this.oneData=row;
            let relation=this.oneData.relation.split(':');
            this.relationType=relation[0];
            this.relationTitle=relation[1];
            this.dialogFormVisible=true;
        },
        editSuccess(){
            let that = this,oneData=that.oneData;
            let newRel=this.relationType+':'+this.relationTitle;
            that.$api.updategood({
                id:oneData.id,
                goodClass:oneData.goodClass,
                goodImage:oneData.goodImage,
                goodStatus:oneData.goodStatus,
                goodTexts:oneData.goodTexts,
                goodTitle:oneData.goodTitle,
                goodType:oneData.goodType,
                relation:newRel,
                time:oneData.time
            }).then(res=>{
                if(res.code === 100){
                    that.$message(res.message);
                    that.getGoodList();
                    that.dialogFormVisible=false;
                }else{
                    that.$message('修改失败');
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
                str=str+item.id+',';
            })
            this.$confirm('确定删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.delgood({
                    ids:str
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                        that.getGoodList();
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
                const tHeader=['发布人','标题','描述','物品分类','联系方式','丢失分类','发布时间','认领状态'];
                const filterVal=["user.stuNum","goodTitle","goodTexts","goodClass","relation","goodType","time","goodStatus"];
                const data=this.formatJson(filterVal,that.list);
                excel.export_json_to_excel(tHeader,data,"物品信息");
                this.downloadLoading=false;
            })
        },
        formatJson(filterVal,jsonData){
            return jsonData.map(v=>filterVal.map(j=>{
                return v[j];
            }))
        },
        //搜索
        handleClass(val){
            this.searchs.name=val;
            this.searchs.val='';
        },
        statusFind(val){
            this.searchs.val=val;
        },
        classFind(val){
            this.searchs.val=val;
        },
        handleSearch(){
            this.isCan=true;
            let that=this;
            that.$api.goods({
                key:that.searchs.name,
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                value:that.searchs.val
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.goods;
            })
        },
        handleCancel(){
            this.isCan=false;
            this.searchs.val='';
            this.searchs.name='all';
            this.getGoodList();
        },
        // 底部导航
        handleSizeChange(val){
            this.query.pageSize=val;
        },
        handleCurrentChange(val){
            let that=this;
            this.query.pageIndex=val;
            that.$api.goods({
                key:that.searchs.name,
                limit:that.pageSize,
                page:that.pageIndex,
                value:that.searchs.val
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.goods;
                that.isLoad=false;
            })
        }
    },
    created(){
        this.isLoad=true;
        this.getGoodList();
    }
}
</script>

<style lang="scss" scoped>
</style>