// /backend/dummyPermits.js
export default [
  {
    permitId: "PTW303",
    taskName: "Boiler Inspection",
    requester: "alice.smith",
    descriptionOfWork: "Inspect and ensure safe operation of industrial boiler located in Plant A.",
    startDateTime: "2025-06-01T08:00:00Z",
    endDateTime: "2025-06-01T12:00:00Z",
    currentStatus: "Issued",
    workLocation: "Plant A, Boiler Room 2",
    servicePurchaseOrder: "PO‑45532",
    department: "Maintenance",
    safetyRequirements: {
      hazards: [
        { hazard: "High Temperature", riskLevel: "Medium" },
        { hazard: "Confined Space", riskLevel: "High" }
      ],
      riskLevels: ["Medium", "High"],
      controlMeasures: [
        "Wear heat‑resistant gloves",
        "Ensure confined space permit is in place"
      ],
      riskAssessmentDocId: "RA‑2025‑072"
    },
    isolationProcedures: {
      isolationSteps: [
        "Shut down boiler main fuel supply valve",
        "Vent remaining pressure from the vessel"
      ],
      deIsolationSteps: [
        "Re‑open fuel supply valve slowly",
        "Allow system to repressurize and check for leaks"
      ],
      lockoutRequired: true,
      lotoDetails: "Lockout tag #LOTO‑B123 on fuel valve handle"
    },
    contractorInfo: {
      contractorCompany: "SafeHeat Inc.",
      contractorSupervisor: "bob.jones",
      contractorPersonnelCount: 3
    },
    companyWorkers: [
      { name: "charlie.white", role: "Lead Inspector" },
      { name: "dana.green", role: "Safety Officer" }
    ],
    emergencyProcedures: {
      emergencyContacts: [
        { name: "Plant A Control Room", phone: "+1‑555‑1010" }
      ],
      evacuationRoutes: ["Exit through Door 3, proceed to Muster Point B"],
      firstAidLocations: ["First Aid Kit in Control Room"],
      procedures: {
        fire: "Sound alarm, alert Fire Brigade, evacuate area",
        chemicalSpill: "Use spill kit, cordon off area, notify EHS"
      }
    },
    approvers: [
      { name: "carol.green", role: "Safety Manager" },
      { name: "edward.black", role: "Plant Manager" }
    ],
    history: [
      {
        timestamp: "2025-05-01T09:00:00Z",
        action: "Submitted",
        by: "alice.smith",
        comments: "Initial request created"
      },
      {
        timestamp: "2025-05-02T10:30:00Z",
        action: "Under Review",
        by: "bob.jones",
        comments: "Checked safety documents"
      },
      {
        timestamp: "2025-05-03T14:15:00Z",
        action: "Issued",
        by: "carol.green",
        comments: "Approved by safety team"
      }
    ]
  },

  // … add 2‑3 more permits with varied statuses, task names, departments, etc.
];
