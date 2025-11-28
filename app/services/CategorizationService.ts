import { getApps, initializeApp } from 'firebase/app';
import { child, get, getDatabase, increment, ref, set, type DatabaseReference } from 'firebase/database';
import ConfigData from '../config.json';
import type { Category, CategoryImage } from '../datatypes/Category';
import type { Item } from '../datatypes/Item';
import BeerIcon from '../ressources/svg/beer-icon.svg?react';
import BeverageIcon from '../ressources/svg/beverage-icon.svg?react';
import BiscuitIcon from '../ressources/svg/biscuits-icon.svg?react';
import LibraryIcon from '../ressources/svg/book-icon.svg?react';
import BreadIcon from '../ressources/svg/bread-icon.svg?react';
import BreakfastIcon from '../ressources/svg/breakfast-icon.svg?react';
import CannedFoodIcon from '../ressources/svg/canned-food-icon.svg?react';
import ClothesIcon from '../ressources/svg/clothes-icon.svg?react';
import CreamIcon from '../ressources/svg/cream-icon.svg?react';
import DessertIcon from '../ressources/svg/dessert-icon.svg?react';
import FishIcon from '../ressources/svg/fish-icon.svg?react';
import FreshIcon from '../ressources/svg/fresh-icon.svg?react';
import FrozenIcon from '../ressources/svg/frozen-icon.svg?react';
import FruitIcon from '../ressources/svg/fruit-icon.svg?react';
import GroceryIcon from '../ressources/svg/grocery-icon.svg?react';
import HealthIcon from '../ressources/svg/health-icon.svg?react';
import HomeCleaningIcon from '../ressources/svg/home-cleaning-icon.svg?react';
import HygieneIcon from '../ressources/svg/hygiene-icon.svg?react';
import MeatIcon from '../ressources/svg/meat-icon.svg?react';
import MusicIcon from '../ressources/svg/music-icon.svg?react';
import OilsAndVinegarIcon from '../ressources/svg/olive-oil-icon.svg?react';
import SpiceIcon from '../ressources/svg/spice-icon.svg?react';
import WineIcon from '../ressources/svg/wine-icon.svg?react';
import WorldCuisineIcon from '../ressources/svg/world-cuisine-icon.svg?react';
import QuantityComputingService from './QuantityComputing.service';

if (!getApps().length) {
    initializeApp({
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
    private static appCategoriesImage: { category: Category, icon?: CategoryImage }[] = [
        {
            category: { name: 'Bières' },
            icon: { type: 'SVGAsComponent', image: BeerIcon, iconURL: `/category-icons/beer-icon.svg` },
        },
        {
            category: { name: 'Boissons' },
            icon: { type: 'SVGAsComponent', image: BeverageIcon, iconURL: `/category-icons/beverage-icon.svg` },
        },
        {
            category: { name: 'Boulangerie' },
            icon: { type: 'SVGAsComponent', image: BreadIcon, iconURL: `/category-icons/bread-icon.svg` },
        },
        {
            category: { name: 'Vêtements' },
            icon: { type: 'SVGAsComponent', image: ClothesIcon, iconURL: `/category-icons/clothes-icon.svg` },
        },
        {
            category: { name: 'Crèmerie' },
            icon: { type: 'SVGAsComponent', image: CreamIcon, iconURL: `/category-icons/cream-icon.svg` },
        },
        {
            category: { name: 'Desserts' },
            icon: { type: 'SVGAsComponent', image: DessertIcon, iconURL: `/category-icons/dessert-icon.svg` },
        },
        {
            category: { name: 'Poissons' },
            icon: { type: 'SVGAsComponent', image: FishIcon, iconURL: `/category-icons/fish-icon.svg` },
        },
        {
            category: { name: 'Fruits et Légumes' },
            icon: { type: 'SVGAsComponent', image: FruitIcon, iconURL: `/category-icons/fruit-icon.svg` },
        },
        {
            category: { name: 'Hygiène' },
            icon: { type: 'SVGAsComponent', image: HygieneIcon, iconURL: `/category-icons/hygiene-icon.svg` },
        },
        {
            category: { name: 'Produits ménager' },
            icon: { type: 'SVGAsComponent', image: HomeCleaningIcon, iconURL: `/category-icons/home-cleaning-icon.svg` },
        },
        {
            category: { name: 'Viande' },
            icon: { type: 'SVGAsComponent', image: MeatIcon, iconURL: `/category-icons/meat-icon.svg` },
        },
        {
            category: { name: 'Vin' },
            icon: { type: 'SVGAsComponent', image: WineIcon, iconURL: `/category-icons/wine-icon.svg` },
        },
        {
            category: { name: 'Epicerie' },
            icon: { type: 'SVGAsComponent', image: GroceryIcon, iconURL: `/category-icons/grocery-icon.svg` },
        },
        {
            category: { name: 'Conserves' },
            icon: { type: 'SVGAsComponent', image: CannedFoodIcon, iconURL: `/category-icons/canned-food-icon.svg` },
        },
        {
            category: { name: 'Surgelé' },
            icon: { type: 'SVGAsComponent', image: FrozenIcon, iconURL: `/category-icons/frozen-icon.svg` },
        },
        {
            category: { name: 'Petit déjeuner' },
            icon: { type: 'SVGAsComponent', image: BreakfastIcon, iconURL: `/category-icons/breakfast-icon.svg` },
        },
        {
            category: { name: 'Epices' },
            icon: { type: 'SVGAsComponent', image: SpiceIcon, iconURL: `/category-icons/spice-icon.svg` },
        },
        {
            category: { name: 'Huiles et vinaigres' },
            icon: { type: 'SVGAsComponent', image: OilsAndVinegarIcon, iconURL: `/category-icons/olive-oil-icon.svg` },
        },
        {
            category: { name: 'Frais' },
            icon: { type: 'SVGAsComponent', image: FreshIcon, iconURL: `/category-icons/fresh-icon.svg` },
        },
        {
            category: { name: 'Biscuits' },
            icon: { type: 'SVGAsComponent', image: BiscuitIcon, iconURL: `/category-icons/biscuits-icon.svg` },
        },
        {
            category: { name: 'Cuisine du monde' },
            icon: { type: 'SVGAsComponent', image: WorldCuisineIcon, iconURL: `/category-icons/world-cuisine-icon.svg` },
        },
        {
            category: { name: 'Musique' },
            icon: { type: 'SVGAsComponent', image: MusicIcon, iconURL: `/category-icons/music-icon.svg` },
        },
        {
            category: { name: 'Librairie' },
            icon: { type: 'SVGAsComponent', image: LibraryIcon, iconURL: `/category-icons/book-icon.svg` },
        },
        {
            category: { name: 'Pharmacie' },
            icon: { type: 'SVGAsComponent', image: HealthIcon, iconURL: `/category-icons/health-icon.svg` },
        },
    ];

    /**
     * Determine an image to display for a category
     * @param category The category
     */
    public static getCategoryImage(category: Category): CategoryImage | undefined {
        return CategorizationService.appCategoriesImage.find(
            (c) => c.category.name === category.name,
        )?.icon;
    }

    /**
     * Returns all categories
     * Used in ItemRow when the user has to choose between all categories
     */
    public static getAppCategories(): Category[] {
        return this.appCategoriesImage.map((c) => ({ name: c.category.name }));
    }

    static categoriesAssignmentsRef = ref(getDatabase(), '/categoriesAssignments');

    static listsRef: DatabaseReference = ref(getDatabase(), '/lists');

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
        const listSpecificCategoryAssignmentsRef = child(CategorizationService.listsRef, `${concernedListID}/categoriesAssignments`);
        let itemName = QuantityComputingService.itemNameWithoutQuantity(forItem);
        itemName = CategorizationService.toCategoriesDBFormat(itemName);
        const categoryToIncrementPath = `${itemName}/${newCategory.name}/assignments`;

        const globalAssignmentRef = child(this.categoriesAssignmentsRef, categoryToIncrementPath)
        set(globalAssignmentRef, increment(1))

        const listSpecificAssignment = child(listSpecificCategoryAssignmentsRef, categoryToIncrementPath)
        set(listSpecificAssignment, increment(1));
    }

    /**
     * Used when the user adds an item and a category should be predicted
     * @param forItem the item to which the category shall be predicted
     * @param concernedListID The list the user is working on - because category prediciton is list specific first
     */
    static async getPreferredCategory(forItem: Item, concernedListID: string)
        : Promise<Category | undefined> {
        const listSpecificCategoryAssignmentsRef = child(CategorizationService.listsRef, `${concernedListID}/categoriesAssignments`);

        // Category is predicted based on the item name, once the quantity is removed
        let itemNameNoQuantity = QuantityComputingService.itemNameWithoutQuantity(forItem);
        itemNameNoQuantity = CategorizationService.toCategoriesDBFormat(itemNameNoQuantity);

        // The list of words and nodes (node is either the application wide node or the  list category node)
        const combinationsToTry: { node: DatabaseReference, word: string }[] = [
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
        return undefined;
    }

    /**
     * Guesses a category based on a word and a category assignment node
     * @param pattern The word from which the category should be guessed
     * @param categoryNode
     */
    private static getPreferredCategoryForNode(
        pattern: string,
        categoryNode: DatabaseReference,
    ): Promise<Category | undefined> {
        return new Promise((resolve) => {
            const patternRef = child(categoryNode, pattern)
            get(patternRef).then(snapshot => {
                const preferredCategoryOnList = CategorizationService
                    .getMostUsedCategory(snapshot.val() as CategoryRankingForItem);
                resolve(preferredCategoryOnList);
            }).catch(() => resolve(undefined));
        });
    }

    /**
     * Based on the category ranking for an item, finds the most used one
     * @param snapshotValue The category ranking
     */
    private static getMostUsedCategory(snapshotValue: CategoryRankingForItem): Category | undefined {
        if (!snapshotValue) {
            return undefined;
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
        )!;
    }

    /**
     * Format a word so it fits the category db format
     * Removes accents, trailing 's', and lowercase
     * @param word The word to format
     */
    private static toCategoriesDBFormat(word: string): string {
        const noAccentLowerCase = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        if (noAccentLowerCase.endsWith('s')) {
            return noAccentLowerCase.substr(0, word.length - 1);
        }
        return noAccentLowerCase;
    }
}
