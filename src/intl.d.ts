
import { ReactNode } from 'react';

export type TypedMessageObj<T> = { id: string, values?: { [key: string]: T } };
export type StringMessageObj = TypedMessageObj<string | number>;
export type StringMessage = StringMessageObj | string;
export type MessageObj = TypedMessageObj<ReactNode>;
export type Message = MessageObj | string;

export const addIntlData: (data: { [messageKey: string]: string }) => void;

type Contents = string | ReactNode[];
type Renderer<T> = (contents: Contents) => T;
type ReactRenderer = Renderer<ReactNode>;
type IntlData = { [messageKey: string]: string };
type Tracker = (description: string) => void;
type Config = { tracker: Tracker, intlData: IntlData, renderer: ReactRenderer };
export const configure: (config: Partial<Config>) => void;

type InternalRender = <T>(msg: Message, renderer: Renderer<T>) => T;

export const __internal: { render: InternalRender };

export const __: (msg: Message, renderer?: ReactRenderer) => ReactNode;
export const __string: (msg: StringMessage, renderer?: Renderer<string>) => string;
