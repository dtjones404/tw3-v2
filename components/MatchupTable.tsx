import {
  ColumnOrderState,
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useTableInstance,
} from '@tanstack/react-table';
import Image from 'next/image';
import React, { useState } from 'react';
import { dummyWinrates } from '../constants/dummyData';
import { factionList } from '../constants/factionList';
import { Faction, IFactionData } from '../constants/types';
import { convertToTitleCase } from '../util/convertToTitleCase';

const styles = {
  container:
    'overflow-scroll h-[50vh] w-[80vw] mx-auto shadow-xl border-2 rounded-t',
  table: 'block w-fit text-center rounded-t',
  thead: 'block sticky top-0 rounded-t',
  tbody: 'block',
  tr: 'block flex',
  th: 'block rounded-t text-rose-500 text-center w-[150px] border border-black flex-shrink-0 bg-white select-none cursor-pointer',
  rowHeader:
    'block text-center w-[150px] sticky left-0 border border-black flex-shrink-0 bg-white justify-self-start select-none cursor-pointer',
  td: 'block text-white border border-black w-[150px] flex-shrink-0',
};

const winrateToCellColor = [
  [0.43, 'bg-rose-600'],
  [0.45, 'bg-rose-500'],
  [0.47, 'bg-rose-400'],
  [0.49, 'bg-amber-500'],
  [0.51, 'bg-yellow-500'],
  [0.53, 'bg-lime-400'],
  [0.55, 'bg-lime-500'],
  [1, 'bg-lime-600'],
];

const getCellColor = (s: string) => {
  const val = +s;
  for (const [threshold, color] of winrateToCellColor) {
    if (val < +threshold) return color;
  }
};

const table = createTable().setRowType<IFactionData>().setOptions({
  enableSortingRemoval: false,
});

const columnDefs = [
  table.createDataColumn((row) => convertToTitleCase(row.name), {
    id: 'name',
    cell: (info) => info.getValue(),
    header: '',
  }),
  ...factionList.map((name) =>
    table.createDataColumn((row) => row.matchups[name], {
      id: name,
      header: convertToTitleCase(name),
      cell: (info) => info.getValue().toFixed(3),
    })
  ),
];

export default function MatchupTable() {
  const [data, setData] = useState(dummyWinrates);
  const [columns, setColumns] = useState([...columnDefs]);
  const [rowSorting, setRowSorting] = useState<SortingState>([]);
  const [colSorting, setColSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      sorting: rowSorting,
      columnOrder,
    },
    onSortingChange: setRowSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (id: Faction) => {
    if (!colSorting.length || colSorting[0].id !== id) {
      setColSorting([{ id, desc: false }]);
      const sortedCols = data
        .slice()
        .sort((f1, f2) => f1.matchups[id] - f2.matchups[id]);
      instance.setColumnOrder([
        'name',
        ...sortedCols.map((faction) => faction.name),
      ]);
    } else {
      setColSorting((oldState) => {
        const sortedCols = data
          .slice()
          .sort(
            (f1, f2) =>
              (colSorting[0].desc ? 1 : -1) *
              (f1.matchups[id] - f2.matchups[id])
          );
        instance.setColumnOrder([
          'name',
          ...sortedCols.map((faction) => faction.name),
        ]);
        return [{ id, desc: !oldState[0].desc }];
      });
    }
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {instance.getHeaderGroups()[0].headers.map((header) => (
              <th
                className={styles.th}
                key={header.id}
                colSpan={header.colSpan}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.id !== 'name' ? (
                  <div className="flex flex-col justify-center items-center">
                    {header.isPlaceholder ? null : header.renderHeader()}
                    <Image
                      src={`/logos/${header.id}.webp`}
                      alt={`${header.id} faction logo`}
                      width={40}
                      height={40}
                    />
                  </div>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {instance.getRowModel().rows.map((row) => (
            <tr className={styles.tr} key={row.id}>
              <th
                className={styles.rowHeader}
                onClick={() => handleRowClick(row.original!.name)}
              >
                {row.getVisibleCells()[0].renderCell()}
              </th>
              {row
                .getVisibleCells()
                .slice(1)
                .map((cell) => (
                  <td
                    className={`${styles.td} ${getCellColor(
                      cell.getValue() as string
                    )}`}
                    key={cell.id}
                  >
                    {cell.renderCell()}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
