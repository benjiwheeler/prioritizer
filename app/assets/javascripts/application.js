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
$(function() {

  // sliders
  // var mySlider = $("input.slider").bootstrapSlider();
  // $("#days_imp").on("slide", function(slideEvt) {
  //   $("#daysImpSliderVal").text(slideEvt.value);
  // });
  $( "#days_imp_slider" ).slider({
    value:3,
    min: 1,
    max: 10,
    step: 1,
    slide: function( event, ui ) {
      $( "#days_imp_amount" ).val( ui.value );
    }
  });
  $( "#days_imp_amount" ).val($( "#days_imp_slider" ).slider( "value" ) );


  // selects
  var tagSelect = $("select.tag_select").select2({
    tags: true,
    tokenSeparators: [',', ' ']
  });

  // mugi to you
  var abc = "ab";
});
