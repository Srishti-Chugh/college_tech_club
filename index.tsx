
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    html {
      scroll-behavior: smooth;
    }
    body {
      background-color: #0f172a;
      color: #f8fafc;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
  `}} />
);
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
