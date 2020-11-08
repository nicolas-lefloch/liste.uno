import { PositionRecord } from './PositionRecord';
import { Category } from './Category';

export interface Item {
    key? :string;
    name: string,
    additionExplanation? : string
    lastUpdate : number;
    bought : boolean;
    boughtTime? : number;
    boughtLocation? : PositionRecord,
    category: Category;
}
