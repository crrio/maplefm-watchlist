$(document).ready(function(){

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

                }, 200);
              }

            });
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
