// @flow

import React, { Component } from 'react';

export class App extends Component<{}> {
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
