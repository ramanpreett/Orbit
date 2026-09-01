import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-lg w-full rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="w-20 h-20 bg-[#F43F5E] text-white rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-12">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-black uppercase mb-4 tracking-tight">Something went wrong</h1>
            <p className="text-slate-600 font-bold mb-8">
              {this.state.error?.message || "An unexpected error occurred in the application."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-[#FEF08A] text-black px-6 py-4 rounded-xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide"
            >
              <RefreshCcw className="w-5 h-5" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
