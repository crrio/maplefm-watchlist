var bgpage = chrome.extension.getBackgroundPage();

var wishlist = bgpage.wishlist;

window.onload = function(){

  $('.watchlist').empty();
    console.log(wishlist[0].name);

    for(var i=0; i<wishlist.length; i++){
      $('.watchlist').append( "<div class=\"item\"><div class=\"icon\"></div><div class=\"name\">"+wishlist[i].name+"</div><div class=\"price\">"+wishlist[i].price+" meso or less</div><div class=\"closebtn\"></div></div>" );
    }
}