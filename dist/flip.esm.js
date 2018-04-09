function snakeToCamel(str) {
  return str.replace(/(-\w)/g, (match) => match[1].toUpperCase());
}

function nextFrame(fn) {
  // Twice because of firefox
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

class ElementHelper {
  constructor(element) {
    this.element = element;
  }

  getStyle(styleProp) {
    return window.getComputedStyle(this.element).getPropertyValue(styleProp);
  }

  getStyles(styleProps) {
    return styleProps.map((prop) => this.getStyle(this.element, prop));
  }

  setStyle(styleProp, value) {
    this.element.style[snakeToCamel(styleProp)] = value;
  }

  addClass(clazz) {
    this.element.classList.add(clazz);
  }

  addEventListener(eventName, cb) {
    this.element.addEventListener(eventName, cb);
  }

  removeEventListener(eventName, cb) {
    this.element.removeEventListener(eventName, cb);
  }

  measure(otherPropsToFlip) {
    return {
      rect: this.element.getBoundingClientRect(),
      opacity: this.getStyle('opacity'),
      others: this.getStyles(otherPropsToFlip),
    };
  }

  static getTransition(properties, transitionDuration, transitionTimingFunction) {
    return properties
      .map((prop) => `${prop} ${transitionDuration} ${transitionTimingFunction}`)
      .join(',');
  }

  static getTransform(translateX, translateY, scaleX, scaleY) {
    const transforms = [];
    if (translateX || translateY) transforms.push(`translate(${translateX}px,${translateY}px)`);
    if (scaleX !== 1 || scaleY !== 1) transforms.push(`scale(${scaleX},${scaleY})`);
    return transforms.join(' ');
  }
}

class Flipper {
  constructor(element, toClass, otherPropsToFlip) {
    this.helper = new ElementHelper(element);
    this.toClass = toClass;
    this.otherPropsToFlip = otherPropsToFlip ? [].concat(otherPropsToFlip) : [];
  }

  firstLastInvert() {
    // first
    const first = this.helper.measure(this.otherPropsToFlip);

    this.helper.addClass(this.toClass);

    // last
    const last = this.helper.measure(this.otherPropsToFlip);

    // invert
    this.inverted = this.invert(first, last, this.otherPropsToFlip);
  }

  play(transitionDuration, transitionTimingFunction) {
    return new Promise((resolve) => {
      // For starters, lets check if we actually have anything to transition
      const transitionProps = [];
      if (this.inverted.hasTransformChanged) transitionProps.push('transform');
      if (this.inverted.hasOpacityChanged) transitionProps.push('opacity');
      Flipper.forEachPropThatChanged(this.otherPropsToFlip, this.inverted, (prop) =>
        transitionProps.push(prop),
      );
      if (!transitionProps.length) {
        resolve();
        return;
      }

      // Set the transition property to enable...well...the transition
      this.helper.setStyle(
        'transition',
        ElementHelper.getTransition(transitionProps, transitionDuration, transitionTimingFunction),
      );

      // Prepare cleanup and resolve after the transition
      const transitionEndCallback = () => {
        this.helper.removeEventListener('transitionend', transitionEndCallback);
        this.helper.setStyle('transition', '');
        resolve();
      };
      this.helper.addEventListener('transitionend', transitionEndCallback);

      // Remove transform and opacity to trigger the transition towards the css class
      if (this.inverted.hasTransformChanged) this.helper.setStyle('transform', '');
      if (this.inverted.hasOpacityChanged) this.helper.setStyle('opacity', '');
      Flipper.forEachPropThatChanged(this.otherPropsToFlip, this.inverted, (prop) =>
        this.helper.setStyle(prop, ''),
      );
    });
  }

  invert(first, last, otherPropsToFlip) {
    // Calculate
    const inverted = {
      translateX: (first.rect.left + first.rect.right) / 2 - (last.rect.left + last.rect.right) / 2,
      translateY: (first.rect.top + first.rect.bottom) / 2 - (last.rect.top + last.rect.bottom) / 2,
      scaleX: first.rect.width / last.rect.width,
      scaleY: first.rect.height / last.rect.height,
      hasOpacityChanged: first.opacity !== last.opacity,
      opacity: first.opacity,
      hasOtherPropsToFlipChanged: first.others.map(
        (firstOther, index) => firstOther !== last.others[index],
      ),
      otherPropsToFlip: first.others,
    };
    inverted.transform = ElementHelper.getTransform(
      inverted.translateX,
      inverted.translateY,
      inverted.scaleX,
      inverted.scaleY,
    );
    inverted.hasTransformChanged = !!inverted.transform;

    // Invert
    if (inverted.hasTransformChanged) this.helper.setStyle('transform', inverted.transform);
    if (inverted.hasOpacityChanged) this.helper.setStyle('opacity', inverted.opacity);
    Flipper.forEachPropThatChanged(otherPropsToFlip, inverted, (prop, index) =>
      this.helper.setStyle(prop, inverted.otherPropsToFlip[index]),
    );

    // return info about what has changed
    return inverted;
  }

  static equals(first, second) {
    return first.helper.element === second.helper.element && first.toClass === second.toClass;
  }

  static forEachPropThatChanged(props, inverted, actionFn) {
    props.forEach((p, index) => {
      if (inverted.hasOtherPropsToFlipChanged[index]) actionFn(p, index);
    });
  }
}

/**
 * A simple an small implementation of Paul Lewis' Flip animation principle.
 */
class Flip {
  constructor() {
    this.reset();
  }

  /**
   * Set the properties of the transition
   * @param {String} duration as set in CSS (default is '375ms')
   * @param {String} timingFunction as set in CSS (default is 'cubic-bezier(0.4, 0.0, 0.2, 1)')
   * @returns {Flip} the instance of Flip
   */
  withTransition(duration = '375ms', timingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)') {
    this.transitionDuration = duration || this.transitionDuration;
    this.transitionTimingFunction = timingFunction || this.transitionTimingFunction;
    return this;
  }

  /**
   * Set the element(s) that will transition, and the CSS to which it will transition to.
   * @param {(HTMLElement|Array<HTMLElement>)} elements that will transition
   * @param {String} toClass CSS class to which the element will transition to
   * @param {(String|Array<String>)} otherPropsToFlip Optionnaly, the additionnal CSS properties
   * that should transition (other than 'opacity' and 'transform', in snake case)
   * @returns {Flip} the instance of Flip
   * @throws {Error} if either 'element' or 'toClass' in not defined
   */
  withClass(elements, toClass, otherPropsToFlip = []) {
    if (!elements) throw new Error('elements should be defined');
    if (!toClass) throw new Error('toClass should be defined');
    if (this.ongoing) console.warn('withClass(): transition already ongoing');
    const elementArray = [].concat(elements);
    let newFlipper;
    elementArray.forEach((element) => {
      newFlipper = new Flipper(element, toClass, otherPropsToFlip);
      if (!this.flippers.some((currentFlipper) => Flipper.equals(currentFlipper, newFlipper))) {
        this.flippers.push(newFlipper);
      }
    });
    return this;
  }

  /**
   * Triggers the transition.
   * @returns {Promise} that resolves after the transition ended.
   */
  go() {
    return new Promise((resolve) => {
      this.ongoing = true;
      // fli
      this.flippers.forEach((flipper) => flipper.firstLastInvert());
      // p
      nextFrame(() => {
        const transitionPromises = this.flippers.map((flipper) =>
          flipper.play(this.transitionDuration, this.transitionTimingFunction),
        );
        Promise.all(transitionPromises).then(() => {
          this.ongoing = false;
          this.reset();
          resolve();
        });
      });
    });
  }

  /**
   * Resets everything (element(s) to transition, as well as transition settings).
   * @returns {Flip} the instance of Flip
   */
  reset() {
    if (this.ongoing) console.warn('reset(): transition still ongoing');
    this.flippers = [];
    this.withTransition();
    return this;
  }
}

export default Flip;
//# sourceMappingURL=flip.esm.js.map
