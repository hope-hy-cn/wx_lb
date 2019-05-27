<template>
  <div class="user-books" :style="'padding-top:'+contentPadding+'rpx'">
    <head-back :title="current==1?'添加音乐':current==2?'添加电影':'添加书籍'"  @goBack="goBack" ></head-back>
    <div class="header-search" :style="'top:'+headHeight+'rpx'">
      <search-input @search="searchData" :placeholder="current==1?'搜索最喜欢的音乐':current==2?'搜索最喜欢的电影':'搜索最喜欢的书籍'"></search-input>
    </div>
    <div class="content">

      <div v-if="current=='1'">
        <div v-for="(item,index) in musicDataList">
          <books-card icon="true"  height="166rpx;" flex="0 0 166rpx;"  :title="item.title" :textMain="item.singers" :url="item.coverUrl"   :item="item" :key="item" @addList="addList" > </books-card>
        </div>  
        <div class="null-img text-center" v-if="musicDataList.length==0">
          <image class="img"  src="https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/undraw_music.png"></image>
          <div v-if="loading">{{loadingText}}</div>
        </div> 
      </div> 
      <div v-if="current=='2'">
        <div v-for="(item,index) in movieDataList">
          <books-card icon="true" :title="item.title" :textMain="item.directors" :url="item.coverUrl"  :textInfo="item.actors" :item="item" :key="item"   @addList="addList"> </books-card>
        </div> 
        <div class="null-img text-center" v-if="movieDataList.length==0">
          <image class="img"  src="https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/undraw_movie.png"></image>
          <div v-if="loading">{{loadingText}}</div>
        </div> 
      </div>
      <div v-if="current=='3'">
        <div v-for="(item,index) in bookDataList">
          <books-card icon="true" :title="item.title" :textMain="item.name" :url="item.coverUrl"  :textInfo="item.publishOrg" :item="item" :key="item" @addList="addList"> </books-card>
        </div> 
        <div class="null-img text-center" v-if="bookDataList.length==0">
          <image class="img"  src="https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/undraw_book.png"></image>
          <div v-if="loading">{{loadingText}}</div>
        </div> 
      </div> 

      <div v-if="reachBottomShow"> 
        <div class="loading-more-bt text-center" v-if="refreshLoading">
          <view class="refresh-loading"></view>
          <span>加载中</span>
        </div> 
        <i-load-more tip="到底啦" i-class="content-load-more" :loading="false" v-else/>
      </div> 

    </div>

  </div>
</template>

<script> 
import * as api from '@/utils/api'  
import headBack from '@/components/head-back'
import booksCard from '@/components/books-card'
import searchInput from '@/components/search-input'
import userInfo from './../../common/index/store'
export default {
  onLoad(opt){
    this.current=opt.current;
    
  },
  onShow(){
    this.searchKey='';
    this.movieDataList=[];
    this.bookDataList=[];
    this.musicDataList=[];
    this.reachBottomShow=false;
    this.refreshLoading=false;
  },
  data () {
    return {    
        headPadding:wx.getStorageSync('headPadding'), 
        contentPadding:wx.getStorageSync('headHeight')+parseInt(98),
        headHeight:wx.getStorageSync('headHeight'), 
        searchKey:'',
        current:'1',
        movieDataList:[],
        bookDataList:[],
        musicDataList:[],
        loading:false,
        loadingText:'搜索中...',
        pageToken:'0',
        reachBottomShow:false,  //下拉加载更多
        refreshLoading:false, //是否到底

        clickMe:true,
    }
  },
  
  components: {
    headBack,
    booksCard,
    searchInput
  },   
  methods: { 
    //返回上一级
    goBack(){
      wx.navigateBack({ delta: 1 }); 
    },  
    searchData(val,pull){
      let vm = this;
      vm.searchKey=val;
      if(val){ 
        if(pull!='pull'){ 
          vm.movieDataList=[];
          vm.bookDataList=[];
          vm.musicDataList=[];
          vm.loading=true;
          vm.loadingText='搜索中...';
          vm.reachBottomShow=false; 
          vm.pageToken='0'
        } 
        let body={
          apikey:'jL7GmUxczBiqvIhqqOhcbgDWkakxnwwLbgqfOOz2O3ZkGeTsDRPqtXqWvG5pEC8I',
          kw:val.replace(/\s+/g,""),
          page_token:vm.pageToken, 
        }
        if(vm.clickMe){
          vm.clickMe=false;
          if(vm.current=='1'){
              body.search_type=1;
              api.searchDouban(body).then(res=>{  
                vm.clickMe=true;
                vm.refreshLoading=res.data.hasNext;
                vm.pageToken=res.data.pageToken;
                if(res.data.retcode=='000000'){
                  vm.loading=false;
                  res.data.data.forEach((item,index)=>{ 
                    let musicObj={};
                    musicObj.title=item.title.replace(/<\/?.+?>/g,"").replace(/ /g,"");
                    musicObj.coverUrl=item.coverUrl;
                    musicObj.singers=''; 
                    if(item.singers){
                      item.singers.forEach((singersItem,index)=>{
                        if(musicObj.singers){
                          musicObj.singers=musicObj.singers+'、'+singersItem.name;
                        } else{
                          musicObj.singers= '歌手：'+singersItem.name;
                        }
                      }) 
                    }else{
                      musicObj.singers= '歌手：未知';
                    } 
                    vm.musicDataList.push(musicObj); 
                  })
                }else{
                  vm.refreshLoading=false;
                  vm.loadingText='暂无数据';
                } 
              }).catch(err=>{
                vm.clickMe=true;
                wx.showToast({ title: err.message, icon: 'none' })
                vm.loading=false;
              }); 
            }else if(vm.current=='2'){
              body.search_type=0;
              api.searchDouban(body).then(res=>{
                vm.clickMe=true;
                vm.refreshLoading=res.data.hasNext;
                vm.pageToken=res.data.pageToken; 
                if(res.data.retcode=='000000'){
                  vm.loading=false;
                  res.data.data.forEach((item,index)=>{ 
                    let movieObj={};
                    movieObj.id=item.id;
                    movieObj.title=item.title.replace(/<\/?.+?>/g,"").replace(/ /g,"");;
                    movieObj.coverUrl=item.coverUrl;
                    movieObj.directors='';
                    movieObj.actors='';
                    if(item.directors){
                      item.directors.forEach((directorsItem,index)=>{
                        if(movieObj.directors){
                          movieObj.directors=movieObj.directors+'、'+directorsItem.name;
                        } else{
                          movieObj.directors= '导演：'+directorsItem.name;
                        }
                      })
                    }else{
                      movieObj.directors= '导演：未知';
                    }
                    if(item.actors){
                      item.actors.forEach((actorsItem,index)=>{ 
                      if(movieObj.actors){
                        movieObj.actors=movieObj.actors+'、'+actorsItem.name;
                      } else{
                        movieObj.actors='主演：'+actorsItem.name;
                      }
                    })
                    }else{
                      movieObj.actors= '主演：未知';
                    } 
                    vm.movieDataList.push(movieObj);  
                  }) 
                }else{
                  vm.refreshLoading=false;
                  vm.loadingText='暂无数据';
                }  
              }).catch(err=>{
                vm.clickMe=true;
                wx.showToast({ title: err.message, icon: 'none' })
                vm.loading=false;
              }); 
            }else{
              body.search_type=2;
              api.searchDouban(body).then(res=>{ 
                vm.clickMe=true;
                vm.refreshLoading=res.data.hasNext;
                vm.pageToken=res.data.pageToken;
                if(res.data.retcode=='000000'){
                  vm.loading=false;
                  res.data.data.forEach((item,index)=>{ 
                    let bookObj={};
                    bookObj.id=item.id;
                    bookObj.title=item.title.replace(/<\/?.+?>/g,"").replace(/ /g,"");;
                    bookObj.coverUrl=item.coverUrl;
                    bookObj.name='';;  //作者名字
                    bookObj.publishOrg='出版社：'+item.publishOrg;  //出版社   
                    if(item.writers){
                      item.writers.forEach((nameItem,index)=>{
                        if(bookObj.name){
                          bookObj.name=bookObj.name+'、'+nameItem.name;
                        } else{
                          bookObj.name= '作者：'+nameItem.name;
                        }
                      })
                    }else{
                      bookObj.name= '作者：未知' ;
                    }  
                    vm.bookDataList.push(bookObj); 
                  }) 
                }else{
                  vm.loadingText='暂无数据';
                  vm.refreshLoading=false;
                }  
              }).catch(err=>{
                vm.clickMe=true;
                wx.showToast({ title: err.message, icon: 'none' })
                vm.loading=false;
              });
            }
            
          }  
        }else{
          wx.showToast({
              title: '请输入关键字',
              icon: 'none'
          })
        }
        
    },
     //添加
    addList(item){
      let vm = this; 
      let body={};
      if(vm.current=='1'){
        body.musics=[{
          "name":item.title,
          "performer":item.singers,
          "cover": item.coverUrl
        }]
      }else if(vm.current=='2'){
        body.movies=[{
          "duba_id": item.id,
          "name":item.title,
          "director":item.directors,
          "principal":item.actors,
          "cover": item.coverUrl
        }]
      }else{
        body.books=[{
          "duba_id": item.id,
          "name": item.title,
          "author": item.name,
          "cover": item.coverUrl
        }]
      } 
      api.postMovieMusicBook(body).then(res=>{
        if(res.data.code==300000){
          wx.showToast({ title:'添加成功', icon: 'none'})
          vm.fetchInfo();
          setTimeout(()=>{
            vm.goBack();
          },600) 
        }
      })
    },
    /**获取用户信息 */
    fetchInfo(){
      let vm = this;
      api.getUserDetail().then(res=>{
        if(res.data.code==300000){ 
          userInfo.state.userInfo=res.data.data; 
        }
      })
    }, 
  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
    let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
    return this.onShareAppMessage('',path);
  }, 
  onReachBottom(){
    if(this.refreshLoading){
      this.searchData(this.searchKey,'pull');
    } 
    this.reachBottomShow=true; 
  },
 
}
</script>
<style>
.user-books .tab-items{
  padding:0 20rpx;
}
</style>
<style scoped lang="scss">  
.user-books{
  width:100%;
  height:100%;   
  .header-search{
    width:100%;
    height:98rpx;
    margin-bottom:20rpx;
    position:fixed;
    z-index:100;
  }
  .content{
    height:100%;
    padding:20rpx 24rpx; 
    .add-card{
      padding:24rpx 10rpx;
      font-size:30rpx;
    }
    .null-img{
      width:320rpx;
      height:340rpx;
      position:absolute;
      top:50%;
      left:50%;
      margin-top:-170rpx;
      margin-left:-160rpx;
      .img{
         width:320rpx;
         height:200rpx; 
      } 
      div{
        font-size:26rpx;
        color:#BBBEC2;
        margin-top:20rpx;
      }
    }
    .loading-more-bt{
      height:100rpx;
      line-height:100rpx; 
      span{
        font-size:26rpx;
        color:#495060;
      }
    }
  }
}
</style>
