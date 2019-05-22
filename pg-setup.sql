create schema dbo;

alter schema dbo owner to postgres;

create table if not exists history
(
	kursnr varchar not null,
	timestamp timestamp default now() not null,
	state varchar not null
);

alter table history owner to postgres;

create table if not exists role
(
	uid integer not null,
	role varchar
);

alter table role owner to postgres;

create table if not exists "user"
(
	id serial not null
		constraint user_pk
			primary key,
	email varchar not null,
	hash varchar not null
);

alter table "user" owner to postgres;

create unique index if not exists user_email_uindex
	on "user" (email);

create table if not exists schedule
(
	id serial not null
		constraint schedule_pk
			primary key,
	data jsonb not null,
	date timestamp not null,
	kid varchar not null,
	link varchar not null,
	"user" varchar not null
);

alter table schedule owner to postgres;

