import slugify from 'slugify';

export const toSlug = (str) => {
  return slugify(str).toLowerCase();
};
