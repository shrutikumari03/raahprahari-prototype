import { t as ReportStepPage } from "./report-step-page-D5glEQLU.js";
import { useNavigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
// src/routes/report.location.tsx?tsr-split=component
function ReportLocationPage() {
	const navigate = useNavigate();
	const go = (path) => {
		if (path === "/") navigate({ to: path });
		else navigate({
			to: path,
			search: { segment: void 0 }
		});
	};
	return /* @__PURE__ */ jsx(ReportStepPage, {
		step: "location",
		navigate: go
	});
}
export { ReportLocationPage as component };
