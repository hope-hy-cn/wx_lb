
<template>
  <div class="detail-page" :style="'padding-top:'+headHeight+'rpx'">  
    <head-back mode="tabs" :currentTab="currentTab" @clickTab="clickTabs" :tabsList="tabsList"></head-back>
      <!--<head-back mode="tabs" :currentTab="currentTab" @clickTab="clickTabs" :tabsList="tabsList"  :background="scrollIndex==0?'transprent':'#fff'" :color="scrollIndex==0?'#fff':'#4e5761'"></head-back>-->
    <block v-if="is_login">
      <div class="swiper-container" >
        <swiper
          class="swiper-main"
          :current="currentTab"
          @change="currenChange($event)"
        >
          <swiper-item class="swiper-item-page">
            <scroll-view scroll-y="true" scroll-with-animation="true" style="height:100vh;" @scroll="scroll" @touchstart="touchStart"
      @touchend="touchEnd" @scrolltolower="scrolltolower" lower-threshold="100">
              <div class="user-detail-page">
                <!--头部信息-->
                <div class="head-box">
                  <div class="head-bg-img">
                    <image mode="aspectFill" src="/static/image/detail-bg.png" alt="" class="img"/>
                  </div>
                  <div class="head-user-info" style="padding-bottom:0;">
                    <div class="head-img" @click.stop="gotoShow('head')">
                      <div class="vip-cap-box" v-if="form.is_vip">
                        <image src="/static/image/vip-cap.png" class="vip-cap"></image>
                      </div>
                      <!-- <image mode="aspectFill" :src="userInfo.photo[0].link+'?x-oss-process=image/resize,w_50'" alt="" class="img"/> -->
                      <image-loader :src="userInfo.head_pic?userInfo.head_pic+'?x-oss-process=image/resize,w_200':'/static/image/user.png'" width="100%" height="100%" image-style="border-radius:50%;"></image-loader>
                      <div class="changeHeadImg">
                        <img src="/static/image/camera-pic.png" alt="">
                      </div>
                    </div>
                    <div class="text-center name">{{userInfo.nickname}}</div>
                    <div class="text-center introduce">{{userInfo.introduce}}</div>
                  </div>
                  <div class="infoNumber" style="padding-bottom:24rpx;">
                    <div class="numberItem" @click="jumpUrl(1)">
                      <p class="itemNum">{{userInfo.like_num}}</p>
                      <p class="itemTxt">关注</p>
                    </div>
                    <div class="numberItem" @click="jumpUrl(2)">
                      <p class="itemNum">{{userInfo.fans_num}}</p>
                      <p class="itemTxt">粉丝</p>
                    </div>
                    <div class="numberItem">
                      <p class="itemNum">{{userInfo.visitor_num}}</p>
                      <p class="itemTxt">访客</p>
                    </div>
                  </div>
                </div>
                <!-- <div class="msg-tab-box" >
                  <scroll-view scroll-y class="msg-tab-content msg-tab-one " :class="{'msg-tab-index':titleHighlight==0}">

                  </scroll-view>
                  <scroll-view  scroll-y class="msg-tab-content msg-tab-two " @scrolltolower="bindscrolltolower" :class="{'msg-tab-index':titleHighlight==1}">
                      1324654654654
                  </scroll-view>
                </div>  -->

                <div class="tag-list">
                  <p class="tag-item" :class="{'tag-item-active':titleHighlight==0}" @click="changeTabbar(0)">主页</p>
                  <p class="tag-item" :class="{'tag-item-active':titleHighlight==1}" @click="changeTabbar(1)">个人资料</p>
                </div>
                <!-- content-box -->
                <div class="content-box" :class="{'items-one-active':titleHighlight==1}" :style="'height:'+contentHeight">
                  <div class="content-items" style="overflow:hidden;">
                    <!--主页-->
                    <div class="homepage">
                      <div class="content-group">
                        <div class="title">我的相册 <span style="font-size:24rpx;color:#A1A7AE"> (最多可上传6张照片) </span></div>
                        <div class="photo-box">
                          <scroll-view scroll-x  class="scroll-view">
                            <div class="addPhoto" @click.stop="gotoShow('photo')" v-if="imgUrls.length<6">
                              <div class="centerInfo">
                                <img src="/static/image/camera.png" alt="">
                                <p>拍照</p>
                              </div>
                            </div>
                            <div class="photo-img" @click="previewImage(item)" v-for="(item,index) in imgUrls" :key="index">
                              <!-- <image mode="aspectFill" :src="item.link" alt="" class="img"/> -->
                              <image-loader :src="item.link+'?x-oss-process=image/resize,w_400'" width="100%" height="100%" image-style="border-radius:6rpx;"></image-loader>
                              <div class="deleteItemPhoto" @click.stop="deletePhoto(item)">
                                <img src="/static/image/delete-red.png" alt="">
                              </div>
                              <div class="lookNum">
                                <img src="/static/image/eye.png" alt="">
                                <i>{{item.view_num}}</i>
                              </div>
                            </div>
                          </scroll-view>
                        </div>
                      </div>
                      <div style="margin-top:24rpx;">
                        <block v-for="(item,index) in artData" :key="index"  v-if="artData.length>0">
                          <news-list :dataItem="item"  @leaveWord="leaveWord" more="true" @deleteItem="deleteArt" @jumpTopic="jumpTopic(item)" @share="shareItem"> </news-list>
                        </block>
                        <div style="height:102rpx;width:100%;" :style="{'margin-bottom':form.is_vip?'140rpx;':''}" v-if="artData.length>0">
                          <div class="wait" style="height:100rpx;" v-if="!isNetErr">
                            {{isLoadEnd?"已经到底了":"正在努力加载中"}}
                          </div>
                          <div class="netErr wait" style="height:100rpx;" @click="repeatRequest" v-if="isNetErr">网络错误，点击重试</div>
                        </div>
                        <div class="text-info text-center" v-if="artData.length==0">
                          <!-- <span>有日志动态的人更容易认识到与你契合的好友哦~ </span><br/>
                          <span style="margin-top:10rpx;display:inline-block;">点击右下角快去发表动态吧</span> -->
                          <img style="width:420rpx;height:370rpx;display:inline-block;" src="/static/image/no-log.png"/>
                          <p>你还没有发布任何日志哦</p>
                        </div>
                        <div class="on-top" v-if="(currentTab==0&&titleHighlight==0)&&form.is_vip" @click.stop="onClickTop">
                          <image class="img" src="/static/image/top-icon.png"></image>
                          <div class="text text-center">推荐置顶</div>
                        </div>
                      </div> 
                    </div>
                  </div>
                  <!--资料-->
                  <div class="content-items">
                    <div class="basicData">
                      <div class="rz-group">
                        <div class="title">基本资料</div>
                        <div class=" main-info">
                          <i-cell-group >
                            <i-cell title="姓名" i-class="user-cell"  @click="openEdit('name')">
                              <div slot="footer" class="footer-color"  @click="openEdit('name')">{{userInfo.nickname}}</div>
                            </i-cell>
                            <i-cell title="内心独白" i-class="user-cell"  @click="openEdit('introduce')">
                              <div slot="footer" class="footer-color" @click="openEdit('introduce')">{{}}
                                <span v-if="userInfo.introduce">{{userInfo.introduce}}</span>
                                <span v-else style="color:#A1A7AE">一句话，一个字都可能让缘分发生哦～</span>
                              </div>
                            </i-cell>
                            <i-cell title="性别" i-class="user-cell"  >
                              <div slot="footer" style="color:#84838D;padding-right:32rpx;">
                                <span v-if="userInfo.sex==1">男</span>
                                <span v-if="userInfo.sex==2">女</span>
                              </div>
                            </i-cell>
                            <i-cell title="生日" i-class="user-cell"  @click.stop="datePickerIsShow=true ">
                              <div slot="footer" class="footer-color" @click.stop="datePickerIsShow=true ">
                                <span v-if="form.birthday">{{form.birthday}}</span>
                                <span v-else style="color:#A1A7AE">请选择</span>
                              </div>
                            </i-cell>
                            <i-cell title="所在地" i-class="user-cell"  @click.stop="showSitePicker=true">
                              <div slot="footer" class="footer-color"  @click.stop="showSitePicker=true">
                                <span v-if="form.city">{{form.city}}</span>
                                <span v-else style="color:#A1A7AE">请选择</span>
                              </div>
                            </i-cell>
                            <i-cell title="职业" i-class="user-cell"   @click.stop="jobShow=true">
                              <div slot="footer" class="footer-color" @click.stop="jobShow=true">
                                <span v-if="form.industry">{{form.industry}}</span>
                                <span v-else style="color:#A1A7AE">请选择</span>
                              </div>
                            </i-cell>
                            <i-cell title="婚姻状况" i-class="user-cell"  @click.stop="maritalShow=true" >
                              <div slot="footer" class="footer-color" @click.stop="maritalShow=true" >
                                <span v-if="form.marryText">{{form.marryText}}</span>
                                <span v-else style="color:#A1A7AE">请选择</span>
                              </div>
                            </i-cell>
                            <i-cell title="身高" i-class="user-cell"  @click.stop="heightShow=true">
                              <div slot="footer" class="footer-color" @click.stop="heightShow=true">
                                <span v-if="form.height">{{form.height}}厘米</span>
                                <span v-else style="color:#A1A7AE">请选择</span>
                              </div>
                            </i-cell>
                            <i-cell title="体重" i-class="user-cell"  @click.stop="weightShow=true">
                              <div slot="footer" class="footer-color"  @click.stop="weightShow=true">
                                <span v-if="form.weight">{{form.weight}}kg</span>
                                <span v-else style="color:#A1A7AE">请选择</span>
                              </div>
                            </i-cell>
                            <i-cell title="年收入" i-class="user-cell"  @click.stop="incomeShow=true">
                              <div slot="footer" class="footer-color" @click.stop="incomeShow=true">
                                <span v-if="form.income">{{form.income}}</span>
                                <span v-else style="color:#A1A7AE">请选择</span>
                              </div>
                            </i-cell>
                          </i-cell-group>
                        </div>
                      </div>
                      <!-- 认证信息 -->
                      <div class="rz-group">
                        <div class="title">认证信息</div>
                        <div class=" main-info">
                          <i-cell-group >
                            <i-cell title="身份证" i-class="user-cell" @click.stop="jumpCaUrl(userCaDetailInfo.id.is_ca,'id')">
                              <image slot="icon" class="cell-icon-img"   src="/static/image/sfz-active.png" v-if="userCaDetailInfo.id.is_ca"></image>
                              <image slot="icon" class="cell-icon-img"   src="/static/image/sfz.png"  v-else></image>
                              <div slot="footer" :class="{'footer-pd-rt':userCaDetailInfo.id.is_ca}" @click.stop="jumpCaUrl(userCaDetailInfo.id.is_ca,'id')">
                                <div v-if="userCaDetailInfo.id.is_ca">
                                  <span class="name" v-if="userCaDetailInfo.id.detail">{{userCaDetailInfo.id.name}}**</span>
                                  <span v-else>审核中</span>
                                </div>
                                <div class="null-text" v-else>未认证<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                              </div>
                            </i-cell>
                            <i-cell title="学历" i-class="user-cell" @click.stop="jumpCaUrl(userCaDetailInfo.education.is_ca,'education')">
                              <image slot="icon" class="cell-icon-img"   src="/static/image/xueli-active.png" v-if="userCaDetailInfo.education.is_ca"></image>
                              <image slot="icon" class="cell-icon-img"   src="/static/image/xueli.png" v-else></image>
                              <div slot="footer" :class="{'footer-pd-rt':userCaDetailInfo.education.is_ca}" @click.stop="jumpCaUrl(userCaDetailInfo.education.is_ca,'education')">
                                  <div v-if="userCaDetailInfo.education.is_ca">
                                    <span v-if="userCaDetailInfo.education.detail">已认证</span>
                                    <span v-else>审核中</span>
                                  </div>
                                  <div class="null-text" v-else>未认证<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                              </div>
                            </i-cell>
                            <i-cell title="微信"  i-class="user-cell" @click.stop="jumpCaUrl(userCaDetailInfo.wechat.is_ca,'wechat')">
                              <image slot="icon" class="cell-icon-img"   src="/static/image/wx-info-active.png" v-if="userCaDetailInfo.wechat.is_ca"></image>
                              <image slot="icon" class="cell-icon-img"   src="/static/image/wx-info.png" v-else></image>
                              <div slot="footer" :class="{'footer-pd-rt':userCaDetailInfo.wechat.is_ca}" @click.stop="jumpCaUrl(userCaDetailInfo.wechat.is_ca,'wechat')">
                                  <div v-if="userCaDetailInfo.wechat.is_ca">
                                    <span v-if="userCaDetailInfo.wechat.detail">已认证</span>
                                    <span v-else>审核中</span>
                                  </div>
                                  <div class="null-text" v-else>未认证<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                              </div>
                            </i-cell>
                            <!-- 手机号认证 -->
                            <button class="get-phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!userCaDetailInfo.phone.is_ca">
                              <i-cell title="手机"  i-class="user-cell" >
                                <image slot="icon" class="cell-icon-img"   src="/static/image/phone.png"></image>
                                <div slot="footer" :class="{'footer-pd-rt':userCaDetailInfo.phone.is_ca}" >
                                  <div class="null-text">未认证<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                                </div>
                              </i-cell>
                            </button>
                            <i-cell title="手机"  i-class="user-cell"  v-if="userCaDetailInfo.phone.is_ca">
                              <image slot="icon" class="cell-icon-img"   src="/static/image/phone-active.png"></image>
                              <div slot="footer" :class="{'footer-pd-rt':userCaDetailInfo.phone.is_ca}" >
                                <div> 已认证 </div>
                              </div>
                            </i-cell>

                            <i-cell title="房产信息"  i-class="user-cell"  @click.stop="jumpCaUrl(userCaDetailInfo.house.is_ca,'house')">
                              <image slot="icon" class="cell-icon-img"   src="/static/image/house-active.png" v-if="userCaDetailInfo.house.is_ca"></image>
                              <image slot="icon" class="cell-icon-img"   src="/static/image/house.png" v-else></image>
                              <div slot="footer" :class="{'footer-pd-rt':userCaDetailInfo.house.is_ca}" @click.stop="jumpCaUrl(userCaDetailInfo.house.is_ca,'house')">
                                <div v-if="userCaDetailInfo.house.is_ca">
                                  <span v-if="userCaDetailInfo.house.detail">已认证</span>
                                  <span v-else>审核中</span>
                                </div>
                                <div class="null-text" v-else>未认证<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                              </div>
                            </i-cell>
                            <i-cell title="车辆信息" i-class="user-cell" @click.stop="jumpCaUrl(userCaDetailInfo.car.is_ca,'car')">
                              <image slot="icon" class="cell-icon-img" src="/static/image/Cert-car-active.png" v-if="userCaDetailInfo.car.is_ca"></image>
                              <image slot="icon" class="cell-icon-img"   src="/static/image/Cert-car.png" v-else></image>
                              <div slot="footer" :class="{'footer-pd-rt':userCaDetailInfo.car.is_ca}"  @click.stop="jumpCaUrl(userCaDetailInfo.car.is_ca,'car')">
                                  <div v-if="userCaDetailInfo.car.is_ca">
                                    <span v-if="userCaDetailInfo.car.detail">已认证</span>
                                    <span v-else>审核中</span>
                                  </div>
                                  <div class="null-text" v-else>未认证<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                              </div>
                            </i-cell>
                          </i-cell-group>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--婚姻状况组件-->
                <div v-if="maritalShow">
                  <public-picker type="one" @submit="marryChange" @closeDate="closeMarry" :oneData="maritalArr" :show="maritalShow"></public-picker>
                </div>
                <!--年收入组件-->
                <div v-if="incomeShow">
                  <public-picker type="one" @submit="incomeChange" @closeDate="closeIncome" :oneData="incomeArr" :show="incomeShow"></public-picker>
                </div>
                <!--行业组件-->
                <div v-if="jobShow">
                  <public-picker type="two" @changeData="changeData" @submit="jobChange" @closeDate="closeJob" :oneData="jobOneArr" :show="jobShow" :twoData="jobTwoArr"></public-picker>
                </div>
                <!--身高入组件-->
                <div v-if="heightShow">
                  <public-picker type="one" @submit="heightChange" @closeDate="closeHeight" :oneData="heightArr" :show="heightShow" :index="[20]"></public-picker>
                </div>
                <!--体重组件-->
                <div v-if="weightShow">
                  <public-picker type="one" @submit="weightChange" @closeDate="closeWeight" :oneData="weightArr" :show="weightShow" :index="[31]"></public-picker>
                </div>
                <!-- 生日     -->
                <date-picker
                  id="date-picker"
                  :value="datePickerValue"
                  :isShow="datePickerIsShow"
                  @sureclick="datePickerOnSureClick"
                  @cancelclick="datePickerOnCancelClick" />
                <!--地址组件 -->
                <div v-if="showSitePicker">
                  <site-picker :limit="false" @submit="bindRegionChange" @closeDate="closeSite" :show="showSitePicker"></site-picker>
                </div>
                <!-- 修改姓名 -->
                <div class="modal-input" v-if="nameShow">
                  <div class="modal-bg" @click="nameShow=false"> </div>
                  <div class="modal-content">
                    <div class="title text-center">修改名称</div>
                    <input type="text" :focus="true" class="input text-center" v-model="form.nickname" placeholder="请输入姓名">
                    <div class="modal-footer">
                      <div class="left text-center"  @click="nameShow=false"> 取消</div>
                      <div class="right text-center" @click="subEditInput('name')"> 确定</div>
                    </div>
                  </div>
                </div>
                <!-- 修改内心独白 -->
                <div class="modal-input" v-if="introduceShow">
                  <div class="modal-bg" @click="introduceShow=false"> </div>
                  <div class="modal-content textarea-content">
                    <div class="title text-center">修改内心独白</div>
                    <textarea maxlength="20"  class="textarea"  :focus="true" v-model="form.introduce"  placeholder="一句话，一个字都可能让缘分发生哦～" :show-confirm-bar="false"/>
                    <div class="modal-footer">
                      <div class="left text-center"  @click="introduceShow=false"> 取消</div>
                      <div class="right text-center" @click="subEditInput('introduce')"> 确定</div>
                    </div>
                  </div>
                </div>
              </div>
            </scroll-view>
          </swiper-item>
          <swiper-item class="swiper-item-page">
          <div class="pre-page">
              <!-- <img src="/static/image/building.png" alt="">
              <p>建设中……</p> -->
              <div class="topContent">
                <div class="backTop">

                </div>
                <div class="floatItem">
                  <div class="innerItem">
                    <image src="/static/image/vip-card-bg.png" class="vip-card-bg">  </image>
                    <div class="head-box">
                      <div class="headImg text-center"> 
                        <image-loader :src="userInfo.head_pic?userInfo.head_pic+'?x-oss-process=image/resize,w_200':'/static/image/user.png'" width="100%" height="100%" image-style="border-radius:50%;"></image-loader>
                      </div>
                      <h1 class="text-center">萝卜交友特权卡</h1>
                      <p class="text-center">邀好友，免费领</p>
                    </div> 
                  </div>
                </div>
              </div>
              <div class="inviteCont">
                <div class="inviteNow" v-if="!form.is_vip"> 
                  <div style="display:inline-block;margin:auto;">
                    <button  class="btn text-center" style="margin-left:0" open-type="share" data-name="pageShare" > 马上邀请 </button >  
                  </div> 
                  <div class="inviteAside" v-if="inviteUserNum==0">邀请5位好友，即刻体验VIP专属特权</div>
                  <div class="inviteAside" v-if="inviteUserNum>0">已有 {{inviteUserNum}} 位好友助力</div>
                </div>
                <div class="getPass" v-if="form.is_vip">
                  <div class="btn">领取成功</div> 
                </div>
                <!-- <div class="quicken" v-if="joinState==1">
                  <div class="btn">帮他加速一下</div>
                  <div class="inviteAside">已有 2 位好友助力</div>
                </div> -->
              </div>
              
              <div class="inviteUserLists">
                <div class="user-item-box">
                  <div class="userItem" v-for="(item,index) in vipInviteData" :key="item">
                    <image mode="aspectFill" :src="item.head_pic" class="img" v-if="item.head_pic"></image>
                    <div class="user-null text-center" v-if="!item.head_pic">+</div>  
                  </div> 
                </div> 
                <div class="more-invite-data" v-if="moreInviteData.length>0">
                  <span class="item" v-for="(item,index) in moreInviteData" :key="item">{{item.nick_name}}</span> 
                </div>
              </div>
              <div class="vipTitle">
                <i></i>
                <p v-if="form.is_vip">已为您开通VIP特权</p>
                <p v-else>VIP特权</p>
              </div>
              <div class="privilegeLists">
                <div class="listItem">
                  <div class="asideLogo">
                    <img src="/static/image/vip01.png" alt="">
                  </div>
                  <div class="rightIntrl">
                    <h1>专属身份</h1>
                    <p>专属的身份标识，让你在人群中更加突出</p>
                  </div>
                </div>
                <div class="listItem">
                  <div class="asideLogo">
                    <img src="/static/image/vip02.png" alt="">
                  </div>
                  <div class="rightIntrl">
                    <h1>查看更多精选萝卜</h1>
                    <p>每天可浏览全部推荐的精选用户，无限浏览， 畅玩交友体验</p>
                  </div>
                </div>
                <div class="listItem">
                  <div class="asideLogo">
                    <img src="/static/image/vip03.png" alt="">
                  </div>
                  <div class="rightIntrl">
                    <h1>置顶推荐</h1>
                    <p>每月一次“新萝卜”、“兔子窝-日志推荐”置顶， 更多人看到你的优秀</p>
                  </div>
                </div>
                <div class="listItem">
                  <div class="asideLogo">
                    <img src="/static/image/vip04.png" alt="">
                  </div>
                  <div class="rightIntrl">
                    <h1>自由定位</h1>
                    <p>自由漫游定位，移动交友，体验地区不受限</p>
                  </div>
                </div>
                <div class="listItem">
                  <div class="asideLogo">
                    <img src="/static/image/vip05.png" alt="">
                  </div>
                  <div class="rightIntrl">
                    <h1>查看访客列表</h1>
                    <p>查看历史访客，对暗恋自己的人了如指掌</p>
                  </div>
                </div>
              </div>
          </div>
          </swiper-item >
          <swiper-item class="swiper-item-page">
            <set-page></set-page>
          </swiper-item>
        </swiper>
      </div>

      <div class="menu-box" v-if="shareMenu">
        <div class="menu-modal" @click.stop="closeShare"></div>
        <div class="menu-content">
            <button class="text-center items" open-type="share" @click.stop="closeShare">转发</button>
            <!-- <div class="text-center items">查看详情</div> -->
            <div class="text-center items" @click.stop="closeShare">取消</div>
        </div>
      </div> 
    </block>
    <div style="padding-top:18rpx;" v-if="!is_login">
      <login-null  @close="closeModal"></login-null>
    </div> 

    <div class="dispatchBtn" v-if="currentTab==0&&titleHighlight==0" @click.stop="releaseDynamics">
      <img src="/static/image/addActive.png"/>
    </div>
    <!--配对成功-->
    <div v-if="vipShow">
      <charge-vip 
        :current="operationData.current"
        :type="operationData.vipType"
        :topDate="operationData.topDate"
        :dateShow="operationData.dateShow"
        @close="chargeVipClose" >
      </charge-vip>
    </div>

  </div>
</template>
<script>
import * as api from '@/utils/api' ;
import { baseUrl } from '@/utils/config' ;
import userStore from './../index/store' ;
import newsStore from './../news/store';
import headBack from '@/components/head-back.vue' ;
import newsList from '@/components/news-list.vue' ;
import setPage from '@/components/set-page.vue' ;
import loginNull from '@/components/login-null.vue' ;  
import chargeVip from '@/components/pop-up-box/charge-vip.vue' ;
import { jobList } from './../../../../static/js/job'
const app = getApp();
export default {
  onLoad(){
    if(this.currentTab==0){
      app.aldstat.sendEvent('个人主页'); // 事件名称规范: 不超过255个字符
    }else if(this.currentTab==1){

    }else if(this.currentTab==2){
      app.aldstat.sendEvent('设置'); // 事件名称规范: 不超过255个字符
    }
    let vm = this; 
    this.scrollIndex=0;
    this.artData=[];
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){ 
      this.getUserpageArt();
      this.creatForm();
      this.fetchTopDate(); //置顶信息
       
    } 
    //每次进来固定在主页详情
    this.titleHighlight=0;
    this.contentHeight='auto';
    //体重列表
    for(let i=19;i<=121;i++){
      let numItem='';
      if(i==19){
        numItem=20+'kg以下'
      }else if(i==121){
        numItem=120+'kg以上'
      }else{
        numItem=i+'kg'
      }
      vm.weightArr.push(numItem);
    }
  },
  onShow: function () {
    let vm = this;
    this.shareMenu=false;
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){ 
      this.fetchShareData();
      //推送消息
      app.globalData.subscriber.on('PUSH_MESSAGE_LIST', (data)=>{
        if(data){ 
          wx.showTabBarRedDot({index:2});
        }  
      })
      this.is_login=true;    
      if(userStore.state.userInfo.head_pic){
        this.userInfo=userStore.state.userInfo;
        userStore.state.userInfo.photo?this.imgUrls=userStore.state.userInfo.photo:this.imgUrls=[];
        this.resetFormData();
      }else{
        this.fetchInfo();
      };
      this.getCaLook();
    } else { 
      this.is_login=false;    
    } 
    
  },
  components:{
    headBack,
    newsList,
    setPage,
    loginNull,
    chargeVip
  },
  data () {
    return {
      scrollIndex:0,  //滚动的距离
      titleHighlight:0, //title下标
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),
      tabsList:[{name:'主页'},{name:'VIP特权'},{name:'设置'}],//分页的列表
      currentTab:0,//当前页面的下标
      userInfo:{},
      imgUrls: [],
      artData:[], //日志列表
      userCaDetailInfo: {
          "id": {
            "is_ca": false,
            "detail": "",
            "name": "",
            "id_card": ""
          },
          "phone": {
            "is_ca": false,
            "detail": ""
          },
          "wechat": {
            "is_ca": false,
            "detail": ""
          },
          "education": {
            "is_ca": false,
            "detail": "",
            "education": "",
            "school": ""
          },
          "car": {
            "is_ca": false,
            "detail": ""
          },
          "house": {
            "is_ca": false,
            "detail": ""
          }
      },
      contentHeight:'auto',
      update_head_link:'',  //更新头像
      update_photo_link:[],  //更新头像
      photoLengthNum:0,  //photo当前有多少img
      form:{},
      nameShow:false,
      introduceShow:false,
      maritalArr:['单身','已婚','离异'],
      maritalShow:false,
      incomeArr:['5万以下','6-10万','11-20万','20-50万','50万以上'],
      incomeShow:false,
      jobOneArr:[],
      jobTwoArr:[],
      jobShow:false,
      heightArr:['190厘米及以上','189厘米','188厘米','187厘米','186厘米','185厘米','184厘米','183厘米','182厘米','181厘米','180厘米','179厘米','178厘米','177厘米','176厘米','175厘米','174厘米','173厘米','172厘米','171厘米','170厘米','169厘米','168厘米','167厘米','166厘米','165厘米','164厘米','163厘米','162厘米','161厘米','160厘米','159厘米','158厘米','157厘米','156厘米','155厘米','154厘米','153厘米','152厘米','151厘米','150厘米','149厘米','148厘米','147厘米','146厘米','145厘米','144厘米','143厘米','142厘米','141厘米','140厘米及以下'],
      heightShow:false,
      weightArr:[],
      weightShow:false,
      // 生日
      datePickerIsShow: false,
      datePickerValue:  [1990, '06', '15'],
      region: [],  //地址
      showSitePicker:false,
      //计时器
      objCtime:null,
      shareData:{},
      shareMenu:false, 
      is_login:false,
      isNetErr:false,//网络错误
      isLoadEnd:false,//是否到底
      pageInfo:{
        page:1,
        size:10,
        total:0,
      },
      isLoad:false, 
      vipShow:false,
      operationData:{
        vipType:'share',
        topDate:'',
        dateShow:false,  //是否显示倒计时
        current:0,
      },

      vipInviteData:[
        {nick_name:"",head_pic: ""},
        {nick_name:"",head_pic: ""},
        {nick_name:"",head_pic: ""},
        {nick_name:"",head_pic: ""},
        {nick_name:"",head_pic: ""}
      ],
      inviteUserNum:0,  //邀请用户数量
      moreInviteData:[],  //多余五个用户

      //置顶信息
      topForm:{
        times:0,
        is_top:false,
        end_time:"2019-5-24 12:00:00"
      },
      setTimeData : null,
    }
  },
  mounted() {
    this.creatArrJob();
  },
  methods: {
    //跳转到粉丝列表
    jumpUrl(val){
      if(this.form.is_vip){
        if(val==1){ 
          userStore.state.msgJumpTab=1;
          wx.switchTab({url:`./../message/main`});   
        }else if(val==2){
          wx.navigateTo({url:`./../fans/main`});
        } 
      }else{
        if(val==1){ 
          userStore.state.msgJumpTab=1;
          wx.switchTab({url:`./../message/main`});   
        }else{
          this.vipShow=true;
          this.operationData.current=2;
          this.operationData.vipType='share';
        }
        
      } 
    },
    //加载的状态避免锁死
    loadState(num) {
      if (num == 1) {
        this.isLoad = false;
        this.isLoadEnd = false;
      } else if (num == 2) {
        this.isLoad = true;
        this.isLoadEnd = false;
      } else if (num == 3) {
        this.isLoad = true;
        this.isLoadEnd = true;
      } else if (num == 0) {
        this.isLoad = false;
        this.isLoadEnd = false;
        this.isNetErr = false;
      }
    },
    //滑动开始
    touchStart(e) {
      //获取开始滑动距离屏幕的位置
      this.startClientY = e.clientY;
    },
    // 滑动结束
    touchEnd(e) {
      //获取结束滑动距离屏幕的位置
      this.endClientY = e.mp.changedTouches[0].clientY;
    },
    //滚动到底部加载
    scrolltolower(){
      //在个人主页以及下滑的时候
      if(this.currentTab==0&&this.endClientY - this.startClientY<0){
        if (this.isLoadEnd) {
          return;
        } else {
          if (!this.isLoad) {
            this.isLoad = true;
            if (this.pageInfo.page >= this.pageInfo.total) {
              this.loadState(3);
              return;
            } else {
              this.loadState(2);
              this.pageInfo.page += 1;
              let time_=setTimeout(() => {
                this.getUserpageArt();
                clearTimeout(time_);
              }, 50);
            }
          }
        }
      }
    },
    //网络错误重试
    repeatRequest(){
      this.getUserpageArt();
    },
    //tabs切换
    clickTabs(item,index){
      this.currentTab=index;
      if(this.currentTab==0){
        app.aldstat.sendEvent('个人主页'); // 事件名称规范: 不超过255个字符
      }else if(this.currentTab==1){
        
      }else if(this.currentTab==2){
        app.aldstat.sendEvent('设置'); // 事件名称规范: 不超过255个字符
      }
    },
    //swiper切换
    currenChange(e){
      this.currentTab=e.target.current;
      if(this.currentTab){
        this.fetchShareData();
      } 
    },
    jumpTopic(item){
        wx.navigateTo({url:`./../../news-pages/tag-list/main?topicid=${item.topic_id}&topic=${item.topic}`});
    },
    creatForm(){
      this.form={
        nickname: "",
        introduce: "",//简介
        height: '',
        birthday:'',
        weight:'',//体重
        marry: 0,
        marryText:'',//婚姻状况
        city: "",
        income: "",//收入
        industry: "",//行业
      };
    },
    goBack(){
      wx.navigateBack({ delta: 1 });
    },
    //计算虚拟dom的参数
    computeDom(dom){
      return new Promise(function (resolve, reject) {
          var query = wx.createSelectorQuery();
          query.select(dom).boundingClientRect();
          query.selectViewport().scrollOffset();
          query.exec((res) => {
              resolve(res[0]);
          });
      });
    },
    resetFormData(){
      this.form={
        nickname: this.userInfo.nickname,
        introduce: this.userInfo.introduce,//简介
        height: this.userInfo.height,
        birthday:this.userInfo.birthday,
        weight:this.userInfo.weight, //体重
        marry: this.userInfo.marital_status,
        marryText:this.userInfo.marital_status==0?'单身':this.userInfo.marital_status==1?'已婚':this.userInfo.marital_status==2?'离异':'其他',  //婚姻状况
        city:this.userInfo.city,
        income: this.userInfo.income, //收入
        industry: this.userInfo.industry,  //行业
        is_vip:this.userInfo.is_vip,
      };
    },
    /**获取用户信息 */
    fetchInfo(){
      let vm = this;
      api.getUserDetail().then(res=>{
        if(res.data.code==300000){
          userStore.state.userInfo=res.data.data;
          vm.userInfo=res.data.data;
          vm.imgUrls=userStore.state.userInfo.photo;
          vm.resetFormData();
        }
      })
    },
    //获取认证信息
    getCaLook(){
      let vm = this;
      api.fetchCaLook().then(res=>{
        if(res.data.code==300000){
          vm.userCaDetailInfo=res.data.data.ca_detail;
        }
      });
    },
    //获取手机号
    getPhoneNumber (e) {
      let vm = this;
      if(e.mp.detail.errMsg=='getPhoneNumber:fail user deny'){
        console.log('用户拒绝授权手机号');
      }else{
        let body={
          openid:wx.getStorageSync('openId'),
          encrypt_data:e.mp.detail.encryptedData,
          iv:e.mp.detail.iv
        };
        api.getDecode(body).then(res=>{
          if(res.data.code==300000){
            //  vm.updatPhone(res.data.data.phoneNumber);
             api.updateCaLook({phone:res.data.data.phoneNumber}).then(res=>{
               if(res.data.code==300000){
                 vm.getCaLook();
                }
             });
          }else{
            wx.showToast({
                title: res.data.err,
                icon: 'none'
            })
          }
        })
      }
    },
    //跳转认证界面
    jumpCaUrl(val,type){
      if(!val){
        if(type=='id'){
          wx.navigateTo({url:`./../../user-info/verify-page/id-verify/main`});
        }else if(type=='education'){
          wx.navigateTo({url:`./../../user-info/verify-page/academic-verify/main`});
        }else if(type=='wechat'){
           wx.navigateTo({url:`./../../user-info/verify-page/wx-verify/main`});
        }else if(type=='house'){
          wx.navigateTo({url:`./../../user-info/verify-page/house-verify/main`});
        }else if(type=='car'){
           wx.navigateTo({url:`./../../user-info/verify-page/car-verify/main`});
        }
      }
    },
    //置顶推荐
    onClickTop(){
      let vm = this;
      if(vm.form.is_vip){
        if(vm.topForm.is_top){
          vm.vipShow=true; 
          vm.operationData.dateShow=true;
          vm.operationData.vipType='top';
        }else{
          if(vm.topForm.times>0){
            api.setTopInfo().then(res=>{
              if(res.data.code==300000&&res.data.data){
                vm.topForm=res.data.data;
                vm.topCountDown(); 
                vm.vipShow=true; 
                vm.operationData.dateShow=true;
                vm.operationData.vipType='top';
              }
            }); 
          }else{
            vm.vipShow=true; 
            vm.operationData.dateShow=false;
            vm.operationData.vipType='top';
          } 
        }
      }else{
        vm.vipShow=true; 
        vm.operationData.current=3;
        vm.operationData.vipType='share';
      } 
    },
    fetchTopDate(val){
      let vm = this;
      api.fetchTopInfo().then(res=>{
        if(res.data.code==300000&&res.data.data){
          vm.topForm=res.data.data;
          vm.topCountDown(); 
        }
      });
    },
    topCountDown(){
      let vm = this;
      let date1=new Date(vm.topForm.end_time); 
      let date3=parseInt((date1.getTime()-new Date().getTime())/1000);   //相差秒数   
      let n = date3; // 当前倒计时 
      let num = 0;//计数倒计时秒数（n - num） 
      // 动画函数
      function animation () {  
        if (num < n) {   
            num++;
            console.log(secondToDate(n-num));
        } else {
          vm.topForm.is_top=false;
          clearInterval(vm.setTimeData);
        }
      };
      //时间转换
      function secondToDate (val){ 
        var h = Math.floor(val / 3600),
          m = Math.floor((val / 60 % 60)),
          s = Math.floor((val % 60)); 
        let result = ""+parseInt(s)+"秒"; 
        if(m > 0) { 
          result = ""+parseInt(m)+"分"+result; 
        } 
        if(h > 0) { 
          result = ""+parseInt(h)+"小时"+result; 
        } 
        vm.operationData.topDate=result; 
      }
      vm.setTimeData = setInterval(animation, 1000); 

    },
    //获取用户日志
    getUserpageArt(){
      let vm = this;
      let body={
        ruuid:'',
        page:this.pageInfo.page,
        size:this.pageInfo.size,
      };
      api.fetchUserpageArt(body).then(res=>{
        if(res.data.code==300000){
          if(res.data.data.data){
            vm.artData.push(...res.data.data.data);
          }
          vm.pageInfo.page=res.data.data.info.page_num;
          vm.pageInfo.size=res.data.data.info.page_size;
          vm.pageInfo.total=res.data.data.info.total_page;
          vm.loadState(0);
          if (vm.pageInfo.total == vm.pageInfo.page) {
            vm.isLoadEnd = true;
          }
        }else{
          vm.loadState(0);
        }
      },()=>{
        vm.loadState(0);
      });
    },
    //跳转详情
    leaveWord(item){
      newsStore.state.newsDataItem=item;
      wx.navigateTo({url:`./../../news-pages/news-detail/main`});
    },
    //浏览大图
    previewImage(item){
      let vm = this;
      let urls = [];
      vm.imgUrls.forEach((list,index)=>{
        urls.push(list.link);
      });
      wx.previewImage({
        current: item.link, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    },
    //选择照片
    gotoShow(val){
      var vm = this
      wx.chooseImage({
        count: val=='photo'?6-vm.imgUrls.length:1,
        sizeType: ['original','compressed'], // compressed 压缩
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
          console.log(res.tempFilePaths[0]);
          if(val=='head'){
            vm.update_head_link=res.tempFilePaths[0];
            vm.postImgFile(val);
          } else if(val=='photo'){
            console.log(res.tempFilePaths);
            app.aldstat.sendEvent('myhome:上传相册照片');
            vm.photoLengthNum=vm.imgUrls.length+1;
            vm.update_photo_link=res.tempFilePaths;
            for(let i=0;i<vm.update_photo_link.length;i++){
              vm.postImgFile(val,i);
            }
          }
        },
        fail: function() {
          // wx.showModal({
          //     title: '提示',
          //     content: '上传失败,请重新选择',
          //     showCancel: false
          // })
        }
      })
    },
    //上传照片
    postImgFile(type,index){
      let vm = this;
      let temporary_link='';
      if(type=='head'){
        temporary_link=vm.update_head_link;
      } else if(type=='photo'){
        temporary_link=vm.update_photo_link[index];
      }
      wx.uploadFile({
        url: `${baseUrl}public/file/wxupload`,
        filePath: temporary_link,
        name: 'file',
        header: { "Content-Type": "multipart/form-data"},
        formData: {
            'name':temporary_link,
            'source':'photo',
        },
        success: function (res) {
          if(res){
            if(type=='head'){
               vm.postHaadLink(JSON.parse(res.data).link)
            }else if(type=='photo'){
              vm.uploadMyPhoto(JSON.parse(res.data).link)
            }
          }
        },
        fail:function(err){
          wx.showModal({
            title: '提示',
            content: '上传失败,请重新上传',
            showCancel: false
          })
        }
      })
      .onProgressUpdate((res) => {
        wx.showToast({
            icon: "loading",
            title:`上传${res.progress}%`
        });
      });
    },
    //上传头像
    postHaadLink(link){
      let vm = this;
      app.aldstat.sendEvent('myhome:更换头像');
      api.updateUserInfo({head_pic:link}).then(res=>{
        if(res.data.code==300000){
          vm.userInfo.head_pic=link;
          userStore.state.userInfo.head_pic=link;
        }
      })
    },
    //上传相册照片
    uploadMyPhoto(val){
      let vm = this;
      let body={
        "serial_num": vm.photoLengthNum,
        "link":val
      };
      api.postUpload(body).then(res=>{
        if(res.data.code==300000){
          wx.showToast({ title: '上传成功', icon: 'none' })
          vm.fetchInfo();//重新获取用户信息
          vm.photoLengthNum++;
        }else{
          wx.showModal({
            title: '提示',
            content: '上传失败,请重新上传',
            showCancel: false
          })
        }
      }).catch(err=>{

      });
    },
    //删除照片
    deletePhoto(val){
      let vm = this;
      app.aldstat.sendEvent('myhome:删除相册照片');
      if(!(vm.imgUrls.length<2)){
        let body={
          link:val.link,
          serial_num:val.serial_num
        };
        api.deletePhoto(body).then(res=>{
          if(res.data.code==300000){
            vm.fetchInfo();
          }
        });
      } else {
        wx.showModal({
            title: '提示',
            content: '一张照片不留，别人怎么刷您呢？',
            showCancel: false
        })
      }
    },
    //切换 tabbar
    changeTabbar(val){
      this.titleHighlight=val;
      if(val==1){
        let me=this;
        this.computeDom('.basicData').then(
          (res)=>{
            me.contentHeight=res.height+20+'px';
          }
        );
      }else{
        let me=this;
        me.contentHeight='auto';
        // this.computeDom('.homepage').then(
        //   (res)=>{
        //     me.contentHeight=res.height+20+'px';
        //   }
        // );
      };
    },
    //页面滚动效果
    scroll (e) {
      let sTop = e.mp.detail.scrollTop;
      if(sTop>50){
        this.scrollIndex=1;
      } else {
        this.scrollIndex=0;
      }
    },
    //删除当前日志
    deleteArt(data){
      if(data.isDelete){
        let me=this;
        api.deletJournal({
            article_id:data.item.art_id,
          }).then(
              (res)=>{
                  if(res.data.code==300000){
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 1000
                    });
                    me.contentHeight=0;
                    me.artData=[];
                    me.loadState(1);
                    me.pageInfo.page=1;
                    let timer=setTimeout(()=>{
                      me.getUserpageArt();
                      clearTimeout(timer);
                    },50);
                  }else{
                      wx.showToast({
                          title: '删除失败',
                          icon: 'none',
                          duration: 1000
                      });
                  }
                  me.contentHeight='auto';
              },
              (err)=>{
                  wx.showToast({
                      title: '删除失败',
                      icon: 'none',
                      duration: 1000
                  });
                  me.contentHeight='auto';
                  console.log(err)
              }
          )
      }
    },
    //编辑用户资料
    updateInfo(body,val){
      let vm = this;
      api.updateUserInfo(body).then(res=>{
        if(res.data.code){
          vm.fetchInfo();
          if(val=='name'){
            vm.nameShow=false;
            // vm.userInfo.nickname=vm.form.nickname;
          }else if(val=='introduce'){
            vm.introduceShow=false;
            // vm.userInfo.introduce=vm.form.introduce;
          }else if(val=='birthday'){
            // vm.userInfo.birthday=vm.form.birthday;
            vm.datePickerIsShow=false;
          }else if(val=='industry'){
            // vm.userInfo.industry=vm.form.industry;
            vm.jobShow=false;
          }else if(val=='city'){
            vm.userInfo.city=vm.form.city;
            vm.showSitePicker=false;
          }else if(val=='marry'){
            // vm.userInfo.marital_status=vm.form.marry;
            // body.marital_status=vm.form.marry;
            vm.maritalShow=false;
          }else if(val=='height'){
            // vm.userInfo.height=vm.form.height;
            // body.height=vm.form.height;
            vm.heightShow=false;
          }else if(val=='weight'){
            // vm.userInfo.weight=vm.form.weight;
            // body.weight=vm.form.weight;
            vm.weightShow=false;
          }else if(val=='income'){
            // vm.userInfo.income=vm.form.income;
            // body.income=vm.form.income;
            vm.incomeShow=false;
          }
        }
      });
    },
    //修改姓名
    openEdit(type){
      if(type=='name'){
        this.form.nickname=this.userInfo.nickname;
        this.nameShow=true;
      }else if(type=='introduce'){
        this.form.introduce=this.userInfo.introduce;
        this.introduceShow=true;
      }
    },
    //确认修改
    subEditInput(type){
      if(type=='name'){
        if(this.form.nickname){
          this.updateInfo({nickname:this.form.nickname},'name');
        }else{
          wx.showToast({
              title: '姓名不能为空',
              icon: 'none',
              duration: 1000
          });
        }
      }else if(type=='introduce'){
        if(this.form.introduce){
          this.updateInfo({introduce:this.form.introduce},'introduce');
        }else{
          wx.showToast({
              title: '内心独白不能为空',
              icon: 'none',
              duration: 1000
          });
        }
      }
    },
    checkMarry(value){
      let vm = this;
      vm.form.marry=value.marry;
      if(value.marry==0){
        vm.form.marryText='单身'
      }else if(value.marry==1) {
        vm.form.marryText='已婚'
      }else if(value.marry==2) {
        vm.form.marryText='离异'
      }
    },
    //婚姻状况
    marryChange (e) {
      this.checkMarry({marry:parseInt(e.mp.detail.oneIndex)});
      this.updateInfo({marital_status:parseInt(e.mp.detail.oneIndex)},'marry');
    },
    closeMarry(){
      this.maritalShow=false;
    },
    //年收入
    incomeChange (e) {
      this.form.income=e.mp.detail.oneValue;
      this.updateInfo({income:this.form.income},'income');
    },
    closeIncome(){
      this.incomeShow=false;
    },
    //行业
    jobChange (e) {
      let vm = this;
      if(e.mp.detail.oneValue=='其他'){
        vm.form.industry=e.mp.detail.twoValue;
      }else{
        vm.form.industry=e.mp.detail.oneValue+e.mp.detail.twoValue;
      }
      this.updateInfo({industry:this.form.industry},'industry');
      this.objCtime=setTimeout(()=>{
        vm.creatArrJob();
      },500)
    },
    changeData(val){
      let valIndex=val.mp.detail;
      this.jobTwoArr=jobList[valIndex[0]].children;
    },
    creatArrJob(){
      let vm = this;
      vm.jobOneArr=[];
      vm.jobTwoArr=jobList[0].children;
      jobList.forEach((item,index)=>{
        vm.jobOneArr.push(item.value)
      })
      clearTimeout(this.objCtime);
    },
    closeJob(){
      this.jobShow=false;
      this.creatArrJob();
    },
    //选择身高
    heightChange(e) {
      this.form.height=e.mp.detail.oneValue.replace(/厘米/g,"");

      this.updateInfo({height:parseInt(this.form.height)},'height');
    },
    closeHeight(){
      this.heightShow=false;
    },
    //选择体重
    weightChange(e) {
      this.form.weight=e.mp.detail.oneValue.replace(/kg/g,"");
      this.updateInfo({weight:parseInt(this.form.weight)},'weight');
    },
    closeWeight(){
      this.weightShow=false;
    },
    //生日
    datePickerOnSureClick(e) {
      this.form.birthday=`${e.mp.detail.value[0]}-${e.mp.detail.value[1]}-${e.mp.detail.value[2]}`;
      this.datePickerValue=e.mp.detail.value;
      this.updateInfo({birthday:this.form.birthday},'birthday');
    },
    datePickerOnCancelClick(event) {
      this.datePickerIsShow=false
    },
    //选择地区
    bindRegionChange (e) {
        this.region=e.mp.detail
        if(e.mp.detail.province==e.mp.detail.city&&e.mp.detail.city!=e.mp.detail.area){
          this.form.city=e.mp.detail.province+e.mp.detail.area
        }else if(e.mp.detail.province==e.mp.detail.city&&e.mp.detail.city==e.mp.detail.area){
          this.form.city=e.mp.detail.province
        }else{
          this.form.city=e.mp.detail.province+e.mp.detail.city+e.mp.detail.area
        }
        this.updateInfo({city:this.form.city},'city');
    },
    closeSite(){
      this.showSitePicker=false;
    },

    releaseDynamics(){
      wx.navigateTo({url:'./../../news-pages/my-dispatch-page/main'});
    },
    //分享
    shareItem(item){ 
      this.shareData=item; 
      this.shareMenu=true;   
      // setTimeout(()=>{
      //   wx.hideTabBar({});// 隐藏tabbar 
      // },50)
    },
    closeShare(){ 
      this.shareMenu=false;
      // wx.showTabBar({});// 显示tabbar        
    },
    //关闭vip
    chargeVipClose(){
      this.vipShow=false;
    },
    //vip设置界面 获取邀请用户
    fetchShareData(){
      let vm =this;
      let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid; 
      api.getShareList({ruuid:meRuuid}).then(res=>{
        let resData=res.data.data;
        if(res.data.code==300000&&resData){
          if(resData.data){
            vm.inviteUserNum=resData.data.length;
            if(vm.inviteUserNum>=5){
              this.fetchInfo();
            }
            resData.data.forEach((item,index)=>{
              if(index<=5){
                vm.vipInviteData[index]=item;
              }else{
                vm.moreInviteData.push(item);
              }
            }) 
          }else{
            vm.vipInviteData=[];
          }
        }
      });
    },


  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid; 
    if(res.from=='button'){   
      if(this.currentTab==0){
        let title = this.shareData.content;
        let imgLink = this.shareData.pics?this.shareData.pics[0]:'';
        let path = `pages/common/index/main?sharRuuid=${meRuuid}&artId=${this.shareData.art_id}&type=news`; 
        return this.onShareAppMessage(title,path,imgLink);  
      }else if(this.currentTab==1||this.currentTab==2){
        let title = `${this.userInfo.nickname}邀您帮忙加速，领取免费无限体验通行卡，点击帮他加速一下`; 
        let path = `pages/common/index/main?sharRuuid=${meRuuid}&type=vip`; 
        return this.onShareAppMessage(title,path);  
      }  
    }else{ 
      let age= this.userInfo.age!=''?`${this.userInfo.age}岁`:'';
      let city=  this.userInfo.city!=''?`家住${this.userInfo.city}。`:'。';
      let introduce=  this.userInfo.introduce!=''?`${this.userInfo.introduce}。`:'';
      let title = `${this.userInfo.nickname},${age}${city}来看看你们合不合得来！`;
      let imgLink = this.imgUrls[0].link;
      let path = `pages/common/index/main?sharRuuid=${meRuuid}&userId=${meRuuid}&type=user`;   
      return this.onShareAppMessage(title,path,imgLink); 
    } 
  }, 
}
</script>

<style lang="scss" scoped>
@import './index.scss';
.menu-box{
    position: fixed;
    top:0;
    right:0;
    left:0;
    bottom:0;
    z-index:10001;
    .menu-modal{
        position: fixed;
        top:0;
        right:0;
        left:0;
        bottom:0; 
        background:rgba(0,0,0,.5); 
    }
    .menu-content{
        position: fixed;
        bottom:0;
        left: 0;
        z-index:10003; 
        width:100%;
        background:#EEEEEE; 
        animation: menu-fade-in .1s linear;
        .items{
            height:100rpx;
            line-height: 100rpx;
            background:#fff;
            border-bottom:1rpx solid #E1E6EB;
            &:last-child{
                border-bottom:0;
                margin-top:10rpx;
            }
            &:active{
                opacity: .6;
            }
        }
    }
}
@keyframes menu-fade-in {
  0% {  
    transform:translateY(500px)
  }   
  100% {  
    transform:translateY(0px)
  } 
}
.wait{
    height:82rpx;
    width: 100%;
    text-align: center;
    font-size: 28rpx;
    line-height: 82rpx;
    color:#999;
}
.on-top{
    width:176rpx;
    height:176rpx;
    position:fixed;
    bottom:55rpx;
    left:50%;
    margin-left:-88rpx;
    border-radius: 50%;
    box-shadow:0px 4px 6px 0px rgba(239,241,246,0.36);
    .img{
      width:100%;
      height:100%;
      transform:scale(1) ;
        transition: transform .1s ;
      &:active{
        transform:scale(1.1) ;
        transition: transform .1s ;
      }
    }
    .text{
      font-size:28rpx;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#4E5761;
    }
}
</style>
