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

  if (items.length <= recordLimit) {
    return;
  }

  const hiddenItems = items.slice(recordLimit);
  const actions = document.createElement("div");
  const button = document.createElement("button");

  actions.className = "records-actions";
  button.className = "more-button";
  button.type = "button";
  button.textContent = "더보기";
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
  });
});
