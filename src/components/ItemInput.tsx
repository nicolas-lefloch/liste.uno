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
            <form onSubmit={onSubmit} className="item-input">
                <textarea
                    placeholder={props.placeholder}
                    value={itemName}
                    onChange={(event) => setItemName(event.target.value)}
                    onPaste={(e) => setTimeout(
                        () => { handlePaste((e.target as HTMLTextAreaElement).value); }, 0,
                    )}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onSubmit(e);
                        }
                    }}
                />
                <button
                    type="button"
                    className="circular massive ui icon button"
                    onClick={listening ? stopRecording : startRecording}
                    disabled={!VoiceRecorder.voiceRecognitionIsSupported}
                >
                    {listening
                        ? <i className="spinner loading  icon" />
                        : <i className="microphone icon" />}
                    {!VoiceRecorder.voiceRecognitionIsSupported && ' (unavailable - use Chrome)'}
                </button>
            </form>
        </>
    );
};
export default ItemInput;
