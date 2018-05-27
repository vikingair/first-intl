// @flow

// declare the types globally (also inside your eslint config) to enhance developer speed
declare type Message = { id: string, values?: { [string]: string } }; // eslint-disable-line
declare function __(msg: Message, renderFunc?: (string) => React$Node): React$Node; // eslint-disable-line

// some other types (required to flow type the tests)
declare function expect(arg: any): any;
declare function describe(msg: string, func: Function): void;
declare function it(msg: string, func: Function): void;
declare function afterEach(func: Function): void;
declare function beforeEach(func: Function): void;
