import { t as ReportStepPage } from "./report-step-page-D5glEQLU.js";
import { useNavigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
// src/routes/report.received.tsx?tsr-split=component
function ReportReceivedPage() {
	const navigate = useNavigate();
	const go = (path) => {
		if (path === "/") navigate({ to: path });
		else navigate({
			to: path,
			search: { segment: void 0 }
		});
	};
	return /* @__PURE__ */ jsx(ReportStepPage, {
		step: "received",
		navigate: go
	});
}
export { ReportReceivedPage as component };
