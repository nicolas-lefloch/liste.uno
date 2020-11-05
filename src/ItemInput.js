import React, { useState } from 'react';
import { VoiceRecorder } from './voice-recorder.service'
const ItemInput = (props) => {
    const [value, setValue] = useState('')
    const [listening, setListening] = useState(false)


    const onSubmit = (event) => {
        event.preventDefault();
        const newItem = { id: Math.random(), value: value }
        props.onItemOutput(newItem);
        setValue('');
    }

    const startRecording = () => {
        setListening(true)
        VoiceRecorder.recordShoppingList().then(
            items => items.map(item =>
                props.onItemOutput({ id: Math.random(), value: item })
            )
        ).finally(() => setListening(false))
    }

    const stopRecording = () => {
        setListening(false)
        VoiceRecorder.stopVoiceRecognition();
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text"
                    placeholder={props.placeholder}
                    value={value}
                    onInput={event => setValue(event.target.value)}
                />
            </form>
            <button
                style={{ width: '120px', color: 'black' }}
                onClick={listening ? stopRecording : startRecording}
                disabled={!VoiceRecorder.voiceRecognitionIsSupported}
                >
                {listening ? 'Listening...' : 'Audio'}
                {!VoiceRecorder.voiceRecognitionIsSupported && ' (unavailable - use Chrome)'}
            </button>
        </>
    );

}
export default ItemInput;
