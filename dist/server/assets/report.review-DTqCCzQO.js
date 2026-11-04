import { t as ReportStepPage } from "./report-step-page-D5glEQLU.js";
import { useNavigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
// src/routes/report.review.tsx?tsr-split=component
function ReportReviewPage() {
	const navigate = useNavigate();
	const go = (path) => {
		if (path === "/") navigate({ to: path });
		else navigate({
			to: path,
			search: { segment: void 0 }
		});
	};
	return /* @__PURE__ */ jsx(ReportStepPage, {
		step: "review",
		navigate: go
	});
}
export { ReportReviewPage as component };
