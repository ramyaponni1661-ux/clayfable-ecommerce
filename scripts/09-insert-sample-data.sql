-- Sample Data for Testing

-- Insert sample categories
INSERT INTO categories (id, name, slug, description) VALUES
(uuid_generate_v4(), 'Cooking', 'cooking', 'Traditional terracotta cooking vessels'),
(uuid_generate_v4(), 'Serving', 'serving', 'Beautiful serving bowls and plates'),
(uuid_generate_v4(), 'Decor', 'decor', 'Decorative vases and artistic pieces'),
(uuid_generate_v4(), 'Garden', 'garden', 'Planters and garden accessories');

-- Insert sample tags
INSERT INTO tags (name, color) VALUES
('Best Seller', '#ff6b35'),
('New Arrival', '#4ecdc4'),
('Premium', '#ffd700'),
('Handcrafted', '#8b4513'),
('Eco-Friendly', '#228b22');

-- Insert sample site settings
INSERT INTO site_settings (key, value, type, description, is_public) VALUES
('site_name', 'Clayfable', 'text', 'Website name', true),
('site_description', 'Premium Terracotta Products Since 1952', 'text', 'Site description', true),
('contact_email', 'info@clayfable.com', 'text', 'Contact email', true),
('contact_phone', '+91-9876543210', 'text', 'Contact phone', true),
('whatsapp_number', '+91-9876543210', 'text', 'WhatsApp business number', true),
('shipping_free_threshold', '999', 'number', 'Free shipping threshold amount', true),
('tax_rate', '18', 'number', 'GST tax rate percentage', false),
('currency', 'INR', 'text', 'Default currency', true),
('items_per_page', '12', 'number', 'Products per page', false);

-- Insert sample shipping providers
INSERT INTO shipping_providers (name, code, is_active) VALUES
('Blue Dart', 'bluedart', true),
('DTDC', 'dtdc', true),
('India Post', 'indiapost', true),
('Delhivery', 'delhivery', true);

-- Insert sample discount codes
INSERT INTO discount_codes (code, name, type, value, minimum_order_amount, usage_limit, starts_at, ends_at) VALUES
('WELCOME10', 'Welcome Discount', 'percentage', 10.00, 500.00, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days'),
('FREESHIP', 'Free Shipping', 'free_shipping', 0.00, 799.00, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days'),
('SAVE500', 'Save 500 Rupees', 'fixed_amount', 500.00, 2000.00, 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15 days');

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Pottery Tips', 'pottery-tips', 'Tips and techniques for pottery care'),
('Heritage Stories', 'heritage-stories', 'Stories about our craft and heritage'),
('Product Spotlights', 'product-spotlights', 'Featured products and their stories');

-- Create a function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
BEGIN
    RETURN 'CF' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
