// @flow

import React, { Fragment } from 'react';
import intlData from './intl-default.json';

export type Message = { id: string, values?: { [string]: mixed } };

const trackOrLog = (str: string) => window.console.error(str);

const defaultRenderFunc = node => <Fragment>{node}</Fragment>;

const internal = (msg: Message, renderFunc?: React$Node => React$Node = defaultRenderFunc): React$Node => {
    const raw = intlData[msg.id];
    if (!raw) {
        _Intl.trackOrLog('No translation for key: ' + msg.id);
        return renderFunc(msg.id);
    }
    const keys = Object.keys(msg.values || {});
    const matches = numberOfMatches(raw);
    if (keys.length > matches) {
        _Intl.trackOrLog('Redundant placeholders for: ' + msg.id);
    }
    return matches ? renderFunc(processString(raw, msg)) : renderFunc(raw);
};

const numberOfMatches = (raw: string): number => {
    const result = [];
    (raw.match(/{[^}]*}/g) || []).forEach(v => {
        if (result.indexOf(v) === -1) result.push(v);
    });
    return result.length;
};

const processString = (raw: string, msg: Message): React$Node => {
    const values = msg.values || {};
    const rawStrings = raw.split(/{[a-zA-Z]+}/);
    let index = 0;
    let reactKey = 0;
    let result = [];
    for (let i = 0; i < rawStrings.length; i++) {
        const rawPart = rawStrings[i];
        result.push(rawPart);
        if (i === rawStrings.length - 1) continue;
        const remainder = raw.substring(index + rawPart.length);
        const indexOfClosingBrace = remainder.indexOf('}');
        const key = remainder.substring(1, indexOfClosingBrace);
        const value = values[key];
        if (value !== undefined) {
            result.push(<Fragment key={reactKey++}>{value}</Fragment>);
        } else {
            result.push(`{${key}}`);
            _Intl.trackOrLog(`Missing placeholder "${key}" for: ${msg.id}`);
        }
        index = index + rawPart.length + indexOfClosingBrace + 1;
    }
    return result;
};
export const _Intl = { func: internal, internal, trackOrLog, _trackOrLog: trackOrLog };
export const __ = (msg: Message, renderFunc?: React$Node => React$Node): React$Node => _Intl.func(msg, renderFunc);
