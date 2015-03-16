var added = false;

var $insertTarget = new Array();

function modal_string(item_name){
   var s = '<div class="ui small modal"><i class="close icon"></i><div class="header">Watch an item: ' + item_name + ' </div><div class="content"> <div class="ui form"><div class="field"><label>Notify me when this item is cheaper than</label> <input> </div> </div></div><div class="actions"><div class="ui button">Cancel</div><div class="ui green ok button">Watch!</div></div></div>';
   return s;
}

$(document).ready(function() {

  var db;
  $.getJSON("http://maple.fm/api/list/items", function(data) {

    var pricemodal = document.createElement("div");
    pricemodal.innerHTML = modal_string('nothing');
    document.body.appendChild(pricemodal);
        
    db = data;

    var f = function() {

      var targetarray = document.getElementsByClassName("item-popover");

      var changed = 0;
      
      console.log(targetarray.length);

      for (var i = 0; i < targetarray.length; i++) {
        var target = targetarray[i];
        var parent = target.parentElement;

        var loaded = false;
        for (var j = 0; j < parent.childNodes.length; j++) {
          if (parent.childNodes[j].className == 'inject-btn'){
            loaded = true;
          }
        }
        if (loaded)
          continue;
        
        next = target.nextSibling;
        button = document.createElement("div");

        button.innerHTML = 'Watch';
        button.className = "inject-btn";

        if (target) parent.insertBefore(button, target);
        else parent.appendChild(button);

        var items = data.map(function(x) {
          return x.b
        });


        $('.inject-btn').unbind().on('click', function(e) {
            var item = $(this).parent().find('a').text();
            $('.header').text('Watch an item: ' + item);
            $('.small.modal').modal({
              closable: true,
              onApprove : function(){
                chrome.extension.sendRequest({message: item+"|"+$('.field').find('input').val()});
              }  
            }).modal('show');
        });

      }
      $('#search_results_table_wrapper').one('DOMNodeInserted', function() {
        $('#search_results_table_wrapper').unbind();
        f();
      });
    }

    f();
    
  });

});