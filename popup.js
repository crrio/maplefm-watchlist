var bgpage = chrome.extension.getBackgroundPage();

var wishlist = bgpage.wishlist;
var db = bgpage.db;

var result = bgpage.resultlist;

var newItemName;

var fmservers = ["Scania", "Windia", "Bera", "Broa", "Khaini", "Ymck", "Gazed", "Bellonova", "Renegades"];

window.onload = reload;

function reload() {
  $.cookie.json = true;

  if ($.cookie('option') == 'newonly')
    $('.currentopt').text('  NEW');
  else
    $('.currentopt').text('  LOWEST');

  console.log("success");
  $('.watchlist').empty();

  wishlist = $.cookie('wishlist');

  db = bgpage.db;

  console.log(wishlist);
  if (wishlist == undefined)
    wishlist = [];

  //for(var i=0; i<wishlist.length; i++){

  var iconIndex = {};
  var idIndex = {};

  var count = 0;

  for (var i = 0; i < wishlist.length; i++) {
    var imgsite = wishlist[i].icon == null ? 'maple.png' : 'http://maple.fm/static/image/icon/' + wishlist[i].icon + '.png';
    $('.watchlist').append("<div class=\"item\"><img class=\"item-icon\" src=" + imgsite + "/><div class=\"helper\"></div><div class=\"name\">" + shorten(wishlist[i].name) + "</div><div class=\"price\">" + wishlist[i].price.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " meso or less</div><span class=\"octicon octicon-x\" id=\"" + wishlist[i].name + "\"></span></div>");
  }

  $('.add-item').submit(function(event) {
    event.preventDefault();

    $("#additembox").autocomplete("close");

    console.log("yea");
    id = -1;
    newItemName = $('.addbox').val();
    if (newItemName.length == 0) {
      return false;
    }
    for (var j = 0; j < db.length; j++) {
      var str1 = newItemName;
      var str2 = db[j].b;
      if (str1.toLowerCase() == str2.toLowerCase()) {
        id = db[j].a;
        newItemName = str2;
        break;
      }
    }

    if (id == -1) {
      swal({
        title: "Error!",
        text: "Item not found!",
        type: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ffb484"
      });

      return false;
    }

    $.getJSON("http://maple.fm/api/items?id=" + id, function(data) {
      id = data.item.icon;
      $('.preview').css('left', 0);
      $('.page1').css('left', -332 + 'px');
      $('.pvicon').attr('src', 'http://maple.fm/static/image/icon/' + id + '.png');
      $('.pvname').text(newItemName);
    });

    $('.backbtn').css('display', 'block');
    $('.octicon-gear').css('display', 'none');
    return false;
  });
  $(".addprice").keyup(function() {
    if (event.which >= 37 && event.which <= 40) {
      event.preventDefault();
    }
    var $this = $(this);
    var num = $this.val().replace(/,/g, '');
    $this.val(num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));


  });

  $('.add-price').submit(function(event) {
    event.preventDefault();

    if ($('.addprice').val().length == 0) {
      return false;
    }
    $(".addprice").val($(".addprice").val().replace(/,/g, ''));

    bgpage.additem(newItemName, $('.addprice').val(), id);

    $('.watchlist').append("<div class=\"item\"><img class=\"item-icon\" src='http://maple.fm/static/image/icon/" + id + ".png'/><div class=\"helper\"></div><div class=\"name\">" + shorten(newItemName) + "</div><div class=\"price\">" + $('.addprice').val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " meso or less</div><span class=\"octicon octicon-x\" id=\"" + newItemName + "\"></span></div>");

    swal({
      title: "Done!",
      text: "The item has been added",
      type: "success",
      confirmButtonText: "OK",

    }, function() {

      wishlist = $.cookie('wishlist');

      $('.backbtn').css('display', 'none');
      $('.octicon-gear').css('display', 'block');
      $('.preview').css('left', 331 + 'px');
      $('.page1').css('left', 0 + 'px');
      $('.addbox').val("");
      $('.addprice').val("");
    });
    return false;
  });

  $('.backbtn').click(function() {
    $('.page1').css('left', 0 + 'px');
    $('.preview').css('left', 331 + 'px');
    $('.owlOfMinerva').css('left', 331 + 'px');
    $('.selectReplacement').css('display', 'block');
    $(this).css('display', 'none');
    $('.octicon-gear').css('display', 'block');
  });

  $('.watchlist').on('click', '.item', function(event) {
    var str = $(this).find('.name').text().replace('...', '');
    console.log(str);
    $('.selectReplacement').css('display', 'none');
    $('.backbtn').css('display', 'block');
    $('.octicon-gear').css('display', 'none');
    for (var i = 0; i < wishlist.length; i++) {
      if (wishlist[i].name.indexOf(str) == 0) {
        console.log('found!');
        viewResult(wishlist[i]);
        break;
      }
    }
  });

  $('.watchlist').on('click', '.octicon-x', function() {
    bgpage.removeitem($(this).attr('id'));
    var par = $(this).parent();
    par.hide('fast', function() {
      par.remove();
      wishlist = $.cookie('wishlist');
    });
    return false;
  });

  $('.selectoption').on('click', '.suboption', function() {
    $.cookie('option', $(this).attr('id'));
    if ($.cookie('option') == 'newonly')
      $('.currentopt').text('  NEW');
    else
      $('.currentopt').text('  LOWEST');
  });

  $('.header').on('click', '.octicon-gear', function() {
    console.log("YEA");
    event.stopPropagation();
    $('.selectoption').css('display', 'block');
    $('.octicon-gear').addClass('active');
  });

  $('.owlOfMinerva').on('click', '.octicon-x', function() {
    var itemid = $(this).attr("id");
    return bgpage.removeitem(itemid), $(".watchlist .octicon-x").each(function(index) {
      if ($(this).attr("id") == itemid) {
        $(this).parent().remove();
        wishlist = $.cookie("wishlist");
      }
    }), $(".page1").css("left", "0px"), $(".owlOfMinerva").css("left", "331px"), $(".backbtn").css("display", "none"), $(".selectReplacement").css("display", "block"), $('.octicon-gear').css('display', 'block');
    !1;
  });

  setForm(function() {
    $('.tempform').remove();
  });

  $("body").click(function() {
    $('.selectoption').css('display', 'none');
    $('.octicon-gear').removeClass('active');
    console.log("CLICK");
    $(".selectOpen").removeClass("selectOpen");
    document.getElementsByClassName("selected")[0].onclick = function() {
      console.log("clickagain");
      event.stopPropagation();
      this.parentNode.className += " selectOpen", this.onclick = function() {
        event.stopPropagation();
        selectMe(this);
      };
    }
  });

}

function selectReplacement(obj) {

  obj.className += ' replaced';
  var ul = document.createElement('ul');
  ul.className = 'selectReplacement';
  ul.className += ' server';
  var opts = obj.options;
  var selectedOpt = $.cookie('server');

  for (var i = 0; i < opts.length; i++) {
    var li = document.createElement('li');
    var txt = document.createTextNode(opts[i].text);
    var img = document.createElement('img');
    img.className = 'server-icon';
    img.src = "http://maple.fm/img/worlds/" + opts[i].id + ".png";

    li.appendChild(img);
    li.appendChild(txt);
    li.selIndex = opts[i].index;
    li.selectID = obj.id;
    li.onclick = function(event) {
      event.stopPropagation();
      selectMe(this);
    }
    if (i == selectedOpt) {
      li.className = 'selected';
      li.onclick = function() {
        event.stopPropagation(event);
        this.parentNode.className += ' selectOpen';
        this.onclick = function(event) {
          event.stopPropagation();
          selectMe(this);
        }
      }
    }
    if (window.attachEvent) {
      li.onmouseover = function() {
        this.className += ' hover';
      }
      li.onmouseout = function() {
        this.className = this.className.replace(new RegExp(" hover\\b"), '');
      }
    }
    ul.appendChild(li);
  }
  obj.parentNode.appendChild(ul);

  addAutoComplete();
}

function addAutoComplete() {
  var items = db.map(function(x) {
    return x.b
  });
  $("#additembox").autocomplete({
    source: function(request, response) {
      var results = $.ui.autocomplete.filter(items, request.term);
      response(results.slice(0, 10));
    },
    messages: {
      noResults: '',
      results: function() {}
    },
    select: function() {
      setTimeout(function() {
        $('.add-item').submit();
      }, 200);
    }

  });
}

function selectMe(obj) {
  var lis = obj.parentNode.getElementsByTagName('li');
  for (var i = 0; i < lis.length; i++) {
    if (lis[i] != obj) {
      lis[i].className = '';
      lis[i].onclick = function(event) {
        event.stopPropagation();
        selectMe(this);
      }
    } else {
      setVal(obj.selectID, obj.selIndex, obj.textContent);
      obj.className = 'selected';
      obj.parentNode.className = obj.parentNode.className.replace(new RegExp(" selectOpen\\b"), '');
      obj.onclick = function(event) {
        event.stopPropagation();
        obj.parentNode.className += ' selectOpen';
        this.onclick = function(event) {
          event.stopPropagation();
          selectMe(this);
        }
      }
    }
  }
}

function setVal(objID, selIndex, name) {
  var obj = document.getElementById(objID);
  obj.selectedIndex = selIndex;
  $.cookie('server', selIndex);
  swal({
    title: "Kaboom!",
    text: "You are now watching " + name,
    type: "success",
    confirmButtonText: "OK",

  }, function() {
    bgpage.show();
  });
}

function setForm(callback) {
  var s = document.getElementsByTagName('select');
  for (var i = 0; i < s.length; i++) {
    selectReplacement(s[i]);
  }
  callback();
}

function closeSel(obj) {}

function shorten(str) {
  if (str.length > 24) {
    return str.substr(0, 24) + "...";
  }
  return str;
}

function viewResult(item) {
  var imgsite = item.icon == null ? "maple.png" : "http://maple.fm/static/image/icon/" + item.icon + ".png";
  $(".owlOfMinerva").css("left", "0px").empty().append('<div class="shopitem"><img class="item-icon" src=\'' + imgsite + '\'/><div class="helper"></div><div class="name">' + shorten(item.name) + '</div><div class="price">' + item.price.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' meso or less</div><span class="octicon octicon-x" id="' + item.name + '"></span></div>');

  function escape(html) {
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  result = $.cookie("result").sort(function(a, b) {
    return parseInt(a.price) - parseInt(b.price);
  });

  for (var i = 0; i < result.length; i++) {
    if (result[i].name == item.name) {
      if (result[i].shopname.length > 25)
        result[i].shopname = result[i].shopname.substr(0, 25) + "...";
      $('.owlOfMinerva').append("<div class=\"item\"><div class=\"shopname\">" + escape(result[i].shopname) + "</div><div class=\"sellprice\">" +
        escape(result[i].price) + " meso - " + escape(result[i].quantity) + " piece(s) </div><div class=\"fmroom\">FM" +
        escape(result[i].fmroom) + "</div></div>");
    }
  }
}