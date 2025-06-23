import React from 'react';

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode
}, { error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{this.state.error.message || String(this.state.error)}</pre>;
    }
    return this.props.children;
  }
}
