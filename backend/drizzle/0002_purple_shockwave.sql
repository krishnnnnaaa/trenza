ALTER TABLE "payments" ALTER COLUMN "provider_payment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "provider_order_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_provider_order_id_unique" UNIQUE("provider_order_id");