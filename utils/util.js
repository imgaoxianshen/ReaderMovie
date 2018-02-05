function converToStarsArray(stars){
  var num = stars.toString().substring(0,1);
  var array = [];
  for(var i = 1;i<=5;i++){
    if(i<=num){
      array.push(1);
    }
    else{
      array.push(0);
    }
  }
  return array;
}

//网络请求获取数据
function http(url,callBack){
  wx.request({
    url: url,
    method:"GET",
    header : {
      "Content-Type":"json"
    },
    success:function(res){
      callBack(res.data);
    }
  })
}


module.exports = {
  converToStarsArray: converToStarsArray,
  http:http
}