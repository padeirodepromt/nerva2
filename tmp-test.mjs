import 'dotenv/config';
import postgres from 'postgres';

const s = process.env.DATABASE_URL;
console.log('URL:', s);
const client = postgres(s, {prepare:false});

try {
  const r = await client`select 1`;
  console.log('connected', r);
} catch (e) {
  console.error('err', e.message);
}
