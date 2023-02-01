import { z } from "zod";

const GameProps = z.object({
  gamePk: z.number(),
  gameType: z.string(),
  season: z.string(),
  gameDate: z.string(),
  link: z.string(),
  status: z.object({
    abstractGameState: z.string(),
    codedGameState: z.string(),
    detailedState: z.string(),
    statusCode: z.string(),
    startTimeTBD: z.boolean(),
  }),
  teams: z.object({
    away: z.object({
      leagueRecord: z.object({
        wins: z.number(),
        losses: z.number(),
        ot: z.number(),
        type: z.string(),
      }),
      score: z.number(),
      team: z.object({
        id: z.number(),
        name: z.string(),
        link: z.string(),
      }),
    }),
    home: z.object({
      leagueRecord: z.object({
        wins: z.number(),
        losses: z.number(),
        ot: z.number(),
        type: z.string(),
      }),
      score: z.number(),
      team: z.object({
        id: z.number(),
        name: z.string(),
        link: z.string(),
      }),
    }),
  }),
  venue: z.object({
    name: z.string(),
    link: z.string(),
  }),
  content: z.object({
    link: z.string(),
  }),
});

const ParsedGameProps = z.object({
  gameId: z.number(),
  gameDate: z.date(),
  homeTeamId: z.number(),
  awayTeamId: z.number(),
});

export type Game = z.infer<typeof GameProps>;
export type ParsedGame = z.infer<typeof ParsedGameProps>;
