import firebase from 'firebase/app';
import 'firebase/database';
import { Category, CategoryImage } from '../datatypes/Category';
import { Item } from '../datatypes/Item';
import QuantityComputingService from './QuantityComputing.service';
import { ReactComponent as BeerIcon } from '../ressources/svg/beer-icon.svg';
import { ReactComponent as BeverageIcon } from '../ressources/svg/beverage-icon.svg';
import { ReactComponent as BreadIcon } from '../ressources/svg/bread-icon.svg';
import { ReactComponent as ClothesIcon } from '../ressources/svg/clothes-icon.svg';
import { ReactComponent as CreamIcon } from '../ressources/svg/cream-icon.svg';
import { ReactComponent as DessertIcon } from '../ressources/svg/dessert-icon.svg';
import { ReactComponent as FishIcon } from '../ressources/svg/fish-icon.svg';
import { ReactComponent as FruitIcon } from '../ressources/svg/fruit-icon.svg';
import { ReactComponent as HygieneIcon } from '../ressources/svg/hygiene-icon.svg';
import { ReactComponent as HomeCleaningIcon } from '../ressources/svg/home-cleaning-icon.svg';
import { ReactComponent as MeatIcon } from '../ressources/svg/meat-icon.svg';
import { ReactComponent as WineIcon } from '../ressources/svg/wine-icon.svg';
import { ReactComponent as GroceryIcon } from '../ressources/svg/grocery-icon.svg';
import { ReactComponent as CannedFoodIcon } from '../ressources/svg/canned-food-icon.svg';
import { ReactComponent as FrozenIcon } from '../ressources/svg/frozen-icon.svg';

interface CategoryRankingForItem{
    [categoryName : string] : {
        assignments : number
    }
}

export default class CategorizationService {
    private static appCategoriesImage : {category : Category, icon : CategoryImage}[] = [
        { category: { name: 'Bières' }, icon: { type: 'SVGAsComponent', image: BeerIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/beer-icon.svg` } },
        { category: { name: 'Boissons' }, icon: { type: 'SVGAsComponent', image: BeverageIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/beverage-icon.svg` } },
        { category: { name: 'Boulangerie' }, icon: { type: 'SVGAsComponent', image: BreadIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/bread-icon.svg` } },
        { category: { name: 'Vêtements' }, icon: { type: 'SVGAsComponent', image: ClothesIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/clothes-icon.svg` } },
        { category: { name: 'Crèmerie' }, icon: { type: 'SVGAsComponent', image: CreamIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/cream-icon.svg` } },
        { category: { name: 'Desserts' }, icon: { type: 'SVGAsComponent', image: DessertIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/dessert-icon.svg` } },
        { category: { name: 'Poissons' }, icon: { type: 'SVGAsComponent', image: FishIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/fish-icon.svg` } },
        { category: { name: 'Fruits et Légumes' }, icon: { type: 'SVGAsComponent', image: FruitIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/fruit-icon.svg` } },
        { category: { name: 'Hygiène' }, icon: { type: 'SVGAsComponent', image: HygieneIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/hygiene-icon.svg` } },
        { category: { name: 'Produits ménager' }, icon: { type: 'SVGAsComponent', image: HomeCleaningIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/home-cleaning-icon.svg` } },
        { category: { name: 'Viande' }, icon: { type: 'SVGAsComponent', image: MeatIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/meat-icon.svg` } },
        { category: { name: 'Vin' }, icon: { type: 'SVGAsComponent', image: WineIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/wine-icon.svg` } },
        { category: { name: 'Epicerie' }, icon: { type: 'SVGAsComponent', image: GroceryIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/grocery-icon.svg` } },
        { category: { name: 'Conserves' }, icon: { type: 'SVGAsComponent', image: CannedFoodIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/canned-food-icon.svg` } },
        { category: { name: 'Surgelé' }, icon: { type: 'SVGAsComponent', image: FrozenIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/frozen-icon.svg` } },
    ];

    public static getCategoryImage(category : Category) : CategoryImage {
        return CategorizationService.appCategoriesImage.find(
            (c) => c.category.name === category.name,
        )?.icon;
    }

    public static getAppCategories() : Category[] {
        return this.appCategoriesImage.map((c) => ({ name: c.category.name }));
    }

    static categoriesAssignmentsRef = firebase.database().ref('/categoriesAssignments')

    static listsRef = firebase.database().ref('/lists')

    static registerCategoryWasAssigned(
        newCategory : Category,
        forItem : Item,
        concernedListID : string,
    ) {
        const listSpecificCategoryAssignmentsRef = CategorizationService.listsRef.child(`${concernedListID}/categoriesAssignments`);
        let itemName = QuantityComputingService.itemNameWithoutQuantity(forItem)
            .toLocaleLowerCase();
        itemName = CategorizationService.toSingular(itemName);
        const categoryToIncrementPath = `${itemName}/${newCategory.name}/assignments`;

        this.categoriesAssignmentsRef
            .child(categoryToIncrementPath)
            .set(firebase.database.ServerValue.increment(1));
        listSpecificCategoryAssignmentsRef
            .child(categoryToIncrementPath)
            .set(firebase.database.ServerValue.increment(1));
    }

    static async getPreferredCategory(forItem : Item, concernedListID : string)
    : Promise<Category> {
        const listSpecificCategoryAssignmentsRef = CategorizationService.listsRef.child(`${concernedListID}/categoriesAssignments`);
        let itemNameNoQuantity = QuantityComputingService.itemNameWithoutQuantity(forItem)
            .toLocaleLowerCase();
        itemNameNoQuantity = CategorizationService.toSingular(itemNameNoQuantity);
        const combinationsToTry : {node : firebase.database.Reference, word : string}[] = [
            {
                node: listSpecificCategoryAssignmentsRef,
                word: itemNameNoQuantity,
            },
            {
                node: CategorizationService.categoriesAssignmentsRef,
                word: itemNameNoQuantity,
            },
        ];
        const wordsInItem = itemNameNoQuantity.split(' ');
        if (wordsInItem.length > 1) {
            wordsInItem.forEach((word) => {
                const singular = CategorizationService.toSingular(word);
                combinationsToTry.push({
                    node: listSpecificCategoryAssignmentsRef,
                    word: singular,
                });
                combinationsToTry.push({
                    node: CategorizationService.categoriesAssignmentsRef,
                    word: singular,
                });
            });
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const combination of combinationsToTry) {
            // Can disable the rule because calls are not independant
            // eslint-disable-next-line no-await-in-loop
            const category = await CategorizationService
                .getPreferredCategorry(combination.word, combination.node);
            if (category) {
                return category;
            }
        }
        return null;
    }

    private static getPreferredCategorry(
        pattern : string,
        categoryNode:firebase.database.Reference,
    ) : Promise<Category> {
        return new Promise((resolve) => {
            categoryNode.child(pattern).once('value',
                (listCategoryRanking) => {
                    const preferredCategoryOnList = CategorizationService
                        .getMostUsedCategory(listCategoryRanking.val() as CategoryRankingForItem);
                    resolve(preferredCategoryOnList);
                });
        });
    }

    private static getMostUsedCategory(snapshotValue : CategoryRankingForItem) : Category {
        if (!snapshotValue) {
            return null;
        }
        const categoryRanking = Object.keys(snapshotValue).map(
            (category) => ({
                category,
                assignments: snapshotValue[category].assignments,
            }),
        );
        categoryRanking.sort((a, b) => (a.assignments < b.assignments ? 1 : -1));
        return CategorizationService.getAppCategories().find(
            (c) => c.name === categoryRanking[0].category,
        );
    }

    private static toSingular(word:string):string {
        if (word.endsWith('s')) {
            return word.substr(0, word.length - 1);
        }
        return word;
    }
}
