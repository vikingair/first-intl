[![GitHub license][license-image]][license-url]
[![Travis][build-image]][build-url]
[![styled with prettier][prettier-image]][prettier-url]

# first-intl
First intl setup you should make.

The intention of this repository is to give a guideline
for internationalization setup on modern javascript applications.

You should read on if:
- you are struggeling with the decision which framework to use.
- you are annoyed by test mocking and the overall complexity overhead
- you want a stable solution, which prevents your tests from breakage
- you simply want to start and do not want to lose the opertunity to
  implement any internationalization framework afterwards
- you want to better handle errors
- you want flow typing

If at least one of the points matched your needs, you should consider
the idea herein. First of all: By following the instructions you will
get:
- Failing tests if your default messages are missing keys or
  any placeholders were not correctly used
- Your bundle-size will enlarge at most by **1 kB**
- Your tests will check your default message, but won't use them to
  render any translations into your snapshots (or component output)
- You may apply tracking to prevent missing messages to occur on
  production system
- You can switch any internationalization framework as soon as
  necessary with very low overhead

## The idea
The basic concept is the following: You wrap your translations inside
another function, which handles everything else for you. That simple!

How does it look in your production code? You got somewhere your translations
inside a [json file](https://github.com/fdc-viktor-luft/first-intl/blob/master/src/intl-default.json)
like so:
```json
{
  "header.logo.alt": "Welcome Logo",
  "footer.navigation.home": "Home",
  "footer.navigation.settings": "Settings",
  "footer.navigation.info": "Information",
  "footer.navigation.shop": "Shopping",
  "account.back": "Revoke submission",
  "account.remove": "Delete account",
  "account.remove.info": "After deleting your account for {email}, you will be consequently distrusted.",
  "account.submit": "Register now!"
}
```
On the other hand you code your [App](https://github.com/fdc-viktor-luft/first-intl/blob/master/src/examples/App.js)
```js
export class App extends React.Component<{}> {
    render() {
        return (
            <div>
                <header>{__({ id: 'header.logo.alt' }, alt => <img src="/path/to/img" alt={alt} />)}</header>
                <main>
                    <button>{__({ id: 'account.remove' })}</button>
                    {__({ id: 'account.remove.info', values: { email: 'my.example@mail.com' } }, info => <p>{info}</p>)}
                </main>
                <footer>
                    <a href="/path/to/home">{__({ id: 'footer.navigation.home' })}</a>
                </footer>
            </div>
        );
    }
}
```
Your [snapshot](https://github.com/fdc-viktor-luft/first-intl/blob/master/src/examples/__snapshots__/App.test.js.snap)
of this app will look like:
```
<div>
  <header>
    <img
      alt="__({ id: 'header.logo.alt' })"
      src="/path/to/img"
    />
  </header>
  <main>
    <button>
      __({ id: 'account.remove' })
    </button>
    <p>
      __({ id: 'account.remove.info', values: {"email":"my.example@mail.com"} })
    </p>
  </main>
  <footer>
    <a
      href="/path/to/home"
    >
      __({ id: 'footer.navigation.home' })
    </a>
  </footer>
</div>
```

## Setup
Copy the [intl.js](https://github.com/fdc-viktor-luft/first-intl/blob/master/src/intl.js)
(if you like together with its test) into your src. Modify it to your custom needs.

#### Flow
Extend or create your custom [flow lib](https://github.com/fdc-viktor-luft/first-intl/blob/master/flow-typed/custom-types.js)
js-File with the following declarations.
```js
declare type Message = { id: string, values?: { [string]: string } }; // eslint-disable-line
declare function __(msg: Message, renderFunc?: (string) => React$Node): React$Node; // eslint-disable-line
```
Do not forget to point within your [.flowconfig](https://github.com/fdc-viktor-luft/first-intl/blob/master/.flowconfig)
at section `[libs]` to this js-File.

#### Eslint
Add the required globals to your eslint config.
```json
"globals": {
    "__": true,
    "Message": true
}
```

#### Jest
Overwrite the behaviour of the intl function for all tests, inside
your [setupTests.js](https://github.com/fdc-viktor-luft/first-intl/blob/master/setupTests.js)
```js
// make your tests fail immediately on encountered errors
_Intl.trackOrLog = (str: string) => {
    throw new Error(str);
};
// make all validations and render an informative string that does not contain translations
window.__ = (msg: Message, renderFunc?: string => React$Node = s => s): React$Node => {
    // make all the validations
    _Intl.func(msg, renderFunc);
    // return rendered message without translated content (for stable test snapshots)
    return renderFunc(`__({ id: '${msg.id}'${msg.values ? ', values: ' + JSON.stringify(msg.values) : ''} })`);
};
```

#### Without React
Just modify return types of the intl func and provide another default
renderer.

## Rules
It is **very important** to differentiate between the message business value
and its translation. To enforce this, the intl func returns a
`React$Node` instead of a simple `string`. Also I defined the type
`Message` for the busines value. The business value should be used as
long as possible. It holds all relevant information to call the intl
func and render the translation. The translation should be done only
if you want to display it. There is no need to make any of your translations
inside a validator or store them inside your redux store or whatever else.

This is the key aspect, why it will be no pain to migrate any other
full internationalization framework, e.g.
[react-intl](https://github.com/yahoo/react-intl) or
[i18next](https://www.i18next.com) especially for react
[react-i18next](https://github.com/i18next/react-i18next).

## Migrate to full intl
You should migrate to a full internationalization framework as soon as
you have to compute translations for more than one language.
To migrate you only need to modify the intl func in the following way.
Before:
```js
const intlFunc = (msg: Message, renderFunc?: string => React$Node = defaultRenderFunc): React$Node => {
    (...)
    return renderFunc(result);
```
After (`react-intl`):
```js
import { FormattedMessage } from 'react-intl';

const intlFunc = (msg: Message, renderFunc?: string => React$Node = defaultRenderFunc): React$Node => {
    (...) // all validations will still be made, but FormattedMessage takes care to translate and update
    return <FormattedMessage {...msg}>{renderFunc}</FormattedMessage>;
```
After (`react-i18next`):
```js
import { Trans } from 'react-i18next';

const intlFunc = (msg: Message, renderFunc: void => React$Node): React$Node => {
    (...) // all validations will still be made, but FormattedMessage takes care to translate and update
    return <Trans i18nKey={msg.id}>{renderFunc()}</Trans>;
```
For `react-i18next` there are mulitple other solutions. You might want to use `I18n`-Tag instead.
For more information see into their [documentaion](https://react.i18next.com).

## Future
- I will possibly provide a method to wrap multiple translations into a single render func.
- If I find a more convinient and general solution with the possibility for good configuration **and**
  very small bundle size, I might add an extra npm package.
- I might add more complete documentation for migrating to different intl frameworks.

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/fdc-viktor-luft/first-intl/blob/master/LICENSE
[build-image]: https://img.shields.io/travis/fdc-viktor-luft/first-intl/master.svg?style=flat-square
[build-url]: https://travis-ci.org/fdc-viktor-luft/first-intl
[prettier-image]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier-url]: https://github.com/prettier/prettier
