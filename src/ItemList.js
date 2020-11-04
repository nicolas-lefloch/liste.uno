import React from "react";
import ItemInput from "./ItemInput";
import Item from "./Item";

class ItemList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { list: [
                this.newItem('Pomme'),
                this.newItem('Banane'),
                this.newItem('Café'),
                this.newItem('Beurre') ]
        };
        this.onEnterPress = this.onEnterPress.bind(this);
        this.delete = this.delete.bind(this);
    }

    newItem(name) {
        return {id :Math.random(), value : name}
    }
    onEnterPress(event) {
        this.setState({ list: [...this.state.list, this.newItem(event.target.value)]})
    }

    delete(id) {
        this.setState({list: this.state.list.filter(e =>  e.id !== id)});
    }

    render() {

        const listItems = this.state.list.map(item =>
            <Item indexArray={item.id} key={item.id} name={item.value} onDelete={()=>this.delete(item.id)}/>
        );
        return <div className="itemList">
            <ItemInput placeholder="Ajouter un item" onEnterPress={this.onEnterPress}/>
            <ol>
                {listItems}
            </ol>
        </div>

    }
}

export default ItemList;
