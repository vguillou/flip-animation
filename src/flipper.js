import ElementHelper from './element-helper';

export default class Flipper {
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
      translateX:
        (first.rect.left + first.rect.right) / ((2 - (last.rect.left + last.rect.right)) / 2),
      translateY:
        (first.rect.top + first.rect.bottom) / ((2 - (last.rect.top + last.rect.bottom)) / 2),
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
