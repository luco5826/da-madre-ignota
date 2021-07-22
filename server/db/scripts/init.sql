DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS MENU;
DROP TABLE IF EXISTS MENU_AVAILABILITY;
DROP TABLE IF EXISTS ORDERS;
SET TIMEZONE = 'Europe/Rome';
CREATE TABLE USERS (
  id serial PRIMARY key not null,
  username varchar(20) not null unique,
  hash varchar(130) not null,
  salt varchar(70) not null
);
CREATE TABLE CUSTOMERS (
  id serial PRIMARY key not null,
  name varchar(20) not null,
  phone_no varchar(20) not null,
  email varchar(30) not null
);
CREATE TABLE MENU (
  id serial primary key not null,
  name varchar(30) not null,
  description text
);
CREATE TABLE MENU_AVAILABILITY(
  id serial not null primary key,
  menu_id int not null REFERENCES MENU(id),
  day date not null,
  UNIQUE(id, day)
);
CREATE TABLE ORDERS (
  customer_id int REFERENCES CUSTOMERS(id),
  avail_id int REFERENCES MENU_AVAILABILITY(id),
  quantity int
);
-- base credentials: admin, password
INSERT INTO USERS(id, username, hash, salt)
VALUES(
    DEFAULT,
    'admin',
    'aebc3ac076fd31118ebc56f46ca1c24d5ce78edde8c7c0ab47e4c7686da00e92ff8a0b42c353f10895d6e33eec7fdaaac71f7c704e443224f15296b255edcaa6',
    '815bd54f902b129614a26113cd225a64019757ded79baf0a54ea6a23bb9c8541'
  );