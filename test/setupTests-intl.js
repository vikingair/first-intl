// @flow
// make your tests fail immediately on encountered errors
import { __internal, configure, type Message } from '../src/intl';
import { Serializer } from 'serialize-as-code';

// make your tests fail if they would produce any intl errors
configure({
    tracker: (str: string) => {
        throw new Error(str);
    },
});
// make all validations and render an informative string that does not contain translations
const oldRender = __internal.render;
__internal.render = (msg: Message | string, renderer?: any => any = s => s): any => {
    // make all the validations
    oldRender(msg, renderer);
    // return rendered message without translated content (for stable test snapshots)
    return renderer(
        typeof msg === 'string'
            ? `__('${msg}')`
            : `__({ id: '${msg.id}'${msg.values ? ', values: ' + Serializer.run(msg.values) : ''} })`
    );
};
