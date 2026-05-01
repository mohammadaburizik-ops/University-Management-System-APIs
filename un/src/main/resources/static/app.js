const resultTitle = document.getElementById("resultTitle");
const resultStatus = document.getElementById("resultStatus");
const resultEndpoint = document.getElementById("resultEndpoint");
const resultContent = document.getElementById("resultContent");
const apiRoot = resolveApiRoot();

const controls = [
  "loadStudentsButton",
  "loadCoursesButton",
  "loadGradesButton",
  "findStudentButton",
  "studentCoursesButton",
  "findCourseButton",
  "courseStudentsButton",
  "studentGradeButton",
  "setStudentCourseGradeButton",
  "saveStudentButton",
  "updateStudentButton",
  "deleteStudentButton",
  "saveCourseButton",
  "updateCourseButton",
  "deleteCourseButton",
  "enrollStudentCourseButton"
]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

initializeDashboard();

bindAction("loadStudentsButton", "All Students", () => ({
  endpoint: buildApiPath("getallstudent")
}));

bindAction("loadCoursesButton", "All Courses", () => ({
  endpoint: buildApiPath("getallcourse")
}));

bindAction("loadGradesButton", "All Student Grades", () => ({
  endpoint: buildApiPath("getallstudentgrade")
}));

bindAction("findStudentButton", "Student Lookup", () => ({
  endpoint: buildApiPath("getStudent", {
    stdId: readRequiredNumber("studentIdInput", "Student ID")
  })
}));

bindAction("studentCoursesButton", "Student Courses", () => ({
  endpoint: buildApiPath("getAllStudentCourses", {
    studentId: readRequiredNumber("studentCoursesInput", "Student ID")
  })
}));

bindAction("findCourseButton", "Course Lookup", () => ({
  endpoint: buildApiPath("getCourse", {
    corId: readRequiredNumber("courseIdInput", "Course ID")
  })
}));

bindAction("courseStudentsButton", "Course Students", () => ({
  endpoint: buildApiPath("getAllCourseStudents", {
    courseId: readRequiredNumber("courseStudentsInput", "Course ID")
  })
}));

bindAction("studentGradeButton", "Student Grade", () => ({
  endpoint: buildApiPath("getstudentcoursegrade", {
    studentId: readRequiredNumber("gradeStudentIdInput", "Student ID"),
    courseId: readRequiredNumber("gradeCourseIdInput", "Course ID")
  })
}));

bindAction("setStudentCourseGradeButton", "Set Student Course Grade", () => ({
  method: "POST",
  endpoint: buildApiPath("setStudentCourseGrade", {
    studentId: readRequiredNumber("setGradeStudentIdInput", "Student ID"),
    courseId: readRequiredNumber("setGradeCourseIdInput", "Course ID"),
    grade: readRequiredNumber("setGradeValueInput", "Grade")
  })
}));

bindAction("saveStudentButton", "Save Student", () => ({
  method: "POST",
  endpoint: buildApiPath("saveStudent"),
  body: collectStudentPayload()
}));

bindAction("updateStudentButton", "Update Student", () => ({
  method: "PUT",
  endpoint: buildApiPath("updateStudent"),
  body: collectStudentPayload()
}));

bindAction("deleteStudentButton", "Delete Student", () => ({
  method: "DELETE",
  endpoint: buildApiPath("deleteStudent", {
    studentId: readRequiredNumber("deleteStudentIdInput", "Student ID")
  })
}));

bindAction("saveCourseButton", "Save Course", () => ({
  method: "POST",
  endpoint: buildApiPath("saveCourse"),
  body: collectCoursePayload()
}));

bindAction("updateCourseButton", "Update Course", () => ({
  method: "PUT",
  endpoint: buildApiPath("updateCourse"),
  body: collectCoursePayload()
}));

bindAction("deleteCourseButton", "Delete Course", () => ({
  method: "DELETE",
  endpoint: buildApiPath("deleteCourse", {
    courseID: readRequiredNumber("deleteCourseIdInput", "Course ID")
  })
}));

bindAction("enrollStudentCourseButton", "Enroll Student In Course", () => ({
  method: "POST",
  endpoint: buildApiPath("enrollstudent", {
    studentId: readRequiredNumber("enrollStudentIdInput", "Student ID"),
    courseId: readRequiredNumber("enrollCourseIdInput", "Course ID")
  })
}));

function bindAction(buttonId, title, requestFactory) {
  const button = document.getElementById(buttonId);

  if (!button) {
    return;
  }

  button.addEventListener("click", (event) => {
    setActiveControl(event.currentTarget);
    runValidatedAction(title, requestFactory);
  });
}

async function runRequest(title, request) {
  const method = request.method || "GET";
  const endpoint = request.endpoint;

  setBusy(true);
  setMeta(title, "Loading", buildRequestLabel(method, endpoint), "neutral");
  resultContent.innerHTML = buildMessageCard(
    method === "GET" ? "Fetching Data" : "Sending Request",
    method === "GET"
      ? "Please wait while the dashboard talks to the API."
      : "Please wait while the dashboard sends your changes to the API."
  );

  try {
    const response = await fetch(endpoint, buildFetchOptions(request));
    const payload = await parseResponse(response);

    if (!response.ok) {
      const message = typeof payload === "string" ? payload : JSON.stringify(payload);
      throw new Error(message || `Request failed with status ${response.status}`);
    }

    renderResult(title, method, endpoint, payload);
  } catch (error) {
    setMeta(title, "Error", buildRequestLabel(method, endpoint), "error");
    resultContent.innerHTML = buildMessageCard("Request Failed", getFriendlyErrorMessage(error));
  } finally {
    setBusy(false);
  }
}

async function runValidatedAction(title, requestFactory) {
  try {
    const request = requestFactory();
    await runRequest(title, request);
  } catch (error) {
    setMeta(title, "Input Needed", "No request sent", "error");
    resultContent.innerHTML = buildMessageCard("Input Required", error.message || "Please fill in the required fields.");
  }
}

function renderResult(title, method, endpoint, payload) {
  const responseState = deriveResponseState(payload);
  setMeta(title, responseState.label, buildRequestLabel(method, endpoint), responseState.statusClass);

  if (typeof payload === "string") {
    resultContent.innerHTML = buildMessageCard("Message", payload);
    return;
  }

  if (Array.isArray(payload)) {
    resultContent.innerHTML = renderArray(payload);
    return;
  }

  if (payload && typeof payload === "object") {
    resultContent.innerHTML = renderObject(payload);
    return;
  }

  resultContent.innerHTML = buildMessageCard("No Data", "The API returned an empty response.");
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

function renderArray(items) {
  if (!items.length) {
    return buildMessageCard("No Results", "The API returned an empty list.");
  }

  const normalized = items.map((item) => flattenRecord(item));
  const columns = Array.from(
    normalized.reduce((set, item) => {
      Object.keys(item).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  const head = columns
    .map((column) => `<th>${escapeHtml(formatLabel(column))}</th>`)
    .join("");

  const rows = normalized
    .map((item) => {
      const cells = columns
        .map((column) => `<td>${escapeHtml(formatDisplayValue(item[column]))}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div class="result-stack">
      <span class="count-pill">${items.length} record${items.length === 1 ? "" : "s"}</span>
      <div class="result-table-wrap">
        <table class="result-table">
          <thead>
            <tr>${head}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderObject(item) {
  const flattened = flattenRecord(item);
  const cards = Object.entries(flattened)
    .map(
      ([key, value]) => `
        <div class="data-chip">
          <span>${escapeHtml(formatLabel(key))}</span>
          <strong>${escapeHtml(formatDisplayValue(value))}</strong>
        </div>
      `
    )
    .join("");

  return `<div class="object-grid">${cards}</div>`;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

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

function collectStudentPayload() {
  return {
    studentId: readRequiredNumber("studentFormIdInput", "Student ID"),
    fname: readRequiredText("studentFormFNameInput", "First name"),
    lname: readRequiredText("studentFormLNameInput", "Last name"),
    addres: readRequiredText("studentFormAddressInput", "Address"),
    mobile: readRequiredText("studentFormMobileInput", "Mobile number"),
    natId: readRequiredNumber("studentFormNatIdInput", "National ID")
  };
}

function collectCoursePayload() {
  return {
    courseId: readRequiredNumber("courseFormIdInput", "Course ID"),
    name: readRequiredText("courseFormNameInput", "Course name"),
    description: readRequiredText("courseFormDescriptionInput", "Course description"),
    nameAppre: readRequiredText("courseFormNameAppreInput", "Course abbreviation")
  };
}

function flattenRecord(record, prefix = "") {
  return Object.entries(record).reduce((accumulator, [key, value]) => {
    const nextKey = prefix ? `${prefix} ${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(accumulator, flattenRecord(value, nextKey));
      return accumulator;
    }

    accumulator[nextKey] = Array.isArray(value) ? value.join(", ") : value;
    return accumulator;
  }, {});
}

function formatLabel(value) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function buildMessageCard(title, message) {
  return `
    <div class="message-card">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

function setMeta(title, statusText, endpoint, statusClass) {
  resultTitle.textContent = title;
  resultStatus.textContent = statusText;
  resultStatus.className = `status-pill ${statusClass}`;
  resultEndpoint.textContent = endpoint;
}

function setBusy(isBusy) {
  controls.forEach((control) => {
    control.disabled = isBusy;
  });
}

function setActiveControl(activeControl) {
  controls.forEach((control) => {
    control.classList.toggle("is-active", control === activeControl);
  });
}

function readRequiredValue(inputId, label) {
  const value = document.getElementById(inputId).value.trim();

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function readRequiredText(inputId, label) {
  return readRequiredValue(inputId, label);
}

function readRequiredNumber(inputId, label) {
  const value = readRequiredValue(inputId, label);
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return parsedValue;
}

function formatDisplayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return String(value);
}

function buildApiPath(path, params = {}) {
  const url = new URL(`${apiRoot}/${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

function buildRequestLabel(method, endpoint) {
  return `${method} ${endpoint}`;
}

function resolveApiRoot() {
  if (window.location.protocol === "file:") {
    return "http://localhost:8081/api";
  }

  return `${window.location.origin}/api`;
}

function getFriendlyErrorMessage(error) {
  if (error && error.message === "Failed to fetch") {
    return "The browser could not reach the API. Open the dashboard from http://localhost:8081/ or keep the backend running on port 8081.";
  }

  return error && error.message ? error.message : "Unknown error";
}

function initializeDashboard() {
  if (window.location.protocol === "file:") {
    setMeta("Open Through Spring Boot", "Wrong URL", "file:// detected", "error");
    resultContent.innerHTML = buildMessageCard(
      "Open The Hosted Page",
      "You opened the source file directly from disk. Run the Spring Boot app and open http://localhost:8081/ instead of file:///.../index.html."
    );
  }
}

function deriveResponseState(payload) {
  if (typeof payload !== "string") {
    return { label: "Success", statusClass: "success" };
  }

  const normalized = payload.trim().toLowerCase();
  const errorSignals = [
    "error",
    "not found",
    "not exist",
    "not saved",
    "not updated",
    "not deleted",
    "already enrolled",
    "system error",
    "fail to pass",
    "course is found",
    "student is found",
    "is not found",
    "is not enrolled"
  ];

  const hasErrorSignal = errorSignals.some((signal) => normalized.includes(signal));

  if (hasErrorSignal) {
    return { label: "Returned Issue", statusClass: "error" };
  }

  return { label: "Success", statusClass: "success" };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
