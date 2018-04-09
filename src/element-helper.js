import { snakeToCamel } from './utils';

export default class ElementHelper {
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
