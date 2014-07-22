var jbApp = function() {
  // constructor
  this.apiURL = jbzzle_api_url; //global set in api.js
  this.loaded = [];
  this.defineEvents();
};
jbApp.prototype.domReady = function(){
	//init 
	this.getTemplate('templates/navbar.html', {brand: "John Blossom"}, function(template) {
         $("#template-navbar").html(template);
    });

	this.getTemplate('templates/header.html', {name: "John Blossom",occupation:"Web Developer"}, function(template) {
         $("#template-header").html(template);
    });

	this.loadPage('home');
};
jbApp.prototype.windowLoad = function(){
	$("#template-carousel").fadeIn("500",function(){
  		$("#template-quotes").show("250");
  });
};
jbApp.prototype.defineEvents = function(){
	//events
	var app = this;
	$(document).on('click', 'a.ajax-link', function(e){
		e.preventDefault();
		var href = $(this).attr("href");
		var li = $(this).parent("li");
		if(li.length > 0){
			$("ul.navbar-nav li").removeClass("active");
			li.addClass("active");
		}
		app.Navigate(href);
	});
};
jbApp.prototype.Navigate = function(page,callback){
	this.loadPage(page);
	$(".page").hide();
	if(typeof callback !== "undefined"){
		$("#page-"+page).fadeIn("500",callback);
	} else {
		$("#page-"+page).fadeIn("500");
	}
};
jbApp.prototype.loadPage = function(page){
	var app = this;
	if($.inArray(page,app.loaded) === -1){
		switch(page){
			//http://ci-jbzzle.rhcloud.com/resume/skills
			case 'skills':
				$.get(app.apiURL+"resume/skills", function(data) {
					app.getTemplate('templates/skills.html', {sets:data}, function(template) {
						$("#template-skills").html(template);
						//var element = $("#template-skills").find(".dots");
						//app.initDots(element,4,150);
					});
				}, "json");


				
			break;
			case 'experience':
				app.getTemplate('templates/experience.html', {}, function(template) {
					$("#template-experience").html(template);
				});
			break;
			case 'contact':
				app.getTemplate('templates/contact.html', {}, function(template) {
					$("#template-contact").html(template);
				});
			break;
			case 'home':
			default:
				 $.get(app.apiURL+"resume/portfolio", function(data) {
					app.getTemplate('templates/carousel.html', {items:data}, function(template) {
						$("#template-carousel").html(template);
					});
				}, "json");

				$.get(app.apiURL+"resume/testimonials", function(data) {
					app.getTemplate('templates/quotes.html', data, function(template) {
				         $("#template-quotes").html(template).cycle({
						        	slides: 	'> div',
						        	fx: 		'fade',
						        	speed: 		'10000', 
						 });
				    });
				}, "json");
		}
		app.loaded.push(page);
	}
};
jbApp.prototype.getTemplate = function(url, context, callback) {
    $.ajax({
        url: url,
            success: function(source) {
                var tmpl = Handlebars.compile(source);
                var html    = tmpl(context);  
                if (callback) callback(html);
        }
    });
};
jbApp.prototype.initDots = function(el,n,interval){
	var dots=0;
	setInterval(function(){
		if(dots < n){
			el.append('.');
        	dots++;
		} else {
			el.html('');
        	dots = 0;
		}
	}, interval);
};