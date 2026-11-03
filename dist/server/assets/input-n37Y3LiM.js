import { t as cn } from "./utils-DWGjSd5x.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/components/ui/field.tsx
var FieldContext = React.createContext(null);
function useFieldProps(props) {
	const context = React.useContext(FieldContext);
	if (!context) return props;
	const describedBy = [
		props["aria-describedby"],
		context.descriptionId,
		context.errorId
	].filter(Boolean).join(" ");
	return {
		...props,
		id: context.id,
		required: props.required ?? context.required,
		"aria-describedby": describedBy || void 0,
		"aria-invalid": context.error ? true : props["aria-invalid"]
	};
}
// src/components/ui/input.tsx
function Input({ className, type, ...props }) {
	const fieldProps = useFieldProps(props);
	return /* @__PURE__ */ jsx("input", {
		type,
		"data-slot": "input",
		className: cn("min-h-11 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", className),
		...fieldProps
	});
}
export { useFieldProps as n, Input as t };
