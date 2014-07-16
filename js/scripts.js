$(function() {
	template('templates/navbar.html', {brand: "John Blossom"}, function(template) {
         $("#template-navbar").html(template);
    });

	template('templates/header.html', {name: "John Blossom",occupation:"Web Developer"}, function(template) {
         $("#template-header").html(template);
    });

    $.get( jbzzle_api_url+"resume/portfolio", function(data) {
		template('templates/carousel.html', {items:data}, function(template) {
			$("#template-carousel").html(template);
		});
	}, "json");

	$.get( jbzzle_api_url+"resume/testimonials", function(data) {
		template('templates/quotes.html', data, function(template) {
	         $("#template-quotes").html(template).cycle({
			        	slides: 	'> div',
			        	fx: 		'fade',
			        	speed: 		'8000', 
			 });
	    });
	}, "json");

});

$( window ).load(function() {
  $("#template-carousel").fadeIn("500",function(){
  		$("#template-quotes").show("250");
  });
});