create schema dbo;

alter schema dbo owner to postgres;

create table if not exists dbo.history
(
	kursnr varchar not null,
	timestamp timestamp default now() not null,
	state varchar not null
);

alter table dbo.history owner to postgres;

create table if not exists dbo.role
(
	uid integer not null,
	role varchar
);

alter table dbo.role owner to postgres;

create table if not exists dbo."user"
(
	id serial not null
		constraint user_pk
			primary key,
	email varchar not null,
	hash varchar not null,
	defaultdata jsonb
);

alter table dbo."user" owner to postgres;

create unique index if not exists user_email_uindex
	on dbo."user" (email);

create table if not exists dbo.schedule
(
	id serial not null
		constraint schedule_pk
			primary key,
	data jsonb not null,
	date timestamp not null,
	kid varchar not null,
	link varchar not null,
	"user" varchar not null,
  	result jsonb
);

alter table dbo.schedule owner to postgres;

