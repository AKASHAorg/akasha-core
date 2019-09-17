function setPageTitle(plugins) {
  if (plugins.length > 1) {
    const title = plugins
      .map(plugin => {
        return plugin.title;
      })
      .join('::');
    return (document.title = title);
  }
  document.title = plugins[0] && plugins[0].title ? plugins[0].title : '';
  return document.title;
}

export { setPageTitle };
