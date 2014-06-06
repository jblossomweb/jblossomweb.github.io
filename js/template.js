function template(url, context, callback) {
    $.ajax({
        url: url,
            success: function(source) {
                var tmpl = Handlebars.compile(source);
                var html    = tmpl(context);  
                if (callback) callback(html);
        }
    });
}