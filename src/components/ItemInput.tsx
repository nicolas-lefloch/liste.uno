import React, { useState } from 'react';
import { faCheck, faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VoiceRecorderService from '../services/voice-recorder.service';

import { Item } from '../datatypes/Item';

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
                name: itemName.trim(),
                lastUpdate: new Date().getTime(),
                bought: false,
                category: null,
            };
            props.onItemsOutput([newItem]);
            setItemName('');
        }
    };

    const startRecording = () => {
        if (!VoiceRecorderService.voiceRecognitionIsSupported) {
            // eslint-disable-next-line no-alert
            alert("La reconnaissance sonore n'est disponible que sur Chrome");
            return;
        }
        setListening(true);
        VoiceRecorderService.recordShoppingList().then(
            (items) => props.onItemsOutput(items),
        ).catch()
            .finally(() => setListening(false));
    };

    const stopRecording = () => {
        setListening(false);
        VoiceRecorderService.stopVoiceRecognition();
    };

    const handlePaste = (pastedText: string) => {
        props.onItemsOutput(VoiceRecorderService.transcriptToItems(pastedText));
        setItemName('');
    };

    return (
        <>
            <form onSubmit={onSubmit} id="item-input">
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
                {
                    itemName ? (
                        <button
                            type="submit"
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </button>

                    )
                        : (
                            <button
                                type="button"
                                onClick={listening ? stopRecording : startRecording}
                            >
                                {listening
                                    ? <FontAwesomeIcon icon={faSpinner} spin />
                                    : <FontAwesomeIcon icon={faMicrophone} />}
                            </button>

                        )
                }
            </form>
        </>
    );
};
export default ItemInput;
