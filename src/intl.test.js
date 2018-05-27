// @flow

import React from 'react';
import { Spy } from 'spy4js';
import { _Intl } from './intl';
import intlData from './intl-default.json';

describe('Internationalization - Tool', () => {
    intlData['test.key.1'] = 'Some message';
    intlData['test.key.2'] = 'My {test} message with {custom} placeholders.';
    let errorSpy = new Spy();

    beforeEach(() => {
        errorSpy = Spy.on(_Intl, 'trackOrLog');
    });

    it('tracks an error', () => {
        window.console.error = new Spy('errorLog');
        _Intl._trackOrLog('myMessage');
        window.console.error.wasCalledWith('myMessage');
    });

    it('logs an error for invalid key', () => {
        expect(_Intl.func({ id: 'foo' })).toEqual(<span>foo</span>);
        errorSpy.wasCalledWith('No translation for key: foo');
    });

    it('logs an error for unnecessary values', () => {
        expect(_Intl.func({ id: 'test.key.1', values: { bar: 'asd' } })).toEqual(<span>Some message</span>);
        errorSpy.wasCalledWith('Redundant or missing placeholders for: test.key.1');

        errorSpy.reset();
        expect(_Intl.func({ id: 'test.key.2', values: { test: 'nice', custom: 'my', what: 'else' } })).toEqual(
            <span>My nice message with my placeholders.</span>
        );
        errorSpy.wasCalledWith('Redundant or missing placeholders for: test.key.2');
    });

    it('logs an error if message contains unfilled placeholders', () => {
        expect(_Intl.func({ id: 'test.key.2' })).toEqual(
            <span>{'My {test} message with {custom} placeholders.'}</span>
        );
        errorSpy.wasCalledWith('Unfilled placeholders within: test.key.2');

        errorSpy.reset();
        expect(_Intl.func({ id: 'test.key.2', values: { custom: 'my' } })).toEqual(
            <span>{'My {test} message with my placeholders.'}</span>
        );
        errorSpy.wasCalledWith('Unfilled placeholders within: test.key.2');
    });

    it('logs no error if message was valid', () => {
        expect(_Intl.func({ id: 'test.key.1' })).toEqual(<span>Some message</span>);
        errorSpy.wasNotCalled();

        expect(_Intl.func({ id: 'test.key.2', values: { test: 'nice', custom: 'my' } })).toEqual(
            <span>My nice message with my placeholders.</span>
        );
        errorSpy.wasNotCalled();
    });
});
