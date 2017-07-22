import React, { Component } from "react";
import { findDOMNode } from "react-dom";

const easeInOutCubic = t =>
  (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);
const position = (start, end, elapsed, duration) =>
  (elapsed > duration
    ? end
    : start + (end - start) * easeInOutCubic(elapsed / duration));

export default class ScrollToBottom extends Component {
  componentWillUpdate() {
    const node = findDOMNode(this);

    this.shouldScrollBottom =
      node.scrollTop + node.offsetHeight >= node.scrollHeight - 50;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      this.scroll();
    }
  }

  scroll(duration = 500) {
    const node = findDOMNode(this);
    const clock = Date.now();
    const start = node.scrollTop;
    const end = node.scrollHeight - node.offsetHeight + 50;

    const step = () => {
      const elapsed = Date.now() - clock;

      node.scrollTop = position(start, end, elapsed, duration);

      if (elapsed <= duration) requestAnimationFrame(step);
    };

    step();
  }

  componentDidMount() {
    this.scroll();
  }

  render() {
    const { className, children } = this.props;
    const style = {
      overflowY: "scroll",
      ...this.props.style
    };
    return (
      <div className={`scroll-to-bottom ${className}`} style={style}>
        {children}
      </div>
    );
  }
}
