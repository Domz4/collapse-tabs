chrome.runtime
  .connect({ name: "popup" })
  .onMessage.addListener(function (sortedTabs) {
    const tabsList = document.getElementById("tabsList");
    for (const domain in sortedTabs) {
      const domainTabs = sortedTabs[domain];
      const domainListItem = document.createElement("li");
      domainListItem.textContent = domain;
      const domainTabsList = document.createElement("ul");
      domainTabs.forEach((tab) => {
        const tabListItem = document.createElement("li");
        tabListItem.textContent = tab.title;
        domainTabsList.appendChild(tabListItem);
      });
      domainListItem.appendChild(domainTabsList);
      tabsList.appendChild(domainListItem);
    }
  });
