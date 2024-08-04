from flask import Flask, request, jsonify, render_template
from solver import solve_sudoku, is_valid_sudoku, get_hint

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/solve', methods=['POST'])
def solve():
    data = request.get_json()
    grid = data['grid']
    if solve_sudoku(grid):
        return jsonify({"solution": grid})
    else:
        return jsonify({"solution": None})


@app.route('/validate', methods=['POST'])
def validate():
    data = request.get_json()
    grid = data['grid']
    return jsonify({"valid": is_valid_sudoku(grid)})


@app.route('/hint', methods=['POST'])
def hint():
    data = request.get_json()
    grid = data['grid']
    row = data['row']
    col = data['col']
    hint = get_hint(grid, row, col)
    return jsonify({"valid": bool(hint), "hint": hint})


if __name__ == '__main__':
    app.run(debug=True, port=9000)
