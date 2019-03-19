import React from 'react';

export class InputView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };
  }

  render() {
    return (
      <span>
        <input type="checkbox" />
        <input
          type="text"
          value={this.state.input}
          placeholder={'Enter your task.'}
          onKeyDown={event => {
            if (event.keyCode === 13 && /\S/g.test(this.state.input)) {
              this.props.onInputed(this.state.input);
              this.setState({ input: '' });
            }
          }}
          onChange={event => {
            this.setState({ input: event.target.value });
          }}
        />
      </span>
    );
  }
}
