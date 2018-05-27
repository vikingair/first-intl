// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

describe('App', () => {
    it('renders the App without translations, but all necessary information', () => {
        // see the "__snapshots__" directory within this directory to the see the rendered output
        expect(shallow(<App />)).toMatchSnapshot();
    });
});
