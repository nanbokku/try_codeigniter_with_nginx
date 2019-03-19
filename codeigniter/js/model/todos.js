import { Reactor } from '../utils/reactor.js';

export class TodosModel {
  constructor() {
    this.events = new Reactor();
    this.todos = [];
  }

  add(todo) {
    this.todos.push(todo);

    // trigger
    this.events.dispatchEvent('added', todo);
  }

  get(id) {
    const index = this.findIndex(id);
    return this.todos[index];
  }

  delete(id) {
    const index = this.findIndex(id);
    this.todos.splice(index, 1);

    // trigger
    this.events.dispatchEvent('deleted', id);
  }

  update(todo) {
    console.log(todo);
    const index = this.findIndex(todo.id);
    this.todos[index] = { ...this.todos[index], ...todo };

    // trigger
    this.events.dispatchEvent('updated', this.todos[index]);
  }

  findIndex(id) {
    return this.todos.findIndex(todo => {
      return todo.id === id;
    });
  }
}
