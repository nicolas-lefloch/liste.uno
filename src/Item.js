import React from "react";
class Item extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: this.props.name, editable : false };

        this.save = this.save.bind(this);
        this.handleDblClick = this.handleDblClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleInput = this.handleInput.bind(this);

    }

    render() {
        let el;
        if(this.state.editable === false) {
            el = <li className={"button-container"} onDoubleClick={this.handleDblClick}>{this.state.name}
                <button className={"negative"} onClick={this.props.onDelete}>X</button>
            </li>
        } else {
            el = <li className={"button-container"}>
                <input className={"item"} onKeyPress={this.handleKeyPress}
                   onInput={this.handleInput}  autoFocus type="text"
                   value={this.state.name}/><button className={"positive"} onClick={this.save}>V</button></li>
        }

        return el;
    }

    handleInput(event) {
        this.setState({name: event.target.value});
    }

    save() {
       this.setState({editable : false})
    }

    handleDblClick() {
        this.setState({editable: !this.state.editable})
    }

    handleKeyPress(event) {
        if (event.code === "Enter") {
            this.setState({editable : false})
        }
    }

}

export default Item;
