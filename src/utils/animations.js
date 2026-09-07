import gsap from 'gsap';

/**
 * GSAP Animation Utilities for TechGy CRM
 * Ensures SSR safety and smooth micro-interactions
 */

/**
 * Animate view / module change entrance
 * @param {HTMLElement|string} target - The view container element
 */
export const animateViewTransition = (target) => {
  if (typeof window === 'undefined' || !target) return;
  
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
export const animateStaggerEntrance = (elements, stagger = 0.05) => {
  if (typeof window === 'undefined' || !elements) return;

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
 * Animate numeric KPI counter with smooth easing
 * @param {HTMLElement} element - Target element displaying the number
 * @param {number} targetValue - End numeric value
 * @param {string} prefix - e.g. "₹"
 * @param {string} suffix - e.g. " Cr", " L"
 * @param {number} duration - Duration in seconds
 */
export const animateNumberCounter = (element, targetValue, prefix = '', suffix = '', duration = 0.8) => {
  if (typeof window === 'undefined' || !element) return;

  const obj = { val: 0 };
  gsap.to(obj, {
    val: targetValue,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.innerText = `${prefix}${Math.round(obj.val).toLocaleString('en-IN')}${suffix}`;
    }
  });
};

/**
 * Animate modal dialog pop-in
 * @param {HTMLElement} dialog - The modal card
 * @param {HTMLElement} backdrop - The backdrop overlay
 */
export const animateModalEnter = (dialog, backdrop) => {
  if (typeof window === 'undefined') return;

  const tl = gsap.timeline();
  if (backdrop) {
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0);
  }
  if (dialog) {
    tl.fromTo(
      dialog,
      { opacity: 0, scale: 0.94, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.5)' },
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
export const animateDrawerEnter = (drawer, backdrop) => {
  if (typeof window === 'undefined' || !drawer) return;

  const tl = gsap.timeline();
  if (backdrop) {
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0);
  }
  tl.fromTo(
    drawer,
    { x: '-100%', opacity: 0.8 },
    { x: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
    0
  );
  return tl;
};
