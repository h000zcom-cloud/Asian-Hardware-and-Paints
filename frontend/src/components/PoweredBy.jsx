import React from 'react';

export function PoweredBy({ className = '', testId }) {
  return <a className={`powered-by ${className}`.trim()} href="https://ready2up.com/" target="_blank" rel="noopener noreferrer" data-testid={testId}>
    <img src="/images/ready2up.jfif" alt="" width="28" height="28" loading="lazy" decoding="async" />
    <span>Powered by <strong>Ready2UP.</strong></span>
  </a>;
}
