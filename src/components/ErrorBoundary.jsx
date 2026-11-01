import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-8 flex flex-col items-center justify-center text-center bg-rose-50/50 rounded-2xl border border-rose-200 my-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Something went wrong rendering the floor plan</h3>
            <p className="text-xs text-stone-500 mt-1">Please tap below to refresh table availability.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Floor Plan</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
