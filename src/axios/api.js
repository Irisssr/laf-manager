import axios from './http';
import base from './base';
import QS from 'qs';

let apis={}

//登录
apis.login=(params)=>{ return axios.post(`${base.url}/admin/login`,QS.stringify(params))};
//获取手机验证码
apis.code=(params)=>{ return axios.post(`${base.url}/admin/code`,QS.stringify(params))};
//注册
apis.register=(params)=>{ return axios.post(`${base.url}/admin/register`,QS.stringify(params)) };
//验证用户是否存在
apis.check=(params)=>{ return axios.get(`${base.url}/admin/check`,{ params:params})};


//获取所有管理员
apis.admins=(params)=>{ return axios.get(`${base.url}/admin/admins`,{ params:params});}
//添加管理员
apis.add=(params)=>{ return axios.post(`${base.url}/admin/add`,QS.stringify(params));}
//删除管理员
apis.del=(params)=>{ return axios.delete(`${base.url}/admin/del`,{params:params});}
//编辑管理员
apis.update=(params)=>{ return axios.put(`${base.url}/admin/update`,QS.stringify(params));}

// 获取所有小程序用户
apis.users=(params)=>{ return axios.get(`${ base.url}/user/users`,{ params:params});}
//修改小程序用户信息
apis.updateuser=(params)=>{ return axios.put(`${ base.url}/user/update`,QS.stringify(params));}
//删除用户
apis.deluser=(params)=>{ return axios.delete(`${ base.url}/user/del`,{params:params});}

//删除物品
apis.delgood=(params)=>{ return axios.delete(`${ base.url}/good/del`,{ params:params });}
//获取物品
apis.goods=(params)=>{ return axios.get(`${ base.url}/good/goods`,{ params:params});}
//修改物品
apis.updategood=(params)=>{ return axios.put(`${ base.url}/good/update`,QS.stringify(params)); }


//获取证件信息
apis.cards=(params)=>{ return axios.get(`${ base.url}/card/cards`,{ params:params});}
//删除卡证
apis.delcard=(params)=>{ return axios.delete(`${ base.url}/card/del`,{ params:params});}
//编辑卡证
apis.updatecard=(params)=>{ return axios.put(`${ base.url}/card/update`,QS.stringify(params));}


//监听信息
apis.listens=(params)=>{ return axios.get(`${ base.url}/listen/cards`,{ params:params});}
//删除监听
apis.dellisten=(params)=>{ return axios.delete(`${ base.url}/listen/del`,{ params:params});}
//监听修改
apis.updatelisten=(params)=>{ return axios.put(`${ base.url}/listen/update`,QS.stringify(params));}

//公告
apis.notices=(params)=>{ return axios.get(`${ base.url }/notice/notices`,{ params:params});}
//删除
apis.delnotice=(params)=>{ return axios.delete(`${ base.url }/notice/del`,{ params:params});}
//编辑公告
apis.updatenotice=(params)=>{ return axios.put(`${ base.url}/notice/update`,QS.stringify(params));}
//新增公告
apis.addNotice=(params)=>{ return axios.post(`${ base.url}/notice/add`,QS.stringify(params));}

//轮播图
apis.images=(params)=>{ return axios.get(`${ base.url}/image/images`,{ params:params });}
//删除
apis.delimage=(params)=>{ return axios.delete(`${ base.url}/image/del`,{ params:params});}
//增加
apis.addImage=(params)=>{ return axios.post(`${ base.url}/image/add`,QS.stringify(params));}
//修改
apis.updateimage=(params)=>{ return axios.put(`${ base.url}/image/update`,QS.stringify(params));}

// apis.addImage=(params)=>{ uploadFile(`${ base.url}/image/add`,params)}


export default apis;