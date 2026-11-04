import { Pool, type PoolClient } from 'pg'
const pools:Pool[]=[]
type Query={text:string;values:unknown[];then:PromiseLike<Record<string,unknown>[]>['then']}
export function postgresForTests(connectionString:string){
 const url=new URL(connectionString)
 if(!['localhost','127.0.0.1','postgres'].includes(url.hostname)||!url.pathname.endsWith('_test'))throw new Error('PostgreSQL integration tests require a local disposable *_test database.')
 const pool=new Pool({connectionString,max:12});pools.push(pool)
 const make=(text:string,values:unknown[]=[]):Query=>({text,values,then(resolve,reject){return pool.query(text,values).then(r=>r.rows).then(resolve,reject)}})
 const sql=(parts:TemplateStringsArray,...values:unknown[])=>make(parts.reduce((text,part,i)=>text+(i?'$'+i:'')+part,''),values)
 sql.query=make
 sql.transaction=async(queries:Query[],options?:{readOnly?:boolean})=>{const client:PoolClient=await pool.connect();try{await client.query(options?.readOnly?'BEGIN READ ONLY':'BEGIN');const result=[];for(const q of queries)result.push((await client.query(q.text,q.values)).rows);await client.query('COMMIT');return result}catch(error){await client.query('ROLLBACK');throw error}finally{client.release()}}
 return sql
}
export async function closeTestDatabases(){await Promise.all(pools.map(pool=>pool.end()))}
