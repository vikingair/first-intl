// @flow

import { Spy } from 'spy4js';
import { _Intl, type Message } from './src/intl';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';

expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));

Enzyme.configure({ adapter: new Adapter() });

const oldDescribe = describe;
window.describe = (string, func) =>
    oldDescribe(string, () => {
        afterEach(Spy.restoreAll);
        return func();
    });

// make your tests fail immediately on encountered errors
_Intl.trackOrLog = (str: string) => {
    throw new Error(str);
};
// make all validations and render an informative string that does not contain translations
_Intl.func = (msg: Message, renderFunc?: React$Node => React$Node = s => s): React$Node => {
    // make all the validations
    _Intl.internal(msg, renderFunc);
    // return rendered message without translated content (for stable test snapshots)
    return renderFunc(`__({ id: '${msg.id}'${msg.values ? ', values: ' + JSON.stringify(msg.values) : ''} })`);
};
