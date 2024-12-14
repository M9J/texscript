export default class Queue {
  constructor() {
    this.items = [];
  }

  // Enqueue a new element at the end of the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Dequeue the front element from the queue
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue underflow");
    }
    return this.items.shift();
  }

  // Peek at the front element of the queue without removing it
  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items[0];
  }

  // Get the current size of the queue
  size() {
    return this.items.length;
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }
}
