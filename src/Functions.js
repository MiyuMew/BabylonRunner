function shakeScreen () 
{
	var interval = 10;
	var duration= 500;
	var shake= 15;
	var vibrateIndex = 0;
	var selector = $('canvas');
	var vibrate = function(){
        $(selector).stop(true,false).css({
            position: 'relative', 
            left: Math.round(Math.random() * shake) - ((shake + 1) / 2) +'px', 
            top: Math.round(Math.random() * shake) - ((shake + 1) / 2) +'px'
        });
    }
    var stopVibration = function() {
        clearInterval(vibrateIndex);
        $(selector).stop(true,false).css({position: 'static', left: '0px', top: '0px'});
    };  
  	vibrateIndex = setInterval(vibrate, interval);
  	setTimeout(stopVibration, duration);
}