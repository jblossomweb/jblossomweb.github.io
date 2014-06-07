$(function() {


	template('templates/header.html', {name: "John Blossom",occupation:"Web Developer"}, function(template) {
         $("#template-header").html(template);
    });

	$.get( jbzzle_api_url+"resume/testimonials", function( data ) {
		template('templates/quotes.html', data, function(template) {
	         $("#template-quotes").html(template).promise().done(function(){
			        $(this).cycle({
			        	slides: '> div',
			        	fx:      'fadein'
			        });
			 });
	    });
	}, "json" );

});