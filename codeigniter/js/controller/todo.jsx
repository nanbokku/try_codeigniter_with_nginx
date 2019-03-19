import React from 'react'; // webpackによりjsファイルに変換されたときに必要
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { TodosView } from '../view/todos.jsx';
import { TodosModel } from '../model/todos.js';
import { InputView } from '../view/input.jsx';

export class TodoController {
  constructor() {
    this.todosModel = new TodosModel();

    // initialize
    $.get('/todo/all').done(res => {
      console.log(res);
      this.initialize(res);
    });
  }

  initialize(todos) {
    ReactDOM.render(
      <InputView
        onInputed={text => {
          $.ajax({
            method: 'POST',
            url: '/todo/',
            data: JSON.stringify({ contents: text }),
            contentType: 'application/json',
          }).done(res => {
            this.todosModel.add({ id: res, contents: text, completed: false });
          });
        }}
      />,
      $('#todo-form').get(0)
    );

    ReactDOM.render(
      <TodosView
        todos={todos}
        model={this.todosModel}
        onChecked={(id, checked) => {
          $.ajax({
            method: 'PUT',
            url: '/todo/' + id,
            data: JSON.stringify({ completed: checked }),
            dataType: 'json',
            contentType: 'application/json',
          }).done(res => {
            this.todosModel.update({ id: id, completed: checked });
          });
        }}
        onEdited={(id, contents) => {
          console.log('contents ' + contents);
          $.ajax({
            method: 'PUT',
            url: '/todo/' + id,
            data: JSON.stringify({ contents: contents }),
            dataType: 'json',
            contentType: 'application/json',
          }).done(res => {
            console.log(res);
            this.todosModel.update({ id: id, contents: contents });
          });
        }}
      />,
      $('#todos').get(0)
    );
  }
}
