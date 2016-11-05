console.log('OVER HERE TEST 0');
// var $ = require('jquery');
// //var jQuery = require('jquery');
//var jQuery = require('jquery/dist/jquery.min.js');
console.log('OVER HERE TEST 1');
console.log($('body'));
console.log(jQuery('body'));
console.log('OVER HERE TEST 2');
// require('jquery-ui/themes/base/core.css');
require('jquery-ui');
require('jquery-ui/ui/widgets/slider');
require('jquery-ui/ui/widgets/sortable');
require('select2');
require('mousetrap');
require('hammerjs');
//require('letterify');
require('bootstrap-datepicker');
//require('./jquery-timepicker.js');
require("imports?$=jquery!jquery-timepicker/jquery.timepicker")
// require('jquery-timepicker/jquery.timepicker');
// var letterify = require('letterify');
// require('letteringjs');
require("imports?$=jquery!./jquery.lettering.js")
require("imports?$=jquery!./color.js")

// require('lettering');

console.log('OVER HERE TEST 3');

$(document).ready(function () {

  console.log("4: " + jQuery('div').first());

  // ***********************
  //        SLIDER
  // ***********************

  var minSlideDelay = 10;
  var endSlideDelay = 35;
  var startSlideDelay = 40;
  var timeAtMinDelay = 2000;
  var slideDelaySpeedUpDecay = .03;
  var slideDelaySlowDownDecay = .005;
  var delayBeforeSliding = 0;
  // make sliders fancy using jqueryui's slider() method:
  var setSliderVal = function(element, newVal) {
    // this is fascinating math! you expect the middle to
    // be 5. but from 1.0-10.0, middle is really 5.5!
    // so must take FLOOR of numbers up through 5, but
    // that makes 5/9 of space taken up, only 4/9 left for
    // 6 through 10 -- 5 numbers. So must make each value
    // above 5 bigger.
    var sliderId = $(element).attr('id');
    var sliderPosVal = newVal;
    var sliderNumVal = newVal;
    if (typeof newVal == 'undefined' || newVal === null) {
      var hiddenVal = $( "#" + sliderId + "_amount_hidden" ).val();
      if (typeof hiddenVal == 'undefined' || hiddenVal === null || hiddenVal === "") {
        // have to fall back on default
        sliderNumVal = 3.0;
      } else {
        hiddenVal = Number(hiddenVal);
        if (typeof hiddenVal == 'undefined' || hiddenVal === null || hiddenVal === NaN) {
          // have to fall back on default
          sliderNumVal = 3.0;
        } else { // hidden value was good, so use it!
          sliderNumVal = hiddenVal;
        }
      }
      // since newVal is not present, best we can do with Num position is set it to
      sliderPosVal = sliderNumVal;
    }
    if (sliderNumVal >= 6.0) {
      sliderNumVal -= 6.0;
      sliderNumVal *= 6.0/5.0; // better than 5/4 because
                             // this way 10 is smaller
      sliderNumVal += 6.0;
    }
    sliderNumVal = Math.floor(sliderNumVal);
//     var roundedVal = Math.round(newVal * 19.0 / 18.0 - .1);
    if (sliderNumVal < 1) { sliderNumVal = 1 }
    $(element).slider("value", sliderPosVal);
    $( "#" + sliderId + "_amount_hidden" ).val(sliderNumVal);
    $( "#" + sliderId + "_amount_shown" ).html(sliderNumVal);
  };
  // $(selector).attr('data-name','value')
  var slide = function(element, delay) {
    console.log("in slide...");
    console.log("is dragging not true?");
    console.log($(element).attr("data-mousedragging") !== "true");
    console.log("is animating?");
    console.log($(element).attr("data-slideanimating") === "true");
    console.log("is slideable?");
    console.log($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") === "true");

    if ($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") === "true") {
      console.log("sliding!");
      var curVal = $(element).slider("value");
      var stepSize = .1;//$(element).slider("option", "step");
      var maxVal = $(element).slider("option", "max");
      var minVal = $(element).slider("option", "min");
      var curDir = $(element).attr("data-curdir");
      if (typeof curDir == 'undefined') {
        curDir = 1
      }
      curVal += curDir * stepSize
      if (curVal > maxVal) {
        curVal -= stepSize * 2;
        curDir = -1;
        $(element).attr("data-curdir", -1);
      }
      if (curVal < minVal) {
        curVal += stepSize * 2;
        curDir = 1;
        $(element).attr("data-curdir", 1);
      }
      setSliderVal(element, curVal);
      if ($(element).attr("data-speedphase") === "speedingUp") {
        delay = delay * (1 - slideDelaySpeedUpDecay);
        if (delay < minSlideDelay) {
          delay = minSlideDelay;
          setTimeout(function() {
            $(element).attr("data-speedphase", "slowingDown");
          }, timeAtMinDelay);
        }
      } else if ($(element).attr("data-speedphase") === "slowingDown") {
        delay = delay * (1 + slideDelaySlowDownDecay);
        if (delay > endSlideDelay) {
          delay = endSlideDelay;
          $(element).attr("data-speedphase", "endingSpeed");
        }
      } else { // speed not changing
      }
      setTimeout(function() {
        slide(element, delay);
      }, delay);
    }
  };
  var startSlidingIfAppropriate = function(element) {
    console.log("is appropriate?");
    if ($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") !== "true") {
      console.log("yes appropriate.");
      setTimeout(function() {
        startSliding(element);
      }, delayBeforeSliding);
    } else {
      console.log("not appropriate.");
    }
  };
  var startSliding = function(element) {
    if ($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") !== "true") {
      $(element).attr("data-speedphase", "speedingUp");
      $(element).attr("data-slideanimating", "true");
      console.log("calling slide...");
      slide(element, startSlideDelay);
    }
  };
  var stopSliding = function(element) {
    $(element).attr("data-slideAnimating", "false");
  };

  // individual sliders
  $( ".imp_slider" ).slider({
    value:3, min: 1, max: 10, step: .1,
    create: function( event, ui ) { // set initial value
      setSliderVal(this, null);
    },
    slide: function( event, ui ) { // called on mouse move
      $(this).attr("data-mousedragging", "true")
      setSliderVal(this, ui.value);
    },
    stop: function( event, ui ) { // called on stopping mouse move
      $(this).attr("data-mousedragging", "false")
    }
  }).focusin(function() { startSlidingIfAppropriate(this); })
  .focusout(function() { stopSliding(this); })
  .mousedown(function() { stopSliding(this); });

  // ***********************
  //        TAGS
  // ***********************

  // apply select2 to any tag_select form elements
  $("select.tag_select").select2({
    tags: true, // able to create new tags by typing them
    placeholder: "Tags",
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

  // ***********************
  //     DATE PICKER
  // ***********************

$('input#due_date_input').datepicker({
    todayHighlight: true,
    startView: 0,
    maxViewMode: 2,
    daysOfWeekHighlighted: "0,6",
    autoclose: true
  });
console.log("5: " + jQuery('div').first());
$('input#time_of_day_input').timepicker({
    timeFormat: 'h:mm p',
    interval: 30,
    minTime: '5',
    maxTime: '10:00pm',
    startTime: '5',
    dynamic: false,
    dropdown: true,
    scrollbar: true
});


  // ***********************
  //     COUNTDOWN
  // ***********************

// $('#countdown').countdown({
//   until: '+70',
//   compact: true,
//   format: "MS",
//   onTick: highlightLast5
// }).on('click', function() {

// });
// function highlightLast5(periods) {
//   if ($.countdown.periodsToSeconds(periods) === 59) {
//     $(this).addClass('highlight');
//   }
// }
// var minuteDeltas = [
//   // above 0 minutes, add 5 minutes
//   [0, 5],
//   [5, 5],
//   [10, 5],
//   [15, 10],
//   [30, 15],
//   [45, 30],
//   [90, 60]
// ]
// $('#moreTimeButton').click(function() {
//   var secsLeft = $.countdown.periodsToSeconds(periods);
//   var now = new Date();
//   var timeUntil = new Date();
//   var deltaPair = [];
//   var minutesToAdd = 0;
//   for (var i = 0; i < minuteDeltas.length; i++) {
//     deltaPair = minuteDeltas[i];
//     if (secsLeft/60.0 > deltaPair[0]) {
//       minutesToAdd = minuteDeltas[1];
//     }
//   }
//   var secondsToAdd = minutesToAdd * 60;
//   timeUntil.setSeconds(now.getSeconds() + secsLeft + secondsToAdd);
//   $('#countdown').countdown('option', {until: timeUntil});
// });
// $('#playButton').click(function() {
//   $('#countdown').countdown('resume');
// });

// $('#pauseButton').click(function() {
//   $('#countdown').countdown('pause');
// });

  // ***********************
  //     CHILD TASKS
  // ***********************

  var generateNewChildFieldsHtml = function() {
    var holder = $("#rails_data_holder");
    var templateObjIdStr = holder.data('new-child-object-id');
    var newChildFieldsHtmlTemplate = holder.data('new-child-fields-html');
    // for sorting
    var time = new Date().getTime();
    var regexp = new RegExp(templateObjIdStr, 'g');
    return newChildFieldsHtmlTemplate.replace(regexp, time)
  };

  $("form").on('click', '.add_child', function(event) {
    $("ul#task_children_list").append(generateNewChildFieldsHtml());
    event.preventDefault();
  });

  $("ul#task_children_list").sortable({
    axis: 'y',
    // have just a part be the handle
//    handle: '.handle',
    update: function() {
      $.post($(this).data('update-url'), $(this).sortable('serialize'))
    }
  });
  //$( "#task_children_list" ).disableSelection();

  $("form").on('keypress', 'input.subtask_name', function(event) {
    if (event.keyCode == 13) {
      var myLiElement = $(this).closest("li");
      myLiElement.after(generateNewChildFieldsHtml());
      var nextLiElement = myLiElement.next();
      nextLiElement.find("input.subtask_name").focus();
      return false;
    }
  });

  // ***********************
  //        SHORTCUTS
  // ***********************

  // mousetrap shortcuts
  Mousetrap.bind('s', function() {
    $("a#split_link")[0].click();
  });
  Mousetrap.bind('e', function() {
    $("a#edit_link")[0].click();
  });
  Mousetrap.bind('p', function() {
    $("a#postpone_link")[0].click();
  });
  Mousetrap.bind('f', function() {
    $("a#finished_link")[0].click();
  });
  Mousetrap.bind('w', function() {
    $("a#worked_link")[0].click();
  });
  Mousetrap.bind('d', function() {
    $("a#destroy_link")[0].click();
  });
  Mousetrap.bind('n', function() {
    $("a#new_link")[0].click();
  });

  // ***********************
  //      VISIBLE TOGGLES
  // ***********************

  // toggle subtask list visibility
  $('#task_children_list_toggle').click(function() {
    $('ul#task_children_list').slideToggle();
    $('#task_children_list_toggle_on').toggle();
    $('#task_children_list_toggle_off').toggle();
  });

  var createFormSectionToggle = function(attribute) {
    $('#form_' + attribute + '_toggle_section').click(function() {
      $('#form_' + attribute).slideToggle(400, function() {
        // focus if we opened it
        if ($(this).is(':visible')) {
          var childInput = $(this).find("input");
          if (childInput) childInput.focus();
          else {
            $(this).focus();
          }
        }
      });
      $('#form_' + attribute + '_toggle_on').toggle();
      $('#form_' + attribute + '_toggle_off').toggle();
    });
  }
  createFormSectionToggle('notes');
  createFormSectionToggle('due');
  createFormSectionToggle('time_of_day');
  createFormSectionToggle('children');

  // ***********************
  //       FOCUS
  // ***********************

  // focus on first place for input
  $('.initial-focus').first().focus();

  // ***********************
  //    BRAND ANIMATION
  // ***********************

  var randomWithRange = function(max, min, minMaxEdgeBonus, prev, minPrevDiff, maxPrevDiff) {
    // make sure we won't run forever!
    if (maxPrevDiff - minPrevDiff <= 0.0) {
      return null;
    }
    var randVal = 0;
    do {
      randVal = Math.random();
      // scale randVal to min-max distance
      randVal = randVal * (max - min + 2 * minMaxEdgeBonus);
      // translate it down to be even
      randVal = randVal + min - minMaxEdgeBonus;
      // pull it in to min or max if past them
      if (randVal > max) { randVal = max; }
      if (randVal < min) { randVal = min; }

      // if it's too small a change from prev val,
      // or too large a change, do a new rand val instead
    } while (
      (Math.abs(randVal - prev) < minPrevDiff)
      ||
      (Math.abs(randVal - prev) > maxPrevDiff)
      );
    return randVal;
  }

  var numBrandChars = "Prioritizer".length;
  var maxBrandSize = 1.5;
  var defaultBrandSize = 1.0;
  var minBrandSize = 0.5;
  var minDiff = 0.2;
  var maxDiff = 0.8;

  var resizeStage = "start";
  var startResizeSpeed = 400;
  var curResizeSpeed = startResizeSpeed;
  var startResizeSpeedDelta = -50;
  var advanceResizeStageAfterNumResizings = 2 * numBrandChars;
  var middleResizeSpeedDelta = 50;
  var finalResizeSpeed = 1200;

  var waitBeforeStartingResize = 1000;
  var waitBetweenResizings = 300;
  var waitBetweenResizingsDelta = 25;
  var extraWaitBeforeFinalResize = 2000;
  var numResizings = 0;
  var maxNumResizings = 5 * numBrandChars;

  // load initial sizes of chars
  var sizes = Array(numBrandChars);
  for (var i = 0; i < numBrandChars; i++) {
    sizes[i] = defaultBrandSize;
  }
  // change resize speed to be correct for the
  // next resizing event
  var iterateResizeSpeed = function() {
    if (numResizings >= advanceResizeStageAfterNumResizings) {
      resizeStage = "middle";
    }
    if (resizeStage === "start") {
      curResizeSpeed += startResizeSpeedDelta;
    } else { // "middle"
      curResizeSpeed += middleResizeSpeedDelta;
    }
  }
  // perform resizings of all chars,
  // then recursively call this same function again
  var resizeAllBrandCharsRepeatedly = function() {
    resizeAllBrandChars();
    if (numResizings < maxNumResizings) {
      setTimeout(function() {
        resizeAllBrandCharsRepeatedly();
      }, curResizeSpeed + waitBetweenResizings);
      waitBetweenResizings += waitBetweenResizingsDelta;
      iterateResizeSpeed();
    } else { // the last time, do the "final" version
      setTimeout(function() {
        resizeAllBrandCharsToFinal();
      }, extraWaitBeforeFinalResize);
    }
  };
  // resize all chars once
  var resizeAllBrandChars = function() {
    for (var i = 0; i < numBrandChars; i++) {
      resizeBrandChar(i);
    }
  };
  // resize all chars back to original size, at
  // special speed
  var resizeAllBrandCharsToFinal = function() {
    for (var i = 0; i < numBrandChars; i++) {
      resizeBrandChar(i, defaultBrandSize, finalResizeSpeed);
    }
  };
  // resize one char
  var resizeBrandChar = function(charNum = null, targetSize = null, resizeSpeed = null) {
    // handle defaults for when params missing
    if (charNum === null) {
      charNum = Math.floor(Math.random() * numBrandChars);
    }
    if (targetSize === null) {
      targetSize = randomWithRange(maxBrandSize, minBrandSize, 0.1, sizes[charNum], minDiff, maxDiff)
    }
    if (resizeSpeed === null) {
      resizeSpeed = curResizeSpeed;
    }

    // record new size of this char
    sizes[charNum] = targetSize;
    // we count resizings of *each* char, to be
    // as fine grained as possible
    numResizings++;

    // transition CSS to fit new size
    var selector = "#brand_" + charNum;
    var newXScale = (targetSize > defaultBrandSize) ? targetSize : defaultBrandSize;
    $(selector).css(
      {
        transition: "transform " + (resizeSpeed / 1000.0) + "s ease-out",
        transform:  "scale(" + newXScale + ", " + targetSize + ")"
      }
    );
  };
  // set the resizing going initially
  setTimeout(function() {
    resizeAllBrandCharsRepeatedly();
  }, waitBeforeStartingResize);

  // ***********************
  //    TEXT SHADOW
  // ***********************

  var props = "Color X Y Blur".split(' '),
    support = $.support,
    rWhitespace = /\s/,
    div = document.createElement('div'),
    divStyle = div.style;

  support.textShadow = (divStyle.textShadow === '');
  div = null;

  if ($.cssHooks && support.textShadow) {
    $.each(props, function(i, suffix) {
      var hook = 'textShadow' + suffix;

      $.cssHooks[hook] = {
        get: function(elem, computed, extra) {
          return (function(elem, pos) {
            var shadow = $.css(elem, 'textShadow');
            var color = $.color.normalize(shadow);
            var ret;

            if (pos === 0) {
              ret = 'rgb'
                  + (color.alpha ? 'a' : '') + '('
                  + color.r + ', '
                  + color.g + ', '
                  + color.b
                  + (color.alpha ? ', ' + color.alpha : '')
                  + ')';
            }
            else {
              ret = $.trim(shadow.replace(color.source, '')).split(rWhitespace)[pos - 1];
            }

            return ret;
          })(elem, i);
        },
        set: function(elem, value) {
          elem.style.textShadow = (function(string, value, index) {
            var color_part = $.style(elem, 'textShadowColor'),
              parts = string.replace(color_part, '').split(rWhitespace),
              ret;

            if (index === 0) {
              color_part = value;
            } else {
              parts[index] = value;
            }

            return color_part + parts.join(' ');
          })($.css(elem, 'textShadow'), value, i);
        }
      };

      if (i !== 0) {
        $.fx.step[hook] = function(fx) {
          $.cssHooks[hook].set(fx.elem, fx.now + fx.unit);
        };
      }
    });
  }

  // ***********************
  //    BLUR ANIMATION
  // ***********************

  // enable jquery lettering
  $("#navbar-title-blur").lettering();
//letterify('#navbar-title-blur');

  var titleElem = $("#navbar-title-blur");
  var numTitleLetters = titleElem.find("span").length;
  var turnsSincePick = Array.apply(null, Array(numTitleLetters)).map(function (x, i) { return 9999 });
  var minBlurDiff = 10;
  var curBlurDiff;
  var minColorDiff = 100;
  var curColorDiff;
  var curBlurVals = {}
  for (var i = 0; i < numTitleLetters; i++) {
    curBlurVals[i] = {"blur": -9999, "color": -9999};
  }
  var whichLetter = 0;
  var newBlur = 0;
  var newColor = 0;

  function randomBlurize() {
    do {
      whichLetter = (Math.floor(Math.random()*numTitleLetters));
      console.log("tentatively picked " + whichLetter + " which has turnsSincePick " + turnsSincePick[whichLetter]);
    } while (turnsSincePick[whichLetter] < Math.floor(numTitleLetters / 2.0));
    console.log("picked " + whichLetter);
    for (var i = 0; i < numTitleLetters; i++) {
      turnsSincePick[i]++;
    }
    turnsSincePick[whichLetter] = 0;
    do {
      newBlur = Math.floor(Math.random()*20);
      curBlurDiff = Math.abs(newBlur - curBlurVals[whichLetter]["blur"]);
    } while (curBlurDiff < minBlurDiff);
    console.log("picked blur " + newBlur + " with diff " + curBlurDiff);
    curBlurVals[whichLetter]["blur"] = newBlur;
    newBlur = newBlur * newBlur / 20.0 + 0.1; // don't go to 0, it'll turn black
    do {
      newColor = Math.floor(Math.random()*200)+55;
      curColorDiff = Math.abs(newColor - curBlurVals[whichLetter]["color"]);
    } while (curColorDiff < minColorDiff);
    console.log("picked color " + newColor + " with diff " + curColorDiff);
    curBlurVals[whichLetter]["color"] = newColor;
    titleElem.find("span:nth-child(" + (whichLetter + 1) + ")")
      .stop().animate({
        'textShadowBlur': newBlur,
        'textShadowColor': 'rgba(0,100,0,' + newColor + ')'
      }, {
        duration: 3000
      });
      // console.log("animating " + whichLetter + " to blur: " + newBlur + " and color: " + newColor);
      // Call itself recurssively
      setTimeout(randomBlurize, 2000);
   } // Call once
   setTimeout(randomBlurize, 2000);


  console.log("6: " + jQuery('div').first());
});

console.log("7: " + jQuery('div').first());


// have it rerun when turbolinks fires
//$(document).on('turbolinks:load', ready);

