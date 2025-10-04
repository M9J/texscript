export default class Stack<T> {
  private items: T[] = [];

  push(element: T): void {
    this.items.push(element);
  }

  pop(): T {
    if (this.isEmpty()) {
      throw new Error("Stack underflow");
    }
    return this.items.pop() as T;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  peek(): T | undefined {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }
}
