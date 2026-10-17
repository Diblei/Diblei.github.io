const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("[data-year]");
const recordSections = document.querySelectorAll(".record-section");
const recordLimit = 10;

if (year) {
  year.textContent = new Date().getFullYear();
}

const addRecordsToggle = (section, items, hiddenItems) => {
  items.forEach((item) => {
    item.hidden = hiddenItems.includes(item);
  });

  if (hiddenItems.length === 0) {
    return;
  }

  const actions = document.createElement("div");
  const button = document.createElement("button");
  const label = document.createElement("span");
  const extraCount = document.createElement("span");
  const icon = document.createElement("img");
  const visibleCount = document.createElement("span");
  const list = section.querySelector("ul");
  const sectionName = section.querySelector("h2").textContent;
  let expanded = false;

  actions.className = "records-actions";
  button.className = "more-button";
  button.type = "button";
  button.setAttribute("aria-controls", list.id);
  extraCount.className = "more-count";
  extraCount.textContent = hiddenItems.length;
  icon.src = "assets/icons/chevron-down.svg";
  icon.alt = "";
  icon.width = 14;
  icon.height = 14;
  visibleCount.className = "records-count";
  button.append(label, extraCount, icon);
  actions.append(button, visibleCount);
  section.append(actions);

  const render = () => {
    hiddenItems.forEach((item) => {
      item.hidden = !expanded;
    });
    label.textContent = expanded ? "접기" : "더보기";
    extraCount.hidden = expanded;
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute(
      "aria-label",
      `${sectionName} ${expanded ? "접기" : "더보기"}`,
    );
    visibleCount.textContent = `${expanded ? items.length : items.length - hiddenItems.length} / ${items.length}`;
  };

  render();
  button.addEventListener("click", () => {
    expanded = !expanded;
    render();
    if (!expanded && button.getBoundingClientRect().top < 0) {
      section.scrollIntoView({ block: "start" });
    }
  });
};

recordSections.forEach((section) => {
  const items = Array.from(
    section.querySelectorAll(".record-list li, .cve-list li"),
  );
  document.querySelectorAll(`[data-total="${section.id}"]`).forEach((count) => {
    count.textContent = items.length;
  });

  if (section.id === "ctf") {
    const finalItems = items.filter((item) =>
      item.classList.contains("record-final"),
    );
    const medalFinals = finalItems.filter((item) =>
      item.querySelector(".sr-only"),
    );
    const otherFinals = finalItems.filter(
      (item) => !medalFinals.includes(item),
    );
    const featuredFinals = new Set(
      [...medalFinals, ...otherFinals].slice(0, recordLimit),
    );
    const hiddenItems = items.filter((item) => !featuredFinals.has(item));

    addRecordsToggle(section, items, hiddenItems);
    return;
  }

  if (section.id === "cve") {
    const featuredCves = new Set(
      items
        .filter((item) => item.classList.contains("cve-featured"))
        .slice(0, recordLimit),
    );
    const hiddenItems = items.filter((item) => !featuredCves.has(item));

    addRecordsToggle(section, items, hiddenItems);
    return;
  }

  const overflowItems = items.slice(recordLimit);
  addRecordsToggle(section, items, overflowItems);
});

if (siteNav) {
  const links = Array.from(siteNav.querySelectorAll('a[href^="#"]'));
  siteNav.setAttribute("role", "tablist");
  siteNav.setAttribute("aria-orientation", "horizontal");
  document.body.classList.add("tabs-ready");

  links.forEach((link) => {
    const section = document.querySelector(link.hash);
    link.setAttribute("role", "tab");
    link.setAttribute("aria-controls", section.id);
    section.setAttribute("role", "tabpanel");
    section.setAttribute("aria-labelledby", link.id);
    section.tabIndex = 0;
  });

  const showSection = (activeLink) => {
    links.forEach((link) => {
      const active = link === activeLink;
      link.setAttribute("aria-selected", String(active));
      link.tabIndex = active ? 0 : -1;
      document.querySelector(link.hash).hidden = !active;
    });
  };

  const updateFromLocation = () => {
    const pageAnchor = ["#top", "#content"].includes(window.location.hash);
    const activeLink =
      links.find((link) => link.hash === window.location.hash) ||
      (pageAnchor &&
        links.find((link) => link.getAttribute("aria-selected") === "true")) ||
      links[0];
    showSection(activeLink);
  };

  const selectTab = (link) => {
    showSection(link);
    if (window.location.hash !== link.hash) {
      history.pushState(null, "", link.hash);
    }
  };

  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      selectTab(link);
    });
    link.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % links.length;
      if (event.key === "ArrowLeft")
        nextIndex = (index - 1 + links.length) % links.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = links.length - 1;
      if (event.key === " ") nextIndex = index;
      if (nextIndex === undefined) return;
      event.preventDefault();
      links[nextIndex].focus();
      selectTab(links[nextIndex]);
    });
  });

  window.addEventListener("hashchange", updateFromLocation);
  window.addEventListener("popstate", updateFromLocation);
  updateFromLocation();
}
