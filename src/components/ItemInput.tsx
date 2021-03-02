import React, { useEffect, useState } from 'react';
import { faCheck, faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timer } from 'rxjs';
import VoiceRecorderService from '../services/voice-recorder.service';
import { Item } from '../datatypes/Item';

interface Props {
    onItemsOutput: (items: Item[]) => void
}

const ItemInput = (props: Props) => {
    const [itemName, setItemName] = useState('');
    const [listening, setListening] = useState(false);
    const [placeholder, setPlaceholder] = useState('');
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

    const consigli = ['Carottes', '3 Patates', 'Pain'];
    const ottenireLaBuonaParolaTagliata = (i:number, durazioneDeLaPausaInPassi:number) => {
        const conto = consigli.map((str) => 2 * str.length + durazioneDeLaPausaInPassi)
            .reduce(
                (acc, val) => acc.concat((acc.length === 0 ? 0 : acc[acc.length - 1]) + val), [],
            );
        const massimo = conto[conto.length - 1];
        const indice = conto.findIndex((val) => val > (i % massimo));
        const parola = consigli[indice];
        const passo = (
            (i % massimo) - (indice === 0 ? 0 : conto[indice - 1]))
            % (2 * parola.length + durazioneDeLaPausaInPassi);
        return parola.substring(
            0,
            passo + 1 > parola.length + durazioneDeLaPausaInPassi
                ? 2 * parola.length - passo + durazioneDeLaPausaInPassi : passo,
        );
    };
    useEffect(() => {
        const sub = timer(0, 100).subscribe((i) => setPlaceholder(
            ottenireLaBuonaParolaTagliata(i, 20),
        ));
        return () => {
            sub.unsubscribe();
        };
    }, []);

    const startRecording = () => {
        if (!VoiceRecorderService.voiceRecognitionIsSupported) {
            // eslint-disable-next-line no-alert
            alert("La reconnaissance sonore n'est disponible que sur Chrome");
            return;
        }
        if (!navigator.onLine) {
            // eslint-disable-next-line no-alert
            alert('Activez internet pour utiliser la saisie vocale');
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
        const items = pastedText.split(/\n/i)
            .map((s) => s.trim())
            .filter((s) => !!s)
            .map(
                (item) => ({
                    name: item, lastUpdate: new Date().getTime(), bought: false, category: null,
                }),
            );
        props.onItemsOutput(items);
        setItemName('');
    };

    return (
        <form onSubmit={onSubmit} id="item-input">
            <textarea
                placeholder={placeholder}
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
    );
};
export default ItemInput;
