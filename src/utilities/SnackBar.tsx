/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';

/**
 * Create snackback React context
 */
const SnackbarContext = React.createContext({
    snack: null,
    duration: 1000,
    triggerSnack: () => { },
} as {
    snack : JSX.Element | string | null,
    duration : number,
    triggerSnack : (str: JSX.Element | string | null, duration: number)=>void
});
/**
 * Snackbar React component
 * @constructor
 */
const SnackBar = () => {
    const { snack, duration, triggerSnack } = useContext(SnackbarContext);
    const [showing, setShowing] = useState(false);
    useEffect(() => {
        if (!snack) {
            return () => {};
        }
        // make sure that several successive snackbars do not stop interrupt last one
        let isLastSnack = true;
        setShowing(true);
        setTimeout(() => {
            if (isLastSnack) {
                setShowing(false);
                setTimeout(() => {
                    if (isLastSnack) {
                        triggerSnack(null, 0);
                    }
                }, 1000);
            }
        }, duration);
        return () => { isLastSnack = false; };
    },
    [snack, duration]);
    return (
        <div className={`snackbar ${showing ? 'visible' : ''}`}>
            {snack}
        </div>
    );
};

interface Props{
    children : any
}
export const SnackBarProvider: React.FC<Props> = (props:Props) => {
    const [snack, setSnack] = useState(null);
    const [duration, setDuration] = useState(1000);
    // init snackbar context
    const value = {
        snack,
        duration,
        // init hooks return to trigger snackbar display
        /**
         * trigger snackbar
         * @param el element to display in snackbar
         * @param d duration
         */
        triggerSnack: (el: JSX.Element | string | null, d: number) => {
            setSnack(el);
            setDuration(d);
        },
    };

    return (
        <SnackbarContext.Provider value={value}>
            {props.children}
            <SnackBar />
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const { triggerSnack } = useContext(SnackbarContext);
    return triggerSnack;
};
