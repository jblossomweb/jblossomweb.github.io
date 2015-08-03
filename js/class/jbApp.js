var jbApp = function() {
  // constructor
  this.apiURL = jbzzle_api_url; //global set in api.js
  this.loaded = [];
  this.homeload = [];
  this.defineEvents();
};
jbApp.prototype.domReady = function(){
};
jbApp.prototype.windowLoad = function(){
	var app = this;
	app.getTemplate('templates/navbar.html', {brand: "John Blossom"}, function(template) {
        $("#template-navbar").html(template).animate({
			marginTop: 0
			}, 250, function() {
			// Animation complete.
			app.Navigate('home',function(){
				$("#template-carousel").fadeIn("500",function(){
				  	$("#template-quotes").show("250");
				});
			});
		});
        
    });
	app.getTemplate('templates/header.html', {name: "John Blossom",occupation:"Web Developer"}, function(template) {
         $("#template-header").html(template);
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
		var nload = $("#template-navbar").find(".navbar-load");
		nload.css("visibility","visible");
		switch(page){
			case 'skills':
				var skills_tab = [];
				$.get(app.apiURL+"resume/skills", function(data) {
					app.getTemplate('templates/skillsets.html', {sets:data}, function(template) {
						var container = $("#template-skills");
						container.html(template);
						var anchor = container.find("a[href='#skills-accordion-learning']");
						anchor.html(anchor.html().replace("...","<span class='dots'></span>"));
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

						nload.css("visibility","hidden");

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

						nload.css("visibility","hidden");
					});
				},"json");
			break;
			case 'contact':
				app.getTemplate('templates/contact.html', {}, function(template) {
					var pg = $("#template-contact");
					pg.html(template);
					pg.find('select[name="subject"]').select2({
						placeholder: "Select subject",
    					allowClear: true
					});
					
					pg.find("#frmContact").bootstrapValidator({
						message: 'Please enter a value.',
						fields: {
							name: {
								message: 'Please enter your name.',
								validators: {
									notEmpty: {
										message: 'Name is required.'
									},
									stringLength: {
										max: 64,
										message: 'Is your name really that long?'
									}
								}
							},
							email: {
								message: 'Please enter your email.',
								validators: {
									notEmpty: {
										message: 'Email is required.'
									},
									emailAddress: {
										message: 'Please enter a valid email.'
									}
								}
							},
							subject: {
								message: 'Please select a subject.',
								validators: {
									notEmpty: {
										message: 'Please select a subject.'
									}
								}
							},
							message: {
								message: 'Please enter your message.',
								validators: {
									notEmpty: {
										message: 'Message is required.'
									}
								}
							}
						},
						submitHandler: function(){
							var form = pg.find("#frmContact");
							var inputs = pg.find("#frmContact :input");
							var buttonIcon = pg.find("#frmContact button[type='submit'] i");

							inputs.prop("disabled", true);
							buttonIcon.removeClass("fa-paper-plane-o").addClass("fa-spin fa-spinner");

							$.support.cors = true;

							$.ajax({
								crossDomain : true,
        						cache: false,
								type: "POST",
								url: app.apiURL+"contact",
								data: {
									name: 	 form.find(":input[name='name']").val(), 
									email: 	 form.find(":input[name='email']").val(),
									subject: form.find(":input[name='subject']").val(),
									message: form.find(":input[name='message']").val()
								},
								success: function(data){
									//console.log(data);
									buttonIcon.removeClass("fa-spin fa-spinner").addClass("fa-paper-plane-o");

									if(data.sent){
										//the email was sent
										buttonIcon.parent('button').html("Sent!");
										form.animate({
										    marginTop: "-500px",
										    opacity: "0"
										  }, 1000, function() {
										    // Animation complete.
										    $(".alert-success").fadeIn("fast");
										  });

									} else {
										buttonIcon.removeClass("fa-spin fa-spinner").addClass("fa-paper-plane-o");
										inputs.prop("disabled", false);
										console.log('did not send email.');
										$("#contact-ajax-error").html('Email error.');
									}
								},
								error: function(jqxhr) {
									buttonIcon.removeClass("fa-spin fa-spinner").addClass("fa-paper-plane-o");
									inputs.prop("disabled", false);
						            console.log('ajax fail');
						            console.log(JSON.stringify(jqxhr));
						            $("#contact-ajax-error").html(jqxhr.statusText);
						        },
								dataType: "json"
							});
						}
					});

					nload.css("visibility","hidden");
				});
			break;
			case 'testimonials':
				$.get(app.apiURL+"resume/testimonials", function(data) {
					app.getTemplate('templates/testimonials.html', data, function(template) {
						$("#template-testimonials").html(template);
						nload.css("visibility","hidden");
					});
				}, "json");
			break;
			case 'portfolio':
				$.get(app.apiURL+"resume/portfolio", function(data) {
					console.log(data);
					app.getTemplate('templates/portfolio.html', data, function(template) {
						$("#template-portfolio").html(template);
						nload.css("visibility","hidden");
					});
				}, "json");
			break;
			case 'home':
			default:
				var homeload = this.homeload;

				 $.get(app.apiURL+"resume/featured_portfolio", function(data) {
					app.getTemplate('templates/carousel.html', {items:data}, function(template) {
						$("#template-carousel").html(template);
						$(".carousel").carousel({
				      interval: 5000
				    });
				    
						 //Enable swiping...
						$(".carousel-inner").swipe( {
							//Generic swipe handler for all directions
							swipeLeft:function(event, direction, distance, duration, fingerCount) {
								$(this).parent().carousel('prev'); 
							},
							swipeRight: function() {
								$(this).parent().carousel('next'); 
							},
							//Default is 75px, set to 0 for demo so any distance triggers swipe
							threshold:0
						});


						homeload.push('portfolio');
						if(homeload.length > 1){
							nload.css("visibility","hidden");
						}
					});
				}, "json");

				$.get(app.apiURL+"resume/testimonials", function(data) {
					app.getTemplate('templates/quotes.html', data, function(template) {
				         $("#template-quotes").html(template).cycle({
						        	slides: 	'> div',
						        	fx: 		'fade',
						        	speed: 		400,
						        	timeout: 9600,
						        	delay: 350 
						 });
						 homeload.push('testimonials');
						 if(homeload.length > 1){
							nload.css("visibility","hidden");
						}
				    });
				}, "json");


		}
		app.loaded.push(page);
		//
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