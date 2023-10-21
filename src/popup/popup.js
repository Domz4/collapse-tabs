browser.windows.getAll({ populate: true }, function (windows) {
  windows.forEach((window) => {
    const groupedTabs = {};
    window.tabs.forEach((tab) => {
      const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/;
      const matches = tab.url.match(regex);
      const domain = matches && matches.length > 1 ? matches[1] : null;

      if (domain) {
        groupedTabs.hasOwnProperty(domain)
          ? groupedTabs[domain].push(tab)
          : (groupedTabs[domain] = [tab]);
      }
    });

    const sortedUrlNames = Object.keys(groupedTabs).sort();

    let index = 0;
    let pinnedIndex = window.tabs.findIndex((tab) => tab.pinned);

    if (pinnedIndex !== -1) {
      index = pinnedIndex + 1;
    }

    sortedUrlNames.forEach((group) => {
      groupedTabs[group].forEach((tab) => {
        if (!tab.pinned) {
          browser.tabs.move(tab.id, { index: index });
          index++;
        }
      });
    });
  });
});
