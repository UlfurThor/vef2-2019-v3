CREATE TABLE applications (
  id serial primary key,
  name varchar(128) not null,
  email varchar(256) not null,
  phone int not null,
  comment text not null,
  jobTitle varchar(32) not null, -- should have a external refrence table for this
  processed boolean DEFAULT false,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp,
  deleted timestamp with time zone -- more realistic implementation of a "delete" function, MUST NEVER BE EXPOSED UNDER NORMAL CIRCUMSTANCES
);


CREATE TABLE users (
  id serial primary key,
  username varchar(128) UNIQUE not null ,
  password varchar(128) not null ,
  name varchar(128) not null,
  email varchar(256) UNIQUE not null,
  admin boolean default false,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp,
  deleted timestamp with time zone, -- more realistic implementation of a "delete" function, MUST NEVER BE EXPOSED UNDER NORMAL CIRCUMSTANCES
  passwordPLAIN varchar(128) --TODO dev only remove
);
