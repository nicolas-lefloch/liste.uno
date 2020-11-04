import React from 'react';

class ItemInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleInput(event) {
        this.setState({value: event.target.value});
    }
    handleKeyPress(event) {
        if (event.code === "Enter") {
            this.setState({value : ''})
            this.props.onEnterPress(event);

        }
    }

    render() {
        return <input type="text"
                  placeholder={this.props.placeholder}
                  value={this.state.value}
                  onInput={this.handleInput}
                  onKeyPress={this.handleKeyPress}
        />;
    }
}

export default ItemInput;
