import { Item } from '../datatypes/Item';
import CleverListService from './clever-list.service';

const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : undefined;

if (recognition) {
    recognition.lang = 'fr-FR';
}
export default class VoiceRecorder {
    static voiceRecognitionIsSupported = !!recognition;

    static recordShoppingList(): Promise<Item[]> {
        return new Promise((resolve, reject) => {
            recognition.onresult = (event) => {
                const { transcript } = event.results[0][0];
                console.log(transcript);
                resolve(CleverListService.transcriptToItems(transcript));
            };
            // will be called only if resolve did not happen (i.e. no result was outputed)
            recognition.onend = reject;
            recognition.start();
        });
    }

    static stopVoiceRecognition() {
        recognition.onend = () => { };
        recognition.stop();
    }
}
