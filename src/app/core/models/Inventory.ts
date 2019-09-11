import { TableMap } from '../services/tableMap/table-map'
import { IDataBaseObj } from './_base'

export interface IInventory extends IDataBaseObj {

    itemID?: string;
    type?: string;
    subType?: string; 
    itemNum?: number;
    name?: string;
    description?: string;
    condition?: string;
    dateAdded?: Date;
    dateEdited?: Date;
    adddedBy?: string;
    editedBy?: string;
    isDeleted?: number;
}

export class Inventory implements IInventory {

    static tableName: string = TableMap.Inventory;

    id : string;

    itemID?: string;
    type?: string;
    subType?: string; 
    itemNum?: number;
    name?: string;
    description?: string;
    condition?: string;
    dateAdded?: Date;
    dateEdited?: Date;
    adddedBy?: string;
    editedBy?: string;
    isDeleted?: number;

    constructor(props: IInventory) {
        Object.keys(props).forEach(prop => {
            const value = prop[prop];
            this[prop] = value;
        })
    }
}