import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import SuggestInstallService from './services/SuggestInstall.service';

const PromptInstall = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    SuggestInstallService.onceAppShouldBeSuggested = () => setShowPrompt(true);
    return showPrompt ? (
        <div className="install-prompt">
            <p>
                Installez l&apos;application pour pouvoir faire vos courses sans connexion internet
            </p>
            <button className="plain-button" type="button" onClick={SuggestInstallService.onInstallAgreed}>Installler Liste.Uno</button>
            <button
                className="small-button"
                type="button"
                onClick={() => {
                    setShowPrompt(false);
                    SuggestInstallService.onInstallRefused();
                }}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    ) : null;
};

export default PromptInstall;
