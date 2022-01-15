import type { Line } from 'utils/Line';

export const shortenItems = (
  inputItems: (Line | null)[] | undefined
): Line[] | undefined => {
  // clean inputItems → Line[]
  let items: Line[] | undefined = (inputItems ?? [])
    .filter(item => !!item) as Line[];

  // if the item has only one Default child → move that child items on the current item
  if (items.length === 1 && items[0].type === 'Default') {
    items = items[0].items;
  }

  if (items) {
    const toRemove: number[] = [];
    for (let i = 1; i < items.length; i++) {
      const currentItem = items[i];
      const previousItem = items[i - 1];

      switch (currentItem.type) {
        // for Code & Test items, merge them when they are consecutives
        case 'Code':
        case 'Test':
          if (previousItem.type === currentItem.type) {
            currentItem.code = [...previousItem.code, ...currentItem.code]
            toRemove.push(i - 1);
          }
          break;
      }
    }

    if (toRemove.length > 0) {
      // remove from the end to avoid changing index of next items to remove
      toRemove.reverse().map(index => {
        items!.splice(index, 1);
      })
    }
  }

  return items;
}
