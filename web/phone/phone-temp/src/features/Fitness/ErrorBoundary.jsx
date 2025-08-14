import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
  if (this.state.hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-6">
        <div className="w-full max-w-sm bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 shadow text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">Something went wrong.</h2>
          <p className="text-sm text-gray-300">
            The app encountered an unexpected error. You can try reloading or report the issue.
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium"
            >
              🔄 Reload App
            </button>

            <a
              href="mailto:support@fuznex.com?subject=Bug Report"
              className="text-xs text-purple-400 hover:underline"
            >
              🐞 Report a bug
            </a>

            <button
              onClick={() => this.setState({ showDetails: !this.state.showDetails })}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              {this.state.showDetails ? "Hide error details" : "Show error details"}
            </button>
          </div>

          {this.state.showDetails && (
            <div className="text-left text-xs text-red-300 bg-[#2a2a2a] p-2 rounded overflow-auto max-h-40">
              <pre className="whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return this.props.children;
}


}

export default ErrorBoundary;
