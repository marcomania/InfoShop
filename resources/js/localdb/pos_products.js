import axios from 'axios';
import { db } from './index';

export async function syncPosProducts(filters = {all_products: true}) {
  try {
    const { data: products } = await axios.post('/pos/filter', filters);

    await db.pos_products.clear();        // optional: wipe old data
    await db.pos_products.bulkPut(products);

    return products;
  } catch (error) {
    console.error('Failed to sync POS products', error);
    return [];
  }
}

export async function getLocalPosProducts() {
  return await db.pos_products.toArray();
}