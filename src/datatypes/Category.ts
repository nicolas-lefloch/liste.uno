import React from 'react';

export interface Category {
    name: string,
}
export interface CategoryImage {
    type : CategoryIconType,
    image : React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    iconURL : string
}

export type CategoryIconType ='SVGAsComponent' | 'b'
