import { Component, type ErrorInfo, type ReactNode } from "react"

type Props = {
    children: ReactNode
}

type State = {
    error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null }

    static getDerivedStateFromError(error: Error): State {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Unhandled UI error", error, info)
    }

    render() {
        if (this.state.error) {
            return (
                <div className="content error-boundary" role="alert">
                    <h1>Something went wrong</h1>
                    <p>{this.state.error.message || "An unexpected error occurred."}</p>
                    <p>
                        <a href="/">Back to home</a>
                        <button type="button" onClick={() => window.location.reload()}>
                            Reload
                        </button>
                    </p>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
