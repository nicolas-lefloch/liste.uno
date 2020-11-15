/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';

const SnackbarContext = React.createContext({
    snack: null,
    duration: 1000,
    triggerSnack: () => { },
} as {
    snack : JSX.Element | string | null,
    duration : number,
    triggerSnack : (str: JSX.Element | string | null, duration: number)=>void
});

const SnackBar = () => {
    const { snack, duration, triggerSnack } = useContext(SnackbarContext);
    useEffect(() => {
        let isLastSnack = true;
        if (snack && duration) {
            setTimeout(() => {
                if (isLastSnack) {
                    triggerSnack(null, 0);
                }
            }, duration);
        }
        return () => { isLastSnack = false; };
    }, [snack, duration]);
    return snack
        ? (
            <div className="snackbar">
                {snack}
            </div>
        )
        : null;
};

interface Props{
    children : any
}
export const SnackBarProvider: React.FC<Props> = (props:Props) => {
    const [snack, setSnack] = useState(null as JSX.Element | null | string);
    const [duration, setDuration] = useState(1000);
    const value = {
        snack,
        duration,
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
