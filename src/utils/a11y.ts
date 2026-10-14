import type React from 'react';

/**
 * Keyboard support for clickable elements that aren't native buttons.
 * Use together with role="button" and tabIndex={0}: Enter / Space trigger the
 * element's own click handler, exactly like a mouse click.
 */
export function onKeyActivate(e: React.KeyboardEvent<HTMLElement>): void {
  if (e.target !== e.currentTarget) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.currentTarget.click();
  }
}
