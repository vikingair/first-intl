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


WIP: Further instructions will follow...

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/fdc-viktor-luft/first-intl/blob/master/LICENSE
[build-image]: https://img.shields.io/travis/fdc-viktor-luft/first-intl/master.svg?style=flat-square
[build-url]: https://travis-ci.org/fdc-viktor-luft/first-intl
[prettier-image]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier-url]: https://github.com/prettier/prettier
