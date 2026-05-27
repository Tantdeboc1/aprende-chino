// src/components/ErrorBoundary.jsx
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Silent in production — remove console.error if you have a logging service
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4ecdc] flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-[#1c1813] mb-2">Algo ha fallado</h1>
          <p className="text-[#928a76] text-sm mb-6 max-w-sm">
            {this.state.error?.message || 'Error inesperado'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 bg-[#c8392f] hover:bg-[#8b1f1a] text-[#fbf5e6] font-semibold rounded-xl transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
