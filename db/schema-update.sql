-- Create event_images table to store multiple images per event
CREATE TABLE IF NOT EXISTS event_images (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add a new column to events table for storing JSON-LD structured data
ALTER TABLE events ADD COLUMN IF NOT EXISTS seo_metadata JSONB;
