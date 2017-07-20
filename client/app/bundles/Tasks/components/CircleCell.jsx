import React from 'react';
import Component from 'react';

export class CircleCell extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.curDir = 1;
    this.speedPhase = 'still';
    this.growAnimating = false;
    this.minGrowDelay = 1.5;
    this.endGrowDelay = 20;
    this.startGrowDelay = 12;
    this.timeAtMinDelay = 2000;
    this.stepSize = .1;
    this.growDelaySpeedUpDecay = .01;
    this.growDelaySlowDownDecay = .005;
    this.minTrueSize = 1;
    this.maxTrueSize = 10;
    this.smallestCssSize = 1;
    this.largestCssSize = 20;
    this.scaleFactor = (this.largestCssSize - this.smallestCssSize) / 10.0;
    this.state = {
      rawColor: props.rawColor,
      colorClassName: props.colorClassName,
      ...this.calcSize(props.size)
    };
  }


  calcSize(trueSize) {
    var cssSize = trueSize;
    if (cssSize === undefined || cssSize === null) {
      cssSize = 1;
    }
    cssSize = this.scaleFactor * (Math.pow(cssSize, .75) + this.smallestCssSize)/(Math.pow(10.0, .75) + this.smallestCssSize);
    var cssSpacerSize = this.scaleFactor * this.smallestCssSize/(10.0 + this.smallestCssSize);
    cssSpacerSize -= cssSize / 2.0;
    cssSpacerSize += 0.2; // extra spacing
    return {
      trueSize: trueSize,
      cssSize: cssSize,
      cssSpacerSize: cssSpacerSize
    };
  }

  setTrueSize(trueSize) {
    this.setState({
      ...this.calcSize(trueSize)
    });
  }

  grow(delay) {
    let curVal = this.state.trueSize;
    if (this.growAnimating === true) {
      if (typeof this.curDir == 'undefined') {
        this.curDir = 1;
      }
      curVal += this.curDir * this.stepSize;
      if (curVal > this.maxTrueSize) {
        curVal -= this.stepSize;
        this.curDir = -1;
      }
      if (curVal < this.minTrueSize) {
        curVal += this.stepSize;
        this.curDir = 1;
      }
      this.setTrueSize(curVal);
      var reactThis = this;
      if (this.speedPhase === "speedingUp") {
        delay = delay * (1 - this.growDelaySpeedUpDecay);
        if (delay < this.minGrowDelay) {
          delay = this.minGrowDelay;
          setTimeout(function() {
            reactThis.speedPhase = "slowingDown";
          }, this.timeAtMinDelay);
        }
      } else if (this.speedPhase === "slowingDown") {
        delay = delay * (1 + this.growDelaySlowDownDecay);
        if (delay > this.endGrowDelay) {
          delay = this.endGrowDelay;
          this.speedPhase = "endingSpeed";
        }
      } else { // speed not changing
      }
      setTimeout(function() {
        reactThis.grow.call(reactThis, delay);
      }, delay);
    }
  }

  startGrowing() {
    if (this.growAnimating === false) {
      this.speedPhase = "speedingUp";
      this.growAnimating = true;
      this.grow(this.startGrowDelay);
    }
  }
  stopGrowing() {
    this.growAnimating = false;
    this.speedPhase = "still";
  }

  toggleClick(e) {
    e.preventDefault();
    if (this.growAnimating === true) {
      this.stopGrowing();
      this.props.onChange(this.state.trueSize);
    } else {
      this.startGrowing();
    }
  }

  render() {
    var styleVars = {width: this.state.cssSize + 'em', height: this.state.cssSize + 'em', marginLeft: this.state.cssSpacerSize + 'em', marginTop: (this.state.cssSpacerSize + 0.5) + 'em'};
    var backgroundColorVars = {}
    if (this.state.rawColor !== undefined && this.state.rawColor !== null) {
      backgroundColorVars = {backgroundColor: this.state.rawColor};
    }
    console.log("rendering cirlce with rawColor " + this.state.rawColor + ", colorClassName " + this.state.colorClassName);
// {Object.assign({}, styleVars, backgroundColorVars)}
    return (
      <div onClick={this.toggleClick.bind(this)} style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.7rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
        <div className={`circle ${this.state.colorClassName}`} style={Object.assign({}, styleVars, backgroundColorVars)}></div>
      </div>
    );
  }
}
CircleCell.propTypes = {
  size: React.PropTypes.number.isRequired,
  rawColor: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired
};


