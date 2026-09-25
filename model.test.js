import test from 'node:test';
import assert from 'node:assert/strict';
import { nextPayment, dateKey, parseDate, monthly, validate } from './model.js';
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
