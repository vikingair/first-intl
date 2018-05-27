// @flow

import React from 'react';
import intlData from './intl-default.json';

const trackOrLog = (str: string) => window.console.error(str);

const defaultRenderFunc = str => <span>{str}</span>;

const intlFunc = (msg: Message, renderFunc?: string => React$Node = defaultRenderFunc): React$Node => {
    const raw = intlData[msg.id];
    if (!raw) {
        _Intl.trackOrLog('No translation for key: ' + msg.id);
        return renderFunc(msg.id);
    }
    const values = msg.values;
    let result = raw;
    if (values) {
        const keys = Object.keys(values);
        const matches = result.match(/{[^}]*}/g);
        if (!matches || keys.length !== matches.length) {
            _Intl.trackOrLog('Redundant or missing placeholders for: ' + msg.id);
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            result = result.replace(`{${key}}`, values[key]);
        }
    }
    if (result.search(/{.*}/g) !== -1) {
        _Intl.trackOrLog('Unfilled placeholders within: ' + msg.id);
    }
    return renderFunc(result);
};
// make "__" accessible everywhere to enhance developer speed
// you could also simply export-import it as module each time,
// but than you have to handle the test mocking yourself
window.__ = intlFunc;
export const _Intl = { func: intlFunc, trackOrLog, _trackOrLog: trackOrLog };
