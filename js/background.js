$(document).ready(function(){
    var $bg1 = $("#background1");
    var $bg2 = $("#background2");
    $(window).on("scroll", function(){
	var bodyHeight = $("body").height();
	if(bodyHeight > window.innerHeight){
	    $bg1.css("height", bodyHeight * 2)
		.css("top", -(window.scrollY * .2));

	    $bg2.css("height", bodyHeight * 2)
		.css("top", -(window.scrollY * .1));
	}else{
	    $bg1.css("height", window.innerHeight)
	    $bg2.css("height", window.innerHeight)

	}
    })
})
