// /backend/index.js
import express from "express";
import bodyParser from "body-parser";
import dummyPermits from "../dummy.js";
import chatRouter from "../routes/chat.js";
const app = express();
app.use(bodyParser.json());

app.use('/api/chat', chatRouter);


app.get("/", (req, res) => {
  res.send("Hello, I am the Permit Management Agent!");
});

// Utility to find a permit by ID (case‑insensitive)
function findPermitById(id) {
  return dummyPermits.find(
    (p) => p.permitId.toLowerCase() === id.toLowerCase()
  );
}

// 1. GET /permits/:id         → getPermitDetails
app.get("/permits/:id", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  res.json({ success: true, data: permit });
});

// 2. GET /permits/:id/status  → getPermitStatus
app.get("/permits/:id/status", (req, res) => {
  const { id } = req.params;
  const includeHistory = req.query.includeHistory === "true";
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const response = {
    permitId: permit.permitId,
    currentStatus: permit.currentStatus,
  };
  if (includeHistory) {
    response.history = permit.history || [];
  }
  res.json({ success: true, data: response });
});

// 3. GET /permits/search/task  → searchPermitsByTaskName
app.get("/permits/search/task", (req, res) => {
  const { taskName } = req.query;
  if (!taskName)
    return res
      .status(400)
      .json({ success: false, error: "taskName query parameter required" });
  const results = dummyPermits.filter((p) =>
    p.taskName.toLowerCase().includes(taskName.toLowerCase())
  );
  res.json({ success: true, data: results });
});

// 4. GET /permits/search/requester → searchPermitsByRequester
app.get("/permits/search/requester", (req, res) => {
  const { requester } = req.query;
  if (!requester)
    return res
      .status(400)
      .json({ success: false, error: "requester query parameter required" });
  const results = dummyPermits.filter(
    (p) => p.requester.toLowerCase() === requester.toLowerCase()
  );
  res.json({ success: true, data: results });
});

// 5. GET /permits/active/department/:dept → listActivePermitsByDepartment
app.get("/permits/active/department/:dept", (req, res) => {
  const { dept } = req.params;
  const results = dummyPermits.filter(
    (p) =>
      p.department.toLowerCase() === dept.toLowerCase() &&
      !["Completed", "Closed", "Cancelled", "Rejected"].includes(
        p.currentStatus
      )
  );
  res.json({ success: true, data: results });
});

// 6. GET /permits/:id/safety  → getSafetyRequirements
app.get("/permits/:id/safety", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const { hazards, riskLevels, controlMeasures, riskAssessmentDocId } =
    permit.safetyRequirements || {};
  res.json({
    success: true,
    data: { permitId: permit.permitId, hazards, riskLevels, controlMeasures, riskAssessmentDocId },
  });
});

// 7. GET /permits/:id/isolation → getIsolationProcedures
app.get("/permits/:id/isolation", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const {
    isolationSteps,
    deIsolationSteps,
    lockoutRequired,
    lotoDetails
  } = permit.isolationProcedures || {};
  res.json({
    success: true,
    data: { permitId: permit.permitId, isolationSteps, deIsolationSteps, lockoutRequired, lotoDetails },
  });
});

// 8. GET /permits/:id/contractor → getContractorInfo
app.get("/permits/:id/contractor", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const { contractorCompany, contractorSupervisor, contractorPersonnelCount } =
    permit.contractorInfo || {};
  res.json({
    success: true,
    data: { permitId: permit.permitId, contractorCompany, contractorSupervisor, contractorPersonnelCount },
  });
});

// 9. GET /permits/:id/workers → getCompanyWorkers
app.get("/permits/:id/workers", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const { companyWorkers } = permit || {};
  res.json({ success: true, data: { permitId: permit.permitId, companyWorkers } });
});

// 10. GET /permits/:id/emergency → getEmergencyProcedures
app.get("/permits/:id/emergency", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const { emergencyContacts, evacuationRoutes, firstAidLocations, procedures } =
    permit.emergencyProcedures || {};
  res.json({
    success: true,
    data: { permitId: permit.permitId, emergencyContacts, evacuationRoutes, firstAidLocations, procedures },
  });
});

// 11. GET /permits/:id/approvers → getApprovers
app.get("/permits/:id/approvers", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const { approvers } = permit || {};
  res.json({ success: true, data: { permitId: permit.permitId, approvers } });
});

// 12. GET /permits/:id/history → getPermitHistory
app.get("/permits/:id/history", (req, res) => {
  const { id } = req.params;
  const permit = findPermitById(id);
  if (!permit)
    return res.status(404).json({ success: false, error: "Permit not found" });
  const { history } = permit || {};
  res.json({ success: true, data: { permitId: permit.permitId, history } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PTW Sentinel backend listening on port ${PORT}`);
});
