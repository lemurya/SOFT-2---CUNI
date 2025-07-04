import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock HTMLCanvasElement.getContext para jsPDF y Recharts
HTMLCanvasElement.prototype.getContext = () => {};
