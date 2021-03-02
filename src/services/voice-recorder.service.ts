import { Item } from '../datatypes/Item';

const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : undefined;

if (recognition) {
    recognition.lang = 'fr-FR';
}

export default class VoiceRecorderService {
    static voiceRecognitionIsSupported = !!recognition;

    /**
     * Trigger speech to text and returns a Promise that resolves to a list of item to create.
     */
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

    /**
     * Transcript a string message into a list of items.
     * @param transcript from Speech to text
     */
    public static transcriptToItems(transcript: string) : Item[] {
        const res = transcript.split(/ (?=[0-9])| et | des | du | de la |(?= une? )|\n/i)
            .map((s) => s.trim())
            .filter((s) => !!s)
            .map((item) => item.replace(/^des |^du |^de la /i, ''))
            .map((item) => item.replace(/^une |^un /i, '1 '))
        // The speech recognition mistakes "deux" for "de"
            .map((item) => item.replace(/^de /, '2 '))
            .map((item) => item.replace(/un /, '1 '))
            .map((item) => item.replace(/^deux /, '2 '))
            .map((item) => item.replace(/^trois /, '3 '))
            .map((item) => item.replace(/^quatre /, '4 '))
            .map((item) => item.replace(/^cinq /, '5 '))
            .map((item) => item.replace(/^six /, '6 '))
            .map((item) => item.replace(/^sept /, '7 '))
            .map((item) => item.replace(/^huit /, '8 '))
            .map((item) => item.replace(/^neuf /, '9 '))
            .map((item) => item.replace(/^dix /, '10 '))
            .map((item) => item.replace(/^onze /, '11 '))
            .map((item) => item.replace(/^douze /, '12 '))
            .map((item) => item.replace(/^treize /, '13 '))
            .map((item) => item.replace(/^quatorze /, '14 '))
            .map((item) => item.replace(/^quinze /, '15 '))
            .map((item) => item.replace(/^seize /, '16 '))
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .map(
                (item) => ({
                    name: item, lastUpdate: new Date().getTime(), bought: false, category: null,
                }),
            );
        return res;
    }

    /**
     * Force voice recognition to stop.
     * used when user click mic button again
     */
    static stopVoiceRecognition() {
        recognition.onend = () => { };
        recognition.stop();
    }
}
