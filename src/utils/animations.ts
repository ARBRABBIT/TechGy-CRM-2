import gsap from 'gsap';

/**
 * GSAP Animation Utilities for TechGy CRM
 * Ensures SSR safety and smooth micro-interactions.
 * Every helper is a no-op when the user prefers reduced motion.
 */

const canAnimate = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Animate view / module change entrance
 * @param {HTMLElement|string} target - The view container element
 */
export const animateViewTransition = (target: HTMLElement | null): void => {
  if (!canAnimate() || !target) return;
  
  gsap.killTweensOf(target);
  gsap.fromTo(
    target,
    { opacity: 0, y: 14, scale: 0.995 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.38,
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
};

/**
 * Animate a list of cards or elements with a crisp stagger
 * @param {NodeList|Array|string} elements - Collection of elements to stagger
 * @param {number} stagger - Delay between each item (default 0.06s)
 */
export const animateStaggerEntrance = (elements: NodeListOf<Element> | Element[] | null, stagger = 0.05): void => {
  if (!canAnimate() || !elements) return;

  gsap.killTweensOf(elements);
  gsap.fromTo(
    elements,
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      stagger: stagger,
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
};

/**
 * Animate modal dialog pop-in
 * @param {HTMLElement} dialog - The modal card
 * @param {HTMLElement} backdrop - The backdrop overlay
 */
export const animateModalEnter = (dialog: HTMLElement | null, backdrop: HTMLElement | null) => {
  if (!canAnimate()) return;

  const tl = gsap.timeline();
  if (backdrop) {
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0);
  }
  if (dialog) {
    tl.fromTo(
      dialog,
      { opacity: 0, scale: 0.97, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.26, ease: 'power3.out', clearProps: 'transform' },
      0.04
    );
  }
  return tl;
};

/**
 * Animate mobile sidebar drawer slide-in
 * @param {HTMLElement} drawer - Sidebar element
 * @param {HTMLElement} backdrop - Backdrop element
 */
export const animateDrawerEnter = (drawer: HTMLElement | null, backdrop: HTMLElement | null) => {
  if (!canAnimate() || !drawer) return;

  const tl = gsap.timeline();
  if (backdrop) {
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0);
  }
  // clearProps hands control back to the CSS classes, so the drawer can close again
  tl.fromTo(
    drawer,
    { x: '-100%', opacity: 0.8 },
    { x: '0%', opacity: 1, duration: 0.32, ease: 'power3.out', clearProps: 'transform,opacity' },
    0
  );
  return tl;
};
