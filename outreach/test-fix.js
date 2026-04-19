// Test: does { + \r escape + "key" parse?
// Use Buffer to create bytes: { (123) \ (92) r (114) " (34) k (107) ...
const bytes = [123, 92, 114, 34, 107, 101, 121, 34, 58, 34, 118, 97, 108, 117, 101, 34, 125];
const buf = Buffer.from(bytes);
const s = buf.toString('utf8');
console.log('Test string: {\\r"key":"value"}');
console.log('Bytes:', [...s].map(c => c.charCodeAt(0)));
try {
  JSON.parse(s);
  console.log('SUCCEEDED');
} catch(e) {
  console.log('FAILED:', e.message);
}

// What does JSON.parse actually do with \r escape at top level?
// \r escape -> produces CR char (13). At top level, is CR (13) valid?
// Test with actual CR byte at top level
const bytes2 = [123, 13, 34, 107, 101, 121, 34, 58, 34, 118, 97, 108, 117, 101, 34, 125];
const buf2 = Buffer.from(bytes2);
const s2 = buf2.toString('utf8');
console.log('\nTest string2: { CR "key":"value"}');
console.log('Bytes:', [...s2].map(c => c.charCodeAt(0)));
try {
  JSON.parse(s2);
  console.log('SUCCEEDED');
} catch(e) {
  console.log('FAILED:', e.message);
}
