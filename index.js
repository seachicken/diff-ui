const { spawn } = require('child_process');

// main();

// async function main() {
//   let seq = 0;
//   let result;
//   result = await open(++seq, file);
//   console.log(`result: ${result}`);
//   result = await prepareCallHierarchy(++seq, file, 90, 9);
//   console.log(`result: ${result}`);
//   result = await provideCallHierarchyIncomingCalls(++seq, file, 90, 9);
//   console.log(`result: ${result}`);
// }

// async function open(seq, file) {
//   return await exec(`{"seq": ${seq}, "command": "open", "arguments": {"file": "${file}"}}\n`);
// }

// async function prepareCallHierarchy(seq, file, line, offset) {
//   return await exec(`{"seq": ${seq}, "command": "prepareCallHierarchy", "arguments": {"file": "${file}", "line": ${line}, "offset": ${offset}}}\n`);
// }

// async function provideCallHierarchyIncomingCalls(seq, file, line, offset) {
//   return await exec(`{"seq": ${seq}, "command": "provideCallHierarchyIncomingCalls", "arguments": {"file": "${file}", "line": ${line}, "offset": ${offset}}}\n`);
// }

// async function exec(request) {
//   return await new Promise((resolve, reject) => {
//     const ts = spawn('tsserver');
//     ts.stdout.setEncoding('utf8');
//     // let i = 0;
//     ts.stdout.on('data', data => {
//       // console.log(`================\ni: ${i++}, data: ${data}, type: ${data.type}`);
//       // // if (data.type === 'response') resolve(data);
//       // if (i === 3) resolve(data);
//       resolve(data);
//     });
//     ts.stderr.on('data', data => reject(data));

//     ts.stdin.write(request);
//     ts.stdin.end();
//   });
// }

if (process.argv.length <= 1) {
  console.log(`invalid arguments. argv: ${argv}`);
  return;
}

const file = process.argv[2];

const ts = spawn('tsserver');
ts.stdout.setEncoding('utf8');
ts.stdout.on('data', data => {
  handleStdout(data);
});
ts.stderr.on('data', data => {
  console.error(`stderr: ${data}`);
});

ts.stdin.write(`{"seq": 1, "command": "open", "arguments": {"file": "${file}"}}\n`);
ts.stdin.write(`{"seq": 2, "command": "provideCallHierarchyIncomingCalls", "arguments": {"file": "${file}", "line": 90, "offset": 9}}\n`);

function handleStdout(data) {
  console.log(`data: ${data}`);
  const requestSeq = data.match(/"request_seq":(\d+)/);
  switch (requestSeq && requestSeq[1]) {
    case '2':
      const callers = data.match(/"from":{"name":"(.+)","kind":"(.+)","file".*}/);
      console.log(`1: ${callers[1]}, 2: ${callers[2]}`);
      break;
  }
}
