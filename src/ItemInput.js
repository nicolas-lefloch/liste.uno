import React, { useState } from 'react';
import {VoiceRecorder} from './voice-recorder.service'
const ItemInput = (props) => {
    const [value, setValue] = useState('')
    const [listening, setListening] = useState(false)


    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            const newItem = { id: Math.random(), value: event.target.value }
            props.onItemOutput(newItem);
            setValue('');

        }
    }

    const startRecording = () => {
        setListening(true)
        VoiceRecorder.recordShoppingList().then(
            items => items.map(item => 
                props.onItemOutput({id : Math.random(), value : item})
            )
        ).finally(()=> setListening(false))
    }

    const stopRecording = () => {
        setListening(false)
        VoiceRecorder.stopVoiceRecognition();
    }

    return (
        <>
            <input type="text"
                placeholder={props.placeholder}
                value={value}
                onInput={event => setValue(event.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button
                style={{ width: '120px', color: 'black' }}
                onClick={listening ? stopRecording : startRecording}>
                {listening ? 'Listening...' : 'Audio'}
            </button>
        </>
    );

}
export default ItemInput;
