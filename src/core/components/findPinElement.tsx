export const findPinElement = (el: HTMLElement | null): HTMLElement | null => {
    if (!el) return null;
    if (el.dataset.pin === 'true') return el;
    return findPinElement(el.parentElement);
};
