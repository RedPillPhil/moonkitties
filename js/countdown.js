function startCountdown(){
    var launchTime = 1502370000000;
    var $countdownCover = $("#countdown-cover");
    var $countdownTimer = $("#countdown-timer");
    function countdown(){
	var remainingTime = launchTime - Date.now();
	if(remainingTime > 0){
	    $countdownCover.css("display", "block");
	    var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
	    var hours = Math.floor(remainingTime / (1000 * 60 * 60)) - days * 24;
	    var minutes = Math.floor(remainingTime / (1000 * 60)) - days * 60 * 24 - hours * 60;
	    var seconds = Math.floor(remainingTime / (1000)) - days * 60 * 60 * 24 - hours * 60 * 60- minutes * 60;
	    $countdownTimer.html('<span id="countdown-days"><em>' + days + '</em> days </span>' +
				 '<span id="countdown-hours"><em>' + hours + '</em> hours </span>' +
				 '<span id="countdown-minutes"><em>' + minutes + '</em> minutes </span>' +
				 '<span id="countdown-seconds"><em>' + seconds + '</em> seconds </span>');
	    requestAnimationFrame(countdown);
	}else{
	    window.location.reload();
	}
    }
    var remainingTime = launchTime - Date.now();
    if(remainingTime > 0){
	countdown();
    }

}
$(document).ready(function(){
    startCountdown();
})
