import type { Category } from './Category';
import type { PositionRecord } from './PositionRecord';

export interface Item {
    key? :string;
    name: string,
    additionExplanation? : string
    lastUpdate : number;
    bought : boolean;
    boughtTime? : number;
    boughtLocation? : PositionRecord,
    category?: Category;
    fromSiri? : boolean;
}
