import { t as ReportStepPage } from "./report-step-page-D5glEQLU.js";
import { useNavigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
// src/routes/report.index.tsx?tsr-split=component
function ReportObservationPage() {
	const navigate = useNavigate();
	const go = (path) => {
		if (path === "/") navigate({ to: path });
		else navigate({
			to: path,
			search: { segment: void 0 }
		});
	};
	return /* @__PURE__ */ jsx(ReportStepPage, {
		step: "observation",
		navigate: go
	});
}
export { ReportObservationPage as component };
