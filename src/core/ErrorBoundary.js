import React from 'react'

export default class ErrorBoundary extends React.Component {

    state = { error: null }

    componentDidCatch(error) {
        this.setState({ error })
    }

    render() {

        const error = this.state.error || this.props.error

        if (error) {
            return (
                <div style={{
                    padding: '64px',
                    background: '#ffbebe',
                    color: '#630000',
                    height: '100vh'
                }}>
                    <h1>Возникла ошибка!</h1>
                    <pre>{error.stack || error.message || error}</pre>
                </div>
            )
        }

        return this.props.children
    }
}