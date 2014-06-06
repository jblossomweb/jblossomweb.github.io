$(function() {


	template('templates/header.html', {name: "John Blossom",occupation:"Web Developer"}, function(template) {
         $("#template-header").html(template);
    });


	//todo: get these from webservice
	var quotes = [
		{
			quote: "John is the best basketball player I have ever seen.",
			source: "Michael Jordan"  
		},
		{
			quote: "John beats me at ping pong every time!",
			source: "Orcun Tagtekin"  
		},
		{
			quote: "What a hunk.",
			source: "Priscilla Blossom"  
		},
	];
	template('templates/quotes.html', quotes, function(template) {
         $("#template-quotes").html(template).promise().done(function(){
		        $(this).cycle({
		        	slides: '> div',
		        	fx:      'fadein'
		        });
		 });
    });

	

});