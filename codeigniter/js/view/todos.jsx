import { TodoView } from './todo.jsx';
import React from 'react';

export class TodosView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: this.props.todos,
    };

    this.props.model.events.addEventListener('added', todo => {
      this.add(todo);
    });
    this.props.model.events.addEventListener('deleted', id => {
      this.delete(id);
    });
    this.props.model.events.addEventListener('updated', todo => {
      this.update(todo);
    });
  }

  render() {
    const todoNode = this.state.todos.map(todo => {
      return (
        <TodoView
          key={todo.id}
          completed={todo.completed}
          contents={todo.contents}
          id={todo.id}
          onChecked={(id, checked) => {
            this.props.onChecked(id, checked);
          }}
          onEdited={(id, contents) => {
            this.props.onEdited(id, contents);
          }}
        />
      );
    });

    return <div>{todoNode}</div>;
  }

  add(todo) {
    this.setState({
      todos: this.state.todos.concat(todo),
    });
  }

  update(todo) {
    const index = this.state.todos.findIndex(todo => {
      return todo.id === id;
    });
    const tmp = this.state.todos;
    tmp[index] = todo;
    this.setState({ todos: tmp });
  }

  delete(id) {
    const index = this.state.todos.findIndex(todo => {
      return todo.id === id;
    });
    const tmp = this.state.todos;
    tmp.splice(index, 1);
    this.setState({ todos: tmp });
  }
}
