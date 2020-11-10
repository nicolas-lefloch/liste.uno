import { Item } from '../datatypes/Item';

const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : undefined;

if (recognition) {
    recognition.lang = 'fr-FR';
}
export default class VoiceRecorderService {
    static voiceRecognitionIsSupported = !!recognition;

    static recordShoppingList(): Promise<Item[]> {
        return new Promise((resolve, reject) => {
            recognition.onresult = (event) => {
                const { transcript } = event.results[0][0];
                // eslint-disable-next-line no-console
                console.log(transcript);
                resolve(VoiceRecorderService.transcriptToItems(transcript));
            };
            // will be called only if resolve did not happen (i.e. no result was outputed)
            recognition.onend = reject;
            recognition.start();
        });
    }

    public static transcriptToItems(transcript: string) : Item[] {
        const res = transcript.split(/ (?=[0-9])| et | des | du | de la |(?= une? )|\n/i)
            .map((s) => s.trim())
            .filter((s) => !!s)
            .map((item) => item.replace(/^des |^du |^de la /i, ''))
            .map((item) => item.replace(/^une |^un /i, '1 '))
        // The speech recognition mistakes "deux" for "de"
            .map((item) => item.replace(/^de /, '2 '))
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .map(
                (item) => ({
                    name: item, lastUpdate: new Date().getTime(), bought: false, category: null,
                }),
            );
        return res;
    }

    static stopVoiceRecognition() {
        recognition.onend = () => { };
        recognition.stop();
    }
}
