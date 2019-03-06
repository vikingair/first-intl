// @flow

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';

// configure enzyme
Enzyme.configure({ adapter: new Adapter() });
// add snapshot serializer
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' })); // for enzyme wrapper
