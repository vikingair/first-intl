// @flow

import React, { Fragment } from 'react';

export type TypedMessage<T> = { id: string, values?: { [string]: T } };
export type StringMessage = TypedMessage<string | number>;
export type Message = TypedMessage<React$Node>;
type Contents = string | React$Node[];
type Renderer<T> = (contents: Contents) => T;
type ReactRenderer = Renderer<React$Node>;

const defaultRenderer: ReactRenderer = contents =>
    typeof contents === 'string' ? (
        contents
    ) : (
        <Fragment>
            {contents.map((v, k) => (
                <Fragment key={k}>{v}</Fragment>
            ))}
        </Fragment>
    );

const stringRenderer: Renderer<string> = contents =>
    typeof contents === 'string' ? contents : contents.map(String).join('');

type IntlData = { [string]: string };
type Tracker = (description: string) => void;
type Config = {| tracker: Tracker, intlData: IntlData, renderer: ReactRenderer |};
const CONFIG: Config = {
    tracker: s => window.console.error(s),
    intlData: ({}: Object),
    renderer: defaultRenderer,
};

export const addIntlData = (data: { [string]: string }) => {
    CONFIG.intlData = { ...CONFIG.intlData, ...data };
};

export const configure = (config: $Shape<Config>): void =>
    Object.keys(config).forEach((key: string) => {
        CONFIG[key] = config[key];
    });

const destructure = (raw: string, msg: Message): Contents => {
    const { id, values } = msg;

    const matches = raw.match(/{[a-z]+}/gi);
    if (!matches) {
        if (values) CONFIG.tracker('Ignoring specified values for: ' + id);
        return raw;
    }

    let toProcess = raw;
    const result = [];
    const used = [];
    const phValues = values || {};
    matches.forEach(ph => {
        const phIndex = toProcess.indexOf(ph);
        const key = ph.slice(1, -1);
        const value = phValues[key];
        used.indexOf(key) === -1 && used.push(key);

        result.push(toProcess.substr(0, phIndex));
        if (value !== undefined) {
            result.push(value);
        } else {
            result.push(ph);
            CONFIG.tracker(`Missing placeholder "${key}" for: ${id}`);
        }
        toProcess = toProcess.substr(phIndex + ph.length);
    });
    toProcess && result.push(toProcess);

    if (used.length < Object.keys(phValues).length) {
        CONFIG.tracker('Redundant placeholders for: ' + id);
    }

    if (result.every(v => typeof v === 'number' || typeof v === 'string')) {
        return result.join('');
    }

    return result;
};

const render = <T>(msg: Message | string, renderer: Renderer<T>): T => {
    const m = typeof msg === 'string' ? { id: msg } : msg;
    const raw = CONFIG.intlData[m.id];
    if (!raw) {
        CONFIG.tracker('No translation for key: ' + m.id);
        return renderer(m.id);
    }
    return renderer(destructure(raw, m));
};

export const __internal = { render };

export const __ = (msg: Message | string, renderer?: ReactRenderer = CONFIG.renderer): React$Node =>
    __internal.render<React$Node>(msg, renderer);

export const __string = (msg: StringMessage | string, renderer?: Renderer<string> = stringRenderer): string =>
    __internal.render<string>(msg, renderer);
