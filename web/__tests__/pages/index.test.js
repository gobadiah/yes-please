import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Index from '../../pages';

import Main from '../../components/main';
import { FlexColumnCenter } from '../../components/styled';

describe('Index page', () => {
  it('should have a Main component as root', () => {
    const index = shallow(<Index />);
    expect(index.children).toHaveLength(1);
    expect(index.type()).toBe(Main);
    expect(index.childAt(0).type()).toBe(FlexColumnCenter);
  });

  it('should match snapshot', () => {
    const index = renderer.create(<Index />);
    const tree = index.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
