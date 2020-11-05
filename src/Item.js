import React, { useState } from "react";
const Item = (props) => {

    const [name, setName] = useState(props.name);
    const [editable, setEditable] = useState(false);

    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            setEditable(false);
        }
    };

    let el;
    if(!editable) {
        el = <li className={"button-container"} onDoubleClick={()=> setEditable(!editable)}>{name}
            <button className={"negative"} onClick={props.onDelete}>X</button>
        </li>
    } else {
        el = <li className={"button-container"}>
            <input className={"item"} onKeyPress={handleKeyPress}
                   onInput={(event) => setName(event.target.value)}  autoFocus type="text"
                   value={name}/><button className={"positive"} onClick={() => setEditable(false)}>V</button></li>
    }

    return el;
}

export default Item;
