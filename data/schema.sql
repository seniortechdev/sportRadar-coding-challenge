create schema nhl_data_pipeline;

create type nhl_data_pipeline."play_type" as enum ('Hit', 'Goal', 'Penalty');

create table nhl_data_pipeline.teams (
    team_id bigint primary key,
    "name" varchar(255) not null,
    "location" varchar(255) not null
);

create type nhl_data_pipeline."player_position" as enum (
    'Center',
    'Left Wing',
    'Right Wing',
    'Defenseman',
    'Goalie'
);

create table nhl_data_pipeline.players (
    player_id bigint primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    "age" int null,
    "number" varchar(10) null,
    "position" nhl_data_pipeline.player_position not null,
    team_id bigint references nhl_data_pipeline.teams(team_id) on delete cascade
);

create table nhl_data_pipeline.games (
    game_id bigint primary key,
    home_team_id bigint references nhl_data_pipeline.teams(team_id),
    away_team_id bigint references nhl_data_pipeline.teams(team_id),
    game_date date not null
);

create table nhl_data_pipeline.plays (
    play_id serial primary key,
    game_id bigint references nhl_data_pipeline.games(game_id),
    play_type nhl_data_pipeline.play_type not null,
    team_id bigint references nhl_data_pipeline.teams(team_id),
    "time_stamp" timestamp not null
);

create table nhl_data_pipeline.play_stats (
    play_stat_id serial primary key,
    play_id bigint references nhl_data_pipeline.plays(play_id),
    player_id bigint references nhl_data_pipeline.players(player_id),
    hit_value int not null default 0,
    goal_value int not null default 0,
    penalty_value int not null default 0,
    penalty_minutes int not null default 0,
    assist_value int not null default 0,
    point_value int not null default 0
);

insert into nhl_data_pipeline.teams (team_id, "name", "location") values
    (1, 'Canadiens', 'Montreal'),
    (2, 'Maple Leafs', 'Toronto'),
    (3, 'Senators', 'Ottawa'),
    (4, 'Bruins', 'Boston'),
    (5, 'Sabres', 'Buffalo'),
    (6, 'Devils', 'New Jersey'),
    (7, 'Islanders', 'New York'),
    (8, 'Rangers', 'New York'),
    (9, 'Flyers', 'Philadelphia'),
    (10, 'Penguins', 'Pittsburgh'),
    (12, 'Capitals', 'Washington'),
    (13, 'Hurricanes', 'Carolina'),
    (14, 'Lightning', 'Tampa Bay'),
    (15, 'Panthers', 'Florida'),
    (16, 'Predators', 'Nashville'),
    (17, 'Blues', 'St. Louis'),
    (18, 'Jets', 'Winnipeg'),
    (19, 'Stars', 'Dallas'),
    (20, 'Avalanche', 'Colorado'),
    (21, 'Oilers', 'Edmonton'),
    (22, 'Flames', 'Calgary'),
    (23, 'Canucks', 'Vancouver'),
    (24, 'Blackhawks', 'Chicago'),
    (25, 'Red Wings', 'Detroit'),
    (26, 'Blue Jackets', 'Columbus'),
    (28, 'Kings', 'Los Angeles'),
    (29, 'Ducks', 'Anaheim'),
    (30, 'Sharks', 'San Jose'),
    (52, 'Golden Knights', 'Las Vegas'),
    (53, 'Coyotes', 'Arizona'),
    (54, 'Wild', 'Minnesota'),
    (55, 'Kraken', 'Seattle');

