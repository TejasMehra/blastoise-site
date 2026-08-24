CREATE INDEX CONCURRENTLY idx_events_account ON events (account_id);

ALTER TABLE events ADD COLUMN plan text NOT NULL DEFAULT 'free';

ALTER TABLE events ADD COLUMN customer_ref uuid NOT NULL DEFAULT gen_random_uuid();
