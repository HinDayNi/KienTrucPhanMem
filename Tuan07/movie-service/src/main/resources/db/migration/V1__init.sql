CREATE TABLE movies (
    id                VARCHAR(40)    PRIMARY KEY,
    title             VARCHAR(200)   NOT NULL,
    description       VARCHAR(2000),
    duration_minutes  INT            NOT NULL,
    poster_url        VARCHAR(200),
    release_date      DATE,
    unit_price        NUMERIC(12,2)  NOT NULL,
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_movies_title ON movies (title);

INSERT INTO movies (id, title, description, duration_minutes, poster_url, release_date, unit_price)
VALUES
('m-incep01', 'Inception',
 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
 148, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
 '2010-07-16', 120000),
('m-oppen01', 'Oppenheimer',
 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
 180, 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
 '2023-07-21', 130000),
('m-dune02-', 'Dune: Part Two',
 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
 166, 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
 '2024-03-01', 140000),
('m-spider01', 'Spider-Man: Across the Spider-Verse',
 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.',
 140, 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
 '2023-06-02', 110000),
('m-godfa01', 'The Godfather',
 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
 175, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
 '1972-03-24', 100000);
