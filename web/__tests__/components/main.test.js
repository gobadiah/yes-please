import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Main from '../../components/main';

describe('Main component', () => {
  it('should allow for one child', () => {
    const main = shallow(<Main><span>Hello world</span></Main>);
    expect(main.find('span').text()).toEqual('Hello world');
  });

  it('should allow for multiple children', () => {
    const main = shallow(<Main><span>Hello</span><span>world</span></Main>);
    expect(main.find('span').length).toBe(2);
  });

  it('should match snapshot', () => {
    const component = renderer.create(<Main><span>Hello dude</span></Main>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
