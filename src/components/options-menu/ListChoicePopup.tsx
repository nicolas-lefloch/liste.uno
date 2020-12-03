import React, { useEffect, useRef, useState } from 'react';
import ListChoice from '../ListChoice';
import { useOptionsMenu } from './OptionsMenu';

interface Props {
    opened: boolean
}
const ListChoicePopup: React.FC<Props> = (props: Props) => {
    const { toggleListChoiceMenu } = useOptionsMenu();
    const backgroundRef = useRef<HTMLButtonElement>();
    const [maxOffset, setMaxOffset] = useState(window.innerHeight);
    const minOffset = maxOffset / 2;
    const popupRef = useRef<HTMLDivElement>();
    const [popupOffset, setPopupOffset] = useState(props.opened ? minOffset : maxOffset);
    const [exceedingBorder, setExceedingBorder] = useState(0);
    useEffect(() => {
        setPopupOffset(props.opened ? minOffset : maxOffset);
    }, [props.opened, maxOffset]);
    const [dragging, setDragging] = useState(false);
    useEffect(() => {
        window.addEventListener('resize', () => {
            setMaxOffset(window.innerHeight);
        });
    }, []);
    useEffect(() => {
        let dragOrigin: number;
        let lastY: number;
        let lastDirection: number;
        let initialOffset: number;
        const startDrag = (event: TouchEvent) => {
            dragOrigin = event.touches[0].clientY;
            lastY = dragOrigin;
            initialOffset = parseInt(popupRef.current.style.top, 10);
            setDragging(true);
        };
        const doDrag = (event: TouchEvent) => {
            event.preventDefault();
            if (dragOrigin) {
                const currentY = event.touches[0].clientY;
                const yDrag = currentY - dragOrigin;
                let newOffset = initialOffset + yDrag;
                if (newOffset > maxOffset) {
                    newOffset = maxOffset;
                }
                const tooHighDrag = Math.min(minOffset - newOffset);

                if (newOffset < minOffset) {
                    newOffset = minOffset;
                }
                lastDirection = lastY - currentY;
                lastY = currentY;
                const addedWidth = tooHighDrag > 0 ? tooHighDrag ** (1 / 2.5) : 0;
                setExceedingBorder(addedWidth);
                setPopupOffset(newOffset - 1.5 * addedWidth);
            }
        };
        const endDrag = () => {
            setDragging(false);
            setExceedingBorder(0);
            const currentOffset = parseInt(popupRef.current.style.top, 10);
            if ((lastDirection < 0 && currentOffset > minOffset) || currentOffset === maxOffset) {
                toggleListChoiceMenu(false);
            } else {
                setPopupOffset(minOffset);
            }
        };
        backgroundRef.current.addEventListener('touchstart', startDrag);
        backgroundRef.current.addEventListener('touchmove', doDrag, { passive: false });
        backgroundRef.current.addEventListener('touchend', endDrag);
        return () => {
            if (backgroundRef.current) {
                backgroundRef.current.removeEventListener('touchstart', startDrag);
                backgroundRef.current.removeEventListener('touchmove', doDrag);
                backgroundRef.current.removeEventListener('touchend', endDrag);
            }
        };
    }, [maxOffset]);
    return (
        <div
            id="list-choice-popup"
            className={props.opened ? 'opened' : ''}
        >
            <button
                type="button"
                onClick={() => props.opened && toggleListChoiceMenu(false)}
                onKeyDown={() => props.opened && toggleListChoiceMenu(false)}
                ref={backgroundRef}
                style={
                    {
                        backgroundColor: `rgba(247, 247, 247, ${
                            (0.3 * exceedingBorder ** 2) / (maxOffset - minOffset)
                            + 0.7 - (0.7 * (popupOffset - minOffset)) / (maxOffset - minOffset)
                        })`,
                        ...(dragging ? { transition: 'none' } : {}),
                    }
                }
                id="list-choice-popup-background"
                aria-label="Fermer la popup"
            />
            <div
                id="popup-content"
                ref={popupRef}
                style={
                    {
                        top: popupOffset,
                        ...(dragging
                            ? {
                                transition: 'none',
                                borderTopWidth: exceedingBorder + 6,
                                boxShadow: `1px -${6 + exceedingBorder}px 13px 4px #b9b9b99c`,
                            }
                            : {}),
                    }
                }
            >
                <ListChoice />
            </div>
        </div>
    );
};

export default ListChoicePopup;
