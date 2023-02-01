import { z } from "zod";

const WatcherProps = z.object({
  players: z.object({
    player: z
      .object({
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
      })
      .array(),
    playerType: z.string(),
    seasonTotal: z.number().optional(),
  }),
  result: z.object({
    event: z.string(),
    eventCode: z.string(),
    eventTypeId: z.string(),
    description: z.string(),
    secondaryType: z.string().optional(),
    penaltySeverity: z.string().optional(),
    penaltyMinutes: z.number().optional(),
  }),
  about: z.object({
    eventIdx: z.number(),
    eventId: z.number(),
    period: z.number(),
    periodType: z.string(),
    ordinalNum: z.string(),
    periodTime: z.string(),
    periodTimeRemaining: z.string(),
    dateTime: z.date(),
    goals: z.object({
      away: z.number(),
      home: z.number(),
    }),
  }),
  coordinates: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  team: z.object({
    id: z.number(),
    name: z.string(),
    link: z.string(),
  }),
});

const ParsedPlayProps = z.object({
  gameId: z.number(),
  playType: z.string(),
  timeStamp: z.date(),
  teamId: z.number(),
});

const PlayStatsProps = z.object({
  playerId: z.number(),
  teamId: z.number(),
  playId: z.number(),
  hitValue: z.number(),
  goalValue: z.number(),
  assistValue: z.number(),
  pointValue: z.number(),
  penaltyMinutes: z.number(),
});

export type Watcher = z.infer<typeof WatcherProps>;
export type ParsedPlay = z.infer<typeof ParsedPlayProps>;
export type ParsedPlayStats = z.infer<typeof PlayStatsProps>;
