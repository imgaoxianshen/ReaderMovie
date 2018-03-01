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

function convertToCastString(casts){
  var castsjoin = "";
  for(var idx in casts){
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0,castsjoin.length-3);
}

function convertToCastInfos(casts){
  var castsArray = [];
  for(var idx in casts){
    var cast = {
      img:casts[idx].avatars?casts[idx].avatars.large:"",
      name:casts[idx].name
    };
    castsArray.push(cast);
  }
  return castsArray;
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
  convertToCastInfos: convertToCastInfos,
  convertToCastString: convertToCastString,
  http:http
}