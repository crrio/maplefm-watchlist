var bgpage = chrome.extension.getBackgroundPage();

var wishlist = bgpage.wishlist;
var db = bgpage.db;

var newItemName;
window.onload = reload;

function addUI(iconIndex, idIndex){
    for(var i=0; i<wishlist.length; i++){
      $('.watchlist').append( "<div class=\"item\"><img class=\"item-icon\" src='http://maple.fm/static/image/icon/" + iconIndex[idIndex[wishlist[i].name]] +".png'/><div class=\"name\">"+wishlist[i].name+"</div><div class=\"price\">"+wishlist[i].price+" meso or less</div><div class=\"closebtn\"></div><span class=\"octicon octicon-x\" id=\""+ wishlist[i].name + "\"></span></div>" );
    }
}

function reload(){
  
    $.cookie.json = true;
  
    console.log("success");
    $('.watchlist').empty();
  
    wishlist = $.cookie('wishlist');
    console.log(wishlist);
    if( wishlist == undefined )
        wishlist = [];
  
    //for(var i=0; i<wishlist.length; i++){
    
    var iconIndex = {};
    var idIndex = {};
  
   var count = 0;
  
   $.each(wishlist, function(index,result){
      
      var id;
      
      for( var j=0; j < db.length; j++){
           if( result.name == db[j].b ){
              id = db[j].a;
              idIndex[db[j].b] = id;
              break; 
           }
      }
      
      $.getJSON("http://maple.fm/api/items?id="+id, function(data){
          count = count+1;
          iconIndex[id] = data.item.icon;
          if( count==wishlist.length )
             addUI(iconIndex, idIndex);
      });
   
    });
  
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
      
          $.getJSON("http://maple.fm/api/items?id="+id, function(data){
              id = data.item.icon;
              $('.preview').css('left', 0);
              $('.page1').css('left', -332+'px');
              $('.pvicon').attr('src', 'http://maple.fm/static/image/icon/' + id +'.png');
              $('.pvname').text(newItemName);
          });
          return false;
      }
    );
  
    $('.add-price').submit( function(event){
          event.preventDefault();
          
          if($('.addprice').val().length == 0){
              return false; 
          }
      
          bgpage.additem(newItemName, $('.addprice').val());
          
          $('.watchlist').append( "<div class=\"item\"><img class=\"item-icon\" src='http://maple.fm/static/image/icon/" + id +".png'/><div class=\"name\">"+newItemName+"</div><div class=\"price\">"+$('.addprice').val()+" meso or less</div><div class=\"closebtn\"></div><span class=\"octicon octicon-x\" id=\""+ newItemName+ "\"></span></div>" );
      
          swal({
               title: "Done!",
               text: "The item has been added",
               type: "success",
               confirmButtonText: "OK",
            
          }, function(){
            $('.preview').css('left', 331+'px');
            $('.page1').css('left', 0+'px');
            $('.addbox').val("");
            $('.addprice').val("");
          });
          return false;
      }
    );
    $(document).on('click','.octicon-x', function(){
          bgpage.removeitem( $(this).attr('id') );
          $(this).parent().remove();
    });
}

