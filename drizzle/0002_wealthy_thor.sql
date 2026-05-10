ALTER TABLE "sessions" ADD COLUMN "refresh_token" text NOT NULL;--> statement-breakpoint
CREATE INDEX "refresh_token_idx" ON "sessions" USING btree ("refresh_token");--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "refresh_token_hash";