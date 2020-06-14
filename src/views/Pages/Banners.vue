<template>
    <div>
        <transition name="loading">
            <Loading v-if="isLoad"></Loading>
        </transition>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-picture-outline"></i> {{ this.$route.meta.title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 搜索 -->
            <div class="handle-box">
                <span class="fontColor mr10">轮播图状态</span>
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
                <!-- 添加轮播图 -->
                <el-button type="warning" size="small"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="changeAdd">
                    添加图片
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
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column align="center" label="轮播图id" prop="id"></el-table-column>
                <el-table-column align="center" label="轮播图" width="150">
                    <template slot-scope="{row}">
                        <el-image :src="row.imgLink | imgFilter"
                            fit="cover"
                            style="width:100px;height:100px;">
                        </el-image>      
                    </template>
                </el-table-column>
                <el-table-column align="center" label="图片名称" prop="imgTitle"></el-table-column>
                <el-table-column align="center" label="更新人账号" width="150" prop="username"></el-table-column>
                <el-table-column align="center" label="更新时间" width="200" sortable prop="updatetime"></el-table-column>
                <el-table-column align="center" label="轮播图状态">
                    <template slot-scope="{row}">
                        <el-tag :type="row.imgStatus | typeStatus">{{ row.imgStatus| bannerFilter}}</el-tag>  
                    </template>
                </el-table-column>
                <el-table-column align="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 底部导航 -->
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
                    {{oneData.username}}
                </el-form-item>
                <el-form-item label="轮播图" :label-width="formLabelWidth">
                    <div class="upload-box">
                        <img :src="editImg.uploadUrl" class="upload-img">
                        <div class="upload">
                            <div class="upload-btn">更换图片
                                <form enctype="multipart/form-data">
                                    <input class="upload-input"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        @change="changeImage"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="图片标题" :label-width="formLabelWidth">
                    <el-input v-model="oneData.imgTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发布时间" :label-width="formLabelWidth">
                    {{ oneData.updatetime }}
                </el-form-item>
                <el-form-item label="公告状态" :label-width="formLabelWidth">
                    <el-select v-model="oneData.imgStatus">
                        <el-option label="显示" value="ok"></el-option>
                        <el-option label="不显示" value="no"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-progress v-show="isProgress" :text-inside="true" :stroke-width="16" :percentage="reprogress"></el-progress>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary"  @click="editSuccess">确 定</el-button>
            </div>
        </el-dialog>
        
        <!-- 新增轮播图 -->
        <el-dialog :title="title2" :visible.sync="dialogFormVisible2">
            <el-form>
                <el-form-item label="选择图片" :label-width="formLabelWidth">
                    <div class="upload">
                        <div class="upload-btn">选择图片
                            <form ref="form"  enctype="multipart/form-data">
                                <input class="upload-input"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    @change="setImage"/>
                            </form>
                        </div>
                    </div>
                    <div class="banner-box">
                        <div class="banner-img">
                            <img :src="imgUpload" class="upload-img">
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="图片标题" :label-width="formLabelWidth">
                    <el-input clearable v-model="imgName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片状态" :label-width="formLabelWidth">
                    <el-select v-model="bannerStatus" @change="selectBan">
                        <el-option label="显示" value="ok"></el-option>
                        <el-option label="不显示" value="no"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
             <el-progress v-show="isProgress" :text-inside="true" :stroke-width="16" :percentage="progress"></el-progress>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible2=false">取 消</el-button>
                <el-button type="primary"  @click="addBanner">添 加</el-button>
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
                no:'info',
                ok:'success'
            }
            return typeMap[type];
        },
        bannerFilter(value){
            const bannerMap={
                no:'不显示',
                ok:'显示'
            }
            return bannerMap[value];
        },
        imgFilter(img){
            return 'https://www.gongsir.club:8081'+img;
        }
    },
    components:{
        Loading
    },
    data(){
        return{
            progress:0,
            reprogress:0,
            isProgress:false,
            imgName:'',
            imgUrl:'',
            imgUpload:'',
            isLoad:false,
            query:{
                totalMsg:null,
                pageSize:10,
                pageIndex:1
            },
            searchs:{
                status:''
            },
            options:[
                { label:'显示',value:'ok' },
                { label:'不显示',value:'no' }
            ],
            editImg:{
                uploadUrl:''
            },
            imageUrl:'',
            isCan:false,
            tableData:[],
            bannerStatus:'',
            multipleSelection:[],
            formLabelWidth:'120px',
            title:'轮播图编辑',
            title2:'添加轮播图',
            dialogFormVisible:false,
            dialogFormVisible2:false,
            oneData:{}
        }
    },
    methods:{
        //信息获取
        getBannerList(){
            let that=this;
            that.$api.images({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.images;
                that.isLoad=false;
            })
        },
        //上传轮播图
        changeAdd(){
            this.imgUpload='';
            this.imgName='';
            this.imgUrl='';
            this.bannerStatus='';
            this.dialogFormVisible2=true;
        },
        selectBan(val){
            this.bannerStatus=val;
        },
        setImage(e){
            let that=this;
            const file =e.target.files[0];
            const reader = new FileReader();
            const formData =new FormData();
            reader.readAsDataURL(file);
            reader.onload=(event)=>{
                that.imgUpload = event.target.result;
            }
            formData.append('file',file);
            this.$axios({
                url:'https://www.gongsir.club:8081/admin/image/upload',
                method: 'post',
                data: formData,
                processData: false,
                contentType: false,
                headers:{ 
                    'Authorization':localStorage.getItem('token')
                }
            }).then(res=>{
                if(res.data.code === 100){
                    that.imgUrl = res.data.url;
                }
            })
        },
        cancleAdd(){
            this.imgUpload='';
            this.imgName='';
            this.imgUrl='';
            this.bannerStatus='';
        },
        addBanner(){
            let that=this;
            this.isProgress=true;
            if(!this.imgUrl){
                return that.$message('请选择需要上传的图片');
            }
            this.$api.addImage({
                imgLink: that.imgUrl,
                imgStatus: that.bannerStatus,
                imgTitle: that.imgName
            }).then(res=>{
                if(res.code === 100){
                    that.$message(res.message);
                    that.dialogFormVisible2=false;
                }else{
                    that.$message('添加失败');
                }
            })
            this.isProgress=false;
        },
        //搜索
        handleSearch(){
            this.isCan=true;
            let that=this;
            that.$api.images({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.images;
                that.isLoad=false;
            })
        },
        handleCancel(){
            this.isCan=false;
            let that=this;
            that.searchs.status='';
            that.$api.images({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.images;
                that.isLoad=false;
            })
        },
        //单项删除
        handleDelete(info){
            let that=this;
            this.$confirm('确定删除吗?','提示',{
                type:'warning'
            }).then(()=>{
                that.$api.delimage({
                    ids:info.id
                }).then(res=>{
                    if(res.code === 100){
                        that.getBannerList();
                        that.$message(res.message);
                    }
                })
            }).catch(()=>{})
        },
        //多项删除
         handleSelectionChange(val){
            this.multipleSelection=val;
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
                that.$api.delimage({
                    ids:str
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                        that.getBannerList();
                    }
                })
            }).catch(()=>{})
        },
        //编辑
        closeDialog(){
            this.getBannerList();
        },
        changeImage(e){
            let that=this;
            const file = e.target.files[0];
            const reader =new FileReader();
            reader.readAsDataURL(file);
            reader.onload=(event)=>{
                that.editImg.uploadUrl = event.target.result;
            }
            let formData = new FormData();
            formData.append('file',file);
            this.$axios({
                url:'https://www.gongsir.club:8081/admin/image/upload',
                method: 'post',
                data: formData,
                processData: false,
                contentType: false,
                headers:{ 
                    'Authorization':localStorage.getItem('token')
                }
            }).then(res=>{
                if(res.data.code === 100){
                    that.imageUrl = res.data.url;
                }
            })
        },
        handleEdit(index,row){
            this.dialogFormVisible=true;
            this.oneData=row;
            this.imageUrl=this.oneData.imgLink;
            this.editImg.uploadUrl='https://www.gongsir.club:8081'+this.oneData.imgLink
        },
        editSuccess(){
            let that=this;
            this.$api.updateimage({
                id:that.oneData.id,
                imgLink:that.imageUrl,
                imgTitle:that.oneData.imgTitle,
                imgStatus:that.oneData.imgStatus
            }).then(res=>{
                if(res.code === 100){
                    that.$message('修改成功');
                }else{
                    that.$message('修改失败,请重新编辑');
                }
                that.dialogFormVisible=false;
            })
        },
        //导航页
        handleSizeChange(val){
            this.query.pageSize=val;
        },
        handleCurrentChange(val){
            let that=this;
            this.query.pageIndex=val;
            that.$api.images({
                limit:that.query.pageSize,
                page:that.query.pageIndex,
                status:that.searchs.status
            }).then(res=>{
                that.query.totalMsg=res.data.count;
                that.tableData=res.data.images;
            })
        }
    },
    created(){
        this.isLoad=true;
        this.getBannerList();
    }
}
</script>

<style lang="scss" scoped>
    .banner-box{
        padding: 10px;
        box-sizing: border-box;
        border-radius:5px;
        background:#fff;
        margin-bottom:10px;
        display:flex;
        align-items:center;

        .banner-img{
            width:150px;
            height:100px;
            background-position:center;

            &>img{
                width:100%;
                height:100%;
            }
        }

        .banner-img:hover{
            opacity:.5;
            cursor: pointer;
        }

        .banner-footer{
            display:flex;
            justify-content:center;
        }

        &>div{
            margin:0 20px;
        }
    }
    .upload{
        display: flex;
        align-items: flex-end;

        .upload-btn{
            position: relative;
            width: 100px;
            height: 35px;
            line-height: 35px;
            padding: 0 20px;
            margin-left: 30px;
            background-color: #0dbc79;
            color: #fff;
            font-size: 14px;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .upload-input:hover{
            cursor: pointer;
        }
        .upload-input{
            position: absolute;
            width: 100px;
            height: 40px;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
        }
    }
    .upload-img{
        width:100px;
        height:100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .upload-box{
        display:flex;
        justify-content:center;
        align-items:center;
    }
</style>