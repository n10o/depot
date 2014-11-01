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
        detail["ASIN"] = item[i].ASIN[0];
        detail["DetailPageURL"] = item[i].DetailPageURL[0];
        detail["SmallImage"] = item[i].SmallImage[0].URL[0];
        detail["MediumImage"] = item[i].MediumImage[0].URL[0];
        detail["LargeImage"] = item[i].LargeImage[0].URL[0];

        var attr = item[i].ItemAttributes;
        for(var j = 0; j < attr.length; j++){
           detail["Title"] = attr[0].Title[0];
           detail["Author"] = attr[0].Author[0];
           detail["ISBN"] = attr[0].ISBN[0];
           detail["Publisher"] = attr[0].Publisher[0];
           detail["ProductGroup"] = attr[0].ProductGroup[0];
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
