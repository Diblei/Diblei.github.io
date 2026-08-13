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

recordSections.forEach((section) => {
  const items = Array.from(section.querySelectorAll(".record-list li"));

  if (section.id === "ctf") {
    const finalItems = items.filter((item) => item.classList.contains("record-final"));
    const medalFinals = finalItems.filter((item) => item.querySelector(".sr-only"));
    const otherFinals = finalItems.filter((item) => !medalFinals.includes(item));
    const featuredFinals = new Set([...medalFinals, ...otherFinals].slice(0, recordLimit));
    const updateCtfVisibility = () => {
      const showAllRecords = window.location.hash === "#ctf";

      items.forEach((item) => {
        item.hidden = !showAllRecords && !featuredFinals.has(item);
      });
    };

    updateCtfVisibility();
    window.addEventListener("hashchange", updateCtfVisibility);
    return;
  }

  const overflowItems = items.slice(recordLimit);

  if (overflowItems.length === 0) {
    return;
  }

  const actions = document.createElement("div");
  const button = document.createElement("button");

  actions.className = "records-actions";
  button.className = "more-button";
  button.type = "button";
  button.textContent = "더보기";
  actions.append(button);
  section.append(actions);

  overflowItems.forEach((item) => {
    item.hidden = true;
  });

  button.addEventListener("click", () => {
    const shouldExpand = overflowItems.some((item) => item.hidden);

    overflowItems.forEach((item) => {
      item.hidden = !shouldExpand;
    });

    button.textContent = shouldExpand ? "접기" : "더보기";
  });
});
