import { t as cn } from "./utils-DWGjSd5x.js";
import { t as Button } from "./button-CFj87KzT.js";
import { c as PLACES, f as SEGMENTS, m as placeById, t as STORAGE_KEYS } from "./storage-_UOyJnYK.js";
import { n as inCoverage, r as nearbySegments, t as getCurrentPosition } from "./geo-DYBOQlZi.js";
import { n as useFieldProps, t as Input } from "./input-n37Y3LiM.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, Camera, CarFront, Check, CircleHelp, Construction, ImagePlus, MapPin, Mountain, RotateCcw, Search, Send, TreePine, Waves, Wind, X } from "lucide-react";
// src/components/ui/textarea.tsx
function Textarea({ className, ...props }) {
	const fieldProps = useFieldProps(props);
	return /* @__PURE__ */ jsx("textarea", {
		"data-slot": "textarea",
		className: cn("flex field-sizing-content min-h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40", className),
		...fieldProps
	});
}
var PHOTO_DATABASE = "raahprahari-report-evidence";
var PHOTO_STORE = "photos";
var createEmptyReportDraft = (date = /* @__PURE__ */ new Date()) => ({
	hazardType: "",
	description: "",
	observedAt: toLocalDateTime(date),
	photo: null,
	location: null
});
var pad = (value) => String(value).padStart(2, "0");
function toLocalDateTime(date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function validateObservation(draft, now = /* @__PURE__ */ new Date()) {
	const errors = {};
	if (!draft.hazardType) errors.hazardType = "Choose the hazard you observed.";
	if (draft.description.length > 500) errors.description = "Description must be 500 characters or fewer.";
	const observed = new Date(draft.observedAt);
	if (!draft.observedAt || Number.isNaN(observed.getTime())) errors.observedAt = "Enter when you observed the hazard.";
	else if (observed.getTime() > now.getTime()) errors.observedAt = "Observation time cannot be in the future.";
	return errors;
}
function validatePhoto(file) {
	const extension = file.name.split(".").pop()?.toLowerCase();
	const acceptedType = file.type === "image/jpeg" || file.type === "image/png";
	const acceptedExtension = extension === "jpg" || extension === "jpeg" || extension === "png";
	if (!acceptedType && !(file.type === "" && acceptedExtension)) return "Choose a JPG or PNG image.";
	if (file.size > 10485760) return "Photo must be 10 MB or smaller.";
	return null;
}
function readReportDraft() {
	const raw = window.localStorage.getItem(STORAGE_KEYS.reportDraft);
	if (!raw) return null;
	const value = JSON.parse(raw);
	if (typeof value !== "object" || value === null || !("description" in value) || typeof value.description !== "string" || !("observedAt" in value) || typeof value.observedAt !== "string") return null;
	const saved = value;
	const hazardType = typeof saved.hazardType === "string" && [
		"landslide",
		"flooding",
		"road_block",
		"fallen_tree",
		"damaged_bridge",
		"accident",
		"poor_visibility",
		"other"
	].includes(saved.hazardType) ? saved.hazardType : "";
	const photoValue = saved.photo;
	const photo = typeof photoValue === "object" && photoValue !== null && "id" in photoValue && typeof photoValue.id === "string" && "name" in photoValue && typeof photoValue.name === "string" && "type" in photoValue && typeof photoValue.type === "string" && "size" in photoValue && typeof photoValue.size === "number" && "timestamp" in photoValue && typeof photoValue.timestamp === "number" && "locationTag" in photoValue && typeof photoValue.locationTag === "string" ? {
		id: photoValue.id,
		name: photoValue.name,
		type: photoValue.type,
		size: photoValue.size,
		timestamp: photoValue.timestamp,
		locationTag: photoValue.locationTag
	} : null;
	let location = null;
	if (typeof saved.location === "object" && saved.location !== null) {
		const rawLocation = saved.location;
		const lat = rawLocation.lat;
		const lon = rawLocation.lon;
		if (typeof lat === "number" && Number.isFinite(lat) && typeof lon === "number" && Number.isFinite(lon)) {
			const source = rawLocation.source === "device" || rawLocation.method === "gps" ? "device" : "manual";
			location = {
				query: typeof rawLocation.query === "string" ? rawLocation.query : typeof rawLocation.landmark === "string" ? rawLocation.landmark : "",
				roadSegment: typeof rawLocation.roadSegment === "string" ? rawLocation.roadSegment : "",
				lat,
				lon,
				accuracyM: typeof rawLocation.accuracyM === "number" ? rawLocation.accuracyM : null,
				source,
				confirmed: rawLocation.confirmed === true
			};
		}
	}
	return {
		hazardType,
		description: saved.description,
		observedAt: saved.observedAt,
		photo,
		location
	};
}
function writeReportDraft(draft) {
	window.localStorage.setItem(STORAGE_KEYS.reportDraft, JSON.stringify(draft));
}
function clearReportDraft() {
	window.localStorage.removeItem(STORAGE_KEYS.reportDraft);
}
function readLocalReports() {
	const raw = window.localStorage.getItem(STORAGE_KEYS.localReports);
	if (!raw) return [];
	const value = JSON.parse(raw);
	return Array.isArray(value) ? value : [];
}
function writeLocalReports(reports) {
	window.localStorage.setItem(STORAGE_KEYS.localReports, JSON.stringify(reports));
}
function writeLastLocalReport(report) {
	window.localStorage.setItem(STORAGE_KEYS.lastLocalReport, JSON.stringify(report));
}
function readLastLocalReport() {
	const raw = window.localStorage.getItem(STORAGE_KEYS.lastLocalReport);
	if (!raw) return null;
	const value = JSON.parse(raw);
	return typeof value === "object" && value !== null && "reference" in value ? value : null;
}
function makeLocalReference(now = /* @__PURE__ */ new Date()) {
	return `LOCAL-RP-${`${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
function openPhotoDatabase() {
	if (typeof indexedDB === "undefined") return Promise.reject(/* @__PURE__ */ new Error("Browser-local photo storage is unavailable."));
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(PHOTO_DATABASE, 1);
		request.onupgradeneeded = () => {
			request.result.createObjectStore(PHOTO_STORE);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not open photo storage."));
	});
}
async function runPhotoStore(mode, run) {
	const database = await openPhotoDatabase();
	try {
		return await new Promise((resolve, reject) => {
			const transaction = database.transaction(PHOTO_STORE, mode);
			const request = run(transaction.objectStore(PHOTO_STORE));
			request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Photo storage request failed."));
			transaction.oncomplete = () => resolve(request.result);
			transaction.onerror = () => reject(transaction.error ?? /* @__PURE__ */ new Error("Photo storage transaction failed."));
			transaction.onabort = () => reject(transaction.error ?? /* @__PURE__ */ new Error("Photo storage transaction was cancelled."));
		});
	} finally {
		database.close();
	}
}
async function saveReportPhoto(id, file) {
	await runPhotoStore("readwrite", (store) => store.put(file, id));
}
async function loadReportPhoto(id) {
	return runPhotoStore("readonly", (store) => store.get(id));
}
async function removeReportPhoto(id) {
	await runPhotoStore("readwrite", (store) => store.delete(id));
}
// src/features/reports/report-step-page.tsx
var STEPS = [
	{
		label: "Observation",
		path: "/report"
	},
	{
		label: "Location",
		path: "/report/location"
	},
	{
		label: "Review & send",
		path: "/report/review"
	}
];
var HAZARDS = [
	{
		value: "landslide",
		label: "Landslide",
		icon: Mountain
	},
	{
		value: "flooding",
		label: "Flooding",
		icon: Waves
	},
	{
		value: "road_block",
		label: "Road Block",
		icon: Construction
	},
	{
		value: "fallen_tree",
		label: "Fallen Tree",
		icon: TreePine
	},
	{
		value: "damaged_bridge",
		label: "Damaged Bridge",
		icon: Construction
	},
	{
		value: "accident",
		label: "Accident",
		icon: CarFront
	},
	{
		value: "poor_visibility",
		label: "Poor Visibility",
		icon: Wind
	},
	{
		value: "other",
		label: "Other",
		icon: CircleHelp
	}
];
var formatBytes = (size) => size < 1048576 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`;
var formatCoordinates = (lat, lon) => `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
function optionsFor(query) {
	const search = query.trim().toLocaleLowerCase();
	if (!search) return [];
	const placeOptions = PLACES.filter((place) => place.name.toLocaleLowerCase().includes(search)).map((place) => ({
		key: `place-${place.id}`,
		label: place.name,
		lat: place.lat,
		lon: place.lon,
		segment: nearbySegments(place.lat, place.lon, 15)[0]?.segment.code ?? "Road segment not identified"
	}));
	return [...SEGMENTS.filter((segment) => {
		const from = placeById(segment.from)?.name ?? "";
		const to = placeById(segment.to)?.name ?? "";
		return `${segment.code} ${from} ${to}`.toLocaleLowerCase().includes(search);
	}).map((segment) => {
		const from = placeById(segment.from);
		const to = placeById(segment.to);
		return {
			key: `segment-${segment.id}`,
			label: `${segment.code} · ${from?.name ?? ""} – ${to?.name ?? ""}`,
			lat: ((from?.lat ?? 0) + (to?.lat ?? 0)) / 2,
			lon: ((from?.lon ?? 0) + (to?.lon ?? 0)) / 2,
			segment: segment.code
		};
	}), ...placeOptions].slice(0, 6);
}
function makeLocation(lat, lon, query, roadSegment, source, accuracyM = null) {
	const nearest = nearbySegments(lat, lon, 15)[0]?.segment;
	const fallbackSegment = nearest ? `${nearest.code} · ${placeById(nearest.from)?.name ?? ""} – ${placeById(nearest.to)?.name ?? ""}` : "Road segment not identified";
	return {
		query,
		roadSegment: roadSegment || fallbackSegment,
		lat,
		lon,
		accuracyM,
		source,
		confirmed: false
	};
}
function ReportStepPage({ step, navigate }) {
	const [draft, setDraft] = useState(() => ({
		...createEmptyReportDraft(),
		observedAt: ""
	}));
	const [loaded, setLoaded] = useState(false);
	const [storageError, setStorageError] = useState("");
	const [errors, setErrors] = useState({});
	const [notice, setNotice] = useState("");
	const [photoError, setPhotoError] = useState("");
	const [photoAsset, setPhotoAsset] = useState(null);
	const [locationSearch, setLocationSearch] = useState("");
	const [gpsError, setGpsError] = useState("");
	const [locating, setLocating] = useState(false);
	const [adjustingPin, setAdjustingPin] = useState(false);
	const [localReport, setLocalReport] = useState(null);
	const cameraInput = useRef(null);
	const libraryInput = useRef(null);
	useEffect(() => {
		try {
			const saved = readReportDraft();
			if (saved) {
				setDraft(saved);
				setLocationSearch(saved.location?.query ?? "");
			} else setDraft(createEmptyReportDraft());
		} catch {
			setStorageError("Could not read the saved draft from this device.");
		}
		if (step === "received") try {
			setLocalReport(readLastLocalReport());
		} catch {
			setStorageError("Could not read the saved report from this device.");
		}
		setLoaded(true);
	}, [step]);
	useEffect(() => {
		if (!loaded || step === "received") return;
		try {
			writeReportDraft(draft);
		} catch {
			setStorageError("This browser could not save the draft. Check available device storage.");
		}
	}, [
		draft,
		loaded,
		step
	]);
	useEffect(() => {
		let active = true;
		let objectUrl = "";
		const photoId = draft.photo?.id;
		if (!photoId) return;
		loadReportPhoto(photoId).then((blob) => {
			if (!active) return;
			if (!blob) {
				setPhotoAsset({
					id: photoId,
					url: "",
					error: "The saved photo is unavailable on this device. You can remove it and choose another."
				});
				return;
			}
			objectUrl = URL.createObjectURL(blob);
			setPhotoAsset({
				id: photoId,
				url: objectUrl
			});
		}).catch(() => {
			if (active) setPhotoAsset({
				id: photoId,
				url: "",
				error: "Could not load the saved photo from this device."
			});
		});
		return () => {
			active = false;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [draft.photo?.id]);
	const currentPhotoAsset = draft.photo && photoAsset?.id === draft.photo.id ? photoAsset : null;
	const photoPreview = currentPhotoAsset?.url ?? "";
	const photoLoadError = currentPhotoAsset?.error ?? "";
	const updateDraft = (patch) => {
		setDraft((current) => ({
			...current,
			...patch
		}));
		setNotice("");
	};
	const updateLocation = (location) => {
		setDraft((current) => ({
			...current,
			location,
			photo: current.photo ? {
				...current.photo,
				locationTag: location.lat !== null && location.lon !== null ? formatCoordinates(location.lat, location.lon) : "No location tag"
			} : null
		}));
		setNotice("");
	};
	const saveDraft = () => {
		try {
			writeReportDraft(draft);
			setNotice("Saved on this device. This draft has not been sent to a server.");
			setStorageError("");
		} catch {
			setStorageError("This browser could not save the draft. Check available device storage.");
		}
	};
	const go = (path) => {
		navigate(path);
		window.scrollTo({ top: 0 });
	};
	const continueObservation = () => {
		const nextErrors = validateObservation(draft);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;
		go("/report/photo");
	};
	const choosePhoto = async (file) => {
		setPhotoError("");
		if (!file) return;
		const validationError = validatePhoto(file);
		if (validationError) {
			setPhotoError(validationError);
			return;
		}
		const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		try {
			await saveReportPhoto(id, file);
			const location = draft.location;
			updateDraft({ photo: {
				id,
				name: file.name,
				type: file.type || "image/jpeg",
				size: file.size,
				timestamp: Date.now(),
				locationTag: location?.lat !== null && location?.lat !== void 0 && location.lon !== null ? formatCoordinates(location.lat, location.lon) : "No location tag"
			} });
			if (draft.photo) await removeReportPhoto(draft.photo.id);
		} catch {
			setPhotoError("Could not save this photo on the device. Try another image or check browser storage.");
		}
	};
	const removePhoto = async () => {
		if (!draft.photo) return;
		try {
			await removeReportPhoto(draft.photo.id);
			updateDraft({ photo: null });
			setPhotoError("");
		} catch {
			setPhotoError("Could not remove the photo from this device. Try again.");
		}
	};
	const chooseSearchOption = (option) => {
		setLocationSearch(option.label);
		updateLocation(makeLocation(option.lat, option.lon, option.label, option.segment, "manual"));
		setGpsError("");
	};
	const useDeviceLocation = async () => {
		setLocating(true);
		setGpsError("");
		const result = await getCurrentPosition();
		setLocating(false);
		if (!result.ok) {
			setGpsError(result.reason === "denied" ? "Location permission was denied. Search for a road or place, or adjust the pin manually." : "Device location is unavailable. Search for a road or place, or adjust the pin manually.");
			return;
		}
		if (!inCoverage(result.lat, result.lon)) {
			setGpsError("Device location is outside this prototype coverage area. Search for a road or place manually.");
			return;
		}
		const loc = makeLocation(result.lat, result.lon, "Current device location", "", "device", result.accuracyM);
		updateLocation(loc);
		setLocationSearch(loc.query);
	};
	const setMapPoint = (lat, lon) => {
		const location = makeLocation(lat, lon, "Manually adjusted map pin", "", "manual");
		updateLocation(location);
	};
	const confirmLocation = () => {
		if (!draft.location || draft.location.lat === null || draft.location.lon === null) {
			setErrors({ location: "Search for a place or road, use device location, or adjust the map pin." });
			return;
		}
		const next = {
			...draft,
			location: {
				...draft.location,
				confirmed: true
			}
		};
		setDraft(next);
		try {
			writeReportDraft(next);
			setStorageError("");
			setErrors({});
			go("/report/review");
		} catch {
			setStorageError("This browser could not save the confirmed location. Check available device storage.");
		}
	};
	const submitReport = () => {
		const observationErrors = validateObservation(draft);
		if (Object.keys(observationErrors).length) {
			setErrors(observationErrors);
			return;
		}
		if (!draft.location?.confirmed) {
			setErrors({ location: "Confirm a report location before submitting." });
			return;
		}
		const savedAt = Date.now();
		const report = {
			reference: makeLocalReference(new Date(savedAt)),
			status: "Saved on this device",
			savedAt,
			draft,
			synthetic: true
		};
		try {
			writeLocalReports([report, ...readLocalReports()].slice(0, 50));
			writeLastLocalReport(report);
			clearReportDraft();
			setLocalReport(report);
			go("/report/received");
		} catch {
			setStorageError("Could not save this report on the device. No report was submitted.");
		}
	};
	const matchingOptions = useMemo(() => optionsFor(locationSearch), [locationSearch]);
	const currentStep = step === "observation" || step === "photo" ? 1 : step === "location" ? 2 : 3;
	if (step === "received") return /* @__PURE__ */ jsx(ReceivedReport, {
		report: localReport,
		navigate,
		storageError
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-full overflow-x-clip",
		children: [/* @__PURE__ */ jsx("section", {
			className: "relative border-b border-border bg-card bg-cover bg-center",
			style: { backgroundImage: "linear-gradient(90deg, rgb(7 21 31 / 94%), rgb(7 21 31 / 65%)), url('/img/banner-strip.png')" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "rp-container relative py-6 sm:py-8",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold tracking-wide text-orange-on-dark",
					children: "Prototype mockup, synthetic data"
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-1 flex flex-wrap items-end justify-between gap-5",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Report a hazard"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "font-display text-2xl font-bold sm:text-3xl",
							children: step === "observation" ? "What did you observe?" : step === "photo" ? "Add photo evidence" : step === "location" ? "Confirm the location" : "Review your report"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 max-w-2xl text-sm text-muted-foreground",
							children: "Share what you observed to help others make informed decisions."
						})
					] }), /* @__PURE__ */ jsx("ol", {
						"aria-label": "Report steps",
						className: "grid min-w-64 grid-cols-3 gap-3 sm:min-w-80",
						children: STEPS.map((item, index) => {
							const number = index + 1;
							const active = currentStep === number;
							const complete = currentStep > number;
							return /* @__PURE__ */ jsxs("li", {
								"aria-current": active ? "step" : void 0,
								className: "flex min-w-0 flex-col items-center gap-1 text-center",
								children: [/* @__PURE__ */ jsx("span", {
									className: `flex size-8 items-center justify-center rounded-full border text-xs font-semibold ${active ? "border-brand-orange bg-brand-orange text-[#111719]" : complete ? "border-brand-orange text-brand-orange" : "border-border text-muted-foreground"}`,
									children: complete ? /* @__PURE__ */ jsx(Check, {
										"aria-hidden": true,
										className: "size-4"
									}) : number
								}), /* @__PURE__ */ jsx("span", {
									className: `text-xs ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`,
									children: item.label
								})]
							}, item.label);
						})
					})]
				})]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "rp-container max-w-content py-5 sm:py-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: step === "observation" ? "grid gap-5 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)]" : "mx-auto max-w-5xl",
				children: [step === "observation" && /* @__PURE__ */ jsxs("aside", {
					className: "relative hidden min-h-[42rem] overflow-hidden rounded-2xl border border-border bg-card lg:block",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: "/img/hero-road.png",
							alt: "Illustrative mountain road through a Himalayan valley.",
							className: "absolute inset-0 size-full object-cover"
						}),
						/* @__PURE__ */ jsx("div", {
							"aria-hidden": true,
							className: "absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/5"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "absolute inset-x-0 bottom-0 p-6",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-display text-2xl font-semibold",
								children: "Local observations matter"
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 max-w-sm text-sm text-foreground/90",
								children: "Share what you saw. A community report provides information, not an official road restriction."
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						storageError && /* @__PURE__ */ jsx("p", {
							role: "alert",
							className: "mb-4 rounded-xl border border-status-dnt/60 bg-status-dnt/10 p-3 text-sm",
							children: storageError
						}),
						notice && /* @__PURE__ */ jsx("p", {
							role: "status",
							className: "mb-4 rounded-xl border border-border bg-card p-3 text-sm",
							children: notice
						}),
						step === "observation" && /* @__PURE__ */ jsxs("section", {
							"aria-labelledby": "observation-heading",
							className: "rounded-2xl border border-border bg-card p-4 sm:p-7",
							children: [
								/* @__PURE__ */ jsx("h2", {
									id: "observation-heading",
									className: "font-display text-xl font-semibold",
									children: "What did you observe?"
								}),
								/* @__PURE__ */ jsxs("fieldset", {
									className: "mt-5",
									"aria-describedby": errors.hazardType ? "hazard-error" : void 0,
									children: [
										/* @__PURE__ */ jsx("legend", {
											className: "mb-3 text-sm font-medium",
											children: "Choose the condition that best describes the road"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
											children: HAZARDS.map(({ value, label, icon: Icon }) => /* @__PURE__ */ jsxs("button", {
												type: "button",
												"aria-pressed": draft.hazardType === value,
												onClick: () => {
													updateDraft({ hazardType: value });
													setErrors((current) => ({
														...current,
														hazardType: ""
													}));
												},
												className: `flex min-h-20 items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${draft.hazardType === value ? "border-brand-orange bg-brand-orange/10 font-semibold" : "border-border bg-background/40 hover:bg-accent"}`,
												children: [/* @__PURE__ */ jsx(Icon, {
													"aria-hidden": true,
													className: "size-5 shrink-0 text-brand-orange"
												}), /* @__PURE__ */ jsx("span", { children: label })]
											}, value))
										}),
										errors.hazardType && /* @__PURE__ */ jsx("p", {
											id: "hazard-error",
											role: "alert",
											className: "mt-2 text-sm text-status-dnt",
											children: errors.hazardType
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-5",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "mb-2 flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ jsx("label", {
												htmlFor: "report-description",
												className: "text-sm font-medium",
												children: "Describe the condition"
											}), /* @__PURE__ */ jsxs("span", {
												"aria-live": "polite",
												className: "text-xs text-muted-foreground",
												children: [draft.description.length, "/500"]
											})]
										}),
										/* @__PURE__ */ jsx(Textarea, {
											id: "report-description",
											rows: 4,
											maxLength: 500,
											value: draft.description,
											"aria-invalid": Boolean(errors.description),
											"aria-describedby": errors.description ? "description-error description-count" : "description-count",
											onChange: (event) => updateDraft({ description: event.target.value }),
											placeholder: "Add details that may help someone understand your observation.",
											className: "rounded-xl bg-background/50"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-1 flex justify-between gap-3",
											children: [errors.description && /* @__PURE__ */ jsx("p", {
												id: "description-error",
												role: "alert",
												className: "text-sm text-status-dnt",
												children: errors.description
											}), /* @__PURE__ */ jsxs("span", {
												id: "description-count",
												className: "ml-auto sr-only",
												children: [draft.description.length, " of 500 characters"]
											})]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-5 max-w-sm",
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "report-observed-at",
											className: "mb-2 block text-sm font-medium",
											children: "When did you observe it?"
										}),
										/* @__PURE__ */ jsx(Input, {
											id: "report-observed-at",
											type: "datetime-local",
											value: draft.observedAt,
											"aria-invalid": Boolean(errors.observedAt),
											"aria-describedby": errors.observedAt ? "observed-at-error" : void 0,
											onChange: (event) => updateDraft({ observedAt: event.target.value })
										}),
										errors.observedAt && /* @__PURE__ */ jsx("p", {
											id: "observed-at-error",
											role: "alert",
											className: "mt-1.5 text-sm text-status-dnt",
											children: errors.observedAt
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-5 overflow-hidden rounded-xl border border-border",
									children: [/* @__PURE__ */ jsx("img", {
										src: "/img/hero-road.png",
										alt: "",
										className: "h-28 w-full object-cover sm:h-36"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center justify-between gap-3 p-3",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium",
											children: "Photo evidence is optional"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-muted-foreground",
											children: "JPG or PNG, up to 10 MB"
										})] }), /* @__PURE__ */ jsxs(Button, {
											type: "button",
											variant: "outline",
											onClick: () => go("/report/photo"),
											children: [/* @__PURE__ */ jsx(ImagePlus, { "aria-hidden": true }), "Add photo"]
										})]
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 rounded-xl border border-status-caution/50 bg-status-caution/10 p-3 text-sm",
									children: "Capture evidence only when you are away from traffic. Do not stop in a dangerous area."
								}),
								/* @__PURE__ */ jsx(StepActions, {
									back: () => go("/"),
									continueLabel: "Continue",
									onContinue: continueObservation,
									onSave: saveDraft,
									backLabel: "Back"
								})
							]
						}),
						step === "photo" && /* @__PURE__ */ jsxs("section", {
							"aria-labelledby": "photo-heading",
							className: "rounded-2xl border border-border bg-card p-4 sm:p-7",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(15rem,0.7fr)]",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("h2", {
											id: "photo-heading",
											className: "font-display text-xl font-semibold",
											children: "Add photo evidence"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: "Attach one image to support your observation."
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-4 grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => cameraInput.current?.click(),
												className: "flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-medium hover:bg-accent",
												children: [/* @__PURE__ */ jsx(Camera, {
													"aria-hidden": true,
													className: "size-4"
												}), " Take photo"]
											}), /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => libraryInput.current?.click(),
												className: "flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-medium hover:bg-accent",
												children: [/* @__PURE__ */ jsx(ImagePlus, {
													"aria-hidden": true,
													className: "size-4"
												}), " Choose existing photo"]
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											ref: cameraInput,
											type: "file",
											accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
											capture: "environment",
											className: "sr-only",
											"aria-label": "Take a JPG or PNG photo",
											"aria-describedby": "photo-format photo-error",
											onChange: (event) => choosePhoto(event.target.files?.[0])
										}),
										/* @__PURE__ */ jsx("input", {
											ref: libraryInput,
											type: "file",
											accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
											className: "sr-only",
											"aria-label": "Choose an existing JPG or PNG photo",
											"aria-describedby": "photo-format photo-error",
											onChange: (event) => choosePhoto(event.target.files?.[0])
										}),
										/* @__PURE__ */ jsx("p", {
											id: "photo-format",
											className: "mt-2 text-xs text-muted-foreground",
											children: "JPG or PNG only · maximum 10 MB"
										}),
										photoError && /* @__PURE__ */ jsx("p", {
											id: "photo-error",
											role: "alert",
											className: "mt-2 text-sm text-status-dnt",
											children: photoError
										}),
										photoLoadError && /* @__PURE__ */ jsx("p", {
											role: "alert",
											className: "mt-2 text-sm text-status-dnt",
											children: photoLoadError
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-6",
											children: [
												/* @__PURE__ */ jsx("h3", {
													className: "text-sm font-semibold",
													children: "Sample examples"
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: "Synthetic examples only; these are not attached to your report."
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-3 grid grid-cols-2 gap-3",
													children: [/* @__PURE__ */ jsxs("figure", {
														className: "overflow-hidden rounded-xl border border-border",
														children: [/* @__PURE__ */ jsx("img", {
															src: "/img/hero-road.png",
															alt: "",
															className: "h-28 w-full object-cover"
														}), /* @__PURE__ */ jsx("figcaption", {
															className: "p-2 text-xs text-muted-foreground",
															children: "Mountain road · example"
														})]
													}), /* @__PURE__ */ jsxs("figure", {
														className: "overflow-hidden rounded-xl border border-border",
														children: [/* @__PURE__ */ jsx("img", {
															src: "/img/hero-mountain.png",
															alt: "",
															className: "h-28 w-full object-cover"
														}), /* @__PURE__ */ jsx("figcaption", {
															className: "p-2 text-xs text-muted-foreground",
															children: "Mountain view · example"
														})]
													})]
												})
											]
										})
									] }), /* @__PURE__ */ jsxs("aside", {
										className: "rounded-xl border border-border bg-background/40 p-3",
										children: [/* @__PURE__ */ jsxs("h3", {
											className: "flex items-center gap-2 text-sm font-semibold",
											children: [/* @__PURE__ */ jsx(ImagePlus, {
												"aria-hidden": true,
												className: "size-4"
											}), " Photo information"]
										}), draft.photo ? /* @__PURE__ */ jsxs("div", {
											className: "mt-3 space-y-3",
											children: [
												photoPreview ? /* @__PURE__ */ jsx("img", {
													src: photoPreview,
													alt: `Selected photo: ${draft.photo.name}`,
													className: "max-h-64 w-full rounded-lg object-contain"
												}) : /* @__PURE__ */ jsx("div", {
													className: "flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground",
													children: "Loading saved photo…"
												}),
												/* @__PURE__ */ jsxs("dl", {
													className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs",
													children: [
														/* @__PURE__ */ jsx("dt", {
															className: "text-muted-foreground",
															children: "File name"
														}),
														/* @__PURE__ */ jsx("dd", {
															className: "break-all",
															children: draft.photo.name
														}),
														/* @__PURE__ */ jsx("dt", {
															className: "text-muted-foreground",
															children: "File size"
														}),
														/* @__PURE__ */ jsx("dd", { children: formatBytes(draft.photo.size) }),
														/* @__PURE__ */ jsx("dt", {
															className: "text-muted-foreground",
															children: "Timestamp"
														}),
														/* @__PURE__ */ jsx("dd", { children: new Date(draft.photo.timestamp).toLocaleString() }),
														/* @__PURE__ */ jsx("dt", {
															className: "text-muted-foreground",
															children: "Location tag"
														}),
														/* @__PURE__ */ jsx("dd", { children: draft.photo.locationTag })
													]
												}),
												/* @__PURE__ */ jsxs(Button, {
													type: "button",
													variant: "outline",
													className: "w-full",
													onClick: removePhoto,
													children: [/* @__PURE__ */ jsx(X, { "aria-hidden": true }), " Remove photo"]
												})
											]
										}) : /* @__PURE__ */ jsx("p", {
											className: "mt-3 rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground",
											children: "No photo added"
										})]
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-5 rounded-xl border border-status-caution/50 bg-status-caution/10 p-3 text-sm",
									children: "Capture evidence only when you are away from traffic. Location tagging depends on your device permissions."
								}),
								/* @__PURE__ */ jsx(StepActions, {
									back: () => go("/report"),
									continueLabel: "Continue",
									onContinue: () => go("/report/location"),
									onSave: saveDraft
								})
							]
						}),
						step === "location" && /* @__PURE__ */ jsxs("section", {
							"aria-labelledby": "location-heading",
							className: "rounded-2xl border border-border bg-card p-4 sm:p-7",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-end justify-between gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
										id: "location-heading",
										className: "font-display text-xl font-semibold",
										children: "Confirm the location"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: "Check the map pin and road segment before continuing."
									})] }), /* @__PURE__ */ jsxs(Button, {
										type: "button",
										variant: "secondary",
										disabled: locating,
										onClick: useDeviceLocation,
										children: [
											/* @__PURE__ */ jsx(MapPin, { "aria-hidden": true }),
											" ",
											locating ? "Finding location…" : "Use current location"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative mt-5",
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "report-location-search",
											className: "mb-2 block text-sm font-medium",
											children: "Search road or place"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Search, {
												"aria-hidden": true,
												className: "pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground"
											}), /* @__PURE__ */ jsx(Input, {
												id: "report-location-search",
												value: locationSearch,
												onChange: (event) => {
													setLocationSearch(event.target.value);
													setDraft((current) => ({
														...current,
														location: current.location ? {
															...current.location,
															query: event.target.value,
															confirmed: false
														} : {
															query: event.target.value,
															roadSegment: "",
															lat: null,
															lon: null,
															accuracyM: null,
															source: null,
															confirmed: false
														}
													}));
												},
												"aria-describedby": `location-search-help${gpsError ? " location-error" : ""}${errors.location ? " location-validation-error" : ""}`,
												"aria-invalid": Boolean(errors.location),
												placeholder: "Search a place or road code",
												className: "pl-10"
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											id: "location-search-help",
											className: "mt-1 text-xs text-muted-foreground",
											children: "Search is limited to this prototype’s synthetic location list."
										}),
										matchingOptions.length > 0 && /* @__PURE__ */ jsx("ul", {
											role: "listbox",
											"aria-label": "Matching places and roads",
											className: "absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lg",
											children: matchingOptions.map((option) => /* @__PURE__ */ jsx("li", {
												role: "option",
												"aria-selected": false,
												children: /* @__PURE__ */ jsxs("button", {
													type: "button",
													className: "min-h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-accent",
													onClick: () => chooseSearchOption(option),
													children: [/* @__PURE__ */ jsx("span", {
														className: "block font-medium",
														children: option.label
													}), /* @__PURE__ */ jsx("span", {
														className: "text-xs text-muted-foreground",
														children: option.segment
													})]
												})
											}, option.key))
										})
									]
								}),
								gpsError && /* @__PURE__ */ jsx("p", {
									id: "location-error",
									role: "status",
									className: "mt-3 rounded-xl border border-status-caution/50 bg-status-caution/10 p-3 text-sm",
									children: gpsError
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.6fr)]",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "relative h-64 overflow-hidden rounded-xl border border-border sm:h-80",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: "/img/map-terrain.png",
												alt: "",
												className: "absolute inset-0 size-full object-cover"
											}),
											/* @__PURE__ */ jsx("div", {
												"aria-hidden": true,
												className: "absolute inset-0 bg-slate-950/25"
											}),
											/* @__PURE__ */ jsxs("button", {
												type: "button",
												disabled: !adjustingPin,
												"aria-label": "Map preview. When location adjustment is enabled, click or use arrow keys to move the pin.",
												onClick: (event) => {
													const bounds = event.currentTarget.getBoundingClientRect();
													const x = event.detail === 0 ? .5 : Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
													const y = event.detail === 0 ? .5 : Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
													setMapPoint(31.5 - y * (31.5 - 28.7), 77.5 + x * (81.1 - 77.5));
												},
												onKeyDown: (event) => {
													if (!draft.location || ![
														"ArrowUp",
														"ArrowDown",
														"ArrowLeft",
														"ArrowRight"
													].includes(event.key)) return;
													event.preventDefault();
													const lat = draft.location.lat ?? 30.1;
													const lon = draft.location.lon ?? 79.3;
													const delta = .005;
													setMapPoint(lat + (event.key === "ArrowUp" ? delta : event.key === "ArrowDown" ? -.005 : 0), lon + (event.key === "ArrowRight" ? delta : event.key === "ArrowLeft" ? -.005 : 0));
												},
												className: "absolute inset-0 w-full cursor-crosshair disabled:cursor-default",
												children: [draft.location?.lat !== null && draft.location?.lat !== void 0 && draft.location.lon !== null && /* @__PURE__ */ jsx(MapPin, {
													"aria-hidden": true,
													className: "absolute size-8 -translate-x-1/2 -translate-y-full fill-brand-orange text-foreground drop-shadow-lg",
													style: {
														left: `${Math.min(96, Math.max(4, (draft.location.lon - 77.5) / (81.1 - 77.5) * 100))}%`,
														top: `${Math.min(96, Math.max(8, (31.5 - draft.location.lat) / (31.5 - 28.7) * 100))}%`
													}
												}), !draft.location?.lat && /* @__PURE__ */ jsx("span", {
													className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/90 px-3 py-1 text-xs",
													children: "Choose a place or adjust the pin"
												})]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "pointer-events-none absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-xs",
												children: "Terrain preview · synthetic map"
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ jsxs(Button, {
											type: "button",
											variant: "outline",
											onClick: () => setAdjustingPin((value) => !value),
											children: [
												/* @__PURE__ */ jsx(RotateCcw, { "aria-hidden": true }),
												" ",
												adjustingPin ? "Finish adjusting" : "Adjust location"
											]
										}), adjustingPin && /* @__PURE__ */ jsx("span", {
											className: "self-center text-xs text-muted-foreground",
											children: "Click the map or focus it and use arrow keys."
										})]
									})] }), /* @__PURE__ */ jsxs("aside", {
										className: "rounded-xl border border-border bg-background/40 p-4",
										children: [
											/* @__PURE__ */ jsxs("h3", {
												className: "flex items-center gap-2 font-semibold",
												children: [/* @__PURE__ */ jsx(MapPin, {
													"aria-hidden": true,
													className: "size-4 text-brand-orange"
												}), " Location Details"]
											}),
											/* @__PURE__ */ jsxs("dl", {
												className: "mt-4 space-y-4 text-sm",
												children: [
													/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
														className: "text-xs text-muted-foreground",
														children: "Road / segment"
													}), /* @__PURE__ */ jsx("dd", {
														className: "mt-1 font-medium",
														children: draft.location?.roadSegment || "Not selected"
													})] }),
													/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
														className: "text-xs text-muted-foreground",
														children: "Coordinates"
													}), /* @__PURE__ */ jsx("dd", {
														className: "mt-1 font-mono text-xs",
														children: draft.location?.lat !== null && draft.location?.lat !== void 0 && draft.location.lon !== null ? formatCoordinates(draft.location.lat, draft.location.lon) : "Not selected"
													})] }),
													/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
														className: "text-xs text-muted-foreground",
														children: "Location accuracy"
													}), /* @__PURE__ */ jsx("dd", {
														className: "mt-1",
														children: draft.location?.accuracyM !== null && draft.location?.accuracyM !== void 0 ? `±${Math.round(draft.location.accuracyM)} meters` : draft.location?.lat !== null && draft.location?.lat !== void 0 ? "Approximate pin location" : "Unknown"
													})] })
												]
											}),
											adjustingPin && /* @__PURE__ */ jsxs("div", {
												className: "mt-4 grid grid-cols-2 gap-2",
												children: [/* @__PURE__ */ jsxs("label", {
													className: "text-xs text-muted-foreground",
													htmlFor: "pin-latitude",
													children: ["Latitude", /* @__PURE__ */ jsx(Input, {
														id: "pin-latitude",
														type: "number",
														step: "0.0001",
														min: "28.7",
														max: "31.5",
														value: draft.location?.lat ?? "",
														onChange: (event) => {
															const lat = Number(event.target.value);
															if (event.target.value && Number.isFinite(lat) && lat >= 28.7 && lat <= 31.5 && draft.location && draft.location.lon !== null) setMapPoint(lat, draft.location.lon);
														},
														className: "mt-1"
													})]
												}), /* @__PURE__ */ jsxs("label", {
													className: "text-xs text-muted-foreground",
													htmlFor: "pin-longitude",
													children: ["Longitude", /* @__PURE__ */ jsx(Input, {
														id: "pin-longitude",
														type: "number",
														step: "0.0001",
														min: "77.5",
														max: "81.1",
														value: draft.location?.lon ?? "",
														onChange: (event) => {
															const lon = Number(event.target.value);
															if (event.target.value && Number.isFinite(lon) && lon >= 77.5 && lon <= 81.1 && draft.location?.lat !== null && draft.location?.lat !== void 0) setMapPoint(draft.location.lat, lon);
														},
														className: "mt-1"
													})]
												})]
											})
										]
									})]
								}),
								errors.location && /* @__PURE__ */ jsx("p", {
									id: "location-validation-error",
									role: "alert",
									className: "mt-3 text-sm text-status-dnt",
									children: errors.location
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-5 rounded-xl border border-status-caution/50 bg-status-caution/10 p-3 text-sm",
									children: "Location access is optional. If permission is denied, search manually or place the pin on the map."
								}),
								/* @__PURE__ */ jsx(StepActions, {
									back: () => go("/report/photo"),
									continueLabel: "Confirm location",
									onContinue: confirmLocation,
									onSave: saveDraft
								})
							]
						}),
						step === "review" && /* @__PURE__ */ jsxs("section", {
							"aria-labelledby": "review-heading",
							className: "rounded-2xl border border-border bg-card p-4 sm:p-7",
							children: [
								/* @__PURE__ */ jsx("h2", {
									id: "review-heading",
									className: "font-display text-xl font-semibold",
									children: "Review your report"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Check the details before saving this observation on your device."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-5 grid gap-3 lg:grid-cols-2",
									children: [
										/* @__PURE__ */ jsxs(ReviewSection, {
											title: "Hazard details",
											edit: () => go("/report"),
											children: [/* @__PURE__ */ jsx("p", {
												className: "font-medium",
												children: HAZARDS.find(({ value }) => value === draft.hazardType)?.label ?? "Not selected"
											}), /* @__PURE__ */ jsx("p", {
												className: "mt-2 whitespace-pre-wrap text-muted-foreground",
												children: draft.description || "No description provided"
											})]
										}),
										/* @__PURE__ */ jsx(ReviewSection, {
											title: "Photo evidence",
											edit: () => go("/report/photo"),
											children: draft.photo ? /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [photoPreview && /* @__PURE__ */ jsx("img", {
													src: photoPreview,
													alt: "",
													className: "size-16 rounded-lg object-cover"
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ jsx("p", {
														className: "truncate",
														children: draft.photo.name
													}), /* @__PURE__ */ jsx("p", {
														className: "text-xs text-muted-foreground",
														children: formatBytes(draft.photo.size)
													})]
												})]
											}) : /* @__PURE__ */ jsx("p", {
												className: "text-muted-foreground",
												children: "No photo attached"
											})
										}),
										/* @__PURE__ */ jsxs(ReviewSection, {
											title: "Location",
											edit: () => go("/report/location"),
											children: [/* @__PURE__ */ jsx("p", { children: draft.location?.roadSegment ?? "Not selected" }), draft.location?.lat !== null && draft.location?.lat !== void 0 && draft.location.lon !== null && /* @__PURE__ */ jsx("p", {
												className: "mt-1 font-mono text-xs text-muted-foreground",
												children: formatCoordinates(draft.location.lat, draft.location.lon)
											})]
										}),
										/* @__PURE__ */ jsx(ReviewSection, {
											title: "Observation time",
											edit: () => go("/report"),
											children: /* @__PURE__ */ jsx("p", { children: draft.observedAt ? new Date(draft.observedAt).toLocaleString() : "Not specified" })
										})
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 rounded-xl border border-status-caution/50 bg-status-caution/10 p-4 text-sm font-medium",
									children: "Your report will be subject to review and is not an official road closure."
								}),
								Object.keys(errors).length > 0 && /* @__PURE__ */ jsx("p", {
									role: "alert",
									className: "mt-3 text-sm text-status-dnt",
									children: "Review the observation and location details before submitting."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-6 flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row",
									children: [/* @__PURE__ */ jsxs(Button, {
										type: "button",
										variant: "outline",
										onClick: () => go("/report/location"),
										children: [/* @__PURE__ */ jsx(ArrowLeft, { "aria-hidden": true }), " Back to location"]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col-reverse gap-3 sm:flex-row",
										children: [/* @__PURE__ */ jsx(Button, {
											type: "button",
											variant: "secondary",
											onClick: saveDraft,
											children: "Save draft"
										}), /* @__PURE__ */ jsxs(Button, {
											type: "button",
											onClick: submitReport,
											children: [/* @__PURE__ */ jsx(Send, { "aria-hidden": true }), " Submit report"]
										})]
									})]
								})
							]
						})
					]
				})]
			})
		})]
	});
}
function StepActions({ back, onContinue, onSave, continueLabel, backLabel = "Back" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-6 flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col-reverse gap-2 sm:flex-row",
			children: [/* @__PURE__ */ jsxs(Button, {
				type: "button",
				variant: "ghost",
				onClick: back,
				children: [
					/* @__PURE__ */ jsx(ArrowLeft, { "aria-hidden": true }),
					" ",
					backLabel
				]
			}), /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "outline",
				onClick: onSave,
				children: "Save draft"
			})]
		}), /* @__PURE__ */ jsxs(Button, {
			type: "button",
			onClick: onContinue,
			children: [continueLabel, /* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })]
		})]
	});
}
function ReviewSection({ title, edit, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-border p-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "font-semibold",
				children: title
			}), /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				className: "h-9",
				onClick: edit,
				children: "Edit"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-2 text-sm",
			children
		})]
	});
}
function ReceivedReport({ report, navigate, storageError }) {
	return /* @__PURE__ */ jsx("div", {
		className: "relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-cover bg-center px-4 py-10",
		style: { backgroundImage: "linear-gradient(90deg, rgb(7 21 31 / 90%), rgb(7 21 31 / 60%)), url('/img/hero-mountain.png')" },
		children: /* @__PURE__ */ jsxs("section", {
			"aria-labelledby": "report-saved-heading",
			className: "w-full max-w-xl rounded-2xl border border-border bg-background/95 p-5 shadow-xl backdrop-blur sm:p-8",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold tracking-wide text-orange-on-dark",
					children: "Prototype mockup, synthetic data"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-5 flex size-14 items-center justify-center rounded-full border border-brand-orange text-brand-orange",
					children: /* @__PURE__ */ jsx(Check, {
						"aria-hidden": true,
						className: "size-7"
					})
				}),
				/* @__PURE__ */ jsx("h1", {
					id: "report-saved-heading",
					className: "mt-4 font-display text-2xl font-bold sm:text-3xl",
					children: "Report saved on this device"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-base font-semibold",
					children: "Saved on this device, not yet received by the server"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "This prototype did not transmit your report. It does not create an official road closure."
				}),
				report ? /* @__PURE__ */ jsxs("div", {
					className: "mt-5 rounded-xl border border-border p-4",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Local / synthetic reference"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 break-all font-mono text-lg font-semibold",
							children: report.reference
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ jsx("p", {
								className: "inline-flex rounded-full border border-border px-3 py-1 text-xs",
								children: report.status
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Prototype, synthetic data"
							})]
						})
					]
				}) : storageError ? /* @__PURE__ */ jsx("p", {
					role: "alert",
					className: "mt-4 text-sm text-status-dnt",
					children: storageError
				}) : /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No locally saved reference is available in this browser."
				}),
				storageError && /* @__PURE__ */ jsx("p", {
					role: "alert",
					className: "mt-3 text-sm text-status-dnt",
					children: storageError
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "secondary",
						className: "w-full",
						disabled: true,
						children: "View my reports"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-center text-xs text-muted-foreground",
						children: "Available in Phase B; not built in this phase."
					})] }), /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "outline",
						className: "w-full",
						onClick: () => navigate("/"),
						children: "Back to home"
					})]
				})
			]
		})
	});
}
export { ReportStepPage as t };
