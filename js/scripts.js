$(function() {

	template('templates/navbar.html', {brand: "John Blossom"}, function(template) {
         $("#template-navbar").html(template);
    });

	template('templates/header.html', {name: "John Blossom",occupation:"Web Developer"}, function(template) {
         $("#template-header").html(template);
    });

    template('templates/carousel.html', {name: "John Blossom"}, function(template) {
         $("#template-carousel").html(template).hide();
    });

	$.get( jbzzle_api_url+"resume/testimonials", function( data ) {
		template('templates/quotes.html', data, function(template) {
	         $("#template-quotes").html(template).promise().done(function(){
			        $(this).cycle({
			        	slides: 	'> div',
			        	fx: 		'fade',
			        	speed: 		'5000', 
			        }).hide();
			 });
	    });
	}, "json" );

});

$( window ).load(function() {
  // Run code
  $("#template-carousel").fadeIn("500",function(){
  		$("#template-quotes").show("250");
  });
});