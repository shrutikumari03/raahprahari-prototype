import { segmentById } from "@/data/fixtures";

export const LONG_ROAD_NAME =
  "North Ridge access road via " +
  "UttarakhandMountainRoadSegmentIdentifierThatExceedsFortyCharacters" +
  " to the eastern valley";

const sampleSegment = segmentById("nh107-02");
if (!sampleSegment) throw new Error('Missing fixture segment "nh107-02"');

export const longRoadNameSegment = {
  ...sampleSegment,
  from: LONG_ROAD_NAME,
};
