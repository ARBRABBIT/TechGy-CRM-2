import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

// Stack of open dialogs so only the top-most one reacts to the keyboard
const openDialogs: object[] = [];

/**
 * Accessible modal behaviour for the element in `ref`:
 * - focus moves into the dialog when it opens (an element with data-autofocus,
 *   else the first form field, else the first focusable) and returns on close
 * - Tab / Shift+Tab stay inside the dialog
 * - Escape closes the top-most dialog, unless a dropdown inside it is open
 *   (any element with aria-expanded="true" handles Escape itself)
 */
export default function useDialog(ref: RefObject<HTMLElement | null>, isOpen: boolean, onClose?: () => void): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const node = ref.current;
    if (!isOpen || !node) return undefined;

    const token = {};
    openDialogs.push(token);
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () => [...node.querySelectorAll<HTMLElement>(FOCUSABLE)]
      .filter(el => el.getClientRects().length > 0);

    const initial = node.querySelector<HTMLElement>('[data-autofocus]')
      || node.querySelector<HTMLElement>('input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])')
      || focusables()[0];
    if (initial) {
      initial.focus({ preventScroll: true });
    } else {
      node.setAttribute('tabindex', '-1');
      node.focus({ preventScroll: true });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (openDialogs[openDialogs.length - 1] !== token) return;

      if (e.key === 'Escape') {
        if (node.querySelector('[aria-expanded="true"]')) return;
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (e.key === 'Tab') {
        const items = focusables();
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !node.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !node.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const i = openDialogs.indexOf(token);
      if (i !== -1) openDialogs.splice(i, 1);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus?.({ preventScroll: true });
      }
    };
  }, [isOpen, ref]);
}

/**
 * Fallback for simple overlays that don't use the hook: Escape clicks the
 * top-most backdrop (whose onClick closes it). Runs on window, after any
 * hook-managed dialog has had the chance to handle the key.
 */
export function installEscapeToCloseOverlays() {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    const overlays = document.querySelectorAll<HTMLElement>('.modal-overlay, .drawer-overlay, .logout-modal-backdrop');
    const top = overlays[overlays.length - 1];
    if (top && !top.querySelector('[aria-expanded="true"]')) top.click();
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
