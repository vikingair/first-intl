[![GitHub license][license-image]][license-url]
[![Travis][build-image]][build-url]
[![GitHub Push][push-image]][push-url]
[![Coverage Status][coveralls-image]][coveralls-url]

# first-intl
First intl setup you should make (for *React*).

### Introduction
There are many things you should consider when you set up a frontend
for production. One of these is **internationalization**. But, most of
the cases you might think:
- Can I add it later without losing resources?
- What will be the benefits?
- Will adding that framework add much complexity?
- Becomes automatic testing even harder?

Therefore, I want to answer the above questions regarding `first-intl`.

1) You should not wait to add `first-intl`. It is easier to extend your
   translations while developing than adding all those translations afterwards.

2) You will benefit from more *readable* and *robust* source **and** test code.

3) In comparison to other frameworks `first-intl` will increase the
   overall complexity very slightly.

4) Your tests wouldn't change at all. But you should consider to
   add some lines to your test configuration that will make your
   tests more readable and robust. Since your tests would only rely
   on message keys instead of whole translations.

### Installation
##### With pnpm
```
pnpm add first-intl
```
##### With yarn
```
yarn add first-intl
```
##### With npm
```
npm install --save first-intl
```

## Usage
First let's define some translations inside a [json file](https://github.com/fdc-viktor-luft/first-intl/blob/master/src/intl-default.json)
like so:
```json
{
  "header.logo.alt": "Welcome Logo",
  "footer.navigation.home": "Home",
  "account.back": "Revoke submission",
  "account.remove": "Delete account",
  "account.remove.info": "After deleting your account for {email}, you will be consequently distrusted.",
}
```
Then your code for any [component](https://github.com/fdc-viktor-luft/first-intl/blob/master/tests/examples/App.tsx) would look like:
```tsx
import { __, addIntlData } from 'first-intl';
import intlJson from './path/to/intl.json';

// first the required translations
// usually you would add your base translations inside the index.js
// but that is up to you
addIntlData(intlJson);

// you are ready to go
export const App = () => (
    <div>
        <header><img src="/path/to/img" alt={__string('header.logo.alt')} /></header>
        <main>
            <button>{__('account.remove')}</button>
            {__({ id: 'account.remove.info', values: { email: 'my.example@mail.com' } }, info => <p>{info}</p>)}
        </main>
        <footer>
            <a href="/path/to/home">{__('footer.navigation.home')}</a>
        </footer>
    </div>
);
```
To render directly strings which is required when you want to insert
translations inside HTML attributes like "alt" or "placeholder" etc. you
may also take the following function which basically ensures that you'll
receive a string.
```tsx
export const Header = () => (
    <header><img src="/path/to/img" alt={__string('header.logo.alt')} />)</header>
);
```
You can additionally customize some internal behaviour by calling `configure`:
```tsx
import { configure } from 'first-intl';

// this is actually the default tracker
// you can track those error occurrences at your backend
// it is absolutely recommended to NOT ignore but fix those errors
// see further below for more detailed information
const myTracker = (errorDescription: string): void =>
                    window.console.error(errorDescription);

// this will replace the whole currently used intl data
const myIntlData = { 'abort': 'ματαίωση' };

// this will replace the default renderer which will be used if
// you use "__" without custom renderer 
const myRenderer: (contents: string | React.ReactNode[]) => React.ReactNode = `<<YOUR_IMPLEMENTATION>>`;

// left keys won't affect your current configuration
configure({
    tracker: myTracker,
    intlData: myIntlData,
    renderer: myRenderer,
})
```
The last thing to mention for production is the configured tracker.
By default the dev console will display error occurrences. But you can
configure whatever tracker you'd like. I recommend to track those occurrences
to see if any of your users are encountering those errors.

What kind of errors will be tracked?
- If the provided key does not belong to any message in your current intl data.
  ('No translation for key: foo.bar')
- If you've specified values although the message do not use any placeholders.
  ('Ignoring specified values for: foo.bar')
- If you've specified more placeholders than necessary.
  ('Redundant placeholders for: foo.bar')
- If you've specified to few placeholders.
  ('Missing placeholder "phone" for: entered.phone')

## Testing
For testing, I recommend to overwrite the behaviour of the intl function for all tests, inside
your [setupTests.js](https://github.com/fdc-viktor-luft/first-intl/blob/master/tests/setupTests-intl.ts)
```js
import intlData from './your/intl-data.json';
import { __internal, configure, type Message } from 'first-intl';

// make your tests fail if they would produce any intl errors
configure({
    tracker: (str: string) => {
        throw new Error(str);
    },
    intlData,
});
// make all validations and render an informative string that does not contain translations
const oldRender = __internal.render;
__internal.render = (msg: Message | string, renderer: (arg: any) => any = (s) => s): any => {
    // make all the validations
    oldRender(msg, renderer);
    // return rendered message without translated content (for stable test snapshots and assertions)
    // you may use other serializers than "JSON.stringify" but for the start it is sufficient
    return renderer(
        typeof msg === 'string'
            ? `__('${msg}')`
            : `__({ id: '${msg.id}'${msg.values ? ', values: ' + JSON.stringify(msg.values) : ''} })`
    );
};
```

## Comparisons (Pro/Con)
The made comparison is related to `react-intl`. You'll benefit from more
development comfort and do not have to adjust your testing behaviour dramatically.
You can access even translations as strings easily. You are flexible in adding
new translations dynamically and are able to override existing translations
in favor to some switched language. It seems almost perfect to consider
`first-intl` **BUT** you are not anymore able to switch all messages without
losing internal state of your React tree. This is the single most important aspect
why `react-intl` and other alike frameworks are that complex. To switch all messages
with `first-intl` and let your current UI take effect, you'd possibly need to change
a "key" property at your highest component in the tree that contains all translations.
This will destroy your current internal state and let's React rerender everything.

But I never had that requirement. It was always fine to lose your current state if the user
switches the desired language. Most sites even deliver statically different content with even different
URLs for different languages.

`first-intl` being that minimalistic also misses functionality to translate e.g. dates
for the end user. You'd have to implement your own or install further packages to handle
this for you.

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/fdc-viktor-luft/first-intl/blob/master/LICENSE
[push-image]: https://github.com/fdc-viktor-luft/first-intl/actions/workflows/push.yml/badge.svg
[push-url]: https://github.com/fdc-viktor-luft/first-intl/actions/workflows/push.yml
[coveralls-image]: https://coveralls.io/repos/github/fdc-viktor-luft/first-intl/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/fdc-viktor-luft/first-intl?branch=master
