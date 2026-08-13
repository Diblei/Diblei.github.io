const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("[data-year]");
const recordSections = document.querySelectorAll(".record-section");
const recordLimit = 10;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const addRecordsToggle = (section, hiddenItems) => {
  if (hiddenItems.length === 0) {
    return;
  }

  const actions = document.createElement("div");
  const button = document.createElement("button");

  actions.className = "records-actions";
  button.className = "more-button";
  button.type = "button";
  button.textContent = "더보기";
  button.setAttribute("aria-expanded", "false");
  actions.append(button);
  section.append(actions);

  hiddenItems.forEach((item) => {
    item.hidden = true;
  });

  button.addEventListener("click", () => {
    const shouldExpand = hiddenItems.some((item) => item.hidden);

    hiddenItems.forEach((item) => {
      item.hidden = !shouldExpand;
    });

    button.textContent = shouldExpand ? "접기" : "더보기";
    button.setAttribute("aria-expanded", String(shouldExpand));
  });
};

recordSections.forEach((section) => {
  const items = Array.from(section.querySelectorAll(".record-list li, .cve-list li"));

  if (section.id === "ctf") {
    const finalItems = items.filter((item) => item.classList.contains("record-final"));
    const medalFinals = finalItems.filter((item) => item.querySelector(".sr-only"));
    const otherFinals = finalItems.filter((item) => !medalFinals.includes(item));
    const featuredFinals = new Set([...medalFinals, ...otherFinals].slice(0, recordLimit));
    const hiddenItems = items.filter((item) => !featuredFinals.has(item));

    addRecordsToggle(section, hiddenItems);
    return;
  }

  if (section.id === "cve") {
    const featuredCves = new Set(
      items.filter((item) => item.classList.contains("cve-featured")).slice(0, recordLimit),
    );
    const hiddenItems = items.filter((item) => !featuredCves.has(item));

    addRecordsToggle(section, hiddenItems);
    return;
  }

  const overflowItems = items.slice(recordLimit);
  addRecordsToggle(section, overflowItems);
});
