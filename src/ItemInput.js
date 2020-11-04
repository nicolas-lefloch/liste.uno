import React , {useState}from 'react';

const ItemInput = (props) => {
    const [value, setValue] = useState('')

    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            const newItem = {id : Math.random(), value: event.target.value}
            props.onItemOutput(newItem);
            setValue('');

        }
    }

    return <input type="text"
          placeholder={props.placeholder}
          value={value}
          onInput={event => setValue(event.target.value)}
          onKeyPress={handleKeyPress}
    />;

}
export default ItemInput;
