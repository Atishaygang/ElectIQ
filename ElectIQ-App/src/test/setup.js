import '@testing-library/jest-dom';

// JSDOM does not implement scrollIntoView — provide a no-op mock globally
window.HTMLElement.prototype.scrollIntoView = function () {};
