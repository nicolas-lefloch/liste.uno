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
import { ReactComponent as BreakfastIcon } from '../ressources/svg/breakfast-icon.svg';
import { ReactComponent as SpiceIcon } from '../ressources/svg/spice-icon.svg';
import { ReactComponent as OilsAndVinegarIcon } from '../ressources/svg/olive-oil-icon.svg';
import { ReactComponent as FreshIcon } from '../ressources/svg/fresh-icon.svg';
import { ReactComponent as BiscuitIcon } from '../ressources/svg/biscuits-icon.svg';
import { ReactComponent as WorldCuisineIcon } from '../ressources/svg/world-cuisine-icon.svg';
import { ReactComponent as MusicIcon } from '../ressources/svg/music-icon.svg';
import { ReactComponent as LibraryIcon } from '../ressources/svg/book-icon.svg';
import ConfigData from '../config.json';

if (!firebase.apps.length) {
    firebase.initializeApp({
        databaseURL: ConfigData.FIREBASE_URL,
    });
}

interface CategoryRankingForItem {
    [categoryName: string]: {
        assignments: number
    }
}

/**
 * Service used to display categories and auto-determine
 * what category best fits an article
 */
export default class CategorizationService {
    /**
     * Correspondence table between categories name and their images
     * Image are not stored in the category object because we send the raw category object to db
     * and we do not want db to store the category images
     */
    private static appCategoriesImage : {category : Category, icon : CategoryImage}[] = [
        {
            category: { name: 'Bières' },
            icon: { type: 'SVGAsComponent', image: BeerIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/beer-icon.svg` },
        },
        {
            category: { name: 'Boissons' },
            icon: { type: 'SVGAsComponent', image: BeverageIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/beverage-icon.svg` },
        },
        {
            category: { name: 'Boulangerie' },
            icon: { type: 'SVGAsComponent', image: BreadIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/bread-icon.svg` },
        },
        {
            category: { name: 'Vêtements' },
            icon: { type: 'SVGAsComponent', image: ClothesIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/clothes-icon.svg` },
        },
        {
            category: { name: 'Crèmerie' },
            icon: { type: 'SVGAsComponent', image: CreamIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/cream-icon.svg` },
        },
        {
            category: { name: 'Desserts' },
            icon: { type: 'SVGAsComponent', image: DessertIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/dessert-icon.svg` },
        },
        {
            category: { name: 'Poissons' },
            icon: { type: 'SVGAsComponent', image: FishIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/fish-icon.svg` },
        },
        {
            category: { name: 'Fruits et Légumes' },
            icon: { type: 'SVGAsComponent', image: FruitIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/fruit-icon.svg` },
        },
        {
            category: { name: 'Hygiène' },
            icon: { type: 'SVGAsComponent', image: HygieneIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/hygiene-icon.svg` },
        },
        {
            category: { name: 'Produits ménager' },
            icon: { type: 'SVGAsComponent', image: HomeCleaningIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/home-cleaning-icon.svg` },
        },
        {
            category: { name: 'Viande' },
            icon: { type: 'SVGAsComponent', image: MeatIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/meat-icon.svg` },
        },
        {
            category: { name: 'Vin' },
            icon: { type: 'SVGAsComponent', image: WineIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/wine-icon.svg` },
        },
        {
            category: { name: 'Epicerie' },
            icon: { type: 'SVGAsComponent', image: GroceryIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/grocery-icon.svg` },
        },
        {
            category: { name: 'Conserves' },
            icon: { type: 'SVGAsComponent', image: CannedFoodIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/canned-food-icon.svg` },
        },
        {
            category: { name: 'Surgelé' },
            icon: { type: 'SVGAsComponent', image: FrozenIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/frozen-icon.svg` },
        },
        {
            category: { name: 'Petit déjeuner' },
            icon: { type: 'SVGAsComponent', image: BreakfastIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/breakfast-icon.svg` },
        },
        {
            category: { name: 'Epices' },
            icon: { type: 'SVGAsComponent', image: SpiceIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/spice-icon.svg` },
        },
        {
            category: { name: 'Huiles et vinaigres' },
            icon: { type: 'SVGAsComponent', image: OilsAndVinegarIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/olive-oil-icon.svg` },
        },
        {
            category: { name: 'Frais' },
            icon: { type: 'SVGAsComponent', image: FreshIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/fresh-icon.svg` },
        },
        {
            category: { name: 'Biscuits' },
            icon: { type: 'SVGAsComponent', image: BiscuitIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/biscuits-icon.svg` },
        },
        {
            category: { name: 'Cuisine du monde' },
            icon: { type: 'SVGAsComponent', image: WorldCuisineIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/world-cuisine-icon.svg` },
        },
        {
            category: { name: 'Musique' },
            icon: { type: 'SVGAsComponent', image: MusicIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/music-icon.svg` },
        },
        {
            category: { name: 'Librairie' },
            icon: { type: 'SVGAsComponent', image: LibraryIcon, iconURL: `${process.env.PUBLIC_URL}/category-icons/book-icon.svg` },
        },
    ];

    /**
     * Determine an image to display for a category
     * @param category The category
     */
    public static getCategoryImage(category : Category) : CategoryImage {
        return CategorizationService.appCategoriesImage.find(
            (c) => c.category.name === category.name,
        )?.icon;
    }

    /**
     * Returns all categories
     * Used in ItemRow when the user has to choose between all categories
     */
    public static getAppCategories() : Category[] {
        return this.appCategoriesImage.map((c) => ({ name: c.category.name }));
    }

    static categoriesAssignmentsRef = firebase.database().ref('/categoriesAssignments');

    static listsRef = firebase.database().ref('/lists');

    /**
     * Triggered when the user assigns a category to an itam
     * Registers the assignment in db for further predictions
     * @param newCategory The category to which the item was assigned
     * @param forItem the item whose category was just assigned
     * @param concernedListID The list on which the user is working. Because the category prediction is based first on the list activity history,
     * then on the application-wide history
     */
    static registerCategoryWasAssigned(
        newCategory: Category,
        forItem: Item,
        concernedListID: string,
    ) {
        const listSpecificCategoryAssignmentsRef = CategorizationService.listsRef
            .child(`${concernedListID}/categoriesAssignments`);
        let itemName = QuantityComputingService.itemNameWithoutQuantity(forItem);
        itemName = CategorizationService.toCategoriesDBFormat(itemName);
        const categoryToIncrementPath = `${itemName}/${newCategory.name}/assignments`;

        this.categoriesAssignmentsRef
            .child(categoryToIncrementPath)
            .set(firebase.database.ServerValue.increment(1));
        listSpecificCategoryAssignmentsRef
            .child(categoryToIncrementPath)
            .set(firebase.database.ServerValue.increment(1));
    }

    /**
     * Used when the user adds an item and a category should be predicted
     * @param forItem the item to which the category shall be predicted
     * @param concernedListID The list the user is working on - because category prediciton is list specific first
     */
    static async getPreferredCategory(forItem : Item, concernedListID : string)
    : Promise<Category> {
        const listSpecificCategoryAssignmentsRef = CategorizationService.listsRef
            .child(`${concernedListID}/categoriesAssignments`);

        // Category is predicted based on the item name, once the quantity is removed
        let itemNameNoQuantity = QuantityComputingService.itemNameWithoutQuantity(forItem);
        itemNameNoQuantity = CategorizationService.toCategoriesDBFormat(itemNameNoQuantity);

        // The list of words and nodes (node is either the application wide node or the  list category node)
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
        // If the search did not succeed for the whole item name, tries to determine category based on each word in the item name
        const wordsInItem = itemNameNoQuantity.split(' ');
        if (wordsInItem.length > 1) {
            wordsInItem.forEach((word) => {
                if (word.trim()) {
                    const singular = CategorizationService.toCategoriesDBFormat(word);
                    combinationsToTry.push({
                        node: listSpecificCategoryAssignmentsRef,
                        word: singular,
                    });
                    combinationsToTry.push({
                        node: CategorizationService.categoriesAssignmentsRef,
                        word: singular,
                    });
                }
            });
        }

        // Tries each combination and stops when a category is found
        // eslint-disable-next-line no-restricted-syntax
        for (const combination of combinationsToTry) {
            // Can disable the rule because calls are not independant
            // eslint-disable-next-line no-await-in-loop
            const category = await CategorizationService
                .getPreferredCategoryForNode(combination.word, combination.node);
            if (category) {
                return category;
            }
        }
        return null;
    }

    /**
     * Guesses a category based on a word and a category assignment node
     * @param pattern The word from which the category should be guessed
     * @param categoryNode
     */
    private static getPreferredCategoryForNode(
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

    /**
     * Based on the category ranking for an item, finds the most used one
     * @param snapshotValue The category ranking
     */
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

    /**
     * Format a word so it fits the category db format
     * Removes accents, trailing 's', and lowercase
     * @param word The word to format
     */
    private static toCategoriesDBFormat(word:string):string {
        const noAccentLowerCase = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        if (noAccentLowerCase.endsWith('s')) {
            return noAccentLowerCase.substr(0, word.length - 1);
        }
        return noAccentLowerCase;
    }
}
