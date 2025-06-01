const functions = [ 
  
  {
    "name": "getPermitDetails",
    "description": "Retrieve all fields for a single permit by its unique Permit ID.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "The unique ID of the permit (e.g. \"PTW123\")."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "getPermitStatus",
    "description": "Fetch only the current status (and optionally history) of a single permit by its ID.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "The unique ID of the permit whose status is requested."
        },
        "includeHistory": {
          "type": "boolean",
          "description": "If true, also return the audit trail of status changes."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "searchPermitsByTaskName",
    "description": "Return a list of permits whose task name matches (or partially matches) the given string. Used when the user asks for a permit by task name and the ID is not given or is ambiguous.",
    "parameters": {
      "type": "object",
      "properties": {
        "taskName": {
          "type": "string",
          "description": "Task name or partial task name to search for (e.g. \"Roof Repair\")."
        }
      },
      "required": ["taskName"]
    }
  },
  {
    "name": "searchPermitsByRequester",
    "description": "Return a list of permits requested by a given person or team.",
    "parameters": {
      "type": "object",
      "properties": {
        "requester": {
          "type": "string",
          "description": "Name or ID of the person/team who requested the permit (e.g. \"John Doe\")."
        }
      },
      "required": ["requester"]
    }
  },
  {
    "name": "listActivePermitsByDepartment",
    "description": "Return all active (i.e., status not in [Completed, Closed, Cancelled, Rejected]) permits for a specified department.",
    "parameters": {
      "type": "object",
      "properties": {
        "department": {
          "type": "string",
          "description": "Name of the department (e.g. \"Production\")."
        }
      },
      "required": ["department"]
    }
  },
  {
    "name": "getSafetyRequirements",
    "description": "Return the hazard identification, risk levels, and control measures for a specific permit.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "The permit ID to fetch safety requirements for."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "getIsolationProcedures",
    "description": "Return the isolation and de-isolation steps (and LOTO info) for a specific permit.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "The permit ID to fetch isolation procedures for."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "getContractorInfo",
    "description": "Return contractor company info and number of contractor personnel for a specific permit.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "The permit ID to fetch contractor information for."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "getCompanyWorkers",
    "description": "Return an array of internal company workers assigned to a given permit, including their roles.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "Permit ID whose internal workers should be returned."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "getEmergencyProcedures",
    "description": "Return emergency contacts, evacuation routes, first aid locations, and procedures for a given permit.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "Permit ID whose emergency procedures are needed."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "getApprovers",
    "description": "Return a list of approvers (Name/ID/Role) for a specific permit.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "The permit ID to fetch approvers for."
        }
      },
      "required": ["permitId"]
    }
  },
  {
    "name": "getPermitHistory",
    "description": "Return the chronological audit trail (all actions, status changes, comments) for a given permit.",
    "parameters": {
      "type": "object",
      "properties": {
        "permitId": {
          "type": "string",
          "description": "Permit ID whose history is requested."
        }
      },
      "required": ["permitId"]
    }
  },
  {
  name: "searchPermitsNatural",
  description: "Search permits using combined filters: permitId, taskName, requester, department",
  parameters: {
    type: "object",
    properties: {
      permitId: { type: "string", description: "Permit number" },
      taskName: { type: "string", description: "Task name" },
      requester: { type: "string", description: "Requester name" },
      department: { type: "string", description: "Department name" },
      
    },
    required: [],
  },
}



];

export { functions };
