export const openWorldConfigInNewTab = (homepageExtensionName: string, worldDataId: string) => {
  const params = new URLSearchParams({
    previewWorldId: worldDataId,
  }).toString();
  const fullUrl = `${window.location.origin}/${homepageExtensionName}?${params}`;
  window.open(fullUrl, '_blank');
};
