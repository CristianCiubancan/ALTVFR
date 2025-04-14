import React from 'react';
import ReactDOM from 'react-dom/client';
import { AltVProvider } from '@framework/ui/components/providers/AltVProvider';
import ExampleComponent from './components/ExampleComponent';
import '@framework/ui/styles/theme.css';

/**
 * Main entry point for Example Plugin UI
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AltVProvider>
      <ExampleComponent />
    </AltVProvider>
  </React.StrictMode>
);