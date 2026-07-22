// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import { captureError } from '@/utils/errorTracking.js';
import { isChunkLoadError, reloadForFreshBuild } from '@/utils/lazyWithRetry.js';
// Es un componente de clase (no hay hooks): usamos la instancia de i18n
// directamente, igual que AuthContext.
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
    // Reporta al servicio de error tracking (Sentry si hay DSN; si no, log en dev).
    captureError(error, { componentStack: info?.componentStack, boundary: 'ErrorBoundary' });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  // Un chunk que no carga NO se arregla reintentando el render: React.lazy
  // memoriza la promesa rechazada y la vuelve a lanzar igual. La única salida
  // es recargar para traer el index.html nuevo.
  handleReload = () => {
    if (!reloadForFreshBuild()) window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const staleBuild = isChunkLoadError(this.state.error);
      const t = i18n.t.bind(i18n);

      return (
        <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-4">{staleBuild ? '🔄' : '⚠️'}</div>
          <h1 className="text-xl font-bold text-[var(--ink)] mb-2">
            {staleBuild ? t('error_boundary_stale_title') : t('error_boundary_title')}
          </h1>
          <p className="text-[var(--mute)] text-sm mb-6 max-w-sm">
            {staleBuild
              ? t('error_boundary_stale_body')
              : (this.state.error?.message || t('error_boundary_unexpected'))}
          </p>
          <button
            onClick={staleBuild ? this.handleReload : this.handleReset}
            className="px-6 py-3 bg-[var(--red)] hover:bg-[var(--red-deep)] text-[var(--on-accent)] font-semibold rounded-xl transition-colors"
          >
            {staleBuild ? t('error_boundary_reload') : t('error_boundary_retry')}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
