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
			case 'skills':
				var skills_tab = [];
				$.get(app.apiURL+"resume/skills", function(data) {
					app.getTemplate('templates/skillsets.html', {sets:data}, function(template) {
						var container = $("#template-skills");
						container.html(template);
						var anchor = container.find("a[href='#skills-accordion-learning']");
						anchor.html(anchor.html().replace("Learning...","Learning<span class='dots'></span>"));
						var dots = anchor.find(".dots");
						app.initDots(dots,4,150);

						// $("#skills-accordion .panel-title, .panel-title a").click(function(e){
						// 	e.preventDefault();
						// });

						$("#skills-accordion .panel-heading").on('click', function(e){
							var heading = $(this);
							var a = heading.children(".panel-title").children("a");
							var spinner = heading.children(".panel-title").children("span.badge");
							var p = a.attr("href");
							var panel =$(p);
							var openPanels = $("#skills-accordion .panel-collapse.collapse.in");
							var panelHeadings = $("#skills-accordion .panel-heading");
							var pbody = panel.children(".panel-body");
							var ssid = pbody.attr('id').substr(9);
							
							openPanels.collapse('hide');

							if($.inArray(p,skills_tab) === -1){
								spinner.css("visibility","visible");
								$.get(app.apiURL+"resume/skills/"+ssid, function(sdata) {
									skills_tab.push(p);
									app.getTemplate('templates/skills.html', {skills:sdata}, function(t) {
										pbody.html(t);
										var imgs = pbody.find("img");
										imgs.load(function() {
											spinner.css("visibility","hidden");
											panel.collapse('show');
										});
									});
								},"json");
							} else {
									panel.collapse('show');
							}
						});

					});
				}, "json");


				
			break;
			case 'experience':
				// app.getTemplate('templates/experience.html', {}, function(template) {
				// 	$("#template-experience").html(template);
				// });
				var experience_tab = [];
				$.get(app.apiURL+"resume/experience", function(data) {
					app.getTemplate('templates/experience.html', {experience:data}, function(template) {
						$("#template-experience").html(template);

						$("#experience-accordion .panel-heading").on('click', function(e){
							var heading = $(this);
							var a = heading.children(".panel-title").children("a");
							var spinner = heading.children(".panel-title").children("span.badge");
							var p = a.attr("href");
							var panel =$(p);
							var openPanels = $("#experience-accordion .panel-collapse.collapse.in");
							var panelHeadings = $("#experience-accordion .panel-heading");
							var pbody = panel.children(".panel-body");
							var exid = pbody.attr('id').substr(11);
							
							openPanels.collapse('hide');

							if($.inArray(p,experience_tab) === -1){
								spinner.css("visibility","visible");
								$.get(app.apiURL+"resume/experience/"+exid, function(edata) {
									experience_tab.push(p);
									app.getTemplate('templates/experience_details.html', edata, function(t) {
										pbody.html(t);
										var imgs = pbody.find("img");
										imgs.load(function() {
											spinner.css("visibility","hidden");
											panel.collapse('show');
										});
									});
								},"json");
							} else {
									panel.collapse('show');
							}
						});
					});
				},"json");
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