var postDatas = require("../../../data/posts-data.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayInMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {    
    var that = this;
    var postId = options.id;
    this.setData({ postId });
    var postData = postDatas.postList[postId];
    this.setData(postData);
    // wx.setStorage({
    //   key: 'key',
    //   data: 'value',
    // });
    // wx.setStorageSync("key","nihaoya ");
    var postCollected = wx.getStorageSync("post_collected");
    if (postCollected) {
      var collected = postCollected[postId];

      if (collected) {
        this.setData({
          collected: collected
        });
      } else {
        this.setData({
          collected: false
        });
      }
    } else {
      var postCollected = {};
      postCollected[postId] = false;
      wx.setStorageSync("post_collected", postCollected);
    }

    if (app.globaleData.g_isPlayInMusic && app.globaleData.g_currentMusicPostId == postId) {
      this.setData({
        'isPlayInMusic': true
      });
    }

    this.setAudioMonitor();


  },

  setAudioMonitor: function (event) {
    var that = this;
    //监听音乐播放
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayInMusic: true
      });
      app.globaleData.g_currentMusicPostId = that.data.postId;
      app.globaleData.g_isPlayInMusic = true;
    });

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayInMusic: false
      });
      app.globaleData.g_isPlayInMusic = false;
      app.globaleData.g_currentMusicPostId = null;
    });

    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayInMusic: false
      });
      app.globaleData.g_isPlayInMusic = false;
      app.globaleData.g_currentMusicPostId = null;
    });
  },


  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync("post_collected");
    var postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;
    this.showModal(postsCollected, postCollected);

  },
  showToast: function (postsCollected, postCollected) {
    //更新缓存
    wx.setStorageSync("post_collected", postsCollected);
    //更新数据绑定
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? '收藏成功' : "取消收藏成功",
      duration: 1000,
    });

  },
  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: postCollected ? '收藏' : '取消收藏',
      content: postCollected ? '是否收藏该文本？' : '是否取消收藏该文本？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("post_collected", postsCollected);
          //更新数据绑定
          that.setData({
            collected: postCollected
          });
        }
      }

    });
  },
  onShareTap: function (event) {
    var itemList = [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到新浪微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
        });
      }, fail: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onMusicTap: function (event) {
    var isPlayInMusic = this.data.isPlayInMusic;
    if (isPlayInMusic) {
      //暂停音乐
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayInMusic: false
      });
    } else {
      //播放音乐
      wx.playBackgroundAudio({
        dataUrl: this.data['music']['dataUrl'],
        title: this.data['music']['title'],
        coverImgUrl: this.data['music']['coverImgUrl'],
      });
      this.setData({
        isPlayInMusic: true
      });
    }


  }
})