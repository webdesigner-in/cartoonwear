-- 🔍 LIST ALL TABLES
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 👥 VIEW ALL USERS
SELECT id, name, email, role, "emailVerified", "isActive", "createdAt" 
FROM "User" 
ORDER BY "createdAt" DESC;

-- 🛍️ VIEW ALL PRODUCTS
SELECT id, title, price, "inStock", "createdAt" 
FROM "Product" 
ORDER BY "createdAt" DESC;

-- 📦 VIEW ALL ORDERS
SELECT id, "userId", total, status, "createdAt"
FROM "Order" 
ORDER BY "createdAt" DESC;

-- 📁 VIEW ALL CATEGORIES
SELECT id, name, description, "createdAt" 
FROM "Category";

-- 🛒 VIEW CART ITEMS
SELECT ci.id, ci.quantity, p.title, u.name as user_name
FROM "CartItem" ci
JOIN "Product" p ON ci."productId" = p.id
JOIN "User" u ON ci."userId" = u.id;

-- 📊 DATABASE STATISTICS
SELECT 
  'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Products', COUNT(*) FROM "Product"
UNION ALL
SELECT 'Orders', COUNT(*) FROM "Order"
UNION ALL
SELECT 'Categories', COUNT(*) FROM "Category"
UNION ALL
SELECT 'CartItems', COUNT(*) FROM "CartItem"
UNION ALL
SELECT 'Reviews', COUNT(*) FROM "Review";

-- 🔧 SAMPLE UPDATE QUERY (Change user role)
-- UPDATE "User" SET role = 'CUSTOMER' WHERE email = 'user@example.com';

-- 🔧 SAMPLE INSERT QUERY (Add new category)
-- INSERT INTO "Category" (name, description) VALUES ('New Category', 'Description here');

-- 🔧 SAMPLE DELETE QUERY (Remove inactive users)
-- DELETE FROM "User" WHERE "isActive" = false;