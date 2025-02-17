// utils/pythonWorker.js
const { workerData, parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

async function executePythonCode() {
  const { code, testCases } = workerData;
  
  // Create a temporary file with a random name
  const tempFileName = crypto.randomBytes(16).toString('hex') + '.py';
  const tempFilePath = path.join(__dirname, '..', 'temp', tempFileName);

  try {
    // Create wrapped code that includes test cases
    const wrappedCode = `
${code}

import json
import time

test_cases = ${JSON.stringify(testCases)}

for test in test_cases:
    try:
        start_time = time.time()
        args = json.loads(f"[{test['input']}]")
        result = ${code.split('def ')[1].split('(')[0]}(*args)
        end_time = time.time()
        
        expected = json.loads(test['expectedOutput'])
        passed = json.dumps(result) == json.dumps(expected)
        
        print(json.dumps({
            'testCaseId': test['_id'],
            'passed': passed,
            'executionTime': (end_time - start_time) * 1000,
            'output': result,
            'expectedOutput': expected,
            'error': None
        }))
    except Exception as e:
        print(json.dumps({
            'testCaseId': test['_id'],
            'passed': False,
            'executionTime': 0,
            'output': None,
            'expectedOutput': None,
            'error': str(e)
        }))
`;

    // Write the code to a temporary file
    await fs.writeFile(tempFilePath, wrappedCode);

    // Execute the Python code
    const pythonProcess = spawn('python', [tempFilePath], {
      timeout: 5000 // 5 second timeout
    });

    pythonProcess.stdout.on('data', (data) => {
      try {
        const result = JSON.parse(data.toString());
        parentPort.postMessage(result);
      } catch (error) {
        parentPort.postMessage({
          error: 'Failed to parse Python output',
          passed: false,
          executionTime: 0,
          output: null,
          expectedOutput: null
        });
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      parentPort.postMessage({
        error: data.toString(),
        passed: false,
        executionTime: 0,
        output: null,
        expectedOutput: null
      });
    });

  } catch (error) {
    parentPort.postMessage({
      error: error.message,
      passed: false,
      executionTime: 0,
      output: null,
      expectedOutput: null
    });
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(tempFilePath);
    } catch (error) {
      console.error('Failed to delete temporary file:', error);
    }
  }
}

executePythonCode();