import * as React from 'react';

export type Props = {};

/**
 * This is the entry point of a plugin.
 * Here you can add react-router, react-redux, etc..
 *
 * @todo Add more documentation for this component
 *
 * @warning :: Root component for a plugin should always extend React.Component
 * @warning :: Always use default export
 */

export default class App extends React.Component<Props> {
    state: { hasErrors: boolean }
    constructor(props: Props) {
        super(props);
        this.state = {
            hasErrors: false
        }
    }
    componentDidCatch(err: Error, info: React.ErrorInfo) {
        this.setState({
            hasErrors: true
        });
        console.error(err, info);
    }
    render() {
        if (this.state.hasErrors) {
            return (
                <div>Oh no, something went wrong in {'{{name}}'}</div>
            );
        }
        return (
            <div>My first plugin!</div>
        );
    }
};