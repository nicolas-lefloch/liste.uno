import React, { useEffect, useRef, useState } from 'react';
import ListChoice from '../ListChoice';
import { useOptionsMenu } from './OptionsMenu';

interface Props {
    opened: boolean
}
const ListChoicePopup: React.FC<Props> = (props: Props) => {
    const { toggleListChoiceMenu } = useOptionsMenu();
    const backgroundRef = useRef<HTMLButtonElement>();

    const popupRef = useRef<HTMLDivElement>();
    const [popupHeight, setPopupHeight] = useState(0);
    const [dragging, setDragging] = useState(false);
    useEffect(() => {
        let dragOrigin: number;
        let lastY: number;
        let lastDirectionIsBottom: boolean;
        let initialHeight:number;
        const startDrag = (event: TouchEvent) => {
            dragOrigin = event.touches[0].clientY;
            lastY = dragOrigin;
            initialHeight = popupRef.current.clientHeight;
            setPopupHeight(initialHeight);
            setDragging(true);
        };
        const doDrag = (event: TouchEvent) => {
            event.preventDefault();
            if (dragOrigin) {
                const currentY = event.touches[0].clientY;
                const yDrag = currentY - dragOrigin;
                let newHeight = initialHeight - yDrag;
                if (newHeight > initialHeight) {
                    newHeight = initialHeight;
                }
                if (newHeight < 0) {
                    newHeight = 0;
                }
                lastDirectionIsBottom = currentY > lastY;
                lastY = currentY;
                setPopupHeight(newHeight);
            }
        };
        const endDrag = () => {
            setDragging(false);
            toggleListChoiceMenu(!lastDirectionIsBottom);
        };
        backgroundRef.current.addEventListener('touchstart', startDrag);
        backgroundRef.current.addEventListener('touchmove', doDrag, { passive: false });
        backgroundRef.current.addEventListener('touchend', endDrag);
    }, []);
    return (
        <div
            id="list-choice-popup"
            className={props.opened ? 'opened' : ''}
        >
            <button
                type="button"
                onClick={() => toggleListChoiceMenu(false)}
                onKeyDown={() => toggleListChoiceMenu(false)}
                ref={backgroundRef}
                id="list-choice-popup-background"
                aria-label="Fermer la popup"
            />
            <div id="popup-content" ref={popupRef} style={dragging ? { height: popupHeight, transition: 'none' } : {}}>
                <ListChoice />
            </div>
        </div>
    );
};

export default ListChoicePopup;
