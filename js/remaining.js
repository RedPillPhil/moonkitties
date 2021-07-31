function showRemainingCats(){
    var $remainingCount = $("#remaining-cats-count");
    function loadRemainingCats(){
	$.getJSON("https://mooncats.live/remaining").then(function(result){
	//$.getJSON("https://mooncats.info/remaining").then(function(result){
	    $remainingCount.html(result);
	    if(result != "0"){
		setTimeout(loadRemainingCats, 30 * 1000);
	    }else{
		//$("#remaining-cats").css("display", "none");
		//$("#remaining-cats").innerHTML("Cats Rescued!")
	    }
	}).catch(function(err){
	    setTimeout(loadRemainingCats, 30 * 1000);
	})
	    }
    loadRemainingCats();
}
$(document).ready(showRemainingCats);
