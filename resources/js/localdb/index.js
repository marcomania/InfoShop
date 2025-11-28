import Dexie from 'dexie';

export const db = new Dexie('db_infoshop');

db.version(1).stores({
  pos_products: `
    id,
    name,
    image_url,
    is_stock_managed,
    batch_number,
    stock_quantity,
    cost,
    price,
    batch_id,
    product_type,
    alert_quantity,
    discount,
    discount_percentage,
    meta_data,
    category_id,
    free_qty
  `
});