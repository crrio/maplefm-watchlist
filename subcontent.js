$(document).ready(function(){

  var db;
  var f = function(){
      
        var target = document.getElementById("vB_Editor_QR");
        if(target != undefined){
          parent = target.parentElement;
          next = target.nextSibling;
          button = document.createElement("div");
          
        
          
          button.innerHTML = '<img id="image" class="toggler" src="' + chrome.extension.getURL('maplefm-icon.png') + '" style="width: 25px; top: -50px; right: 10px;" />';
          button.className = "inject-btn";
          
          
          parent.insertBefore(button, target);
          /*if (next) parent.insertBefore(button, next);
          else parent.appendChild(button);*/
          
          // insert form 
          searchform = document.createElement("form");
          searchform.className = "formwrap";
          searchform.innerHTML = '<input type="text" id="inject-form">';
          button.appendChild(searchform);
          //parent.insertBefore(searchform,button);
          
          $('.toggler').click(function(){
             if( ! $('.inject-btn').hasClass("showForm") ){
                $('.inject-btn').addClass("showForm");
                $('#inject-form').focus();
             }
             else{
                $('.inject-btn').removeClass("showForm");
             }
          });
          
          
          $.getJSON("http://maple.fm/api/list/items", function(data) {
            
            db = data;
            
            var items = data.map(function(x) {
              return x.b
            });

            $("#inject-form").autocomplete({
              source: function(request, response) {
                var results = $.ui.autocomplete.filter(items, request.term);
                response(results.slice(0, 7));
              },
              messages: {
                noResults: '',
                results: function() {}
              },
              select: function() {
                setTimeout(function() {
                    $("#inject-form").autocomplete("close");

                    id = -1;
                    newItemName = $('#inject-form').val();
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
                      $('#inject-form').val("Not found!");
                      return false;
                    }
                    var iconid;
                    $.getJSON("http://maple.fm/api/items?id=" + id, function(data) {
                      iconid = data.item.icon;
                      msg = "[url=http://maple.fm/db/items/" + id + 
                          "[img]http://maple.fm/static/icon/"+ iconid + 
                          ".png[/img]" + newItemName + "[/url]";
                      var original = $('#cke_contents_vB_Editor_QR_editor textarea').val();
                      $('#cke_contents_vB_Editor_QR_editor textarea').val( original + msg);
                      $('.inject-btn').removeClass('showForm');
                      
                      
                    });
                }, 200);
              }

            });
          });
          
          
          
          $('#inject-form').on("keypress", function(event) {
            
            if(event.which == 13){
              $("#inject-form").autocomplete("close");

              id = -1;
              newItemName = $('#inject-form').val();
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
                $('#inject-form').val("Not found!");
                return false;
              }
              var iconid;
              $.getJSON("http://maple.fm/api/items?id=" + id, function(data) {
                iconid = data.item.icon;
                $('.inject-btn').removeClass('showForm');
                var msg = "[url=http://maple.fm/db/items/" + id + 
                    "[img]http://maple.fm/static/icon/"+ iconid + 
                    ".png[/img]" + newItemName + "[/url]";
                var original = $('#cke_contents_vB_Editor_QR_editor textarea').val();
                $('#cke_contents_vB_Editor_QR_editor textarea').val( original + msg);
              });

              return false;
            }
          });
          
          return ;
        }
    

        console.log("NOPE5");

        setTimeout(function() {
          f();
        }, 1000);
  }

  f();

});


