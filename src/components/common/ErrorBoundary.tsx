import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in TrustChain application:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-sky-50/60 p-6">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center shadow-xl border border-white/80">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Application Interface Recovered</h2>
            <p className="text-sm text-slate-600 mb-6">
              A temporary runtime condition occurred. Your cryptographic credentials and identity records remain safe and intact.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
