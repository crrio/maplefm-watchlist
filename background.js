var wishlist = [
                {"name":"Lightning God Ring","price":"9999999998"},
                {"name":"Ice Cold Red", "price": "2999999999"},
                {"name":"Cubic Chaos Blade", "price": "24999999"},
                {"name":"[A] Nebulite (DEX %)", "price": "2999999999"},
                {"name":"[A] Nebulite (STR %)", "price": "2999999999"},
               ];

var notId = 0;

function show() {

    $.getJSON("http://maple.fm/api/2/search?server=8&stats=0&desc=0", function(data) {
        console.log(data); // use data as a generic object
        var json = data.fm_items;
        notId = 0;
        for(var i = 0; i < json.length; i++) {
            var obj = json[i];
            //console.log(obj.name + ' ' + obj.price + ' ' + obj.room);
            for(var j=0;j < wishlist.length;j++){
                if(wishlist[j].name == obj.name && parseInt(wishlist[j].price) >= parseInt(obj.price) && parseInt(obj.quantity)>=1 ||
                   obj.character_name == 'PhasicLiquid' && parseInt(obj.quantity) >=1
                  ){
                    //notId = obj.character_name + '_' + obj.id + '_' + obj.price; //+ data.seconds_ago;
                    var shopname = obj.shop_name;
                    if(shopname.length > 25) shopname  = shopname.substring(0,25) + "...";
                    var notOption = {
                        type : "basic",
                        title: obj.name + " at FM " + obj.room,
                        message: obj.quantity + " pieces at " +obj.price + "\nShop: " + shopname,
                        //buttons: { title: 'stop notifying this item'},
                        //iconUrl: "maple.png",
                        iconUrl: 'http://maple.fm/static/image/icon/'+ obj.icon+ '.png',
                    }

                    chrome.notifications.create(notId.toString(), notOption, creationCallback);
                    notId++;
                }
            }
        }
    });

}

function creationCallback(notID) {
	console.log("Succesfully created " + notID + " notification" );
}




var script = document.createElement('script');
script.src = 'jquery-2.1.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}

if (JSON.parse(localStorage.isActivated)) { show(); }

var interval = 0; // The display interval, in minutes.

setInterval(function() {
  interval++;
  //chrome.idle.queryState(15, function (state) {
    if (
        JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval 
  //      state == "active"
    ) {
        chrome.notifications.getAll( function(notifications){
          
        });
        for( var i=0; i< notId; i++ ){
          chrome.notifications.clear(i.toString(), deletionCallback); 
        }
        show();
        interval = 0;
    }
  //});
}, 60000);

function deletionCallback(notID) {
	console.log("Succesfully deleted " + notID + " notification" );
}
