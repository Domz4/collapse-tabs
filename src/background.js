chrome.tabs.query({}, function (tabs) {
  const groupedTabs = {};

  tabs.forEach((tab) => {
    const url = tab.url;
    const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/;
    const matches = url.match(regex);
    const domain = matches && matches.length > 1 ? matches[1] : null;

    if (domain) {
      if (groupedTabs.hasOwnProperty(domain)) {
        groupedTabs[domain].push(tab);
      } else {
        groupedTabs[domain] = [tab];
      }
    }
  });

  const sortedGroups = Object.keys(groupedTabs).sort();
  const sortedTabs = {};
  sortedGroups.forEach((group) => {
    sortedTabs[group] = groupedTabs[group];
  });

  chrome.tabs.create({ url: "popup.html" }); // Open a new tab with the result
  chrome.runtime.onConnect.addListener(function (port) {
    port.postMessage(sortedTabs); // Send the sorted tabs to popup.html
  });
});
