$.cookie.json = true;

var wishlist = [
  /*{"name":"Lightning God Ring","price":"9999999998"},
  {"name":"Ice Cold Red", "price": "2999999999"},
  {"name":"Cubic Chaos Blade", "price": "24999999"},
  {"name":"[A] Nebulite (DEX %)", "price": "2999999999"},
  {"name":"[A] Nebulite (STR %)", "price": "2999999999"},*/
];

var resultlist = [],
  oldone = [];

var db;

var notId = 0;

var noticenter = {};

$.getJSON("http://maple.fm/api/list/items", function(data) {
  db = data;
  console.log(db);
});

if ($.cookie('option') == undefined) {
  $.cookie('option', 'newonly');
}

if ($.cookie('server') == undefined) {
  $.cookie('server', '0');
}

if ($.cookie('wishlist') != undefined) {
  console.log($.cookie('wishlist'));
  wishlist = $.cookie('wishlist');
} else
  $.cookie('wishlist', wishlist);

$.cookie('result', []);

var count;

function show() {

  count = 0;
  resultlist = [];
  noticenter = {};

  for (var i = 0; i < notId; i++) {
    chrome.notifications.clear(i.toString(), deletionCallback);
  }

  if (notId == 0)
    create();

}

chrome.extension.onRequest.addListener(function(request, sender)
{
    var str = request.message.split("|");
    var newItemName = str[0];
    var price = str[1];
  
    for (var j = 0; j < db.length; j++) {
      var str1 = newItemName;
      var str2 = db[j].b;
      if (str1.toLowerCase() == str2.toLowerCase()) {
        id = db[j].a;
        newItemName = str2;
        break;
      }
    }  
    var iconid;
    $.getJSON("http://maple.fm/api/items?id=" + id, function(data) {
      iconid = data.item.icon;
      additem(newItemName,price,iconid);
    });
});

function create() {

  console.log("bg" + $.cookie('server'));

  $.getJSON("http://maple.fm/api/2/search?server=" + $.cookie('server') + "&stats=0&desc=0", function(data) {

    oldone = $.cookie('result');
    resultlist = [];
    $.cookie('result', resultlist);

    console.log(data); // use data as a generic object
    var json = data.fm_items;
    notId = 0;
    $.each(json, function(ind, obj) {
      $.each(wishlist, function(index, result) {
        if (result.name == obj.name && parseInt(result.price) >= parseInt(obj.price) && parseInt(obj.quantity) >= 1) {

          if (noticenter[obj.name] == undefined || parseInt(noticenter[obj.name].price) > parseInt(obj.price)) {
            noticenter[obj.name] = obj;
          }
          resultlist.push({
            "shopname": obj.shop_name,
            "price": obj.price,
            "fmroom": obj.room,
            "quantity": obj.quantity,
            "name": obj.name
          });
          $.cookie('result', resultlist);

          if ($.cookie('option') == 'newonly') {
            var found = false;
            console.log('this is ' + obj.name + obj.shop_name + obj.price + obj.room);
            for (var i = 0; i < oldone.length; i++) {
              var o = oldone[i];
              console.log(o.name + o.shopname + o.price + o.fmroom);

              if (o.price == obj.price && o.shopname == obj.shop_name && o.name == obj.name && o.fmroom == obj.room) {
                console.log("FOUND!");
                found = true;
              }
            }

            if (!found) {
              var shopname = obj.shop_name;
              if (shopname.length > 25) shopname = shopname.substring(0, 25) + "...";


              var notOption = {
                type: "basic",
                title: obj.name + " at FM " + obj.room,
                message: obj.quantity + " pieces at " + obj.price + "\nShop: " + shopname,
                iconUrl: 'http://maple.fm/static/image/icon/' + obj.icon + '.png',
              }

              chrome.notifications.create(notId.toString(), notOption, creationCallback);
              notId++;
            }
          }

        }
      });
    });


    if ($.cookie('option') == 'lowest') {

      for (var i = 0; i < wishlist.length; i++) {

        obj = noticenter[wishlist[i].name];

        if (obj == undefined) continue;

        var shopname = obj.shop_name;
        if (shopname.length > 25) shopname = shopname.substring(0, 25) + "...";


        var notOption = {
          type: "basic",
          title: obj.name + " at FM " + obj.room,
          message: obj.quantity + " pieces at " + obj.price + "\nShop: " + shopname,
          iconUrl: 'http://maple.fm/static/image/icon/' + obj.icon + '.png',
        }

        chrome.notifications.create(notId.toString(), notOption, creationCallback);
        notId++;
      }

    }
  });

}

function creationCallback(notID) {
  console.log("Succesfully created " + notID + " notification");
}

/*var script = document.createElement('script');
script.src = 'jquery-1.11.2.min.js';
script.type = 'text/javascript';

document.getElementsByTagName('head')[0].appendChild(script);*/

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true; // The display activation.
  localStorage.frequency = 1; // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
  localStorage.watchlist = wishlist;
}

if (JSON.parse(localStorage.isActivated)) {
  show();
}

$.cookie.defaults = {
  expires: 365
};

var interval = 0; // The display interval, in minutes.

setInterval(function() {
  interval++;
  if (
    JSON.parse(localStorage.isActivated) &&
    localStorage.frequency <= interval
  ) {
    chrome.notifications.getAll(function(notifications) {

    });
    show();
    interval = 0;
  }
}, 60000);

function additem(itemName, itemPrice, icon) {
  wishlist.push({
    "name": itemName,
    "price": itemPrice,
    'icon': icon
  });
  $.cookie('wishlist', wishlist);
  show();
}

function removeitem(itemName) {
  var deleteindex;
  $.each(wishlist, function(index, result) {
    if (result.name == itemName) {
      deleteindex = index;
    }
  });
  wishlist.splice(deleteindex, 1);
  $.cookie('wishlist', wishlist);
}

function deletionCallback(notID) {
  console.log("Succesfully deleted " + notID + " notification");
  count++;
  if (count == notId)
    create();
}