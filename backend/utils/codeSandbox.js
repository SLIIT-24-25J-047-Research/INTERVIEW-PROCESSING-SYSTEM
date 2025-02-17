// utils/codeSandbox.js
const vm = require('node:vm');

class CodeExecutor {
  constructor() {
    this.timeoutMs = 5000; // 5 second timeout
  }

  createSandbox() {
    // Create a restricted context with only necessary built-ins
    return {
      Array,
      Object,
      Number,
      String,
      Boolean,
      Date,
      Math,
      JSON,
      console: {
        log: () => {}, // Suppress console.log
        error: () => {} // Suppress console.error
      },
      module: {
        exports: {}
      }
    };
  }

  async executeJavaScript(code, testCases) {
    const results = [];
    
    try {
      // Create a new secure context
      const sandbox = vm.createContext(this.createSandbox());
      
      // Wrap user code in a module pattern to avoid global scope pollution
      const wrappedCode = `
        (function() {
          ${code}
          module.exports = ${code.split('function ')[1].split('(')[0]};
        })();
      `;

      // First, try to compile the code to catch syntax errors
      try {
        new vm.Script(wrappedCode, {
          timeout: this.timeoutMs,
          filename: 'usercode.js'
        });
      } catch (error) {
        return [{
          error: `Syntax Error: ${error.message}`,
          passed: false,
          executionTime: 0,
          output: null,
          expectedOutput: null
        }];
      }

      // Run the code in the sandbox
      vm.runInContext(wrappedCode, sandbox, {
        timeout: this.timeoutMs,
        filename: 'usercode.js'
      });

      // Get the function from the sandbox
      const userFunction = sandbox.module.exports;

      // Run each test case
      for (const testCase of testCases) {
        const start = process.hrtime();
        
        try {
          // Parse input string to arguments array
          const args = JSON.parse(`[${testCase.input}]`);
          
          // Execute the function with timeout
          const output = userFunction(...args);
          
          // Calculate execution time
          const [seconds, nanoseconds] = process.hrtime(start);
          const executionTime = seconds * 1000 + nanoseconds / 1000000;

          // Parse expected output
          const expectedOutput = JSON.parse(testCase.expectedOutput);

          // Compare results
          const passed = JSON.stringify(output) === JSON.stringify(expectedOutput);

          results.push({
            testCaseId: testCase._id,
            passed,
            executionTime,
            output,
            expectedOutput,
            error: null
          });
        } catch (error) {
          results.push({
            testCaseId: testCase._id,
            error: `Runtime Error: ${error.message}`,
            passed: false,
            executionTime: 0,
            output: null,
            expectedOutput: JSON.parse(testCase.expectedOutput)
          });
        }
      }
    } catch (error) {
      results.push({
        error: `Execution Error: ${error.message}`,
        passed: false,
        executionTime: 0,
        output: null,
        expectedOutput: null
      });
    }

    return results;
  }
}

module.exports = CodeExecutor;