import React, { useState } from 'react';
import VoiceRecorder from '../services/voice-recorder.service';

import { Item } from '../datatypes/Item';
import CleverListService from '../services/clever-list.service';

interface Props {
    onItemsOutput: (items: Item[]) => void
    placeholder: string
}

const ItemInput = (props: Props) => {
    const [itemName, setItemName] = useState('');
    const [listening, setListening] = useState(false);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (itemName !== '') {
            const newItem : Item = {
                name: itemName,
                lastUpdate: new Date().getTime(),
                bought: false,
            };
            props.onItemsOutput([newItem]);
            setItemName('');
        }
    };

    const startRecording = () => {
        setListening(true);
        VoiceRecorder.recordShoppingList().then(
            (items) => props.onItemsOutput(items),
        ).finally(() => setListening(false));
    };

    const stopRecording = () => {
        setListening(false);
        VoiceRecorder.stopVoiceRecognition();
    };

    const handlePaste = (pastedText: string) => {
        console.log(pastedText.split('\n'));

        props.onItemsOutput(CleverListService.transcriptToItems(pastedText));
        setItemName('');
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <textarea
                    // type="text"
                    placeholder={props.placeholder}
                    value={itemName}
                    onChange={(event) => setItemName(event.target.value)}
                    onPaste={(e) => setTimeout(
                        () => { handlePaste((e.target as HTMLInputElement).value); }, 0,
                    )}
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
