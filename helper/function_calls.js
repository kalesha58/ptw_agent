export default function getApiUrl(fnName, args) {
  const encode = encodeURIComponent;
  switch (fnName) {
    case "getPermitDetails": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}`;
    case "getPermitStatus": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/status?includeHistory=${!!args.includeHistory}`;
    case "searchPermitsByTaskName": return `https://ptw-agent-i5nb.vercel.app/permits/search/task?taskName=${encode(args.taskName)}`;
    case "getSafetyRequirements": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/safety`;
    case "getIsolationProcedures": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/isolation`;
    case "getContractorInfo": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/contractor`;
    case "getCompanyWorkers": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/workers`;
    case "getEmergencyProcedures": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/emergency`;
    case "getApprovers": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/approvers`;
    case "getPermitHistory": return `https://ptw-agent-i5nb.vercel.app/permits/${args.permitId}/history`;
    case "searchPermitsByRequester": return `https://ptw-agent-i5nb.vercel.app/permits/search/requester?requester=${encode(args.requester)}`;
    case "listActivePermitsByDepartment": return `https://ptw-agent-i5nb.vercel.app/permits/active/department/${encode(args.department)}`;
    case "searchPermitsNatural":
  const queryParams = [];
  if (args.permitId) queryParams.push(`permitId=${encode(args.permitId)}`);
  if (args.taskName) queryParams.push(`taskName=${encode(args.taskName)}`);
  if (args.requester) queryParams.push(`requester=${encode(args.requester)}`);
  if (args.department) queryParams.push(`department=${encode(args.department)}`);
  return `https://ptw-agent-i5nb.vercel.app/permits/search/natural?${queryParams.join("&")}`;
    default: return null;
  }
}