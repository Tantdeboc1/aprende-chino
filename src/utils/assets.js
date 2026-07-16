// Helper para URLs que funciona en local y en GitHub Pages
export const assetUrl = (path) => {
  const clean = String(path).replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
};
