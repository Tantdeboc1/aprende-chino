// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import i18n from '@/i18n.js';

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
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-white mb-2">{i18n.t('error_boundary_title')}</h1>
          <p className="text-gray-400 text-sm mb-6 max-w-sm">
            {this.state.error?.message || 'Error inesperado'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors"
          >
            {i18n.t('error_boundary_retry')}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
