const sortOrderConst = [
  {value: 'none', label: 'None'},
  {value: 'asc', label: 'Ascending'},
  {value: 'desc', label: 'Descending'},
];
sortOrderConst.default = sortOrderConst[0];

export {sortOrderConst};

export const sortEvent = {
  outsideSortChange: 'outside-sort-change',
  sortChange: 'category-sort-change',
};
