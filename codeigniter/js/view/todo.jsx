import React from 'react';

export class TodoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: this.props.completed,
      contents: this.props.contents,
    };
  }

  render() {
    return (
      <li>
        <span>
          <input
            type="checkbox"
            checked={this.state.completed}
            onChange={event => {
              this.setState({ completed: event.target.checked });
              // setStateしても直ちにstateは変更されない(componentWillUpdate()とrender()の間で更新される)．なのでevent.target.checkedを渡す．
              this.props.onChecked(this.props.id, event.target.checked);
            }}
          />
          <input
            type="text"
            value={this.state.contents}
            onBlur={() => {
              // when textarea value is not blank
              if (/\S+/g.test(this.state.contents)) {
                this.props.onEdited(this.props.id, this.state.contents);
              }
            }}
            onKeyDown={event => {
              // when push enter key or textarea value is not blank
              if (event.keyCode === 13 && /\S+/g.test(this.state.contents)) {
                this.props.onEdited(this.props.id, this.state.contents);
              }
            }}
            onChange={event => {
              // when change contents
              this.setState({ contents: event.target.value });
            }}
          />
          {this.state.contents}
        </span>
      </li>
    );
  }
}
