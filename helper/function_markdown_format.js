export function permitToMarkdown(permit) {
  const dash = "-";
  const safe = (val) => (val !== undefined && val !== null && val !== "" ? val : dash);

  const fieldRows = [];

  // Permit Details
  fieldRows.push(
    ["Task Name", safe(permit.taskName)],
    ["Requester", safe(permit.requester)],
    ["Description of Work", safe(permit.descriptionOfWork)],
    ["Start Date & Time", safe(permit.startDateTime)],
    ["End Date & Time", safe(permit.endDateTime)],
    ["Current Status", safe(permit.currentStatus)],
    ["Work Location", safe(permit.workLocation)],
    ["Service Purchase Order", safe(permit.servicePurchaseOrder)],
    ["Department", safe(permit.department)]
  );

  // Safety Requirements
  const hazards = permit.safetyRequirements?.hazards || [];
  const riskLevels = permit.safetyRequirements?.riskLevels || [];
  const controlMeasures = (permit.safetyRequirements?.controlMeasures || []).join(", ") || dash;

  hazards.forEach((hazard, i) => {
    fieldRows.push([
      `Hazard #${i + 1}`,
      `Hazard: ${hazard}, Risk Level: ${safe(riskLevels[i])}, Control Measures: ${controlMeasures}`
    ]);
  });

  fieldRows.push([
    "Risk Assessment Document ID",
    safe(permit.safetyRequirements?.riskAssessmentDocId)
  ]);

  // Isolation Procedures
  const isoSteps = (permit.isolationProcedures?.isolationSteps || []).map(s => `- ${s}`).join("<br>") || dash;
  const deIsoSteps = (permit.isolationProcedures?.deIsolationSteps || []).map(s => `- ${s}`).join("<br>") || dash;
  const lockoutRequired = permit.isolationProcedures?.lockoutRequired ? "Yes" : "No";
  const lotoDetails = safe(permit.isolationProcedures?.lotoDetails);

  fieldRows.push(
    ["Isolation Steps", isoSteps],
    ["De-Isolation Steps", deIsoSteps],
    ["Lockout Required", lockoutRequired],
    ["LOTO Details", lotoDetails]
  );

  // Contractor Info
  fieldRows.push(
    ["Contractor Company", safe(permit.contractorInfo?.contractorCompany)],
    ["Contractor Supervisor", safe(permit.contractorInfo?.contractorSupervisor)],
    ["Contractor Personnel Count", safe(permit.contractorInfo?.contractorPersonnelCount)]
  );

  // Company Workers
  const workers = permit.companyWorkers || [];
  if (workers.length) {
    workers.forEach((w, i) =>
      fieldRows.push([`Company Worker #${i + 1}`, `Name: ${safe(w.name)}, Role: ${safe(w.role)}`])
    );
  }

  // Emergency Procedures
  fieldRows.push(
    ["Emergency Contacts", (permit.emergencyProcedures?.emergencyContacts || []).join(", ") || dash],
    ["Evacuation Routes", safe(permit.emergencyProcedures?.evacuationRoutes)],
    ["First Aid Locations", safe(permit.emergencyProcedures?.firstAidLocations)],
    [
      "Emergency Procedures",
      (permit.emergencyProcedures?.procedures || [])
        .map(p => `**${p.type}:** ${p.description}`)
        .join("<br>") || dash
    ]
  );

  // Approvers
  const approvers = permit.approvers || [];
  if (approvers.length) {
    approvers.forEach((a, i) =>
      fieldRows.push([`Approver #${i + 1}`, `Name: ${safe(a.name)}, Position: ${safe(a.position)}`])
    );
  }

  // History
  const history = permit.history || [];
  if (history.length) {
    history.forEach((h, i) =>
      fieldRows.push([
        `History #${i + 1}`,
        `Stage: ${safe(h.stage)}, Time: ${safe(h.timestamp)}, By: ${safe(h.by)}, Comments: ${safe(h.comments)}`
      ])
    );
  }

  // Final single markdown table output
  const header = "| Field | Details |\n|-------|---------|";
  const rows = fieldRows.map(([field, detail]) => `| ${field} | ${detail} |`).join("\n");

  return `## ✅ Permit Summary\n\n${header}\n${rows}`;
}
