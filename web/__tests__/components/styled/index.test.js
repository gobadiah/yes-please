import React from 'react';
import renderer from 'react-test-renderer';

import {
  Flex,
  FlexColumn,
} from '../../../components/styled';

describe('Styled components', () => {
  describe('Flex', () => {
    it('should match snapshot', () => {
      const component = renderer.create(<Flex />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('FlexColumn', () => {
    it('should match snapshot', () => {
      const component = renderer.create(<FlexColumn />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
