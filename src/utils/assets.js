// Helper para URLs que funciona en local y en GitHub Pages
export const assetUrl = (path) => {
  const clean = String(path).replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
};

export const getJson = async (relativePath) => {
  const res = await fetch(assetUrl(relativePath));
  if (!res.ok) throw new Error(`No se pudo cargar ${relativePath}`);
  return res.json();
};
