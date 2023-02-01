import { z } from "zod";

const PlayerProps = z.object({
  id: z.number(),
  fullName: z.string(),
  link: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  primaryNumber: z.string(),
  birthDate: z.string(),
  currentAge: z.number(),
  birthCity: z.string(),
  birthStateProvince: z.string(),
  birthCountry: z.string(),
  nationality: z.string(),
  height: z.string(),
  weight: z.number(),
  active: z.boolean(),
  alternateCaptain: z.boolean(),
  captain: z.boolean(),
  rookie: z.boolean(),
  shootsCatches: z.string(),
  rosterStatus: z.string(),
  currentTeam: z.object({
    id: z.number(),
    name: z.string(),
    link: z.string(),
  }),
  primaryPosition: z.object({
    code: z.string(),
    name: z.string(),
    type: z.string(),
    abbreviation: z.string(),
  }),
});

const ParsedPlayerProps = z.object({
  playerId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  number: z.string(),
  position: z.string(),
  teamId: z.number(),
  age: z.number(),
});

const AbbreviatedPlayerProps = z.object({
  person: z.object({
    id: z.number(),
    fullName: z.string(),
    link: z.string(),
  }),
  jerseyNumber: z.string(),
  position: z.object({
    code: z.string(),
    name: z.string(),
    type: z.string(),
    abbreviation: z.string(),
  }),
});

const PlayerFeedProps = z.record(PlayerProps);

export type Player = z.infer<typeof PlayerProps>;
export type PlayerFeed = z.infer<typeof PlayerFeedProps>;
export type AbbreviatedPlayer = z.infer<typeof AbbreviatedPlayerProps>;
export type ParsedPlayer = z.infer<typeof ParsedPlayerProps>;
