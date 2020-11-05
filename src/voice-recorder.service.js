const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = SpeechRecognition? new SpeechRecognition() : undefined

if(recognition){
    recognition.lang = 'fr-FR'
}
export class VoiceRecorder {
    static voiceRecognitionIsSupported = !!recognition;

    static recordShoppingList() {
        console.log(recognition);

        return new Promise((resolve, reject) => {
            recognition.onresult = event => {
                const transcript = event.results[0][0].transcript
                resolve(VoiceRecorder.toShoppingList(transcript))
            }
            recognition.onend = reject // will be called only if resolve did not happen (i.e. no result was outputed)
            recognition.start()
        })
    }

    static stopVoiceRecognition() {
        recognition.onend = () => { }
        recognition.stop()
    }

    static toShoppingList(transcript) {
        console.log(transcript)
        const res = transcript.split(/ puis | et /)
            .map(s => s.trim())
            .map(item => item.replace(/^des |^du /, ''))
            .map(s => s.charAt(0).toUpperCase()+s.slice(1))
        console.log(res);
        return res
    }
}