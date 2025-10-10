/**
 * Generic Stack Data Structure
 *
 * A type-safe, generic implementation of the stack (LIFO - Last In, First Out)
 * data structure. This implementation is used throughout the Texscript compiler
 * for managing parsing contexts, tracking nested scopes, and maintaining
 * execution state during AST traversal.
 *
 * @module stack
 * @template T The type of elements stored in the stack
 *
 * @example
 * const nodeStack = new Stack<ASTNode>();
 * nodeStack.push(rootNode);
 * const current = nodeStack.peek();
 * nodeStack.pop();
 */

/**
 * A generic stack implementation providing LIFO (Last In, First Out) operations.
 *
 * This class wraps an array to provide stack semantics with type safety.
 * Common use cases in the compiler include:
 * - Tracking nested component hierarchies during parsing
 * - Managing scope contexts during semantic analysis
 * - Maintaining state during recursive AST traversal
 *
 * @class Stack
 * @template T The type of elements stored in the stack
 */
export default class Stack<T> {
  /** Internal storage for stack elements */
  private items: T[] = [];

  /**
   * Adds an element to the top of the stack.
   *
   * @param {T} element - The element to push onto the stack
   * @returns {void}
   *
   * @example
   * const stack = new Stack<string>();
   * stack.push("first");
   * stack.push("second"); // "second" is now on top
   */
  push(element: T): void {
    this.items.push(element);
  }

  /**
   * Removes and returns the element at the top of the stack.
   *
   * @returns {T} The element that was at the top of the stack
   * @throws {Error} Throws "Stack underflow" if the stack is empty
   *
   * @example
   * stack.push("item");
   * const item = stack.pop(); // Returns "item"
   * stack.pop(); // Throws Error: Stack underflow
   */
  pop(): T {
    if (this.isEmpty()) {
      throw new Error("Stack underflow");
    }
    return this.items.pop() as T;
  }

  /**
   * Checks whether the stack is empty.
   *
   * Useful for loop conditions and guard clauses to prevent underflow errors.
   *
   * @returns {boolean} True if the stack contains no elements, false otherwise
   *
   * @example
   * if (!stack.isEmpty()) {
   *   const item = stack.pop(); // Safe to pop
   * }
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the element at the top of the stack without removing it.
   *
   * This is useful for inspecting the current context or state without
   * modifying the stack. Returns null if the stack is empty rather than
   * throwing an error, making it safer for optional context checking.
   *
   * @returns {T | null} The top element if the stack is not empty, null otherwise
   *
   * @example
   * stack.push("top");
   * console.log(stack.peek()); // "top"
   * console.log(stack.size()); // Still 1 - peek doesn't remove
   *
   * const emptyStack = new Stack<string>();
   * console.log(emptyStack.peek()); // null
   */
  peek(): T | null {
    if (!this.isEmpty()) return this.items[this.items.length - 1]!;
    else return null;
  }
}
