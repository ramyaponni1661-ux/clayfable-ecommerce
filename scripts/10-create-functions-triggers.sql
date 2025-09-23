-- Database Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating average
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- This would typically update a rating_average column in products table
    -- For now, we'll just return the trigger
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product ratings when reviews change
CREATE TRIGGER update_product_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON product_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to update inventory when order is placed
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        -- Reserve inventory for confirmed orders
        UPDATE inventory 
        SET reserved_quantity = reserved_quantity + (
            SELECT SUM(oi.quantity) 
            FROM order_items oi 
            WHERE oi.order_id = NEW.id AND oi.product_id = inventory.product_id
        )
        WHERE product_id IN (
            SELECT DISTINCT product_id 
            FROM order_items 
            WHERE order_id = NEW.id
        );
    END IF;
    
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        -- Reduce actual inventory when delivered
        UPDATE inventory 
        SET 
            quantity = quantity - (
                SELECT SUM(oi.quantity) 
                FROM order_items oi 
                WHERE oi.order_id = NEW.id AND oi.product_id = inventory.product_id
            ),
            reserved_quantity = reserved_quantity - (
                SELECT SUM(oi.quantity) 
                FROM order_items oi 
                WHERE oi.order_id = NEW.id AND oi.product_id = inventory.product_id
            )
        WHERE product_id IN (
            SELECT DISTINCT product_id 
            FROM order_items 
            WHERE order_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for inventory management
CREATE TRIGGER inventory_management_trigger 
    AFTER UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_inventory_on_order();

-- Function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate loyalty points
CREATE OR REPLACE FUNCTION calculate_loyalty_points(order_amount DECIMAL)
RETURNS INTEGER AS $$
BEGIN
    -- 1 point per 100 rupees spent
    RETURN FLOOR(order_amount / 100)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function to award loyalty points on order completion
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
    points_earned INTEGER;
BEGIN
    IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
        points_earned := calculate_loyalty_points(NEW.total_amount);
        
        -- Add points to user account
        UPDATE users 
        SET loyalty_points = loyalty_points + points_earned 
        WHERE id = NEW.user_id;
        
        -- Record the transaction
        INSERT INTO loyalty_transactions (user_id, order_id, type, points, description)
        VALUES (NEW.user_id, NEW.id, 'earned', points_earned, 'Points earned from order #' || NEW.order_number);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for loyalty points
CREATE TRIGGER loyalty_points_trigger 
    AFTER UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION award_loyalty_points();
