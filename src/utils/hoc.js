import React, { Component } from 'react';

export default (WrappedComponent) => {
  return class withRef extends Component {
      static displayName = `withRef(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
      render() {
        // 这里重新定义一个props的原因是:
        // 你直接去修改this.props.ref在react开发模式下会报错，不允许你去修改
        const props = {
          ...this.props,
        };
        const { getInstance } = props;
        if (typeof getInstance === 'function') {
          // 在这里把getInstance赋值给ref，
          // 传给`WrappedComponent`，这样就getInstance能获取到`WrappedComponent`实例
          props.ref = getInstance;
        }
        return (
          <WrappedComponent {...props} />
        );
      }
  };
};
