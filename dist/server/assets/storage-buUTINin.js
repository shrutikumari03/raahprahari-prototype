import { useCallback, useEffect, useState } from "react";
// src/lib/storage.ts
var EVENT = "rp-storage";
function readLocal(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function writeLocal(key, value) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
		window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
	} catch {}
}
function useLocalState(key, initial) {
	const [value, setValue] = useState(initial);
	useEffect(() => {
		setValue(readLocal(key, initial));
		const sync = (e) => {
			if (e.detail === key) setValue(readLocal(key, initial));
		};
		window.addEventListener(EVENT, sync);
		return () => window.removeEventListener(EVENT, sync);
	}, [key]);
	return [value, useCallback((next) => {
		const resolved = typeof next === "function" ? next(readLocal(key, initial)) : next;
		setValue(resolved);
		writeLocal(key, resolved);
	}, [key])];
}
var STORAGE_KEYS = {
	theme: "rp.theme",
	lang: "rp.lang",
	recentSearches: "rp.recentSearches",
	savedRoads: "rp.savedRoads",
	reportDraft: "rp.reportDraft",
	localReports: "rp.localReports"
};
export { writeLocal as i, readLocal as n, useLocalState as r, STORAGE_KEYS as t };
