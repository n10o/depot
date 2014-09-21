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
      var items = results.ItemSearchResponse.Items[0];
      var item = items.Item;
      var output = [];
      if(typeof item === "undefined"){
        res.send("No value"); // TODO
        return;
      }
      for(var i = 0; i < item.length; i++){
        var detail = {};
        detail["ASIN"] = item[i].ASIN[0];
        detail["URL"] = item[i].DetailPageURL[0];
        detail["ImageURL"] = item[i].MediumImage[0].URL[0];

        var attr = item[i].ItemAttributes;
        for(var j = 0; j < attr.length; j++){
           detail["Title"] = attr[0].Title[0];
         }
        output.push(detail);
      }
      var top = {};
      top["item"] = output; 
      res.send(JSON.stringify(top, undefined, 2));
  });
});

module.exports = router;
