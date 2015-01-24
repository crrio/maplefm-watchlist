var bgpage = chrome.extension.getBackgroundPage();

var wishlist = bgpage.wishlist;
var db = bgpage.db;

var newItemName;
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
      $('.watchlist').append( "<div class=\"item\"><img class=\"item-icon\" src='http://maple.fm/static/image/icon/" + id +".png'/><div class=\"name\">"+wishlist[i].name+"</div><div class=\"price\">"+wishlist[i].price+" meso or less</div><div class=\"closebtn\"></div><span class=\"octicon octicon-x\"></span></div>" );
    }
  
    $('.add-item').submit( function(event){
          event.preventDefault();
          console.log("yea");
          id = -1;
          newItemName = $('.addbox').val();
          if(newItemName.length == 0){
              return false; 
          }
          for( var j=0; j < db.length; j++){
             var str1 = newItemName;
             var str2 = db[j].b;
             if( str1.toLowerCase() == str2.toLowerCase() ){
                id = db[j].a;
                newItemName = str2;
                break; 
             }
          }
          if(id==-1){
             swal({
               title: "Error!",
               text: "Item not found!",
               type: "error",
               confirmButtonText: "OK",
               confirmButtonColor: "#ffb484"
             });
             
             return false;
          }
      
          $('.preview').css('left', 0);
          $('.page1').css('left', -302+'px');
          $('.pvicon').attr('src', 'http://maple.fm/static/image/icon/' + id +'.png');
          $('.pvname').text(newItemName);
          return false;
      }
    );
  
    $('.add-price').submit( function(event){
          event.preventDefault();
          
          if($('.addprice').val().length == 0){
              return false; 
          }
      
          bgpage.additem(newItemName, $('.addprice').val());
          
          $('.watchlist').append( "<div class=\"item\"><img class=\"item-icon\" src='http://maple.fm/static/image/icon/" + id +".png'/><div class=\"name\">"+wishlist[i].name+"</div><div class=\"price\">"+wishlist[i].price+" meso or less</div><div class=\"closebtn\"></div></div>" );
      
          swal({
               title: "Done!",
               text: "The item has been added",
               type: "success",
               confirmButtonText: "OK",
            
          }, function(){
            $('.preview').css('left', 301+'px');
            $('.page1').css('left', 0+'px');
            $('.addbox').val("");
            $('.addprice').val("");
          });
          return false;
      }
    );
}

