import Axios from 'axios'
import router from '@/router/index.js'
// import store from '../store';
// Axios.defaults.baseURL='/api'
let instance =Axios.create({ timeout:2000});
instance.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=utf-8';

//请求错误状态码处理
const errorHandle=(status,error)=>{
    switch(status){
        case 401:
            console.log(error);
            break;
        case 404:
            console.log(error);
            break;
        default:
            console.log(error);
            break;
    }
}
//请求处理
instance.interceptors.request.use(
    config=>{
        const token = localStorage.getItem('token');
        token && (config.headers.Authorization=token);
        return config;
    },
    error=>Promise.reject(error)
)
//响应处理
instance.interceptors.response.use(
    res=>{
        if(res.status === 200){
            if(res.data.code === '1024'){
                router.replace({
                    path:'/login',
                    query:{
                        redirect:router.currentRoute.fullPath
                    }
                });
            }
            return Promise.resolve(res.data);
        }else{
            return Promise.reject(res);
        }
    },
    error=>{
        const { response } =error;
        if(response){
            errorHandle(response.status,response.data.message);
        }else{
            //处理断网情况
            if(!window.navigator.onLine){
                // store.commit
                console.log("断网");
            }
        }
    }
)

export function uploadFile(url,data){
    Axios.post(url,data,{
        contentType:false,
        processDate:false,
        headers:{ 
            'Authorization':localStorage.getItem('token')
        }
    }).then(res=>{        
        console.log(res.data);
        return Promise.resolve(res.data);
    }).catch(error=>{
        console.log(error);
    })
}

export default instance;