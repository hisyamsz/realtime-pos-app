-- ==============================================================================
-- Migration: Seed Dummy Data for Menus
-- Schema: 006-menu.sql (public.menus)
-- Storage Bucket: images/menus
-- Note: Discount is stored as a percentage value (0 to 100, e.g. 10 = 10%)
-- Clear existing data and reset auto-increment ID sequence
-- ==============================================================================

TRUNCATE TABLE public.menus RESTART IDENTITY;

INSERT INTO public.menus (name, description, price, discount, image_url, category, is_available)
VALUES
  -- Coffee Category
  (
    'Espresso Single',
    'Rich and concentrated shot of pure espresso extracted from freshly ground Arabica beans.',
    22000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/espresso-single.jpg',
    'Coffee',
    true
  ),
  (
    'Americano Hot/Iced',
    'Double shot espresso diluted with hot or iced filtered water for a clean coffee profile.',
    28000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/americano-hot-iced.jpg',
    'Coffee',
    true
  ),
  (
    'Caffè Latte',
    'Smooth double shot espresso combined with steamed velvety milk and a light layer of microfoam.',
    34000,
    10,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/caffe-latte.jpg',
    'Coffee',
    true
  ),
  (
    'Cappuccino',
    'Equal parts espresso, steamed milk, and airy thick froth topped with fine cocoa powder dusting.',
    34000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/cappuccino.jpg',
    'Coffee',
    true
  ),
  (
    'Caramel Macchiato',
    'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and drizzled with caramel sauce.',
    39000,
    15,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/caramel-macchiato.jpg',
    'Coffee',
    true
  ),
  (
    'Cold Brew Reserve',
    'Steeped for 18 hours in cold filtered water, yielding a smooth, naturally sweet, low-acid iced coffee.',
    36000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/cold-brew-reserve.jpg',
    'Coffee',
    false
  ),

  -- Non-Coffee Category
  (
    'Matcha Latte Premium',
    'Authentic Uji ceremonial grade matcha whisked with warm oat milk or fresh dairy milk.',
    38000,
    15,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/matcha-latte-premium.jpg',
    'Non-Coffee',
    true
  ),
  (
    'Signature Iced Chocolate',
    'Blend of 70% dark Belgian cocoa and fresh milk, served ice cold with whipped cream topping.',
    35000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/signature-iced-chocolate.jpg',
    'Non-Coffee',
    true
  ),
  (
    'Earl Grey Milk Tea',
    'Fragrant Earl Grey bergamot black tea infused with creamy milk and cane sugar syrup.',
    32000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/earl-grey-milk-tea.jpg',
    'Non-Coffee',
    true
  ),
  (
    'Taro Milk Latte',
    'Creamy purple taro root blend infused with sweet vanilla notes and fresh cold milk.',
    33000,
    10,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/taro-milk-latte.jpg',
    'Non-Coffee',
    true
  ),

  -- Main Course Category
  (
    'Nasi Goreng Special Omni',
    'Indonesian fried rice wok-tossed with chicken, sunny-side-up egg, prawns, and crackers.',
    45000,
    20,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/nasi-goreng-special-omni.jpg',
    'Main Course',
    true
  ),
  (
    'Chicken Katsu Don',
    'Crispy panko-breaded chicken cutlet simmered with egg and sweet dashi sauce over warm steamed rice.',
    48000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/chicken-katsu-don.jpg',
    'Main Course',
    true
  ),
  (
    'Spaghetti Carbonara',
    'Classic Italian pasta coated in creamy egg yolk sauce, smoked beef bacon bits, and grated Parmesan.',
    52000,
    15,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/spaghetti-carbonara.jpg',
    'Main Course',
    true
  ),
  (
    'Classic Beef Burger & Fries',
    'Juicy Australian beef patty topped with melted cheddar, lettuce, tomato, pickles, and crispy french fries.',
    58000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/classic-beef-burger-and-fries.jpg',
    'Main Course',
    true
  ),

  -- Snack & Pastry Category
  (
    'Butter Croissant',
    'Flaky, golden-brown French pastry crafted with layers of rich French butter.',
    24000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/butter-croissant.jpg',
    'Snack & Pastry',
    true
  ),
  (
    'Truffle French Fries',
    'Crispy golden potato fries tossed in aromatic white truffle oil, sea salt, and parsley.',
    32000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/truffle-french-fries.jpg',
    'Snack & Pastry',
    true
  ),
  (
    'Honey Garlic Chicken Wings',
    'Six pieces of crispy fried chicken wings glazed with sweet sticky honey garlic sauce.',
    38000,
    10,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/honey-garlic-chicken-wings.jpg',
    'Snack & Pastry',
    true
  ),

  -- Dessert Category
  (
    'Affogato al Caffè',
    'Two scoops of premium vanilla bean gelato drowned in a hot shot of fresh espresso.',
    30000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/affogato-al-caffe.jpg',
    'Dessert',
    true
  ),
  (
    'Chocolate Lava Cake',
    'Warm chocolate sponge cake with a molten chocolate center, served with a scoop of vanilla ice cream.',
    36000,
    0,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/chocolate-lava-cake.jpg',
    'Dessert',
    true
  ),
  (
    'New York Cheesecake',
    'Dense, smooth, and creamy baked cheesecake with a buttery graham cracker crust and berry compote.',
    38000,
    10,
    'https://mcnmvybtqetfgkpcvevy.supabase.co/storage/v1/object/public/images/menus/new-york-cheesecake.jpg',
    'Dessert',
    false
  );
