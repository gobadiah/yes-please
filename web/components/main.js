import React from 'react';
import {
  oneOfType,
  element,
  arrayOf,
} from 'prop-types';

// eslint-disable-next-line no-unused-vars
import * as styles from '../styles';

class Main extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}

Main.propTypes = {
  children: oneOfType([
    element,
    arrayOf(element),
  ]).isRequired,
};

export default Main;
