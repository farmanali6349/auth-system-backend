CREATE TABLE "token_blacklist" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "token_blacklist_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(128) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "token_idx" ON "token_blacklist" USING btree ("token");--> statement-breakpoint
CREATE INDEX "token_created_at_idx" ON "token_blacklist" USING btree ("token","created_at");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");