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
inside a [json file][https://github.com/fdc-viktor-luft/first-intl/blob/master/src/intl-default.json]
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
On the other hand you code your [App][https://github.com/fdc-viktor-luft/first-intl/blob/master/src/examples/App.js]
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
Your [snapshot][https://github.com/fdc-viktor-luft/first-intl/blob/master/src/examples/__snapshots__/App.test.js.snap]
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
Copy the [intl.js][https://github.com/fdc-viktor-luft/first-intl/blob/master/src/intl.js]
(if you like together with its test) into your src. Modify it to your custom needs.

WIP: Further instructions will follow...

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/fdc-viktor-luft/first-intl/blob/master/LICENSE
[build-image]: https://img.shields.io/travis/fdc-viktor-luft/first-intl/master.svg?style=flat-square
[build-url]: https://travis-ci.org/fdc-viktor-luft/first-intl
[prettier-image]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier-url]: https://github.com/prettier/prettier
