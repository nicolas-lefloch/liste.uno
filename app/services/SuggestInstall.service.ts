/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 */
interface BeforeInstallPromptEvent extends Event {

    /**
     * Returns an array of DOMString items containing
     * the platforms on which the event was dispatched.
     * This is provided for user agents that want to present a choice of versions
     * to the user such as, for example, "web" or "play" which would allow
     * the user to chose between a web version or an Android version.
     */
    readonly platforms: Array<string>;

    /**
     * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
     */
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed',
      platform: string
    }>;

    /**
     * Allows a developer to show the install prompt at a time of their own choosing.
     * This method returns a Promise.
     */
    prompt(): Promise<void>;

  }

export default class SuggestInstallService {
    private static interactions = 0

    static deferredPrompt : BeforeInstallPromptEvent

    static onceAppShouldBeSuggested : () => void

    /**
     * Register user interaction to suggest them to install PWA
     */
    static registerInteractionWasMade() {
        SuggestInstallService.interactions += 1;
        if (this.interactions == 3 && !localStorage.getItem('installation_refused')) {
            if (!this.deferredPrompt) {
                // eslint-disable-next-line no-console
                console.log('could not suggest install because no beforeinstallprompt was caught');
                return;
            }
            SuggestInstallService.onceAppShouldBeSuggested();
        }
    }

    static onInstallAgreed() {
        if (SuggestInstallService.deferredPrompt) {
            SuggestInstallService.deferredPrompt.prompt();
        }
    }

    static onInstallRefused() {
        localStorage.setItem('installation_refused', 'true');
    }
}

if(typeof window !== "undefined"){
    window.addEventListener('beforeinstallprompt', (e:BeforeInstallPromptEvent) => {
        e.preventDefault();
        SuggestInstallService.deferredPrompt = e;
    });
}
