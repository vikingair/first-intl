import React, { Fragment } from 'react';

export type TypedMessageObj<T> = { id: string; values?: { [key: string]: T } };
export type StringMessageObj = TypedMessageObj<string | number>;
export type StringMessage = StringMessageObj | string;
export type MessageObj = TypedMessageObj<React.ReactNode>;
export type Message = MessageObj | string;

type Contents = string | React.ReactNode[];
type Renderer<T> = (contents: Contents) => T;
type ReactRenderer = Renderer<React.ReactNode>;
type IntlData = { [messageKey: string]: string };
type Tracker = (description: string) => void;
type Config = { tracker: Tracker; intlData: IntlData; renderer: ReactRenderer };

const defaultRenderer: ReactRenderer = (contents) =>
    typeof contents === 'string' ? (
        contents
    ) : (
        <Fragment>
            {contents.map((v, k) => (
                <Fragment key={k}>{v}</Fragment>
            ))}
        </Fragment>
    );

const stringRenderer: Renderer<string> = (contents) =>
    typeof contents === 'string' ? contents : contents.map(String).join('');

const CONFIG: Config = {
    tracker: (s) => window.console.error(s),
    intlData: {},
    renderer: defaultRenderer,
};

export const addIntlData = (data: IntlData) => {
    CONFIG.intlData = { ...CONFIG.intlData, ...data };
};

export const configure = (config: Partial<Config>): void =>
    Object.keys(config).forEach((key: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (CONFIG as any)[key] = config[key as keyof Config];
    });

const destructure = (raw: string, msg: MessageObj): Contents => {
    const { id, values } = msg;

    const matches = raw.match(/{[a-z]+}/gi);
    if (!matches) {
        if (values) CONFIG.tracker('Ignoring specified values for: ' + id);
        return raw;
    }

    let toProcess = raw;
    const result = [];
    const used: string[] = [];
    const phValues = values || {};
    matches.forEach((ph) => {
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

    if (result.every((v) => typeof v === 'number' || typeof v === 'string')) {
        return result.join('');
    }

    return result;
};

const render = <T,>(msg: Message, renderer: Renderer<T>): T => {
    const m = typeof msg === 'string' ? { id: msg } : msg;
    const raw = CONFIG.intlData[m.id];
    if (!raw) {
        CONFIG.tracker('No translation for key: ' + m.id);
        return renderer(m.id);
    }
    return renderer(destructure(raw, m));
};

export const __internal = { render };

export const __ = (msg: Message, renderer: ReactRenderer = CONFIG.renderer): React.ReactNode =>
    __internal.render<React.ReactNode>(msg, renderer);

export const __string = (msg: StringMessage, renderer: Renderer<string> = stringRenderer): string =>
    __internal.render<string>(msg, renderer);
