var app = getApp();
var util = require("../../../utils/util.js");

Page({
  data: {
    movies: {},
    totalCount: 0,
    isEmpty: true,
  },
  onLoad: function (options) {
    var category = options.category;
    //设置导航栏标题
    wx.setNavigationBarTitle({
      title: category,
    });
    var dataUrl = "";
    //查数据
    switch (category) {
      case "正在热映":
        dataUrl = app.globaleData.g_urlbase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globaleData.g_urlbase + "/v2/movie/coming_soon";
        break;
      default:
        dataUrl = app.globaleData.g_urlbase + "/v2/movie/top250";
        break;
    }

    this.setData({ requestUrl: dataUrl });

    util.http(dataUrl, this.processDoubanData)

  },
  processDoubanData: function (movieDouban) {
    var that = this;
    var movies = [];
    for (var idx in movieDouban.subjects) {
      var subject = movieDouban.subjects[idx];
      //标题
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";
      }

      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.converToStarsArray(subject.rating.stars)
      }

      movies.push(temp);

    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.setData({isEmpty:false})
    }
    this.setData({
      movies: totalMovies,
      totalCount: that.data.totalCount + 20
    });
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },
  // onScrollLower: function (event) {
  //   wx.showNavigationBarLoading()
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
  //   // console.log(nextUrl);
  //   util.http(nextUrl, this.processDoubanData);
  //   wx.hideNavigationBarLoading()

  // },

  //页面移动到最下面自动调用
  onReachBottom:function(event){
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.hideNavigationBarLoading();
  },
  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl + "?start=0"+ "&count=20";
    this.setData({movies: {},isEmpty:true,totalCount:0});
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },

})