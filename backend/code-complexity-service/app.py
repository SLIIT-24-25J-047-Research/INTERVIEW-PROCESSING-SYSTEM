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
    Calculate all code metrics with detailed breakdowns
    """
    print(f"Language: {language}")  
    print(f"Code: {code}") 

    # Weights 
    weight_CC = 4.983
    weight_CFC = -5.597
    weight_WCC = 2.925
    bias = 2.6895663956639577

    if language == "python":
  
        cc_details = calculate_cc(code)
        cfc_details = calculate_cfc(code)
        wcc_details = calculate_wcc(code)
        mi_details = calculate_maintainability(code)
        pylint_details = calculate_pylint_score(code)

        # Extract values 
        cc_value = cc_details['value'] if isinstance(cc_details, dict) else cc_details
        cfc_value = cfc_details['value'] if isinstance(cfc_details, dict) else cfc_details
        wcc_value = wcc_details['value'] if isinstance(wcc_details, dict) else wcc_details

        #  single value
        weighted_sum = (cc_value * weight_CC) + (cfc_value * weight_CFC) + (wcc_value * weight_WCC) + bias

        return {
            "language": language,
            "overall_Complexity_score": weighted_sum,
            "metrics": {
                "cyclomatic_complexity": enhance_cc_output(cc_details),
                "cognitive_complexity": enhance_cfc_output(cfc_details),
                "weighted_complexity": enhance_wcc_output(wcc_details),
                "maintainability_index": enhance_mi_output(mi_details),
                "code_quality": enhance_pylint_output(pylint_details)
            },
            "interpretation": {
                "overall": get_overall_interpretation(weighted_sum),
                "recommendations": get_recommendations({
                    'cc': cc_value,
                    'cfc': cfc_value,
                    'wcc': wcc_value,
                    'mi': mi_details['value'] if isinstance(mi_details, dict) else mi_details
                })
            }
        }

    elif language == "javascript":
        try:
            
            cc_details = calculate_js_cc(code)
            cfc_details = calculate_js_cfc(code)
            wcc_details = calculate_js_wcc(code)
            mi_details = calculate_js_maintainability(code)

           
            cc_value = cc_details['value'] if isinstance(cc_details, dict) else cc_details
            cfc_value = cfc_details['value'] if isinstance(cfc_details, dict) else cfc_details
            wcc_value = wcc_details['value'] if isinstance(wcc_details, dict) else wcc_details

            weighted_sum = (cc_value * weight_CC) + (cfc_value * weight_CFC) + (wcc_value * weight_WCC) + bias

            return {
                "language": language,
                "overall_Complexity_score": weighted_sum,
                "metrics": {
                    "cyclomatic_complexity": enhance_js_cc_output(cc_details),
                    "cognitive_complexity": enhance_js_cfc_output(cfc_details),
                    "weighted_complexity": enhance_js_wcc_output(wcc_details),
                    "maintainability_index": enhance_js_mi_output(mi_details)
                },
                "interpretation": {
                    "overall": get_overall_interpretation(weighted_sum),
                    "recommendations": get_recommendations({
                        'cc': cc_value,
                        'cfc': cfc_value,
                        'wcc': wcc_value,
                        'mi': mi_details['value'] if isinstance(mi_details, dict) else mi_details
                    })
                }
            }
        except Exception as e:
            print(f"Metric Calculation Error: {e}")
            return {"error": str(e)}
    else:
        return {"error": f"Unsupported language: {language}"}
    


# enhancement
def enhance_cc_output(cc_result):
    """Add detailed explanation for cyclomatic complexity"""
    if isinstance(cc_result, dict):
        value = cc_result.get('value', cc_result)
        breakdown = cc_result.get('breakdown', [])
    else:
        value = cc_result
        breakdown = []
    
    interpretation = ""
    if value <= 5:
        interpretation = "Simple, easy to understand and maintain"
    elif 6 <= value <= 10:
        interpretation = "Moderately complex, consider refactoring if it grows"
    elif 11 <= value <= 20:
        interpretation = "Complex, refactoring recommended"
    else:
        interpretation = "Very high complexity, immediate refactoring needed"
    
    return {
        "value": value,
        "breakdown": breakdown,
        "interpretation": interpretation,
        "optimal_range": "1-5",
        "scale": {
            "low": "1-5 (excellent)",
            "medium": "6-10 (acceptable)",
            "high": "11-20 (needs improvement)",
            "very_high": "20+ (critical)"
        }
    }

def enhance_cfc_output(cfc_result):
    """Add detailed explanation for cognitive complexity"""
    if isinstance(cfc_result, dict):
        value = cfc_result.get('value', cfc_result)
        breakdown = cfc_result.get('breakdown', [])
    else:
        value = cfc_result
        breakdown = []
    
    interpretation = ""
    if value <= 5:
        interpretation = "Very easy to understand"
    elif 6 <= value <= 10:
        interpretation = "Moderate understanding effort"
    elif 11 <= value <= 15:
        interpretation = "Difficult to understand, consider simplifying"
    else:
        interpretation = "Very difficult to understand, needs refactoring"
    
    return {
        "value": value,
        "breakdown": breakdown,
        "interpretation": interpretation,
        "optimal_range": "1-5",
        "scale": {
            "low": "1-5 (excellent)",
            "medium": "6-10 (acceptable)",
            "high": "11-15 (needs improvement)",
            "very_high": "15+ (critical)"
        }
    }

def enhance_mi_output(mi_result):
    """Add detailed explanation for maintainability index"""
    if isinstance(mi_result, dict):
        value = mi_result.get('value', mi_result)
        breakdown = mi_result.get('breakdown', {})
    else:
        value = mi_result
        breakdown = {}
    
    interpretation = ""
    if value >= 85:
        interpretation = "Excellent maintainability"
    elif 65 <= value < 85:
        interpretation = "Good maintainability"
    elif 50 <= value < 65:
        interpretation = "Moderate maintainability, could be improved"
    else:
        interpretation = "Low maintainability, needs significant refactoring"
    
    return {
        "value": value,
        "breakdown": breakdown,
        "interpretation": interpretation,
        "optimal_range": "85-100",
        "scale": {
            "excellent": "85-100",
            "good": "65-84",
            "moderate": "50-64",
            "low": "0-49"
        }
    }

def get_overall_interpretation(score):
    """Provide overall interpretation based on weighted sum"""
    if score < 20:
        return "Excellent code quality with very low complexity"
    elif 20 <= score < 40:
        return "Good code quality with manageable complexity"
    elif 40 <= score < 60:
        return "Moderate code quality that could benefit from improvements"
    elif 60 <= score < 80:
        return "Complex code that needs refactoring"
    else:
        return "Very complex code that requires significant refactoring"

def get_recommendations(metrics):
    """Generate specific recommendations based on metrics"""
    recommendations = []
    
    if metrics['cc'] > 10:
        recommendations.append(
            "High cyclomatic complexity detected. Consider breaking down complex functions "
            "into smaller, single-purpose functions."
        )
    
    if metrics['cfc'] > 15:
        recommendations.append(
            "High cognitive complexity detected. Simplify logical structures and reduce "
            "nesting levels where possible."
        )
    
    if metrics['mi'] < 65:
        recommendations.append(
            "Maintainability could be improved. Add comments, reduce complexity, "
            "and ensure consistent coding style."
        )
    
    if not recommendations:
        return ["Code quality metrics are generally good. Keep up the good work!"]
    
    return recommendations


def enhance_js_cc_output(cc_result):
    """Add detailed explanation for JavaScript cyclomatic complexity"""
    if isinstance(cc_result, dict):
        value = cc_result.get('value', cc_result)
    else:
        value = cc_result
    
    interpretation = ""
    if value <= 5:
        interpretation = "Simple JavaScript function, easy to understand and maintain"
    elif 6 <= value <= 10:
        interpretation = "Moderately complex JavaScript, consider refactoring if it grows"
    elif 11 <= value <= 20:
        interpretation = "Complex JavaScript code, refactoring recommended"
    else:
        interpretation = "Very high complexity in JavaScript, immediate refactoring needed"
    
    return {
        "value": value,
        "interpretation": interpretation,
        "optimal_range": "1-5",
        "scale": {
            "low": "1-5 (excellent)",
            "medium": "6-10 (acceptable)",
            "high": "11-20 (needs improvement)",
            "very_high": "20+ (critical)"
        }
    }

def enhance_js_cfc_output(cfc_result):
    """Add detailed explanation for JavaScript cognitive complexity"""
    if isinstance(cfc_result, dict):
        value = cfc_result.get('value', cfc_result)
    else:
        value = cfc_result
    
    interpretation = ""
    if value <= 5:
        interpretation = "Very easy to understand JavaScript code"
    elif 6 <= value <= 10:
        interpretation = "Moderate understanding effort for JavaScript"
    elif 11 <= value <= 15:
        interpretation = "Difficult to understand JavaScript, consider simplifying"
    else:
        interpretation = "Very difficult to understand JavaScript, needs refactoring"
    
    return {
        "value": value,
        "interpretation": interpretation,
        "optimal_range": "1-5",
        "scale": {
            "low": "1-5 (excellent)",
            "medium": "6-10 (acceptable)",
            "high": "11-15 (needs improvement)",
            "very_high": "15+ (critical)"
        }
    }

def enhance_js_wcc_output(wcc_result):
    """Add detailed explanation for JavaScript weighted complexity"""
    if isinstance(wcc_result, dict):
        value = wcc_result.get('value', wcc_result)
    else:
        value = wcc_result
    
    interpretation = ""
    if value <= 7:
        interpretation = "Well-structured JavaScript with good complexity distribution"
    elif 8 <= value <= 15:
        interpretation = "Moderate weighted complexity in JavaScript"
    elif 16 <= value <= 25:
        interpretation = "High weighted JavaScript complexity - review nested functions"
    else:
        interpretation = "Very high weighted JavaScript complexity - needs restructuring"
    
    return {
        "value": value,
        "interpretation": interpretation,
        "optimal_range": "1-7",
        "scale": {
            "low": "1-7 (excellent)",
            "medium": "8-15 (acceptable)",
            "high": "16-25 (needs improvement)",
            "very_high": "25+ (critical)"
        }
    }

def enhance_js_mi_output(mi_result):
    """Add detailed explanation for JavaScript maintainability index"""
    if isinstance(mi_result, dict):
        value = mi_result.get('value', mi_result)
    else:
        value = mi_result
    
    interpretation = ""
    if value >= 85:
        interpretation = "Excellent JavaScript maintainability"
    elif 65 <= value < 85:
        interpretation = "Good JavaScript maintainability"
    elif 50 <= value < 65:
        interpretation = "Moderate JavaScript maintainability, could be improved"
    else:
        interpretation = "Low JavaScript maintainability, needs significant refactoring"
    
    return {
        "value": value,
        "interpretation": interpretation,
        "optimal_range": "85-100",
        "scale": {
            "excellent": "85-100",
            "good": "65-84",
            "moderate": "50-64",
            "low": "0-49"
        }
    }

def enhance_wcc_output(wcc_result):
    """Add detailed explanation for weighted cyclomatic complexity"""
    if isinstance(wcc_result, dict):
        value = wcc_result.get('value', wcc_result)
    else:
        value = wcc_result
    
    interpretation = ""
    if value <= 7:
        interpretation = "Well-structured code with good complexity distribution"
    elif 8 <= value <= 15:
        interpretation = "Moderate weighted complexity"
    elif 16 <= value <= 25:
        interpretation = "High weighted complexity - review nested functions"
    else:
        interpretation = "Very high weighted complexity - needs restructuring"
    
    return {
        "value": value,
        "interpretation": interpretation,
        "optimal_range": "1-7",
        "scale": {
            "low": "1-7 (excellent)",
            "medium": "8-15 (acceptable)",
            "high": "16-25 (needs improvement)",
            "very_high": "25+ (critical)"
        }
    }

def enhance_pylint_output(pylint_result):
    """Add detailed explanation for pylint score"""
    if isinstance(pylint_result, dict):
        score = pylint_result.get('score', 0)
        details = pylint_result.get('details', '')
    else:
        score = pylint_result
        details = ''
    
    interpretation = ""
    if score >= 9.0:
        interpretation = "Excellent code quality according to Pylint standards"
    elif 7.0 <= score < 9.0:
        interpretation = "Good code quality with minor issues"
    elif 5.0 <= score < 7.0:
        interpretation = "Moderate code quality that needs improvement"
    else:
        interpretation = "Poor code quality that requires significant refactoring"
    
    # Extract key messages from Pylint output
    key_messages = []
    if details:
        # Look for important messages (errors and warnings)
        import re
        error_messages = re.findall(r'[A-Z]\d+:.*', details)
        key_messages = [msg.strip() for msg in error_messages[:3]]  # Get top 3 messages
    
    return {
        "score": score,
        "interpretation": interpretation,
        "optimal_range": "9.0-10.0",
        "scale": {
            "excellent": "9.0-10.0",
            "good": "7.0-8.9",
            "moderate": "5.0-6.9",
            "poor": "0.0-4.9"
        },
        "key_messages": key_messages,
        "full_report": details if len(details) < 1000 else details[:1000] + "... [truncated]"
    }
    

# enhancement over


def calculate_cc(code):
    try:
        tree = ast.parse(code)
        
        class ComplexityVisitor(ast.NodeVisitor):
            def __init__(self):
                self.complexity = 1
                self.breakdown = []
            
            def add_complexity(self, node_type, lineno, count=1):
                self.complexity += count
                self.breakdown.append({
                    'type': node_type,
                    'location': f"Line {lineno}",
                    'complexity_added': count
                })
            
            def visit_If(self, node):
                self.add_complexity('if_statement', node.lineno)
                self.generic_visit(node)
            
            def visit_For(self, node):
                self.add_complexity('for_loop', node.lineno)
                self.generic_visit(node)
            
            def visit_While(self, node):
                self.add_complexity('while_loop', node.lineno)
                self.generic_visit(node)
            
            def visit_With(self, node):
               
                self.generic_visit(node)
            
            def visit_Try(self, node):
                
                self.generic_visit(node)
            
            def visit_ExceptHandler(self, node):
                self.add_complexity('except_handler', node.lineno)
                self.generic_visit(node)
            
            def visit_BoolOp(self, node):
                
                count = len(node.values) - 1
                if count > 0:
                    self.add_complexity('boolean_operator', node.lineno, count)
                self.generic_visit(node)
            
            
            
        visitor = ComplexityVisitor()
        visitor.visit(tree)
        
        return {
            'value': visitor.complexity,
            'breakdown': visitor.breakdown,
            'total_components': len(visitor.breakdown)
        }
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