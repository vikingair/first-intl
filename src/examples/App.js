// @flow

import React, { Component } from 'react';
import { __ } from '../intl';

export class App extends Component<{}> {
    render() {
        return (
            <div>
                <header>{__({ id: 'header.logo.alt' }, alt => <img src="/path/to/img" alt={alt} />)}</header>
                <main>
                    <button>{__({ id: 'account.remove' })}</button>
                    {__({ id: 'account.remove.info', values: { email: 'my.example@mail.com' } }, info => <p>{info}</p>)}
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
                </footer>
            </div>
        );
    }
}
