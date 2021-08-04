import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "./database";
import { genPassword, validatePassword } from "./passwords";

passport.use(
  new LocalStrategy((username, password, done) => {
    db.oneOrNone(
      `SELECT * 
       FROM USERS 
       WHERE username = $1`,
      [username]
    ).then((row) => {
      if (
        row !== undefined &&
        row !== null &&
        validatePassword(password, row.hash, row.salt)
      )
        done(null, row);
      else {
        done("No user found", null);
      }
    });
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  db.oneOrNone(
    `SELECT * 
     FROM USERS 
     WHERE id = $1`,
    [id]
  ).then((row) => done(null, row));
});
