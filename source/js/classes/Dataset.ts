import axios from 'axios';
import {DatasetFields, DatasetExpandedItemFields} from '../interfaces.ts';

interface ExpandedColumns {
  [dataset: string]: string[];
}
interface ExpandedItems {
  [dataset: string]: {
    [entry: string]: DatasetExpandedItemFields;
  }
}

const _filterItems = ['id', 'label', 'mnemonic', 'mass'];
const _cachedExpandedColumns: ExpandedColumns = {};
const _cachedExpandedItems: ExpandedItems = {};

export default class Dataset {


  static async getExpandedColumns(
    dataset: string
  ): Promise<string[] | void> {
    if (dataset === 'uniprot') {
      if (!_cachedExpandedColumns[dataset]) {
        await axios
          .get('http://ep.dbcls.jp/grasp-togodx/', {
            params: {
              query: '{ __type(name: "UniProt") { name fields { name } } }',
            },
          })
          .then(res => {
            const names = (res.data as DatasetFields).data.__type.fields.map(field => field.name);
            const filtered = names.filter(name => _filterItems.indexOf(name) !== -1);
            _cachedExpandedColumns[dataset] = filtered;
          });
        console.log(_cachedExpandedColumns)
        return _cachedExpandedColumns[dataset];
      } else {
        return Promise.resolve(_cachedExpandedColumns[dataset]);
      }
    } else {
      return Promise.resolve();
    }
  }

  static async prepareExpandedItems(
    dataset: string,
    ids: string[]
  ) {
    if (dataset === 'uniprot') {
      const expandedColumns = await Dataset.getExpandedColumns(dataset) as string[];
      await axios
        .get('http://ep.dbcls.jp/grasp-togodx/', {
          params: {
            query: `{ UniProt(id: ${JSON.stringify(ids)}) { ${expandedColumns.join(' ')} }}`,
          },
        })
        .then(res => {
          for (const dataset in res.data.data) {
            const __dataset = dataset.toLowerCase();
            if (!_cachedExpandedItems[__dataset]) _cachedExpandedItems[__dataset] = {};
            for (const item of res.data.data[dataset]) {
              _cachedExpandedItems[__dataset][item.id] = item;
            }
          }
        });
    } else {
      return Promise.resolve();
    }
  }

  static getExpandedItem(
    dataset: string,
    id: string
  ): DatasetExpandedItemFields {
    return _cachedExpandedItems[dataset]?.[id];
  }
}
