from flask import Flask, request, jsonify
import radon.metrics
import radon.complexity
import mccabe
import ast
import io
import sys
from pylint import lint
from pylint.reporters.text import TextReporter
from radon.complexity import cc_visit
from radon.metrics import mi_visit
import esprima 
import logging
import traceback
# import joblib

# # Load model (example using joblib, but can be TensorFlow, etc.)
# model = joblib.load('path_to_your_model/model.pkl')

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)


def calculate_metrics(code, language):
    """
    Calculate all code metrics such as cyclomatic complexity, 
    weighted cyclomatic complexity, coupling between classes, 
    maintainability index, pylint score for the provided code,
    and a weighted sum of selected metrics using predefined weights.
    """
    print(f"Language: {language}")  # Debug print
    print(f"Code: {code}")  # Debug print

    # Weights and bias for the calculation
    weight_CC = 4.983
    weight_CFC = -5.597
    weight_WCC = 2.925
    bias = 2.6895663956639577

    if language == "python":
        # Ensure that the functions return numeric values (not a dict or sequence)
        cc_result = calculate_cc(code)  # Expected to return numeric value
        cfc_result = calculate_cfc(code)  # Expected to return numeric value
        wcc_result = calculate_wcc(code)  # Expected to return numeric value

        # Print types to debug the issue
        print(f"CC Result Type: {type(cc_result)} - {cc_result}")
        print(f"CFC Result Type: {type(cfc_result)} - {cfc_result}")
        print(f"WCC Result Type: {type(wcc_result)} - {wcc_result}")

        # Extract values from the results if they are dictionaries or sequences
        if isinstance(cc_result, dict):
            cc_result = cc_result.get('cyclomatic_complexity', 0)  # Default to 0 if not found
        if isinstance(cfc_result, dict):
            cfc_result = cfc_result.get('internal_interactions', 0)  # Default to 0 if not found
        if isinstance(wcc_result, dict):
            wcc_result = wcc_result.get('weighted_cyclomatic_complexity', 0)  # Default to 0 if not found

        # Convert to float if necessary
        cc_result = float(cc_result) if isinstance(cc_result, (int, float)) else 0
        cfc_result = float(cfc_result) if isinstance(cfc_result, (int, float)) else 0
        wcc_result = float(wcc_result) if isinstance(wcc_result, (int, float)) else 0

        # Print debug values
        print(f"CC Result: {cc_result}")
        print(f"CFC Result: {cfc_result}")
        print(f"WCC Result: {wcc_result}")

        # Calculate the single value using weighted sum
        weighted_sum = (cc_result * weight_CC) + (cfc_result * weight_CFC) + (wcc_result * weight_WCC) + bias
        print(f"Weighted Sum (Single Value): {weighted_sum}")

        return {
            "cyclomatic_complexity": cc_result,
            "weighted_cyclomatic_complexity": wcc_result,
            "coupling_between_classes": cfc_result,
            "maintainability_index": calculate_maintainability(code),
            "pylint_score": calculate_pylint_score(code),
            "single_value": weighted_sum
        }

    elif language == "javascript":
        try:
            # Ensure the JavaScript versions of the metrics return numeric values (not dicts)
            cc_result = calculate_js_cc(code)
            cfc_result = calculate_js_cfc(code)
            wcc_result = calculate_js_wcc(code)
            maintainability_result = calculate_js_maintainability(code)

            # Print types to debug the issue
            print(f"CC Result Type: {type(cc_result)} - {cc_result}")
            print(f"CFC Result Type: {type(cfc_result)} - {cfc_result}")
            print(f"WCC Result Type: {type(wcc_result)} - {wcc_result}")

            # Extract values from the results if they are dictionaries or sequences
            if isinstance(cc_result, dict):
                cc_result = cc_result.get('cyclomatic_complexity', 0)  # Default to 0 if not found
            if isinstance(cfc_result, dict):
                cfc_result = cfc_result.get('internal_interactions', 0)  # Default to 0 if not found
            if isinstance(wcc_result, dict):
                wcc_result = wcc_result.get('weighted_cyclomatic_complexity', 0)  # Default to 0 if not found

            # Convert to float if necessary
            cc_result = float(cc_result) if isinstance(cc_result, (int, float)) else 0
            cfc_result = float(cfc_result) if isinstance(cfc_result, (int, float)) else 0
            wcc_result = float(wcc_result) if isinstance(wcc_result, (int, float)) else 0

            # Print debug values
            print(f"CC Result: {cc_result}")
            print(f"CFC Result: {cfc_result}")
            print(f"WCC Result: {wcc_result}")

            # Calculate the single value using weighted sum
            weighted_sum = (cc_result * weight_CC) + (cfc_result * weight_CFC) + (wcc_result * weight_WCC) + bias
            print(f"Weighted Sum (Single Value): {weighted_sum}")

            return {
                "cyclomatic_complexity": cc_result,
                "coupling_between_classes": cfc_result,
                "weighted_cyclomatic_complexity": wcc_result,
                "maintainability_index": maintainability_result,
                "single_value": weighted_sum
            }

        except Exception as e:
            print(f"Metric Calculation Error: {e}")
            return {"error": str(e)}
    else:
        return {"error": f"Unsupported language: {language}"}


def calculate_cc(code):
    """
    Calculate Cyclomatic Complexity using Radon
    """
    try:
        results = cc_visit(code)
        complexities = [
            {
                "name": obj.name,
                "complexity": obj.complexity,
                "lineno": obj.lineno,
            }
            for obj in results
        ]
        return complexities
    except Exception as e:
        return {"error": str(e)}

def calculate_wcc(code):
    """
    Calculate Weighted Cyclomatic Complexity (WCC).
    """
    try:
        results = cc_visit(code)
        weighted_complexity = sum(
            obj.complexity * 1.5 if obj.complexity > 10 else obj.complexity
            for obj in results
        )
        return weighted_complexity
    except Exception as e:
        return {"error": str(e)}




def calculate_cfc(code):
    """
    Calculate Coupling Between Classes (CFC).
    """
    try:
        class CouplingVisitor(ast.NodeVisitor):
            def __init__(self):
                self.coupling_data = {
                    "external_imports": set(),
                    "internal_interactions": 0
                }

            def visit_Import(self, node):
                for alias in node.names:
                    self.coupling_data["external_imports"].add(alias.name)

            def visit_ClassDef(self, node):
                self.coupling_data["internal_interactions"] += len(node.body)
                self.generic_visit(node)

        tree = ast.parse(code)
        visitor = CouplingVisitor()
        visitor.visit(tree)

        return {
            "external_imports": list(visitor.coupling_data["external_imports"]),
            "internal_interactions": visitor.coupling_data["internal_interactions"]
        }
    except Exception as e:
        return {"error": str(e)}


def calculate_maintainability(code):
    """
    Calculate Maintainability Index
    """
    try:
        # Radon Maintainability Index
        mi = radon.metrics.mi_visit(code, True)
        return mi
    except Exception as e:
        return {"error": str(e)}

def calculate_pylint_score(code):
    """
    Calculate Pylint Score
    """
    try:
        # Create a temporary file to write the code
        import tempfile
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(code)
            temp_file_path = temp_file.name
        
        # Capture Pylint output
        pylint_output = io.StringIO()
        reporter = TextReporter(pylint_output)
        
        # Run Pylint
        lint.Run([temp_file_path], reporter=reporter, exit=False)
        
        # Clean up temporary file
        import os
        os.unlink(temp_file_path)
        
        # Parse Pylint output
        output_text = pylint_output.getvalue()
        
        # Extract score from the output
        import re
        score_match = re.search(r'Your code has been rated at ([-\d.]+)/10', output_text)
        
        return {
            "score": float(score_match.group(1)) if score_match else None,
            "details": output_text
        }
    except Exception as e:
        return {"error": str(e)}
    
    # javascript code
    
def calculate_js_cc(code):
    """
    Calculate Cyclomatic Complexity for JavaScript code.
    """
    try:
        # Use a more comprehensive complexity calculation
        tree = esprima.parseScript(code, {'loc': True})
        complexity = 1  # Base complexity

        def count_complexity(node):
            nonlocal complexity
            
            # Complexity increasing node types
            complexity_increasing_types = [
                'IfStatement',           # if statements
                'ConditionalExpression', # ternary operators
                'ForStatement',           # for loops
                'ForInStatement',         # for...in loops
                'ForOfStatement',         # for...of loops
                'WhileStatement',         # while loops
                'DoWhileStatement',       # do...while loops
                'SwitchStatement',        # switch statements
                'CatchClause',            # catch blocks
                'LogicalExpression',      # && and || operators
                'TernaryExpression'       # Additional ternary expressions
            ]

            # Check node type
            if isinstance(node, dict):
                node_type = node.get('type')
                
                # Increment complexity for specific node types
                if node_type in complexity_increasing_types:
                    complexity += 1
                
                # Special handling for logical expressions
                if node_type == 'LogicalExpression':
                    # Add extra complexity for multiple logical conditions
                    if node.get('operator') in ['&&', '||']:
                        complexity += 1
                
                # Recursive traversal
                for value in node.values():
                    if isinstance(value, (dict, list)):
                        if isinstance(value, dict):
                            count_complexity(value)
                        elif isinstance(value, list):
                            for item in value:
                                count_complexity(item)
            
            # Handle list of nodes
            elif isinstance(node, list):
                for item in node:
                    count_complexity(item)

        # Start complexity counting
        count_complexity(tree)
        
        return {"cyclomatic_complexity": complexity}
    
    except Exception as e:
        return {"error": f"JS Complexity Error: {str(e)}"}
  

def calculate_js_maintainability(code):
    """
    Calculate a simplified Maintainability Index for JavaScript code.
    """
    try:
        # Parse the JavaScript code into lines
        lines = code.splitlines()
        total_lines = len(lines)

        # Count comment lines
        comment_lines = sum(
            1 for line in lines if line.strip().startswith("//") or line.strip().startswith("/*")
        )

        # Lines of code (LOC)
        loc = total_lines - comment_lines

        # Cyclomatic complexity
        cc_result = calculate_js_cc(code)
        cyclomatic_complexity = cc_result.get("cyclomatic_complexity", 1)  # Default to 1 if not available

        # Approximate Maintainability Index
        from math import log
        if loc > 0:
            maintainability_index = max(
                0,
                171
                - 5.2 * log(loc)
                - 0.23 * cyclomatic_complexity
                - 16.2 * log(comment_lines + 1)
            )
        else:
            maintainability_index = 0  # No meaningful maintainability index for empty code

        return {"maintainability_index": maintainability_index}

    except Exception as e:
        return {"error": str(e)}

    

def calculate_js_cfc(code):
    """
    Calculate Coupling Between Classes for JavaScript code.
    """
    try:
        tree = esprima.parseScript(code, {'loc': True})
        external_imports = set()
        internal_interactions = 0

        def analyze_coupling(node):
            nonlocal external_imports, internal_interactions
            
            # Check if node is a dictionary
            if isinstance(node, dict):
                node_type = node.get('type')
                
                # Detect import statements
                if node_type == 'ImportDeclaration':
                    for specifier in node.get('specifiers', []):
                        imported_name = specifier.get('local', {}).get('name')
                        if imported_name:
                            external_imports.add(imported_name)
                
                # Detect class and function declarations
                if node_type in ['ClassDeclaration', 'FunctionDeclaration']:
                    # Count methods or function body statements
                    body = node.get('body', {}).get('body', [])
                    internal_interactions += len(body)
                
                # Recursive traversal
                for value in node.values():
                    if isinstance(value, (dict, list)):
                        if isinstance(value, dict):
                            analyze_coupling(value)
                        elif isinstance(value, list):
                            for item in value:
                                analyze_coupling(item)
            
            # Handle list of nodes
            elif isinstance(node, list):
                for item in node:
                    analyze_coupling(item)

        # Start coupling analysis
        analyze_coupling(tree)
        
        return {
            "external_imports": list(external_imports),
            "internal_interactions": internal_interactions
        }
    except Exception as e:
        return {"error": f"JS Coupling Error: {str(e)}"}


  
def calculate_js_wcc(code):
    """
    Calculate Weighted Cyclomatic Complexity for JavaScript code.
    """
    try:
        # First calculate base complexity
        cc_result = calculate_js_cc(code)
        
        # Extract cyclomatic complexity
        complexity = cc_result.get("cyclomatic_complexity", 1)
        
        # Apply weighted complexity logic
        # If complexity is greater than 10, multiply by 1.5
        weighted_complexity = complexity * 1.5 if complexity > 10 else complexity
        
        return {"weighted_cyclomatic_complexity": weighted_complexity}
    
    except Exception as e:
        return {"error": f"JS Weighted Complexity Error: {str(e)}"}


@app.route('/evaluate', methods=['POST'])
def evaluate_code():
    
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    code = data.get('code')
    language = data.get('language', 'python').lower()  # Default to Python if not specified


    if not code:
        return jsonify({"error": "Code is required"}), 400
    
    print(f"Received code: {code}")  # Debug print
    print(f"Language: {language}")   # Debug print
    # Validate syntax
    try:
        if language == "python":
            # Validate Python syntax
            ast.parse(code)
        elif language == "javascript":
            # Validate JavaScript syntax using Esprima
            try:
                esprima.parseScript(code)
            except Exception as e:
                raise SyntaxError(f"JavaScript syntax error: {str(e)}")
        else:
            return jsonify({"error": f"Unsupported language: {language}"}), 400

        # Calculate metrics
        metrics = calculate_metrics(code, language)
        return jsonify(metrics)
    except SyntaxError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logging.error(f"Unexpected error: {e}", exc_info=True)
        return jsonify({"error": str(e), "details": str(traceback.format_exc())}), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)