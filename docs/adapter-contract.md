# Adapter Contract (BE1-02)

Status: PROPOSED
Note: Ye naam BEHAVIOUR batate hain. Jab implement ho, actual route/function ka naam "Actual name" column me bhara jayega.

## Rules
- Har response me UTC timestamps hone chahiye.
- Event time, receipt time, review time, aur cache time alag fields me honge.
- Private evidence aur public advisory bilkul alag outputs honge.
- Koi raw SQL error ya secret response me nahi aana chahiye.

## Standard error format
Har error ka standard JSON format yeh hoga:
```json
{
  "code": "REPORT_CONFLICT",
  "message": "Is UUID se pehle alag payload aa chuka hai.",
  "field_errors": { "event_time": "Future me nahi ho sakta" },
  "retryable": false,
  "request_id": "req_8f3a1c"
}

#,Behaviour,Owner,Primary consumer,Input (short),Output (short),Status,Actual name
1,Submit report,BE1,Sudiksha,validated payload + client UUID,"report ID, receipt time, media requirements",Planned,
2,Complete media,BE1,Sudiksha,owner + object + report link,attachment state,Planned,
3,Get segments / advisory,"BE2 (output), BE1 (access)",Shruti,segment filter,"sanitized segment, action, condition, restriction, evidence, time, rule-version",Planned,
4,Extract report,BE2,Sudiksha,report text/media,schema-valid unconfirmed suggestions + provider mode + uncertainty,Planned,extract-hazard (Edge Fn)
5,Get reviewer incidents,BE2,Vanshika,reviewer identity,incidents + evidence + conflicts,Planned,
6,Review mutation,BE2,Vanshika,action + rationale + expected_version,outcome + audit,Planned,
7,Clearance report,BE2,Vanshika,observation,pending state,Planned,
8,Official update,BE2 (+BE1 checks),Vanshika,"role+jurisdiction, source ref, time, restriction, expected_version",updated state + history,Planned,
9,Contribution views/mutations,BE2,Optional,-,-,Optional,