
var SwipeableCard = {
    
    /**
     * Fired when the card is swiped away.
     *
     * @event swipeable-card-swipe-away
     */
    
    /**
     * If true, the card can not be swiped.
     *
     * @attribute disableSwipe
     * @type boolean
     * @default false
     */
    disableSwipe: false,

    /**
     * Becomes `true` once the card has been swiped.  Set
     * back to `false` to reset the swipe state.
     *
     * @attribute swiped
     * @type boolean
     * @default false
     */
    swiped: false,
    
    noCurve: false,
    offsetRatio: 0.2,
    widthRatio: 3,
    
    eventDelegates: {
      webkitTransitionEnd: 'transitionEnd',
      transitionend: 'transitionEnd',
      trackstart: 'trackStart',
      trackx: 'trackx',
      trackend: 'trackEnd'
    },

    animate (x) {
      let s = this.style;
      let d = x > 0 ? 1 : -1;
      let w = this._w * this.widthRatio;
      let x1 = Math.max(0, Math.abs(x) - this._w * this.offsetRatio);
      let r = Math.max(0, (w - x1) / w);
      let y = w - Math.sqrt(w * w - x1 * x1);
      let deg = (1 - r) * d * 90;
      s.opacity = r;
      let translate = 'translate3d(' + x + 'px,' + 
          (this.noCurve ? 0 : y) + 'px,0)';
      let rotate = 'rotate(' + deg + 'deg)';
      s.transform = s.webkitTransform =
          translate + (this.noCurve ? '' : ' ' + rotate);
    },
    
    trackStart (e) {
      if (!this.disableSwipe) {
        e.preventTap();
        this._w = this.offsetWidth;
        this.classList.add('dragging');
      }
    },
    
    trackx (e) {
      if (!this.disableSwipe) {
        this.animate(e.dx);
      }
    },
    
    trackEnd (e) {
      if (!this.disableSwipe) {
        this.swipeEnd(Math.abs(e.dx) > this._w / 2 && e.dx * e.xDirection > 0, 
            e.dx > 0);
      }
    },
    
    swipeEnd (away, dir) {
      this.classList.remove('dragging');
      this.away = away;
      this.direction = dir ? 'right' : 'left';
      if (away) {
        let w = this._w * this.widthRatio;
        this.animate(dir ? w : -w);
      } else {
        this.animate(0);
      }
    },
    
    transitionEnd (e) {
      if (this.away && e.propertyName == 'opacity') {
        this.fire('swipeable-card-swipe-away', {direction: this.direction});
        this.swiped = true;
      }
      e.stopPropagation();
    },

    swipedChanged () {
      if (this.away != this.swiped) {
        this.away = this.swiped;
        this.classList.add('dragging');
        this._w = this.offsetWidth;
        this.animate(this.swiped ? this._w * this.widthRatio : 0);
      }
    }
  };

Polymer('swipeable-card', SwipeableCard);