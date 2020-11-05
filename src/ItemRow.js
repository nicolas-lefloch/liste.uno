import React, { useState } from "react";
const ItemRow = (props) => {

    const [name, setName] = useState(props.name);
    const [editable, setEditable] = useState(false);

    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            setEditable(false);
        }
    };

    if(!editable) {
        return (
            <li className={"button-container"} onDoubleClick={()=> setEditable(!editable)}>{name}
                <button className={"negative"} onClick={props.onDelete}>X</button>
            </li>
        );
    } else {
        return (
            <li className={"button-container"}>
                <form onSubmit={() => setEditable(false)}>
                    <input className={"item"} onKeyPress={handleKeyPress}
                           onInput={(event) => setName(event.target.value)}  autoFocus type="text"
                           value={name}/>
                </form>
                <button className={"positive"} onClick={() => setEditable(false)}>V</button>
            </li>
        );
    }

}

export default ItemRow;
