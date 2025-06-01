export default function getApiUrl(fnName, args) {
  const encode = encodeURIComponent;
  switch (fnName) {
    case "getPermitDetails": return `http://localhost:3000/permits/${args.permitId}`;
    case "getPermitStatus": return `http://localhost:3000/permits/${args.permitId}/status?includeHistory=${!!args.includeHistory}`;
    case "searchPermitsByTaskName": return `http://localhost:3000/permits/search/task?taskName=${encode(args.taskName)}`;
    case "getSafetyRequirements": return `http://localhost:3000/permits/${args.permitId}/safety`;
    case "getIsolationProcedures": return `http://localhost:3000/permits/${args.permitId}/isolation`;
    case "getContractorInfo": return `http://localhost:3000/permits/${args.permitId}/contractor`;
    case "getCompanyWorkers": return `http://localhost:3000/permits/${args.permitId}/workers`;
    case "getEmergencyProcedures": return `http://localhost:3000/permits/${args.permitId}/emergency`;
    case "getApprovers": return `http://localhost:3000/permits/${args.permitId}/approvers`;
    case "getPermitHistory": return `http://localhost:3000/permits/${args.permitId}/history`;
    case "searchPermitsByRequester": return `http://localhost:3000/permits/search/requester?requester=${encode(args.requester)}`;
    case "listActivePermitsByDepartment": return `http://localhost:3000/permits/active/department/${encode(args.department)}`;
    case "searchPermitsNatural":
  const queryParams = [];
  if (args.permitId) queryParams.push(`permitId=${encode(args.permitId)}`);
  if (args.taskName) queryParams.push(`taskName=${encode(args.taskName)}`);
  if (args.requester) queryParams.push(`requester=${encode(args.requester)}`);
  if (args.department) queryParams.push(`department=${encode(args.department)}`);
  return `http://localhost:3000/permits/search/natural?${queryParams.join("&")}`;
    default: return null;
  }
}