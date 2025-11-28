import React from 'react';

export interface Option{
    label : string;
    action : () => void;
    disabled? :boolean
}

interface Props {
    opened : boolean;
    options : Option[];
}
const ContextualMenu: React.FC<Props> = (props: Props) => (
    <div className={`contextual-menu ${props.opened ? 'opened' : ''}`}>
        {props.options.map((option) => (
            <button type="button" disabled={!!option.disabled} key={option.label} onClick={option.action}>{option.label}</button>
        ))}
    </div>
);

export default ContextualMenu;
