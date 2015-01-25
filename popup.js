var bgpage = chrome.extension.getBackgroundPage();

var wishlist = bgpage.wishlist;
var db = bgpage.db;

var newItemName;

var fmservers = ["Scania","Windia","Bera","Broa","Khaini","Ymck","Gazed","Bellonova","Renegades"];

window.onload = reload;

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
  
   for(var i=0; i<wishlist.length; i++){
      $('.watchlist').append( "<div class=\"item\"><img class=\"item-icon\" src='http://maple.fm/static/image/icon/" + wishlist[i].icon +".png'/><div class=\"name\">"+wishlist[i].name+"</div><div class=\"price\">"+wishlist[i].price+" meso or less</div><div class=\"closebtn\"></div><span class=\"octicon octicon-x\" id=\""+ wishlist[i].name + "\"></span></div>" );
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
      
          bgpage.additem(newItemName, $('.addprice').val(), id);
          
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
          var par = $(this).parent();
          par.hide('slow', function(){
            par.remove(); 
          });
    });
  
    setForm( function(){
        $('.tempform').remove(); 
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
        img.src = "http://maple.fm/img/worlds/"+opts[i].id+".png";
        
        li.appendChild(img);
        li.appendChild(txt);
        li.selIndex = opts[i].index;
        li.selectID = obj.id;
        li.onclick = function() {
            selectMe(this);
        }
        if (i == selectedOpt) {
            li.className = 'selected';
            li.onclick = function() {
                this.parentNode.className += ' selectOpen';
                this.onclick = function() {
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
}

function selectMe(obj) {
    var lis = obj.parentNode.getElementsByTagName('li');
    for (var i = 0; i < lis.length; i++) {
        if (lis[i] != obj) {
            lis[i].className = '';
            lis[i].onclick = function() {
                selectMe(this);
            }
        } else {
            setVal(obj.selectID, obj.selIndex, obj.textContent);
            obj.className = 'selected';
            obj.parentNode.className = obj.parentNode.className.replace(new RegExp(" selectOpen\\b"), '');
            obj.onclick = function() {
                obj.parentNode.className += ' selectOpen';
                this.onclick = function() {
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
               text: "You are now watching "+name,
               type: "success",
               confirmButtonText: "OK",
            
    }, function(){
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

