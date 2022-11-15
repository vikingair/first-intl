import '../setupTests-intl'; // this is something you could include into your regular test setup
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { App } from './App';

describe('App', () => {
    it('renders the App without translations, but all necessary information', () => {
        // see the "__snapshots__" directory within this directory to the see the rendered output
        expect(render(<App />).container.firstChild).toMatchSnapshot();
    });
});
