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

router.get('/:kw?', function(req, res) {
  var kw = req.params.kw;
  if(!kw){
    // TODO
    res.send("No keyword error");
    return;
  }
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': kw,
    'ResponseGroup': 'ItemAttributes,Offers,Images'
  }, function(results) {
    // todo Itemsがundefinedで落ちる
      var items = results.ItemSearchResponse.Items[0];
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
        detail["smallImage"] = item[i].SmallImage[0].URL[0];
        detail["mediumImage"] = item[i].MediumImage[0].URL[0];
        detail["largeImage"] = item[i].LargeImage[0].URL[0];

        var attr = item[i].ItemAttributes;
        for(var j = 0; j < attr.length; j++){
           detail["title"] = attr[0].Title[0];
           detail["author"] = attr[0].Author[0];
           detail["isbn"] = attr[0].ISBN[0];
           detail["publisher"] = attr[0].Publisher[0];
           detail["[roductGroup"] = attr[0].ProductGroup[0];
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
