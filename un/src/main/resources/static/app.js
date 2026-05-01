const elements = {
  hostNotice: document.getElementById("hostNotice"),
  resultTitle: document.getElementById("resultTitle"),
  resultSummary: document.getElementById("resultSummary"),
  resultStatus: document.getElementById("resultStatus"),
  resultEndpoint: document.getElementById("resultEndpoint"),
  resultContent: document.getElementById("resultContent")
};

const isHostedDashboard = window.location.protocol !== "file:";

const actionConfigs = [
  {
    buttonId: "loadStudentsButton",
    title: "All Students",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getallstudent")
    })
  },
  {
    buttonId: "loadCoursesButton",
    title: "All Courses",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getallcourse")
    })
  },
  {
    buttonId: "loadGradesButton",
    title: "All Grades",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getallstudentgrade")
    })
  },
  {
    buttonId: "findStudentButton",
    title: "Find One Student",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getStudent", {
        stdId: readRequiredInteger("studentIdInput", "Student ID")
      })
    })
  },
  {
    buttonId: "studentCoursesButton",
    title: "Show Courses For A Student",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getAllStudentCourses", {
        studentId: readRequiredInteger("studentCoursesInput", "Student ID")
      })
    })
  },
  {
    buttonId: "saveStudentButton",
    title: "Save Student",
    buildRequest: () => ({
      method: "POST",
      url: buildApiUrl("saveStudent"),
      body: collectStudentPayload()
    })
  },
  {
    buttonId: "updateStudentButton",
    title: "Update Student",
    buildRequest: () => ({
      method: "PUT",
      url: buildApiUrl("updateStudent"),
      body: collectStudentPayload()
    })
  },
  {
    buttonId: "deleteStudentButton",
    title: "Delete Student",
    buildRequest: () => ({
      method: "DELETE",
      url: buildApiUrl("deleteStudent", {
        studentId: readRequiredInteger("deleteStudentIdInput", "Student ID")
      })
    })
  },
  {
    buttonId: "findCourseButton",
    title: "Find One Course",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getCourse", {
        corId: readRequiredInteger("courseIdInput", "Course ID")
      })
    })
  },
  {
    buttonId: "courseStudentsButton",
    title: "Show Students In A Course",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getAllCourseStudents", {
        courseId: readRequiredInteger("courseStudentsInput", "Course ID")
      })
    })
  },
  {
    buttonId: "saveCourseButton",
    title: "Save Course",
    buildRequest: () => ({
      method: "POST",
      url: buildApiUrl("saveCourse"),
      body: collectCoursePayload()
    })
  },
  {
    buttonId: "updateCourseButton",
    title: "Update Course",
    buildRequest: () => ({
      method: "PUT",
      url: buildApiUrl("updateCourse"),
      body: collectCoursePayload()
    })
  },
  {
    buttonId: "deleteCourseButton",
    title: "Delete Course",
    buildRequest: () => ({
      method: "DELETE",
      url: buildApiUrl("deleteCourse", {
        courseID: readRequiredInteger("deleteCourseIdInput", "Course ID")
      })
    })
  },
  {
    buttonId: "enrollStudentCourseButton",
    title: "Enroll Student In Course",
    buildRequest: () => ({
      method: "POST",
      url: buildApiUrl("enrollstudent", {
        studentId: readRequiredInteger("enrollStudentIdInput", "Student ID"),
        courseId: readRequiredInteger("enrollCourseIdInput", "Course ID")
      })
    })
  },
  {
    buttonId: "studentGradeButton",
    title: "Get Student Course Grade",
    buildRequest: () => ({
      method: "GET",
      url: buildApiUrl("getstudentcoursegrade", {
        studentId: readRequiredInteger("gradeStudentIdInput", "Student ID"),
        courseId: readRequiredInteger("gradeCourseIdInput", "Course ID")
      })
    })
  },
  {
    buttonId: "setStudentCourseGradeButton",
    title: "Set Student Course Grade",
    buildRequest: () => ({
      method: "POST",
      url: buildApiUrl("setStudentCourseGrade", {
        studentId: readRequiredInteger("setGradeStudentIdInput", "Student ID"),
        courseId: readRequiredInteger("setGradeCourseIdInput", "Course ID"),
        grade: readRequiredNumber("setGradeValueInput", "Grade", { min: 0 })
      })
    })
  }
];

const actionButtons = actionConfigs
  .map(({ buttonId }) => document.getElementById(buttonId))
  .filter(Boolean);

const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
const inputs = Array.from(document.querySelectorAll("input"));

const uiState = {
  busy: false,
  activeActionButtonId: null,
  activeTab: "student"
};

initializeDashboard();
bindTabs();
bindActions();
bindInputCleanup();

function initializeDashboard() {
  activateTab(uiState.activeTab);
  syncActionButtonState();

  if (!isHostedDashboard) {
    showHostNotice(
      "This page was opened with file://. Run the Spring Boot app and open http://localhost:8081/ so the dashboard can call /api correctly."
    );
    setResultMeta({
      title: "Open Through Spring Boot",
      summary: "Requests are disabled when the page is opened directly from disk.",
      statusText: "Unavailable",
      statusTone: "warning",
      requestText: "No request sent"
    });
    renderMessageCard({
      title: "Run The Spring Boot App",
      message:
        "Open http://localhost:8081/ after the backend starts. The dashboard uses the same host and calls /api from there.",
      tone: "warning"
    });
  } else {
    hideHostNotice();
  }
}

function bindTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tabTarget;
      activateTab(tabName);
    });
  });
}

function activateTab(tabName) {
  uiState.activeTab = tabName;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== tabName;
  });
}

function bindActions() {
  actionConfigs.forEach(({ buttonId, title, buildRequest }) => {
    const button = document.getElementById(buttonId);

    if (!button) {
      return;
    }

    button.addEventListener("click", async () => {
      setActiveActionButton(buttonId);

      if (!isHostedDashboard) {
        showHostNotice(
          "Run the Spring Boot application and use http://localhost:8081/ instead of opening index.html directly."
        );
        return;
      }

      clearInputErrors();

      try {
        const request = buildRequest();
        await runRequest(title, request);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Please fill in the required fields and try again.";

        setResultMeta({
          title,
          summary: message,
          statusText: "Input Required",
          statusTone: "warning",
          requestText: "No request sent"
        });
        renderMessageCard({
          title: "Input Required",
          message,
          tone: "warning"
        });
      }
    });
  });
}

function bindInputCleanup() {
  inputs.forEach((input) => {
    input.addEventListener("input", () => clearInputError(input));
  });
}

async function runRequest(title, request) {
  const method = request.method || "GET";
  const url = request.url;
  const requestText = buildRequestText(method, url);

  setBusy(true);
  setResultMeta({
    title,
    summary: `Sending ${requestText}.`,
    statusText: "Loading",
    statusTone: "loading",
    requestText
  });
  renderMessageCard({
    title: "Loading",
    message: `Please wait while ${requestText} is sent to the API.`,
    tone: "loading"
  });

  try {
    const response = await fetch(url.toString(), buildFetchOptions(request));
    const payload = await parseResponse(response);

    if (!response.ok) {
      throw buildResponseError(response, payload);
    }

    renderApiResult(title, method, url, payload);
  } catch (error) {
    const message = getFriendlyErrorMessage(error);

    setResultMeta({
      title,
      summary: message,
      statusText: "Error",
      statusTone: "error",
      requestText
    });
    renderMessageCard({
      title: "Request Failed",
      message,
      tone: "error"
    });
  } finally {
    setBusy(false);
  }
}

function renderApiResult(title, method, url, payload) {
  const state = derivePayloadState(payload);
  const requestText = buildRequestText(method, url);

  setResultMeta({
    title,
    summary: buildSummaryText(payload, state),
    statusText: state.statusText,
    statusTone: state.statusTone,
    requestText
  });

  if (payload === "" || payload === null || payload === undefined) {
    renderMessageCard({
      title: "No Data",
      message: "The API returned an empty response.",
      tone: "empty"
    });
    return;
  }

  if (typeof payload === "string") {
    renderMessageCard({
      title,
      message: payload,
      tone: state.statusTone
    });
    return;
  }

  if (Array.isArray(payload)) {
    renderArray(payload);
    return;
  }

  if (isPlainObject(payload)) {
    renderObject(payload);
    return;
  }

  renderMessageCard({
    title: "Response",
    message: String(payload),
    tone: state.statusTone
  });
}

function renderArray(items) {
  if (!items.length) {
    renderMessageCard({
      title: "No Results",
      message: "The API returned an empty list.",
      tone: "empty"
    });
    return;
  }

  if (items.every(isPlainObject)) {
    if (items.length === 1) {
      const wrapper = createStackWrapper(items.length);
      wrapper.appendChild(createDetailGrid(flattenRecord(items[0])));
      replaceResultContent(wrapper);
      return;
    }

    replaceResultContent(createTableView(items));
    return;
  }

  replaceResultContent(createPrimitiveList(items));
}

function renderObject(item) {
  const flattened = flattenRecord(item);

  if (!Object.keys(flattened).length) {
    renderMessageCard({
      title: "No Data",
      message: "The API returned an empty object.",
      tone: "empty"
    });
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "result-stack";
  wrapper.appendChild(createDetailGrid(flattened));
  replaceResultContent(wrapper);
}

function createTableView(items) {
  const normalizedItems = items.map((item) => flattenRecord(item));
  const columns = Array.from(
    normalizedItems.reduce((set, item) => {
      Object.keys(item).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  const stack = createStackWrapper(items.length);
  const tableShell = document.createElement("div");
  tableShell.className = "table-shell";

  const table = document.createElement("table");
  table.className = "results-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = formatLabel(column);
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  normalizedItems.forEach((item) => {
    const row = document.createElement("tr");

    columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = formatDisplayValue(item[column]);
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableShell.appendChild(table);
  stack.appendChild(tableShell);

  return stack;
}

function createPrimitiveList(items) {
  const stack = createStackWrapper(items.length);
  const list = document.createElement("ul");
  list.className = "simple-list";

  items.forEach((item) => {
    const entry = document.createElement("li");
    entry.textContent = formatDisplayValue(item);
    list.appendChild(entry);
  });

  stack.appendChild(list);
  return stack;
}

function createDetailGrid(flattenedRecord) {
  const grid = document.createElement("div");
  grid.className = "detail-grid";

  Object.entries(flattenedRecord).forEach(([key, value]) => {
    const card = document.createElement("div");
    card.className = "detail-card";

    const label = document.createElement("span");
    label.className = "detail-label";
    label.textContent = formatLabel(key);

    const data = document.createElement("strong");
    data.className = "detail-value";
    data.textContent = formatDisplayValue(value);

    card.appendChild(label);
    card.appendChild(data);
    grid.appendChild(card);
  });

  return grid;
}

function createStackWrapper(count) {
  const stack = document.createElement("div");
  stack.className = "result-stack";

  const badge = document.createElement("span");
  badge.className = "result-count";
  badge.textContent = `${count} record${count === 1 ? "" : "s"}`;

  stack.appendChild(badge);
  return stack;
}

function renderMessageCard({ title, message, tone }) {
  const card = document.createElement("div");
  card.className = `state-card state-${tone || "idle"}`;

  const copy = document.createElement("div");
  copy.className = "state-copy";

  if (tone === "loading") {
    const spinner = document.createElement("div");
    spinner.className = "loading-indicator";
    spinner.setAttribute("aria-hidden", "true");
    card.appendChild(spinner);
  }

  const tag = document.createElement("span");
  tag.className = "state-tag";
  tag.textContent = formatToneTag(tone);

  const heading = document.createElement("h3");
  heading.textContent = title;

  const details = document.createElement("p");
  details.textContent = message;

  copy.appendChild(tag);
  copy.appendChild(heading);
  copy.appendChild(details);
  card.appendChild(copy);

  replaceResultContent(card);
}

function replaceResultContent(node) {
  elements.resultContent.replaceChildren(node);
}

function buildFetchOptions(request) {
  const headers = {
    Accept: "application/json, text/plain, */*",
    ...(request.headers || {})
  };

  const options = {
    method: request.method || "GET",
    headers
  };

  if (request.body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(request.body);
  }

  return options;
}

async function parseResponse(response) {
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!text) {
    return "";
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return text;
    }
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

function buildResponseError(response, payload) {
  const fallbackMessage = `Request failed with status ${response.status}.`;
  const payloadMessage =
    typeof payload === "string" && payload.trim()
      ? payload.trim()
      : Array.isArray(payload) || isPlainObject(payload)
        ? JSON.stringify(payload)
        : "";
  const error = new Error(payloadMessage || fallbackMessage);
  error.status = response.status;
  return error;
}

function collectStudentPayload() {
  return {
    studentId: readRequiredInteger("studentFormIdInput", "Student ID"),
    natId: readRequiredInteger("studentFormNatIdInput", "National ID"),
    fname: readRequiredText("studentFormFNameInput", "First name"),
    lname: readRequiredText("studentFormLNameInput", "Last name"),
    addres: readRequiredText("studentFormAddressInput", "Address"),
    mobile: readRequiredText("studentFormMobileInput", "Mobile number")
  };
}

function collectCoursePayload() {
  return {
    courseId: readRequiredInteger("courseFormIdInput", "Course ID"),
    nameAppre: readRequiredText("courseFormNameAppreInput", "Course abbreviation"),
    name: readRequiredText("courseFormNameInput", "Course name"),
    description: readRequiredText("courseFormDescriptionInput", "Course description")
  };
}

function readRequiredText(inputId, label) {
  return readInputValue(inputId, label).trim();
}

function readRequiredInteger(inputId, label) {
  return readRequiredNumber(inputId, label, { integer: true, min: 1 });
}

function readRequiredNumber(inputId, label, options = {}) {
  const rawValue = readInputValue(inputId, label).trim();
  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    markInputInvalid(document.getElementById(inputId));
    throw new Error(`${label} must be a valid number.`);
  }

  if (options.integer && !Number.isInteger(numericValue)) {
    markInputInvalid(document.getElementById(inputId));
    throw new Error(`${label} must be a whole number.`);
  }

  if (options.min !== undefined && numericValue < options.min) {
    markInputInvalid(document.getElementById(inputId));
    throw new Error(`${label} must be ${options.min} or greater.`);
  }

  return numericValue;
}

function readInputValue(inputId, label) {
  const input = document.getElementById(inputId);

  if (!input) {
    throw new Error(`Missing input field: ${inputId}`);
  }

  const value = input.value.trim();

  if (!value) {
    markInputInvalid(input);
    input.focus();
    throw new Error(`${label} is required.`);
  }

  return value;
}

function markInputInvalid(input) {
  if (!input) {
    return;
  }

  input.classList.add("input-error");
  input.setAttribute("aria-invalid", "true");
}

function clearInputError(input) {
  input.classList.remove("input-error");
  input.removeAttribute("aria-invalid");
}

function clearInputErrors() {
  inputs.forEach((input) => clearInputError(input));
}

function flattenRecord(record, prefix = "", output = {}) {
  if (!isPlainObject(record)) {
    return output;
  }

  Object.entries(record).forEach(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      flattenRecord(value, nextKey, output);
      return;
    }

    output[nextKey] = normalizeRecordValue(value);
  });

  return output;
}

function normalizeRecordValue(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return "N/A";
    }

    return value
      .map((item) => {
        if (isPlainObject(item)) {
          return JSON.stringify(item);
        }

        return String(item);
      })
      .join(", ");
  }

  return value;
}

function derivePayloadState(payload) {
  if (payload === "" || payload === null || payload === undefined) {
    return { statusText: "Empty", statusTone: "empty" };
  }

  if (Array.isArray(payload)) {
    return payload.length
      ? { statusText: "Success", statusTone: "success" }
      : { statusText: "Empty", statusTone: "empty" };
  }

  if (typeof payload === "string") {
    return deriveTextState(payload);
  }

  if (isPlainObject(payload)) {
    return Object.keys(payload).length
      ? { statusText: "Success", statusTone: "success" }
      : { statusText: "Empty", statusTone: "empty" };
  }

  return { statusText: "Success", statusTone: "success" };
}

function deriveTextState(text) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return { statusText: "Empty", statusTone: "empty" };
  }

  const warningSignals = [
    "already enrolled",
    "fail to pass",
    "has not finish",
    "is found"
  ];

  const errorSignals = [
    "error",
    "not found",
    "not exist",
    "not saved",
    "not updated",
    "not deleted",
    "can not",
    "is not enrolled",
    "student is not enrolled",
    "wrong url",
    "contact with admin"
  ];

  if (warningSignals.some((signal) => normalized.includes(signal))) {
    return { statusText: "Attention", statusTone: "warning" };
  }

  if (errorSignals.some((signal) => normalized.includes(signal))) {
    return { statusText: "Problem", statusTone: "error" };
  }

  return { statusText: "Success", statusTone: "success" };
}

function buildSummaryText(payload, state) {
  if (state.statusTone === "empty") {
    return "The API returned no data.";
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return `${payload.length} record${payload.length === 1 ? "" : "s"} returned from the API.`;
  }

  if (isPlainObject(payload)) {
    const fieldCount = Object.keys(flattenRecord(payload)).length;
    return `${fieldCount} field${fieldCount === 1 ? "" : "s"} returned from the API.`;
  }

  return "Request completed successfully.";
}

function buildApiUrl(path, params = {}) {
  const baseOrigin = window.location.protocol === "file:" ? "http://localhost:8081" : window.location.origin;
  const url = new URL(`/api/${path}`, baseOrigin);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url;
}

function buildRequestText(method, url) {
  return `${method} ${url.pathname}${url.search}`;
}

function setResultMeta({ title, summary, statusText, statusTone, requestText }) {
  elements.resultTitle.textContent = title;
  elements.resultSummary.textContent = summary;
  elements.resultStatus.textContent = statusText;
  elements.resultStatus.className = `status-badge status-${statusTone}`;
  elements.resultEndpoint.textContent = requestText;
}

function setBusy(isBusy) {
  uiState.busy = isBusy;
  syncActionButtonState();
}

function setActiveActionButton(buttonId) {
  uiState.activeActionButtonId = buttonId;

  actionButtons.forEach((button) => {
    button.classList.toggle("is-active", button.id === buttonId);
  });
}

function syncActionButtonState() {
  actionButtons.forEach((button) => {
    button.disabled = uiState.busy || !isHostedDashboard;
  });
}

function showHostNotice(message) {
  elements.hostNotice.textContent = message;
  elements.hostNotice.classList.remove("is-hidden");
}

function hideHostNotice() {
  elements.hostNotice.textContent = "";
  elements.hostNotice.classList.add("is-hidden");
}

function formatLabel(value) {
  return value
    .replace(/[._-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDisplayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return String(value);
}

function formatToneTag(tone) {
  const tags = {
    idle: "Ready",
    loading: "Loading",
    success: "Success",
    warning: "Attention",
    error: "Error",
    empty: "Empty"
  };

  return tags[tone] || "Info";
}

function getFriendlyErrorMessage(error) {
  if (error && error.message === "Failed to fetch") {
    return "The browser could not reach the API. Make sure Spring Boot is running and open the dashboard from http://localhost:8081/.";
  }

  return error && error.message ? error.message : "Unknown error";
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
