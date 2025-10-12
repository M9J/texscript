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

  peek(): T | null {
    if (!this.isEmpty()) return this.items[this.items.length - 1]!;
    else return null;
  }

  get size(): number {
    return this.items.length;
  }
}
