var express = require('express');
var router = express.Router();
var config = require('../config');

//var util = require('util'),
var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
      endPoint:  config.endPoint,
      awsId:     config.awsId,
      awsSecret: config.awsSecret,
      assocId:   config.assocId
});

router.get('/:kw?/:page?', function(req, res) {
  var kw = req.params.kw;
  var page = req.params.page;
  if(!page){
    page = 1;
  }
  if(!kw){
    // TODO
    res.send("No keyword error");
    return;
  }
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
//   TODO:本以外の場合は中のItemの値が変わってくるのであるものだけとってくる仕組みが必要
//  'SearchIndex': 'Blended',
    'Keywords': kw,
    'ItemPage': page,
    'ResponseGroup': 'ItemAttributes,Offers,Images'
  }, function(results) {
      //console.log(results.ItemSearchResponse.Items[0].TotalPages);
      if (typeof results.ItemSearchResponse === "undefined"){
        console.log("ItemSearchResponse undefined");
        res.send("Items undefined");
        return;
      }
//       if (results.ItemSearchErrorResponse){
//         console.log("ENTER ERRRESPONES");
//       }
      var items = results.ItemSearchResponse.Items[0];
      if(page > items.TotalPages){
        console.log("Exceed total page limit");
        res.send("Total page limit");
        res.status(500);
        return;
      }else if(page > 10){
        console.log("Exceed Amazon API page size limit");
        res.send("Total api page size limit");
        res.status(500);
        return;
      }
      var item = items.Item;
      var elem = [];
      if(typeof item === "undefined"){
        res.send("No value"); // TODO
        return;
      }
      for(var i = 0; i < item.length; i++){
        var detail = {};
        detail["asin"] = item[i].ASIN[0];
        detail["detailPageURL"] = item[i].DetailPageURL[0];
        if(item[i].SmallImage){
          detail["smallImage"] = item[i].SmallImage[0].URL[0];
        }
        if(item[i].MediumImage){
          detail["mediumImage"] = item[i].MediumImage[0].URL[0];
        }
        if(item[i].LargeImage){
          detail["largeImage"] = item[i].LargeImage[0].URL[0];
        }

        var attr = item[i].ItemAttributes;
        for(var j = 0; j < attr.length; j++){
          detail["title"] = attr[0].Title[0];
          if(attr[0].author){
            // 複数人の場合がある
            detail["author"] = attr[0].Author[0];
          }
          // 0がない場合がある
//          detail["isbn"] = attr[0].ISBN[0];
          if(attr[0].Publisher){
            detail["publisher"] = attr[0].Publisher[0];
          }
          detail["productGroup"] = attr[0].ProductGroup[0];
         }
        elem.push(detail);
      }
      var root = {};
      root["item"] = elem;
      //res.send(JSON.stringify(root, null, 4));
      res.json(root);
  });
});

module.exports = router;
