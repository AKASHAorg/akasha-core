function setPageTitle(plugins) {
  if (plugins.length > 1) {
    const title = plugins
      .map(plugin => {
        return plugin.title;
      })
      .join('::');
    return (document.title = title);
  }
  return (document.title = plugins[0].title);
}

export { setPageTitle };
