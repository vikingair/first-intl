// @flow

import React from 'react';
import { __, __string, addIntlData } from '../../src/intl';
import intlData from './intl-default.json';

addIntlData(intlData);

export const App = () => (
    <div>
        <header>
            {__('header.logo.alt', alt => (
                <img src="/path/to/img" alt={alt} />
            ))}
        </header>
        <main>
            <button>{__('account.remove')}</button>
            {__({ id: 'account.remove.info', values: { email: 'my.example@mail.com' } }, info => (
                <p>{info}</p>
            ))}
            {__({
                id: 'account.tac.text',
                values: {
                    tac: <a href="/path/to/tac">{__({ id: 'account.tac' })}</a>,
                    info: __({ id: 'account.tac.info' }),
                    br: <br />,
                },
            })}
        </main>
        <footer>
            <a href="/path/to/home">{__({ id: 'footer.navigation.home' })}</a>
            <img src="/path/to/img-footer" alt={__string('footer.logo.alt')} />
        </footer>
    </div>
);
