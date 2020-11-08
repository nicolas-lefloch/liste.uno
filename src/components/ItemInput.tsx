import React, { useState } from 'react';
import { faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
                category: { name: '', image: '' },
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
                    className="circular big icon button"
                    onClick={listening ? stopRecording : startRecording}
                    disabled={!VoiceRecorder.voiceRecognitionIsSupported}
                >
                    {listening
                        ? <FontAwesomeIcon icon={faSpinner} spin />
                        : <FontAwesomeIcon icon={faMicrophone} />}
                    {!VoiceRecorder.voiceRecognitionIsSupported && ' (unavailable - use Chrome)'}
                </button>
            </form>
        </>
    );
};
export default ItemInput;
