import test from 'node:test';
import assert from 'node:assert/strict';
import { nextPayment, dateKey, parseDate, monthly, validate, categories, sections, sectionFor, validatePaymentMethods, calculateSpending } from './model.js';
const item={id:'1',name:'Example',amount:120,currency:'USD',cycle:'monthly',category:'其他',status:'active',method:'',notes:'',date:'2024-01-31'};
test('monthly recurrence clamps month-end without changing the anchor',()=>{
 assert.equal(dateKey(nextPayment(item,parseDate('2024-02-01'))),'2024-02-29');
 assert.equal(dateKey(nextPayment(item,parseDate('2024-03-01'))),'2024-03-31');
 assert.equal(dateKey(nextPayment(item,parseDate('2025-02-01'))),'2025-02-28');
});
test('yearly leap dates, quarterly and weekly dates',()=>{
 assert.equal(dateKey(nextPayment({...item,date:'2024-02-29',cycle:'yearly'},parseDate('2025-01-01'))),'2025-02-28');
 assert.equal(dateKey(nextPayment({...item,cycle:'quarterly'},parseDate('2024-02-01'))),'2024-04-30');
 assert.equal(dateKey(nextPayment({...item,cycle:'weekly'},parseDate('2024-02-08'))),'2024-02-14');
});
test('today and future anchors are preserved, optional dates stay absent',()=>{
 assert.equal(dateKey(nextPayment(item,parseDate('2024-01-31'))),'2024-01-31');
 assert.equal(dateKey(nextPayment(item,parseDate('2023-01-01'))),'2024-01-31');
 assert.equal(nextPayment({...item,date:''}),null);
});
test('monthly normalization',()=>{
 assert.equal(monthly({...item,cycle:'yearly'}),10);
 assert.equal(monthly({...item,cycle:'quarterly'}),40);
 assert.equal(monthly({...item,amount:12,cycle:'weekly'}),52);
});
test('imports reject malformed data, duplicates and impossible dates',()=>{
 assert.deepEqual(validate([item]),[item]);
 for(const bad of [null,{},[item,item],[{...item,amount:-1}],[{...item,date:'2024-02-30'}],[{...item,cycle:'toString'}],[{...item,notes:null}],[{...item,currency:'INVALID'}]])assert.throws(()=>validate(bad));
});
test('every category belongs to exactly one section, preserving existing categories',()=>{
 assert.deepEqual(sections.flatMap(section=>section.categories).sort(), [...categories].sort());
 assert.equal(sectionFor('影音娱乐').id,'app');
 assert.equal(sectionFor('域名服务').id,'domain');
 assert.equal(sectionFor('住房租金').id,'life');
 assert.equal(sectionFor('通讯网络').id,'life');
 assert.equal(sectionFor('保险保障').id,'life');
 for(const category of ['服务器托管','游戏服务'])assert.equal(validate([{...item,category}])[0].category,category);
});
test('payment history accepts custom names, trims and deduplicates, rejects invalid backups',()=>{
 assert.deepEqual(validatePaymentMethods([' 家庭账户 ','家庭账户','备用卡']),['家庭账户','备用卡']);
 for(const invalid of [null,{},[''],['  '],[42],['a'.repeat(81)],Array(101).fill('Visa')])assert.throws(()=>validatePaymentMethods(invalid));
});
test('calculateSpending aggregates by currency and cycle correctly',()=>{
 assert.deepEqual(calculateSpending([]),[]);
 const domainItems=[{...item,name:'aimer.moe',amount:13.99,currency:'USD',cycle:'yearly',category:'域名服务'}];
 const domainResult=calculateSpending(domainItems);
 assert.equal(domainResult.length,1);
 assert.equal(domainResult[0].currency,'USD');
 assert.equal(domainResult[0].type,'yearly');
 assert.equal(domainResult[0].yearly,13.99);
 assert.ok(Math.abs(domainResult[0].monthly - 13.99 / 12) < 1e-6);

 const monthlyItems=[
   {...item,name:'Netflix',amount:2290,currency:'JPY',cycle:'monthly',category:'影音娱乐'},
   {...item,name:'Spotify',amount:1080,currency:'JPY',cycle:'monthly',category:'影音娱乐'}
 ];
 const monthlyResult=calculateSpending(monthlyItems);
 assert.equal(monthlyResult[0].currency,'JPY');
 assert.equal(monthlyResult[0].type,'monthly');
 assert.equal(monthlyResult[0].monthly,3370);
 assert.equal(monthlyResult[0].yearly,40440);

 const mixedItems=[
   {...item,name:'ChatGPT',amount:20,currency:'USD',cycle:'monthly'},
   {...item,name:'Domain',amount:120,currency:'USD',cycle:'yearly'},
   {...item,name:'Mail',amount:30,currency:'CNY',cycle:'monthly'}
 ];
 const mixedResult=calculateSpending(mixedItems);
 assert.equal(mixedResult.length,2);
 const usd=mixedResult.find(r=>r.currency==='USD');
 assert.equal(usd.type,'mixed');
 assert.equal(usd.monthly,30);
 assert.equal(usd.yearly,360);
 const cny=mixedResult.find(r=>r.currency==='CNY');
 assert.equal(cny.type,'monthly');
 assert.equal(cny.monthly,30);
});
