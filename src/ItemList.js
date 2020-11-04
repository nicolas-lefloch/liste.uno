import React from "react";
import ItemInput from "./ItemInput";
import Item from "./Item";

class ItemList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { list: [
                {id:1, value : 'Banane'},
                {id: 2, value : 'Pomme'},
                {id: 3, value : 'Café'},
                {id: 4, value : 'Beurre'} ]
        };
        this.addItemToList = this.addItemToList.bind(this);
        this.delete = this.delete.bind(this);
    }


    addItemToList(item) {
        this.setState({ list: [...this.state.list, item]})
    }

    delete(id) {
        this.setState({list: this.state.list.filter(e =>  e.id !== id)});
    }

    render() {

        const listItems = this.state.list.map(item =>
            <Item indexArray={item.id} key={item.id} name={item.value} onDelete={()=>this.delete(item.id)}/>
        );
        return <div className="itemList">
            <ItemInput placeholder="Ajouter un item" onItemOutput={this.addItemToList}/>
            <ol>
                {listItems}
            </ol>
        </div>

    }
}

export default ItemList;
