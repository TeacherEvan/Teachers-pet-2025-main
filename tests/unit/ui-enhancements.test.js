import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

function createClassList(owner) {
  const classes = new Set();
  return {
    add(...tokens) {
      tokens.forEach((token) => classes.add(token));
      owner.className = Array.from(classes).join(" ");
    },
    remove(...tokens) {
      tokens.forEach((token) => classes.delete(token));
      owner.className = Array.from(classes).join(" ");
    },
    contains(token) {
      return classes.has(token);
    },
    toArray() {
      return Array.from(classes);
    },
  };
}

function createElement(tagName, documentRef) {
  const element = {
    tagName: tagName.toUpperCase(),
    children: [],
    parentElement: null,
    style: {},
    dataset: {},
    attributes: {},
    eventListeners: {},
    textContent: "",
    innerHTML: "",
    value: "",
    id: "",
    className: "",
    removed: false,
    classList: null,
    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
      if (child.id) {
        documentRef.elementsById.set(child.id, child);
      }
      return child;
    },
    remove() {
      this.removed = true;
      if (this.parentElement) {
        this.parentElement.children = this.parentElement.children.filter(
          (child) => child !== this,
        );
      }
      if (this.id) {
        documentRef.elementsById.delete(this.id);
      }
    },
    addEventListener(type, handler) {
      this.eventListeners[type] ||= [];
      this.eventListeners[type].push(handler);
    },
    dispatchEvent(event) {
      const listeners = this.eventListeners[event.type] || [];
      listeners.forEach((listener) => listener(event));
    },
    click() {
      this.dispatchEvent({
        type: "click",
        currentTarget: this,
        target: this,
        clientX: 0,
        clientY: 0,
      });
    },
    focus() {
      documentRef.activeElement = this;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === "id") {
        this.id = String(value);
        documentRef.elementsById.set(this.id, this);
      }
      if (name.startsWith("data-")) {
        const dataKey = name
          .slice(5)
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        this.dataset[dataKey] = String(value);
      }
    },
    getAttribute(name) {
      if (name === "id") return this.id;
      return this.attributes[name];
    },
    querySelectorAll(selector) {
      return querySelectorAllFrom([this], selector, documentRef);
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    scrollIntoView() {
      this.didScroll = true;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: 120,
        height: 40,
      };
    },
  };
  element.classList = createClassList(element);
  return element;
}

function flattenElements(nodes) {
  const flattened = [];
  nodes.forEach((node) => {
    flattened.push(node);
    flattened.push(...flattenElements(node.children || []));
  });
  return flattened;
}

function matchesSelector(element, selector) {
  const trimmed = selector.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith(".")) {
    return element.classList.contains(trimmed.slice(1));
  }

  if (["button", "input", "select", "textarea", "a"].includes(trimmed)) {
    return element.tagName === trimmed.toUpperCase();
  }

  if (trimmed === ".modal" || trimmed === ".overlay" || trimmed === ".dropdown-open") {
    return element.classList.contains(trimmed.slice(1));
  }

  if (trimmed === "input, textarea, select") {
    return ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
  }

  if (trimmed === "input, textarea, select, button, [tabindex]:not([tabindex=\"-1\"])") {
    return ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(element.tagName);
  }

  if (trimmed === "button, a, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])") {
    return ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(element.tagName);
  }

  if (trimmed === "button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])") {
    return ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(element.tagName);
  }

  if (trimmed === ".btn-primary, .btn-secondary, button, .clickable") {
    return (
      element.tagName === "BUTTON" ||
      element.classList.contains("btn-primary") ||
      element.classList.contains("btn-secondary") ||
      element.classList.contains("clickable")
    );
  }

  if (trimmed === ".action-card, .btn-primary, .btn-secondary, .glass-card") {
    return (
      element.classList.contains("action-card") ||
      element.classList.contains("btn-primary") ||
      element.classList.contains("btn-secondary") ||
      element.classList.contains("glass-card")
    );
  }

  if (trimmed === "a[href^=\"#\"]") {
    return element.tagName === "A" && (element.attributes.href || "").startsWith("#");
  }

  if (trimmed === "[data-skeleton]") {
    return Object.hasOwn(element.dataset, "skeleton");
  }

  if (trimmed === "[data-tooltip]") {
    return Object.hasOwn(element.dataset, "tooltip");
  }

  if (trimmed === "main[id], section[id], h1[id], h2[id], [data-quick-nav-label]") {
    return (
      ((["MAIN", "SECTION", "H1", "H2"].includes(element.tagName) && Boolean(element.id))) ||
      Object.hasOwn(element.dataset, "quickNavLabel")
    );
  }

  if (trimmed === "#generateBtn") {
    return element.id === "generateBtn";
  }

  if (trimmed === "input:not([type=\"hidden\"]), textarea, select") {
    return ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
  }

  return false;
}

function querySelectorAllFrom(nodes, selector, documentRef) {
  const selectors = selector.split(",").map((part) => part.trim());
  const results = [];
  flattenElements(nodes).forEach((element) => {
    if (element === documentRef.body || element === documentRef.head) {
      return;
    }
    if (selectors.some((part) => matchesSelector(element, part) || matchesSelector(element, selector))) {
      results.push(element);
    }
  });
  return results;
}

function createDocumentStub() {
  const documentRef = {
    elementsById: new Map(),
    activeElement: null,
    eventListeners: {},
    body: null,
    head: null,
    documentElement: {
      attributes: {},
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
    },
    createElement(tagName) {
      return createElement(tagName, documentRef);
    },
    addEventListener(type, handler) {
      this.eventListeners[type] ||= [];
      this.eventListeners[type].push(handler);
    },
    dispatchEvent(event) {
      const listeners = this.eventListeners[event.type] || [];
      listeners.forEach((listener) => listener(event));
    },
    querySelectorAll(selector) {
      return querySelectorAllFrom([documentRef.body, documentRef.head], selector, documentRef);
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    getElementById(id) {
      return this.elementsById.get(id) || null;
    },
  };

  documentRef.body = createElement("body", documentRef);
  documentRef.head = createElement("head", documentRef);
  return documentRef;
}

export async function runTests() {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalNavigator = globalThis.navigator;
  const originalGetComputedStyle = globalThis.getComputedStyle;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalSetTimeout = globalThis.setTimeout;

  try {
    const documentStub = createDocumentStub();
    const subjectSection = documentStub.createElement("section");
    subjectSection.id = "subjectSelection";
    subjectSection.dataset.quickNavLabel = "Subject Selection";
    documentStub.body.appendChild(subjectSection);

    const commentsHeading = documentStub.createElement("h2");
    commentsHeading.id = "generatedComments";
    commentsHeading.dataset.quickNavLabel = "Generated Comments";
    documentStub.body.appendChild(commentsHeading);

    const generateButton = documentStub.createElement("button");
    generateButton.id = "generateBtn";
    generateButton.textContent = "Generate Comments";
    generateButton.wasClicked = false;
    generateButton.addEventListener("click", () => {
      generateButton.wasClicked = true;
    });
    documentStub.body.appendChild(generateButton);

    const firstInput = documentStub.createElement("input");
    firstInput.id = "studentName";
    documentStub.body.appendChild(firstInput);

    const launcherButton = documentStub.createElement("button");
    launcherButton.id = "launcher";
    launcherButton.textContent = "Open";
    documentStub.body.appendChild(launcherButton);
    launcherButton.focus();

    let startOverCalled = false;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: {
      matchMedia() {
        return {
          matches: false,
          addEventListener() {},
        };
      },
      location: {
        pathname: "/Subjects.html",
        href: "/Subjects.html",
      },
      startOverWithAnimation() {
        startOverCalled = true;
      },
      },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      writable: true,
      value: documentStub,
    });
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      writable: true,
      value: {
      vibrate() {},
      },
    });
    globalThis.getComputedStyle = () => ({ position: "static" });
    globalThis.requestAnimationFrame = (callback) => callback();
    globalThis.setTimeout = (callback) => {
      callback();
      return 0;
    };

    const moduleUrl = `${pathToFileURL(
      path.join(repoRoot, "assets/js/utils/ui-enhancements.js"),
    ).href}?ui-test`;
    await import(moduleUrl);

    const enhancements = globalThis.window.uiEnhancements;
    assert.equal(typeof enhancements.showQuickNavigation, "function");

    enhancements.showQuickNavigation();

    const overlay = documentStub.getElementById("quickNavigationOverlay");
    const searchInput = documentStub.getElementById("quickNavigationSearch");
    const emptyState = documentStub.getElementById("quickNavigationEmpty");
    assert.ok(overlay);
    assert.ok(overlay.classList.contains("overlay"));
    assert.ok(overlay.classList.contains("active"));
    assert.equal(documentStub.activeElement, searchInput);

    const overlayText = flattenElements([overlay])
      .map((element) => element.textContent)
      .filter(Boolean)
      .join(" ");

    assert.match(overlayText, /Student Information/);
    assert.match(overlayText, /Subject Selection/);
    assert.match(overlayText, /Generate Comments/);
    assert.match(overlayText, /Start Over/);
    assert.match(overlayText, /Focus First Input/);
    assert.doesNotMatch(overlayText, /\bStudent Name\b/);

    const sectionButton = flattenElements([overlay]).find(
      (element) => element.textContent === "Subject Selection",
    );

    let shiftTabPrevented = false;
    searchInput.dispatchEvent({
      type: "keydown",
      key: "Tab",
      shiftKey: true,
      preventDefault() {
        shiftTabPrevented = true;
      },
    });
    assert.equal(shiftTabPrevented, true);
    assert.notEqual(documentStub.activeElement, searchInput);

    let tabPrevented = false;
    documentStub.activeElement.dispatchEvent({
      type: "keydown",
      key: "Tab",
      shiftKey: false,
      preventDefault() {
        tabPrevented = true;
      },
    });
    assert.equal(tabPrevented, true);
    assert.equal(documentStub.activeElement, searchInput);

    sectionButton.click();
    assert.equal(subjectSection.didScroll, true);
    assert.equal(documentStub.activeElement, subjectSection);

    launcherButton.focus();
    enhancements.showQuickNavigation();
    const currentPageButton = flattenElements([overlay]).find(
      (element) => element.textContent === "Subjects",
    );
    currentPageButton.click();
    assert.equal(documentStub.activeElement, launcherButton);

    enhancements.showQuickNavigation();
    searchInput.value = "start";
    searchInput.dispatchEvent({ type: "input" });
    const startOverButton = flattenElements([overlay]).find(
      (element) => element.textContent === "Start Over",
    );
    let actionButton = flattenElements([overlay]).find(
      (element) => element.textContent === "Generate Comments",
    );
    assert.equal(startOverButton.style.display, "");
    assert.equal(actionButton.style.display, "none");
    assert.equal(emptyState.style.display, "none");

    let enterPrevented = false;
    startOverCalled = false;
    searchInput.dispatchEvent({
      type: "keydown",
      key: "Enter",
      preventDefault() {
        enterPrevented = true;
      },
    });
    assert.equal(enterPrevented, true);
    assert.equal(startOverCalled, true);

    enhancements.showQuickNavigation();
    searchInput.value = "zzzz";
    searchInput.dispatchEvent({ type: "input" });
    assert.equal(emptyState.style.display, "block");

    enhancements.showQuickNavigation();
    actionButton = flattenElements([overlay]).find(
      (element) => element.textContent === "Generate Comments",
    );
    actionButton.click();
    assert.equal(generateButton.wasClicked, true);
    assert.equal(documentStub.activeElement, generateButton);

    enhancements.showQuickNavigation();
    searchInput.value = "";
    searchInput.dispatchEvent({ type: "input" });
    startOverButton.click();
    assert.equal(startOverCalled, true);

    enhancements.showQuickNavigation();
    const focusButton = flattenElements([overlay]).find(
      (element) => element.textContent === "Focus First Input",
    );
    focusButton.click();
    assert.equal(documentStub.activeElement, firstInput);

    enhancements.closeOverlays();
    assert.equal(overlay.classList.contains("active"), false);

    globalThis.window.location.pathname = "/";
    let homePage = enhancements
      .getQuickNavigationPages()
      .find((item) => item.label === "Home");
    assert.equal(homePage.isCurrent, true);

    globalThis.window.location.pathname = "/teachers-pet/";
    homePage = enhancements
      .getQuickNavigationPages()
      .find((item) => item.label === "Home");
    assert.equal(homePage.isCurrent, true);
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: originalWindow,
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      writable: true,
      value: originalDocument,
    });
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      writable: true,
      value: originalNavigator,
    });
    globalThis.getComputedStyle = originalGetComputedStyle;
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.setTimeout = originalSetTimeout;
  }
}