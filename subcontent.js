var added = false;

var $insertTarget = new Array();

$(document).ready(function(){

  var db;
  $.getJSON("http://maple.fm/api/list/items", function(data) {
    
      db = data;
    
      var f = function(){

         var targetarray = document.getElementsByClassName("texteditor");

         var changed = 0;

         for( var i = 0; i < targetarray.length; i++){
              var target= targetarray[i];
              var parent = target.parentElement;

              var loaded = false;
              for(var j=0;j < parent.childNodes.length; j++){
                if( parent.childNodes[j].className == 'inject-btn' || parent.childNodes[j].className == 'inject-btn showForm' ){
                    loaded = true;
                }
              }
              if(loaded) 
                continue;


              next = target.nextSibling;
              button = document.createElement("div");

              button.innerHTML = '<img class="toggler" src="' + chrome.extension.getURL('maplefm-icon.png') + '" style="width: 25px; top: -50px; right: 10px;" />';
              button.className = "inject-btn";


              parent.insertBefore(button, target);

              // insert form 
              searchform = document.createElement("form");
              searchform.className = "formwrap";
              searchform.innerHTML = '<input type="text" class="inject-form">';
              button.appendChild(searchform);

                var items = data.map(function(x) {
                  return x.b
                });


                $(".inject-form").autocomplete({
                  source: function(request, response) {
                    var results = $.ui.autocomplete.filter(items, request.term);
                    response(results.slice(0, 7));
                  },
                  messages: {
                    noResults: '',
                    results: function() {}
                  },
                  select: function(event, ui) {
                    setTimeout(function() {
                        $(".inject-form").autocomplete("close");

                        id = -1;
                        var newItemName = ui.item.label;
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
                          targetForm.val("Not found!");
                          return false;
                        }
                        var iconid;
                        $.getJSON("http://maple.fm/api/items?id=" + id, function(data) {
                          iconid = data.item.icon;
                          msg = "[url=http://maple.fm/db/items/" + id + 
                              "][img]http://maple.fm/static/image/icon/"+ iconid + 
                              ".png[/img]" + newItemName + "[/url]";

                          var item = $insertTarget.pop();
                          var targetArea = item.find('.cke_contents textarea'); 
                          var original = targetArea.val();
                          targetArea.val( original + msg);
                          $('.inject-btn').removeClass('showForm');


                        });
                    }, 200);
                  }

                });

                $(".inject-btn").unbind();
                $('.inject-btn').on('click', '.toggler', function(){
                     if( ! $(this).parent().hasClass("showForm") ){
                        $(this).parent().addClass("showForm");
                        $insertTarget.push($(this).parent().parent());
                        $(this).parent().find('.inject-form').focus();
                     }
                     else{
                        console.log($(this).parent().hasClass("showForm"));
                        $(this).parent().removeClass("showForm");
                     }
                  });

            
              $('.inject-form').on("keypress", function(event) {

                if(event.which == 13){
                  $("#inject-form").autocomplete("close");

                  id = -1;
                  var item = $insertTarget[0];
                  var targetForm = item.find('.inject-form');
                  var newItemName = targetForm.val();
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
                    targetForm.val("Not found!");
                    return false;
                  }
                  var iconid;
                  $.getJSON("http://maple.fm/api/items?id=" + id, function(data) {
                    iconid = data.item.icon;
                    msg = "[url=http://maple.fm/db/items/" + id + 
                        "][img]http://maple.fm/static/image/icon/"+ iconid + 
                        ".png[/img]" + newItemName + "[/url]";

                    item = $insertTarget.pop();
                    var targetArea = item.find('.cke_contents textarea'); 
                    var original = targetArea.val();
                    targetArea.val( original + msg);
                    $('.inject-btn').removeClass('showForm');

                  });

                  return false;
                }
              });

         }

            setTimeout(function() {
              f();
            }, 1000);
      }

      f();
  });

});


