import React, { useState } from 'react';
import VoiceRecorder from '../services/voice-recorder.service';

import { Item } from '../datatypes/Item';

interface Props {
    onItemsOutput: (items: Item[]) => void
    placeholder: string
}

const ItemInput = (props: Props) => {
    const [value, setValue] = useState('');
    const [listening, setListening] = useState(false);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (value !== '') {
            const newItem = { id: Math.random(), value };
            props.onItemsOutput([newItem]);
            setValue('');
        }
    };

    const startRecording = () => {
        setListening(true);
        VoiceRecorder.recordShoppingList().then(
            (items) => props.onItemsOutput(
                items.map((item) => ({ id: Math.random(), value: item })),
            ),
        ).finally(() => setListening(false));
    };

    const stopRecording = () => {
        setListening(false);
        VoiceRecorder.stopVoiceRecognition();
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder={props.placeholder}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </form>
            <button
                type="button"
                style={{ width: '120px', color: 'black' }}
                onClick={listening ? stopRecording : startRecording}
                disabled={!VoiceRecorder.voiceRecognitionIsSupported}
            >
                {listening ? 'Listening...' : 'Audio'}
                {!VoiceRecorder.voiceRecognitionIsSupported && ' (unavailable - use Chrome)'}
            </button>
        </>
    );
};
export default ItemInput;
