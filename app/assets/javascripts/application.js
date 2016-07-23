// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require turbolinks
//= require cocoon
//
// Bower:
// these are resolved thanks to bower-rails:
//
// javascript
//= require jquery/dist/jquery
//= require jquery-ui/jquery-ui
//= require jquery-ujs/src/rails
//= require lodash/lodash
//
// bootstrap
//= require bootstrap-sass-official
//
// third party
//= require select2
//
// angular
//= require angular/angular
//= require angular-resource/angular-resource
//= require angular-sanitize/angular-sanitize
//= require angular-ui-router/release/angular-ui-router
//= require angular-ui-utils/ui-utils
//= require angular-rails-templates
//
// rails app files:
//= require_tree ../../../lib/assets/javascripts
//= require_tree ../../../vendor/assets/javascripts
//= require_tree .

// Instantiate a slider
var ready = function() {

  // make sliders fancy using jqueryui's slider() method:
  $( "#days_imp_slider" ).slider({
    value:3,
    min: 1,
    max: 10,
    step: 1,
    slide: function( event, ui ) {
      $( "#days_imp_amount" ).val( ui.value );
    }
  });
  // set initial value
  $( "#days_imp_amount" ).val($( "#days_imp_slider" ).slider( "value" ) );


  // apply select2 to any tag_select form elements
  var tagSelect = $("select.tag_select").select2({
    tags: true, // able to create new tags by typing them
    tokenSeparators: [',', ' '] // respond to these keystrokes
  });

  // attempt to fix tag reordering issue; seehttps://github.com/angular-ui/angular-ui-OLDREPO/issues/406
  // note that this does NOT work with tokenSeparator keystrokes... only return/mouseclicks
  // maybe this doesn't do anything at all?
  $("select.tag_select").on("select2:select", function (event) {
    var element = event.params.data.element;
    var $element = $(element);
    $element.detach();
    $(this).append($element);
    $(this).trigger("change");
  });


  $("form").on('click', '.add_child', function(event) {
    // for sorting
    //var time = new Date().getTime()
    //regexp = new RegExp($(this).data('id'), 'g')
    //$(this).before($(this).data('fields').replace(regexp, time))
    event.preventDefault();
  });

  $("#children").sortable({
    axis: 'y',
    update: function() {
      alert('updated!');
    }
  });


};

// have it rerun when turbolinks fires
$(document).ready(ready)
$(document).on('page:load', ready)
