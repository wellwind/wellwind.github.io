export const slugify = (value: string) =>
  value.replace(/[ ]+/g, '-').replace(/#/g, '~23~').replace(/\*/g, '~2A~');
