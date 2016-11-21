import React, { PropTypes, Component } from 'react';


export class Slider extends React.Component {
  constructor(props) { // list of objects
    super(props);
    var startSliderVal = props.sliderValue;
    if (typeof startSliderVal == 'undefined' || startSliderVal === null || startSliderVal === "") {
      startSliderVal = 3.0;
    }
    this.state = {
      posValue: startSliderVal,
      dispValue: startSliderVal
    };
    this.curDir = 1;
    this.speedPhase = 'still';
    this.mouseDragging = false;
    this.slideAnimating = false;
    this.minSlideDelay = 10;
    this.endSlideDelay = 35;
    this.startSlideDelay = 40;
    this.timeAtMinDelay = 2000;
    this.slideDelaySpeedUpDecay = .03;
    this.slideDelaySlowDownDecay = .005;
    this.delayBeforeSliding = 0;
    this.sliderMin = 1;
    this.sliderMax = 10;
    this.sliderStepSize = 0.1;
    this.jQuerySelectorString = "#" + this.props.kind + "_slider";
  }

  setSliderVal(newPosVal) {
    // this is fascinating math! you expect the middle to
    // be 5. but from 1.0-10.0, middle is really 5.5!
    // so must take FLOOR of numbers up through 5, but
    // that makes 5/9 of space taken up, only 4/9 left for
    // 6 through 10 -- 5 numbers. So must make each value
    // above 5 bigger.
    if (typeof newPosVal !== 'undefined' && newPosVal !== null) {
      var sliderNumVal = newPosVal;
      if (sliderNumVal >= 6.0) {
        sliderNumVal -= 6.0;
        // better than 5/4 because
        // this way 10 is smaller
        sliderNumVal *= 6.0/5.0;
        sliderNumVal += 6.0;
      }
      sliderNumVal = Math.floor(sliderNumVal);
      if (sliderNumVal < 1) { sliderNumVal = 1; }
      $(this.jQuerySelectorString).slider("value", newPosVal);
      this.setState({
        posValue: newPosVal,
        dispValue: sliderNumVal
      });
    }
  }

  slide(delay) {
    if (this.mouseDragging !== true
      && this.slideAnimating === true) {
      //console.log("sliding!");
      var curVal = $(this.jQuerySelectorString).slider("value");
      if (typeof this.curDir == 'undefined') {
        this.curDir = 1;
      }
      curVal += this.curDir * this.sliderStepSize;
      if (curVal > this.sliderMax) {
        curVal -= this.sliderStepSize * 2;
        this.curDir = -1;
      }
      if (curVal < this.sliderMin) {
        curVal += this.sliderStepSize * 2;
        this.curDir = 1;
      }
      this.setSliderVal(curVal);
      var reactThis = this;
      if (this.speedPhase === "speedingUp") {
        delay = delay * (1 - this.slideDelaySpeedUpDecay);
        if (delay < this.minSlideDelay) {
          delay = this.minSlideDelay;
          setTimeout(function() {
            reactThis.speedPhase = "slowingDown";
          }, this.timeAtMinDelay);
        }
      } else if (this.speedPhase === "slowingDown") {
        delay = delay * (1 + this.slideDelaySlowDownDecay);
        if (delay > this.endSlideDelay) {
          delay = this.endSlideDelay;
          this.speedPhase = "endingSpeed";
        }
      } else { // speed not changing
      }
      setTimeout(function() {
        reactThis.slide.call(reactThis, delay);
      }, delay);
    }
  }

  startSlidingIfAppropriate() {
    var reactThis = this;
    //console.log("is appropriate?");
    if (this.mouseDragging !== true
      && this.slideAnimating !== true) {
      //console.log("yes appropriate.");
      setTimeout(function() {
        reactThis.startSliding.call(reactThis);
      }, this.delayBeforeSliding);
    } else {
      //console.log("not appropriate.");
    }
  }
  startSliding() {
    if (this.mouseDragging !== true
      && this.slideAnimating !== true) {
      this.speedPhase = "speedingUp";
      this.slideAnimating = true;
      //console.log("calling slide...");
      this.slide(this.startSlideDelay);
    }
  }
  stopSliding() {
    this.slideAnimating = false;
    this.speedPhase = "still";
  }

  setupForJQuery() {
    var reactThis = this;
    $(this.jQuerySelectorString).slider({
    value: this.state.posValue, min: this.sliderMin, max: this.sliderMax,
    step: this.sliderStepSize,
    create: function( event, ui ) { // set initial value
      reactThis.setSliderVal.call(reactThis, null);
    },
    slide: function( event, ui ) { // called on mouse move
      reactThis.mouseDragging = true;
      reactThis.setSliderVal.call(reactThis, ui.value);
    },
    stop: function( event, ui ) { // called on stopping mouse move
      reactThis.mouseDragging = false;
    }
  }).focusin(function() { reactThis.startSlidingIfAppropriate.call(reactThis); })
  .focusout(function() { reactThis.stopSliding.call(reactThis); })
  .mousedown(function() { reactThis.stopSliding.call(reactThis); });
  }

  componentDidMount() { // called by React.Component
    this.setupForJQuery();
  }

  // note that onChange won't work for the hidden field because it's set by
  // jquery, whose val() function doesn't trigger onChange.
  // Instead, we keep a ref to that element, and grab its val onBlur.
  render() {
    return (
      <div className='row' style={{marginTop: '5px'}}>
        <div className='col-xs-3'>
          <div style={{paddingLeft: '5px'}}>
            <i className='icon-down-right-arrow'
            style={{float: 'left', position: 'relative'}}></i>
            <label htmlFor={'task_' + this.props.kind}>{this.props.text}</label>
            &nbsp;<span
            style={{border: 0, color: '#f6931f', fontWeight: 'bold'}}>{this.state.dispValue}</span>
            <input id={this.props.kind + '_slider_amount_hidden'}
            name={this.props.kind}
            type='hidden' value={this.state.dispValue}
            />
          </div>
        </div>
        <div className='field col-xs-9'>
          <div className='imp_slider' id={this.props.kind + '_slider'}
          style={{marginTop: '3px'}}
          ></div>
        </div>
      </div>
    );
  }
}
