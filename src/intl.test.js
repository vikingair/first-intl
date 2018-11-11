// @flow

import React, { Fragment } from 'react';
import { Spy } from 'spy4js';
import { _Intl } from './intl';
import intlData from './intl-default.json';

const _Intl$Mock = Spy.mock(_Intl, 'trackOrLog');

describe('Internationalization - Tool', () => {
    intlData['test.key.1'] = 'Some message';
    intlData['test.key.2'] = 'My {test} message with {custom} placeholders.';
    intlData['test.key.3'] =
        'My text: {br} with some br-Tags: {br}. Interesting? -> Use React-Components {foo} or strings {bar}';

    it('tracks an error', () => {
        window.console.error = new Spy('errorLog');
        _Intl._trackOrLog('myMessage');
        window.console.error.wasCalledWith('myMessage');
    });

    it('logs an error for invalid key', () => {
        expect(_Intl.internal({ id: 'foo' })).toEqual(<Fragment>foo</Fragment>);
        _Intl$Mock.trackOrLog.wasCalledWith('No translation for key: foo');
    });

    it('logs an error for unnecessary values', () => {
        expect(_Intl.internal({ id: 'test.key.1', values: { bar: 'asd' } })).toEqual(<Fragment>Some message</Fragment>);
        _Intl$Mock.trackOrLog.wasCalledWith('Redundant placeholders for: test.key.1');

        _Intl$Mock.trackOrLog.reset();
        expect(_Intl.internal({ id: 'test.key.2', values: { test: 'nice', custom: 'my', what: 'else' } })).toEqual(
            <Fragment>
                {[
                    'My ',
                    <Fragment key={0}>nice</Fragment>,
                    ' message with ',
                    <Fragment key={1}>my</Fragment>,
                    ' placeholders.',
                ]}
            </Fragment>
        );
        _Intl$Mock.trackOrLog.wasCalledWith('Redundant placeholders for: test.key.2');
    });

    it('logs an error if message contains unfilled placeholders', () => {
        expect(_Intl.internal({ id: 'test.key.2' })).toEqual(
            <Fragment>{['My ', '{test}', ' message with ', '{custom}', ' placeholders.']}</Fragment>
        );
        _Intl$Mock.trackOrLog.hasCallHistory(
            'Missing placeholder "test" for: test.key.2',
            'Missing placeholder "custom" for: test.key.2'
        );

        _Intl$Mock.trackOrLog.reset();
        expect(_Intl.internal({ id: 'test.key.2', values: { custom: 'my' } })).toEqual(
            <Fragment>
                {['My ', '{test}', ' message with ', <Fragment key={0}>my</Fragment>, ' placeholders.']}
            </Fragment>
        );
        _Intl$Mock.trackOrLog.hasCallHistory('Missing placeholder "test" for: test.key.2');
    });

    it('logs no error if message was valid', () => {
        expect(_Intl.internal({ id: 'test.key.1' })).toEqual(<Fragment>Some message</Fragment>);
        _Intl$Mock.trackOrLog.wasNotCalled();

        expect(_Intl.internal({ id: 'test.key.2', values: { test: 'nice', custom: 'my' } })).toEqual(
            <Fragment>
                {[
                    'My ',
                    <Fragment key={0}>nice</Fragment>,
                    ' message with ',
                    <Fragment key={1}>my</Fragment>,
                    ' placeholders.',
                ]}
            </Fragment>
        );
        _Intl$Mock.trackOrLog.wasNotCalled();
    });

    it('logs no error if message contains duplicated placeholders', () => {
        expect(_Intl.internal({ id: 'test.key.3', values: { br: <br />, foo: <div>Test</div>, bar: 'blub' } })).toEqual(
            <Fragment>
                {[
                    'My text: ',
                    <Fragment key={0}>
                        <br />
                    </Fragment>,
                    ' with some br-Tags: ',
                    <Fragment key={1}>
                        <br />
                    </Fragment>,
                    '. Interesting? -> Use React-Components ',
                    <Fragment key={2}>
                        <div>Test</div>
                    </Fragment>,
                    ' or strings ',
                    <Fragment key={3}>blub</Fragment>,
                    '',
                ]}
            </Fragment>
        );
        _Intl$Mock.trackOrLog.wasNotCalled();
    });

    it('logs an error if number of distinct matches was smaller than provided placeholders', () => {
        _Intl.internal({ id: 'test.key.3', values: { br: <br />, foo: <div>Test</div>, bar: 'blub', test: 'it' } });
        _Intl$Mock.trackOrLog.wasCalledWith('Redundant placeholders for: test.key.3');
    });
});
