import React, { Fragment } from 'react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Spy } from 'spy4js';
import { __, __string, addIntlData, configure } from '../src';

addIntlData({
    'test.key.1': 'Some message',
    'test.key.2': 'My {test} message with {custom} placeholders.',
    'test.key.3': 'My text: {br} with some br-Tags: {br}. Interesting? - Use React-Components {foo} or strings {bar}',
});

describe('Default Tracker', () => {
    const oldConsoleError = window.console.error;
    afterEach(() => {
        window.console.error = oldConsoleError;
    });
    it('logs an error', () => {
        const logSpy = Spy('console.error');
        window.console.error = logSpy;
        expect(__({ id: 'foo' })).toEqual('foo');
        logSpy.hasCallHistory('No translation for key: foo');
    });
});

describe('Internationalization - Tool', () => {
    const tracker = Spy('tracker');

    beforeAll(() => {
        configure({ tracker });
    });

    it('logs an error for invalid key', () => {
        expect(__({ id: 'foo' })).toEqual('foo');
        tracker.wasCalledWith('No translation for key: foo');
    });

    it('logs an error for unnecessary values', () => {
        expect(__({ id: 'test.key.1', values: { bar: 'asd' } })).toEqual('Some message');
        tracker.wasCalledWith('Ignoring specified values for: test.key.1');

        tracker.reset();
        expect(__({ id: 'test.key.2', values: { test: 'nice', custom: 'my', what: 'else' } })).toBe(
            'My nice message with my placeholders.'
        );
        tracker.wasCalledWith('Redundant placeholders for: test.key.2');
    });

    it('logs an error if message contains unfilled placeholders', () => {
        expect(__({ id: 'test.key.2' })).toBe('My {test} message with {custom} placeholders.');
        tracker.hasCallHistory(
            'Missing placeholder "test" for: test.key.2',
            'Missing placeholder "custom" for: test.key.2'
        );

        tracker.reset();
        expect(__({ id: 'test.key.2', values: { custom: 'my' } })).toBe('My {test} message with my placeholders.');
        tracker.hasCallHistory('Missing placeholder "test" for: test.key.2');
    });

    it('logs no error if message was valid', () => {
        expect(__({ id: 'test.key.1' })).toBe('Some message');
        tracker.wasNotCalled();

        expect(__({ id: 'test.key.2', values: { test: <strong>nice</strong>, custom: 'my' } })).toEqual(
            <Fragment>
                {[
                    <Fragment key={0}>My </Fragment>,
                    <Fragment key={1}>
                        <strong>nice</strong>
                    </Fragment>,
                    <Fragment key={2}> message with </Fragment>,
                    <Fragment key={3}>my</Fragment>,
                    <Fragment key={4}> placeholders.</Fragment>,
                ]}
            </Fragment>
        );
        tracker.wasNotCalled();
    });

    it('allows to simply supply strings for messages without placeholders', () => {
        expect(__('test.key.1')).toBe('Some message');
        tracker.wasNotCalled();

        expect(__('foo')).toBe('foo');
        tracker.wasCalledWith('No translation for key: foo');
    });

    it('logs no error if message contains duplicated placeholders', () => {
        expect(__({ id: 'test.key.3', values: { br: <br />, foo: <div>Test</div>, bar: 'blub' } })).toEqual(
            <Fragment>
                {[
                    <Fragment key={0}>My text: </Fragment>,
                    <Fragment key={1}>
                        <br />
                    </Fragment>,
                    <Fragment key={2}> with some br-Tags: </Fragment>,
                    <Fragment key={3}>
                        <br />
                    </Fragment>,
                    <Fragment key={4}>. Interesting? - Use React-Components </Fragment>,
                    <Fragment key={5}>
                        <div>Test</div>
                    </Fragment>,
                    <Fragment key={6}> or strings </Fragment>,
                    <Fragment key={7}>blub</Fragment>,
                ]}
            </Fragment>
        );
        tracker.wasNotCalled();
    });

    it('logs an error if number of distinct matches was smaller than provided placeholders', () => {
        __({ id: 'test.key.3', values: { br: <br />, foo: <div>Test</div>, bar: 'blub', test: 'it' } });
        tracker.wasCalledWith('Redundant placeholders for: test.key.3');
    });

    it('ensures to return strings if necessary', () => {
        expect(__string('test.key.1')).toBe('Some message');
        expect(__string({ id: 'test.key.2', values: { test: 1337, custom: 'my' } })).toBe(
            'My 1337 message with my placeholders.'
        );
        expect(__string({ id: 'test.key.2', values: { test: (<strong>nice</strong>) as any, custom: 'my' } })).toBe(
            'My [object Object] message with my placeholders.'
        );
        tracker.wasNotCalled();
    });
});
