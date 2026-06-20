CREATE TABLE "published_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"message_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"delete_after" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_config" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"current_key" text NOT NULL,
	"autopublish_channels" text[] DEFAULT '{}',
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "published_posts" ADD CONSTRAINT "published_posts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_config" ADD CONSTRAINT "workspace_config_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;