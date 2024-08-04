# solver.py

def find_empty_location(grid, l):
    for row in range(9):
        for col in range(9):
            if grid[row][col] == 0:
                l[0], l[1] = row, col
                return True
    return False


def used_in_row(grid, row, num):
    for col in range(9):
        if grid[row][col] == num:
            return True
    return False


def used_in_col(grid, col, num):
    for row in range(9):
        if grid[row][col] == num:
            return True
    return False


def used_in_box(grid, row, col, num):
    for i in range(3):
        for j in range(3):
            if grid[row+i][col+j] == num:
                return True
    return False


def check_location_is_safe(grid, row, col, num):
    return not used_in_row(grid, row, num) and not used_in_col(grid, col, num) and not used_in_box(grid, row - row % 3, col - col % 3, num)


def solve_sudoku(grid):
    l = [0, 0]
    if not find_empty_location(grid, l):
        return True
    row, col = l[0], l[1]
    for num in range(1, 10):
        if check_location_is_safe(grid, row, col, num):
            grid[row][col] = num
            if solve_sudoku(grid):
                return True
            grid[row][col] = 0
    return False


def is_valid_sudoku(grid):
    for row in range(9):
        for col in range(9):
            num = grid[row][col]
            if num != 0:
                grid[row][col] = 0
                if not check_location_is_safe(grid, row, col, num):
                    return False
                grid[row][col] = num
    return True


def get_hint(grid, row, col):
    if grid[row][col] != 0:
        return None
    for num in range(1, 10):
        if check_location_is_safe(grid, row, col, num):
            return {"row": row, "col": col, "value": num}
    return None
