const pg = require("pg");
const client = new pg.Client("postgres://localhost/gamestore");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/gamestore/videogames", async (req, res, next) => {
  try {
    const SQL = `
        SELECT *
        FROM videogames
        `;

    const response = await client.query(SQL);
    console.log("Welcome to the Gamestore");
    res.send(response.rows);
  } catch (error) {
    next(console);
  }
});

app.get("/api/gamestore/videogames/:id", async (req, res, next) => {
  try {
    const SQL = `
        SELECT *
        FROM videogames
        WHERE id = $1
        `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post("/api/gamestore/videogames", async (req, res, next) => {
  console.log(req.body);
  try {
    let SQL = `
            INSERT INTO videogames (name, rating)
            VALUES ($1, $2)
            RETURNING *
        `;
    const response = await client.query(SQL, [req.body.name, req.body.rating]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/gamestore/videogames/:id", async (req, res, next) => {
  try {
    const SQL = `
        DELETE
        FROM videogames
        WHERE id = $1
        `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
    console.log("Successfully deleted videogame");
  } catch (error) {
    next(error);
  }
});

app.put("/api/gamestore/videogames/:id", async (req, res, next) => {
  try {
    const SQL = `
        UPDATE videogames
        SET name = $1, rating = $2
        WHERE id = $3
        RETURNING *
        `;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.rating,
      req.params.id,
    ]);
    res.send(response.rows);
    console.log(`Videogame with id:${req.params.id} has been updated!`);
  } catch (error) {
    next(error);
  }
});

app.get("/api/gamestore/boardgames", async (req, res, next) => {
  try {
    const SQL = `
        SELECT *
        FROM boardgames
        `;
    const response = await client.query(SQL);
    console.log("Welcome to the Gamestore");
    res.send(response.rows);
    console.log("Success");
  } catch (error) {
    next(console);
  }
});

app.get("/api/gamestore/boardgames/:id", async (req, res, next) => {
  try {
    const SQL = `
          SELECT *
          FROM boardgames
          WHERE id = $1
          `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows[0]);
    console.log("Success");
  } catch (error) {
    next(error);
  }
});

app.post("/api/gamestore/boardgames", async (req, res, next) => {
  console.log(req.body);
  try {
    let SQL = `
              INSERT INTO boardgames (name, rating)
              VALUES ($1, $2)
              RETURNING *
          `;
    const response = await client.query(SQL, [req.body.name, req.body.rating]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/gamestore/boardgames/:id", async (req, res, next) => {
  try {
    const SQL = `
          DELETE
          FROM boardgames
          WHERE id = $1
          `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
    console.log("Successfully deleted boardgame");
  } catch (error) {
    next(error);
  }
});

app.put("/api/gamestore/boardgames/:id", async (req, res, next) => {
  try {
    const SQL = `
          UPDATE boardgames
          SET name = $1, rating = $2
          WHERE id = $3
          RETURNING *
          `;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.rating,
      req.params.id,
    ]);
    res.send(response.rows);
    console.log(`Boardgame with id:${req.params.id} has been updated!`);
  } catch (error) {
    next(error);
  }
});

const start = async () => {
  await client.connect();
  console.log("connected to database");

  const SQL = `
    DROP TABLE IF EXISTS videogames;
    DROP TABLE IF EXISTS boardgames;

    CREATE TABLE boardgames(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        rating VARCHAR(4)
    );
    INSERT INTO boardgames (name, rating) VALUES ('Catan', '9.5');
    INSERT INTO boardgames (name, rating) VALUES ('Ticket to Ride', '8.6');
    INSERT INTO boardgames (name, rating) VALUES ('Dominion', '7');
    INSERT INTO boardgames (name, rating) VALUES ('Pandemic', '8.2');
    INSERT INTO boardgames (name, rating) VALUES ('Gloomhaven', '9.1');

    CREATE TABLE videogames(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        rating VARCHAR(4)
    );
    INSERT INTO videogames (name, rating) VALUES ('Red Dead Redepmtion 2', '9.7');
    INSERT INTO videogames (name, rating) VALUES ('L.A. Noire', '8.5');
    INSERT INTO videogames (name, rating) VALUES ('Grand Theft Auto V', '10');
    INSERT INTO videogames (name, rating) VALUES ('Bully', '8.7');
    INSERT INTO videogames (name, rating) VALUES ('Max Payne 3', '9');
`;

  await client.query(SQL);
  console.log("tables created and data seeded");
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

start();
