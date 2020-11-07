const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : undefined;

if (recognition) {
    recognition.lang = 'fr-FR';
}
export default class VoiceRecorder {
    static voiceRecognitionIsSupported = !!recognition;

    static recordShoppingList(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            recognition.onresult = (event) => {
                const { transcript } = event.results[0][0];
                console.log(transcript);
                resolve(VoiceRecorder.toShoppingList(transcript));
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

    static toShoppingList(transcript: string) {
        const res = transcript.split(/ (?=[0-9])| et | des | du | de la |(?= une? )/i)
            .map((s) => s.trim())
            .map((item) => item.replace(/^des |^du |^de la /i, ''))
            .map((item) => item.replace(/^une |^un /i, '1 '))
            // The speech recognition mistakes "deux" for "de"
            // Except for the expression "de la" (e.g. "de la creme") which is handled before
            .map((item) => item.replace(/^de /, '2 '))
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
        return res;
    }
}
