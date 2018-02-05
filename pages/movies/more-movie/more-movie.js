var app = getApp();
var util = require("../../../utils/util.js");

Page({
  data: {
    movies:{},
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

    util.http(dataUrl, this.processDoubanData)

  },
  processDoubanData: function (movieDouban) {
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
    this.setData({movies:movies});
  },


})