import { Component, type ReactNode } from 'react';

// A screen or module failure must leave the shared-session shell and sidebar usable.
export class AdministratorScreenBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 render() {
  return this.state.failed ? <section className="mp-error"><h3>Administration view unavailable</h3><p role="alert">This view could not be loaded. Saved demo records are retained. You can open another Administration view or reload to retry.</p><button onClick={() => window.location.reload()}>Reload to retry this view</button></section> : this.props.children;
 }
}
