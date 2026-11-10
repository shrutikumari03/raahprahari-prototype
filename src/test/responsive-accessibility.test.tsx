import { forwardRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdvisoryCard } from "@/components/advisory-card";
import { PreferencesProvider } from "@/i18n/preferences";
import { segmentById } from "@/data/fixtures";
import { advisoryFor } from "@/lib/data";
import {
  MapSegmentDetail,
  SegmentDetail,
} from "@/features/routes/segment-detail";
import { ResultRow } from "@/routes/traveller";
import { longRoadNameSegment, LONG_ROAD_NAME } from "./qa-fixtures";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  const MockLink = forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<"a"> & {
      to?: string;
      params?: Record<string, string>;
      search?: Record<string, unknown>;
    }
  >((props, ref) => {
    const { to = "#", params, search, ...anchorProps } = props;
    void params;
    void search;
    return <a ref={ref} href={to} {...anchorProps} />;
  });
  MockLink.displayName = "MockLink";
  return { ...actual, Link: MockLink };
});

describe("responsive accessibility regressions", () => {
  it("wraps an unbroken road name in cards, search, map selection, and detail", () => {
    expect(LONG_ROAD_NAME.length).toBeGreaterThanOrEqual(80);
    expect(
      LONG_ROAD_NAME.split(/\s+/).some((word) => word.length >= 40),
    ).toBe(true);

    const segment = segmentById("nh107-02");
    if (!segment) throw new Error('Missing fixture segment "nh107-02"');
    const advisory = advisoryFor(segment.id);
    if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);

    const { container } = render(
      <PreferencesProvider>
        <AdvisoryCard segment={longRoadNameSegment} />
        <ResultRow
          segment={longRoadNameSegment}
          observedAt={advisory.latestObservationAt}
          reason={LONG_ROAD_NAME}
        />
        <MapSegmentDetail
          segment={longRoadNameSegment}
          advisory={advisory}
          corridorName={LONG_ROAD_NAME}
        />
        <SegmentDetail segment={longRoadNameSegment} />
      </PreferencesProvider>,
    );

    const wrappedElements = [
      container.querySelector("article h2"),
      container.querySelector(".traveller-result-main h2"),
      container.querySelector(".rp-map-segment-title-row h2"),
      container.querySelector("#seg-title"),
    ];

    for (const element of wrappedElements) {
      expect(element).not.toBeNull();
      expect(element).toHaveClass("rp-wrap-anywhere");
      expect(element).toHaveTextContent(LONG_ROAD_NAME);
    }

  }, 15_000);
});
