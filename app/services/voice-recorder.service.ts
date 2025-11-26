import type { Item } from '../datatypes/Item';

let SpeechRecognition
if (typeof window !== "undefined") {
    SpeechRecognition = (window as any).webkitSpeechRecognition;
}
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
            recognition.onresult = (event: { results: { transcript: string; }[][]; }) => {
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
    public static transcriptToItems(transcript: string): Item[] {
        const res = transcript.split(/ (?=[0-9])| et | des | du | de la |(?= une? )|\n/i)
            .map((s) => s.trim())
            .filter((s) => !!s)
            .map((item) => item.replace(/^des |^du |^de la /i, ''))
            .map((item) => item.replace(/^une |^un /i, '1 '))
            // The speech recognition mistakes "deux" for "de"
            .map((item) => item.replace(/^de /i, '2 '))
            .map((item) => item.replace(/un /i, '1 '))
            .map((item) => item.replace(/^deux /i, '2 '))
            .map((item) => item.replace(/^trois /i, '3 '))
            .map((item) => item.replace(/^quatre /i, '4 '))
            .map((item) => item.replace(/^cinq /i, '5 '))
            .map((item) => item.replace(/^six /i, '6 '))
            .map((item) => item.replace(/^sept /i, '7 '))
            .map((item) => item.replace(/^huit /i, '8 '))
            .map((item) => item.replace(/^neuf /i, '9 '))
            .map((item) => item.replace(/^dix /i, '10 '))
            .map((item) => item.replace(/^onze /i, '11 '))
            .map((item) => item.replace(/^douze /i, '12 '))
            .map((item) => item.replace(/^treize /i, '13 '))
            .map((item) => item.replace(/^quatorze /i, '14 '))
            .map((item) => item.replace(/^quinze /i, '15 '))
            .map((item) => item.replace(/^seize /i, '16 '))
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .map(
                (item) => ({
                    name: item, lastUpdate: new Date().getTime(), bought: false, category: undefined,
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
