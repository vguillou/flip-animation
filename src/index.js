import Flipper from './flipper';
import { nextFrame } from './utils';

class Flip {
  constructor() {
    this.reset();
  }

  /**
   * Set the properties of the transition
   * @param {String} duration as set in CSS (default is '375ms')
   * @param {String} timingFunction as set in CSS (default is 'cubic-bezier(0.4, 0.0, 0.2, 1)')
   * @returns the instance of Flip
   */
  withTransition(duration = '375ms', timingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)') {
    this.transitionDuration = duration || this.transitionDuration;
    this.transitionTimingFunction = timingFunction || this.transitionTimingFunction;
    return this;
  }

  /**
   * Set the element that will transition, and the CSS to which it will transition to.
   * @param {HTMLElement or Array} elements that will transition
   * @param {String}} toClass CSS class to which the element will transition to
   * @param {String or Array} otherPropsToFlip Optionnaly, the additionnal CSS properties
   * that should transition (other than 'opacity' and 'transform', in snake case)
   * @returns the instance of Flip
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
   * @returns A Promise that resolves after the transition ended.
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
   * Reset everything (elements to transition, as well as transition settings).
   * @returns the instance of Flip
   */
  reset() {
    if (this.ongoing) console.warn('reset(): transition still ongoing');
    this.flippers = [];
    this.withTransition();
    return this;
  }
}

export default Flip;
