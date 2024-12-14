export default class Stack {
  constructor() {
    this.items = [];
  }

  // Push a new element onto the stack
  push(element) {
    this.items.push(element);
  }

  // Pop the top element from the stack
  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack underflow");
    }
    return this.items.pop();
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get the current size of the stack
  size() {
    return this.items.length;
  }

  // Peek at the top element of the stack without removing it
  peek() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }
}
