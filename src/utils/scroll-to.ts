export const scrollTo = (top: number, element: HTMLElement) => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion)');
  element.scroll({
    behavior: motionQuery.matches ? 'auto' : 'smooth',
    top: top
  });
}
