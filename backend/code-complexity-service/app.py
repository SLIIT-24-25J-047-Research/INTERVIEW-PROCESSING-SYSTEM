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
    print(f"Language: {language}")  
    print(f"Code: {code}") 

    # Weights and bias for the calculation
    weight_CC = 4.983
    weight_CFC = -5.597
    weight_WCC = 2.925
    bias = 2.6895663956639577

    if language == "python":
        cc_result = calculate_cc(code)  
        cfc_result = calculate_cfc(code)  
        wcc_result = calculate_wcc(code)  

        print(f"CC Result Type: {type(cc_result)} - {cc_result}")
        print(f"CFC Result Type: {type(cfc_result)} - {cfc_result}")
        print(f"WCC Result Type: {type(wcc_result)} - {wcc_result}")

    
        if isinstance(cc_result, dict):
            cc_result = cc_result.get('cyclomatic_complexity', 0)  
        if isinstance(cfc_result, dict):
            cfc_result = cfc_result.get('internal_interactions', 0)  
        if isinstance(wcc_result, dict):
            wcc_result = wcc_result.get('weighted_cyclomatic_complexity', 0) 

        
        cc_result = float(cc_result) if isinstance(cc_result, (int, float)) else 0
        cfc_result = float(cfc_result) if isinstance(cfc_result, (int, float)) else 0
        wcc_result = float(wcc_result) if isinstance(wcc_result, (int, float)) else 0

  
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
            "single_complexity_value": weighted_sum
        }

    elif language == "javascript":
        try:
            
            cc_result = calculate_js_cc(code)
            cfc_result = calculate_js_cfc(code)
            wcc_result = calculate_js_wcc(code)
            maintainability_result = calculate_js_maintainability(code)

          
            print(f"CC Result Type: {type(cc_result)} - {cc_result}")
            print(f"CFC Result Type: {type(cfc_result)} - {cfc_result}")
            print(f"WCC Result Type: {type(wcc_result)} - {wcc_result}")

         
            if isinstance(cc_result, dict):
                cc_result = cc_result.get('cyclomatic_complexity', 0) 
            if isinstance(cfc_result, dict):
                cfc_result = cfc_result.get('internal_interactions', 0)  
            if isinstance(wcc_result, dict):
                wcc_result = wcc_result.get('weighted_cyclomatic_complexity', 0)  

           
            cc_result = float(cc_result) if isinstance(cc_result, (int, float)) else 0
            cfc_result = float(cfc_result) if isinstance(cfc_result, (int, float)) else 0
            wcc_result = float(wcc_result) if isinstance(wcc_result, (int, float)) else 0

          
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
                "single_complexity_value": weighted_sum
            }

        except Exception as e:
            print(f"Metric Calculation Error: {e}")
            return {"error": str(e)}
    else:
        return {"error": f"Unsupported language: {language}"}


def calculate_cc(code):
    """
    Calculate Cyclomatic Complexity manually for Python code.
    Formula: CC = Number of decision points + 1
    """
    try:
        tree = ast.parse(code)
        complexity = 1  
        
        class ComplexityVisitor(ast.NodeVisitor):
            def __init__(self):
                self.complexity = 1
            
            def visit_If(self, node):
                self.complexity += 1
                self.generic_visit(node)
            
            def visit_For(self, node):
                self.complexity += 1
                self.generic_visit(node)
            
            def visit_While(self, node):
                self.complexity += 1
                self.generic_visit(node)
            
            def visit_With(self, node):
                self.complexity += 1
                self.generic_visit(node)
            
            def visit_Try(self, node):
                self.complexity += 1
                self.generic_visit(node)
            
            def visit_ExceptHandler(self, node):
                self.complexity += 1
                self.generic_visit(node)
            
            def visit_BoolOp(self, node):
                self.complexity += len(node.values) - 1
                self.generic_visit(node)
            
            def visit_Compare(self, node):
                self.complexity += len(node.ops) - 1
                self.generic_visit(node)
        
        visitor = ComplexityVisitor()
        visitor.visit(tree)
        return visitor.complexity
    except Exception as e:
        return {"error": str(e)}



def calculate_wcc(code):
    """
    Calculate Weighted Cyclomatic Complexity manually.
    Formula: WCC = Sum of (complexity of each function * nesting level multiplier)
    """
    try:
        tree = ast.parse(code)
        total_weighted_complexity = 0
        
        class FunctionVisitor(ast.NodeVisitor):
            def __init__(self):
                self.functions = []
            
            def visit_FunctionDef(self, node):
                self.functions.append(node)
                self.generic_visit(node)
        
        # Find all functions
        visitor = FunctionVisitor()
        visitor.visit(tree)
        
        # Calculate complexity for each function
        for func in visitor.functions:
            #  base complexity
            cc = 1
            for node in ast.walk(func):
                if isinstance(node, ast.If) or isinstance(node, ast.For) or isinstance(node, ast.While):
                    cc += 1
                elif isinstance(node, ast.BoolOp):
                    cc += len(node.values) - 1
                elif isinstance(node, ast.Compare):
                    cc += len(node.ops) - 1
            
            #  nesting level
            nesting_level = 0
            parent = func
            while hasattr(parent, 'parent'):
                parent = parent.parent
                if isinstance(parent, (ast.FunctionDef, ast.ClassDef)):
                    nesting_level += 1
            
            # Apply weight based on nesting level
            weight = 1 + (0.1 * nesting_level)
            total_weighted_complexity += cc * weight
        
        return total_weighted_complexity if visitor.functions else 1
    except Exception as e:
        return {"error": str(e)}




def calculate_cfc(code):
    """
    Calculate Cognitive Complexity manually.
    Based on SonarSource's Cognitive Complexity specification.
    """
    try:
        tree = ast.parse(code)
        complexity = 0
        
        class CognitiveVisitor(ast.NodeVisitor):
            def __init__(self):
                self.complexity = 0
                self.nesting_level = 0
            
            def visit_If(self, node):
                self.complexity += 1 + self.nesting_level
                self.nesting_level += 1
                self.generic_visit(node)
                self.nesting_level -= 1
            
            def visit_For(self, node):
                self.complexity += 1 + self.nesting_level
                self.nesting_level += 1
                self.generic_visit(node)
                self.nesting_level -= 1
            
            def visit_While(self, node):
                self.complexity += 1 + self.nesting_level
                self.nesting_level += 1
                self.generic_visit(node)
                self.nesting_level -= 1
            
            def visit_Try(self, node):
                self.complexity += 1 + self.nesting_level
                self.nesting_level += 1
                self.generic_visit(node)
                self.nesting_level -= 1
            
            def visit_ExceptHandler(self, node):
                self.complexity += 1 + self.nesting_level
                self.generic_visit(node)
            
            def visit_BoolOp(self, node):
                self.complexity += len(node.values) - 1
                self.generic_visit(node)
            
            def visit_Compare(self, node):
                self.complexity += len(node.ops) - 1
                self.generic_visit(node)
        
        visitor = CognitiveVisitor()
        visitor.visit(tree)
        return visitor.complexity
    except Exception as e:
        return {"error": str(e)}



def calculate_maintainability(code):
    """
    Calculate Maintainability Index manually.
    Formula: MI = 171 - 5.2 * ln(Halstead Volume) - 0.23 * (Cyclomatic Complexity) - 16.2 * ln(LOC)
    Simplified version using just CC and LOC
    """
    try:
        # Calculate LOC
        loc = len(code.splitlines())
        
        # Calculate Cyclomatic Complexity
        cc = calculate_cc(code)
        if isinstance(cc, dict):
            cc = 1  # Default if error
        
        # Calculate comment percentage (simplified)
        comment_lines = sum(1 for line in code.splitlines() if line.strip().startswith('#'))
        comment_percentage = (comment_lines / loc) * 100 if loc > 0 else 0
        
        # Simplified MI calculation
        mi = max(0, 171 - 5.2 * (cc or 1) - 0.23 * (loc or 1) + 0.1 * comment_percentage)
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
    Calculate Cyclomatic Complexity for JavaScript code manually using text analysis.
    Formula: CC = Number of decision points + 1
    """
    try:
        # Base complexity
        complexity = 1
        
        # Count decision points
        complexity += code.count('if ') + code.count('if(')
        complexity += code.count('else ') + code.count('else{')
        complexity += code.count('case ')
        complexity += code.count('default:')
        complexity += code.count('?')  # ternary operators
        complexity += code.count('&&')  # logical AND
        complexity += code.count('||')  # logical OR
        complexity += code.count('for ') + code.count('for(')
        complexity += code.count('while ') + code.count('while(')
        complexity += code.count('catch ') + code.count('catch(')
        
        # Count function declarations (adds to complexity)
        complexity += code.count('function ') + code.count('=>')  # arrow functions
        
        return complexity
    except Exception as e:
        return {"error": f"JS CC Calculation Error: {str(e)}"}
  

def calculate_js_maintainability(code):
    """
    Calculate Maintainability Index for JavaScript manually.
    Simplified formula: MI = 171 - 5.2 * ln(CC) - 0.23 * ln(LOC) - 16.2 * ln(1 + comment_ratio)
    """
    try:
        import math
        
        # Calculate lines of code
        lines = [line for line in code.splitlines() if line.strip()]
        loc = len(lines)
        
        # Count comment lines
        comment_lines = sum(
            1 for line in lines 
            if line.strip().startswith(('//', '/*')) or line.strip().endswith('*/')
        )
        comment_ratio = comment_lines / loc if loc > 0 else 0
        
        # Calculate cyclomatic complexity
        cc = calculate_js_cc(code)
        if isinstance(cc, dict):
            cc = 1  # default if error
        
        # Simplified MI calculation
        mi = max(0, 
            171 - 
            5.2 * math.log(cc + 1) - 
            0.23 * math.log(loc + 1) - 
            16.2 * math.log(1 + comment_ratio)
        )
        
        return mi
    except Exception as e:
        return {"error": f"JS Maintainability Calculation Error: {str(e)}"}

    
def calculate_js_cfc(code):
    """
    Calculate Cognitive Complexity for JavaScript manually using text analysis.
    Based on SonarSource's Cognitive Complexity specification.
    """
    try:
        complexity = 0
        nesting_level = 0
        lines = code.splitlines()
        
        for line in lines:
            stripped = line.strip()
            # Skip empty lines and comments
            if not stripped or stripped.startswith(('//', '/*', '*')):
                continue
            
            # Check for nesting-increasing constructs
            if ('if ' in stripped or 'if(' in stripped or 
                'else ' in stripped or 'else{' in stripped or
                'for ' in stripped or 'for(' in stripped or
                'while ' in stripped or 'while(' in stripped or
                'catch ' in stripped or 'catch(' in stripped):
                complexity += 1 + nesting_level
                nesting_level += 1
            
            # Check for logical operators
            if ('&&' in stripped or '||' in stripped or 
                '?' in stripped):  # ternary operator
                complexity += 1
            
            # Check for switch cases
            if 'case ' in stripped or 'default:' in stripped:
                complexity += 1
            
            # Count closing braces (decrease nesting)
            if '}' in stripped:
                nesting_level = max(0, nesting_level - stripped.count('}'))
        
        return complexity
    except Exception as e:
        return {"error": f"JS CFC Calculation Error: {str(e)}"}

def calculate_js_wcc(code):
    """
    Calculate Weighted Cyclomatic Complexity for JavaScript manually.
    Formula: WCC = Sum of (complexity of each function * nesting level multiplier)
    """
    try:
        # First calculate base CC
        base_cc = calculate_js_cc(code)
        if isinstance(base_cc, dict):
            base_cc = 1  # default if error
        
        # Estimate nesting level by counting indentations and braces
        lines = code.splitlines()
        nesting_level = 0
        max_nesting = 0
        in_function = False
        
        for line in lines:
            stripped = line.strip()
            # Skip empty lines and comments
            if not stripped or stripped.startswith(('//', '/*', '*')):
                continue
            
            # Count opening braces (increase nesting)
            nesting_level += line.count('{')
            # Count closing braces (decrease nesting)
            nesting_level -= line.count('}')
            
            # Track max nesting
            if nesting_level > max_nesting:
                max_nesting = nesting_level
        
        # Apply weight based on max nesting level (0.1 per level)
        weight = 1 + (0.1 * max_nesting)
        return base_cc * weight
    except Exception as e:
        return {"error": f"JS WCC Calculation Error: {str(e)}"}  



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