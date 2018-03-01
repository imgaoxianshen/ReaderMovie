var util = require("../../utils/util.js");
var app = getApp();
Page({

  data: {
    inTheaters: {},
    comingsoon: {},
    top250: {},
    searchResult:{},
    containerShow: true,
    searchPannelShow: false
  },

  onLoad: function (options) {
    var inTheatersUrl = app.globaleData.g_urlbase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingsoonUrl = app.globaleData.g_urlbase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globaleData.g_urlbase + "/v2/movie/top250" + "?start=0&count=3";

    //向服务器发送请求，
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingsoonUrl, "comingsoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "Top:250");
  },


  onReady: function () {

  },

  onShow: function () {

  },

  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      header: {
        "Content-Type": "json"
      },
      method: "GET",
      success: function (res) {
        //处理获取的数据
        that.processDoubanData(res.data, settedKey, categoryTitle);
      }
    });
  },
  processDoubanData: function (movieDouban, settedKey, categoryTitle) {
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
    var readyData = {};
    readyData[settedKey] = { movies: movies, categoryTitle: categoryTitle };
    this.setData(readyData);
  },
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    });
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },
  onCancleTap: function (event) {
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      // searchResult:{}
    });
  },
  onBindChange: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globaleData.g_urlbase+"/v2/movie/search?q="+text;
    this.getMovieListData(searchUrl,"searchResult","");

       
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieId='+movieId,
    })
  },


})