require('dotenv').config();
const postgres=require('postgres');
const s=process.env.DATABASE_URL;
console.log('URL:',s);
const client=postgres(s,{prepare:false});
client`select 1`.then(r=>{console.log('connected',r); process.exit(0)}).catch(e=>{console.error('err',e.message); process.exit(1)});
