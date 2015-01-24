var bgpage = chrome.extension.getBackgroundPage();

var wishlist = bgpage.wishlist;
var db = bgpage.db;

window.onload = function(){
    $('.watchlist').empty();
    
    for(var i=0; i<wishlist.length; i++){
      
      var id;
      
      if( wishlist[i].name.search("Nebulite") >= 0 && wishlist[i].name.charAt(0)=='['){
          id = "nebulite-" + wishlist[i].name.charAt(1);
      }
      
      else{
        for( var j=0; j < db.length; j++){
           if( wishlist[i].name == db[j].b ){
              id = db[j].a;
              break; 
           }
        }
      }
      $('.watchlist').append( "<div class=\"item\"><img class=\"icon\" src='http://maple.fm/static/image/icon/" + id +".png'/><div class=\"name\">"+wishlist[i].name+"</div><div class=\"price\">"+wishlist[i].price+" meso or less</div><div class=\"closebtn\"></div></div>" );
    }
}
