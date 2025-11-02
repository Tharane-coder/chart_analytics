-- Create sad_path_categories table
CREATE TABLE IF NOT EXISTS sad_path_categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sad_path_subcategories table
CREATE TABLE IF NOT EXISTS sad_path_subcategories (
  id SERIAL PRIMARY KEY,
  subcategory_name TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES sad_path_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_custom_values table to store custom chart data
CREATE TABLE IF NOT EXISTS user_custom_values (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  chart_type TEXT NOT NULL,
  chart_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, chart_type)
);

-- Insert initial data for sad_path_categories
INSERT INTO sad_path_categories (category_name) VALUES
  ('Customer Hostility'),
  ('Unsupported Language'),
  ('Caller Identification Issues')
ON CONFLICT (category_name) DO NOTHING;

-- Insert initial data for sad_path_subcategories
INSERT INTO sad_path_subcategories (subcategory_name, category_id) VALUES
  ('Verbal Agression', 1),
  ('Assistant did not speak French', 2),
  ('Assistant did not speak Spanish', 2),
  ('User refused to confirm identity', 3),
  ('Caller Identification', 3),
  ('Incorrect caller identity', 3)
ON CONFLICT DO NOTHING;

-- Create index on email and chart_type for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_custom_values_email_chart_type 
ON user_custom_values(email, chart_type);

