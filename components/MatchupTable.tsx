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
import { Faction, IFactionData } from '../constants/types';
import { convertToTitleCase } from '../util/convertToTitleCase';

const styles = {
  container:
    'overflow-scroll h-[50vh] w-full mx-auto shadow-xl border-2 rounded-t',
  table: 'block w-fit text-center rounded-t',
  thead: 'block sticky top-0 rounded-t z-10',
  tbody: 'block',
  tr: 'block flex',
  th: 'block rounded-t text-black text-center w-[150px] border border-black flex-shrink-0 bg-white select-none cursor-pointer',
  rowHeader:
    'block text-center w-[150px] sticky left-0 border border-black flex-shrink-0 bg-white justify-self-start select-none cursor-pointer',
  td: 'block border border-black w-[150px] flex-shrink-0',
  foot: 'block border border-black w-[150px] flex-shrink-0 bg-white',
};

const winrateToCellColor = [
  [0.45, 'bg-[#ff7167]'],
  [0.47, 'bg-[#ffa08c]'],
  [0.49, 'bg-[#ffb09b]'],
  [0.51, 'bg-[#fcf5c3]'],
  [0.53, 'bg-[#def391]'],
  [0.55, 'bg-[#cdf083]'],
  [1, 'bg-[#a0e666]'],
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

const getColumnDefs = (factionData: IFactionData[]) => {
  const totalGamesPlayed = factionData.reduce(
    (tot, faction) => tot + faction.gamesPlayed,
    0
  );
  return [
    table.createDataColumn((row) => convertToTitleCase(row.name), {
      id: 'name',
      cell: (info) => info.getValue(),
      header: '',
      footer: 'Playrate',
    }),
    ...factionData.map(({ name, gamesPlayed }) =>
      table.createDataColumn((row) => row.matchups[name], {
        id: name,
        header: convertToTitleCase(name),
        cell: (info) => info.getValue().toFixed(3),
        footer: (gamesPlayed / totalGamesPlayed).toFixed(3),
      })
    ),
    table.createDataColumn(
      (row) => (row.gamesWon / row.gamesPlayed).toFixed(3),
      {
        id: 'overallWinrate',
        cell: (info) => info.getValue(),
        header: 'Overall Winrate',
        footer: '',
      }
    ),
  ];
};

export default function MatchupTable() {
  const [data, setData] = useState(dummyWinrates);
  const [columns, setColumns] = useState([...getColumnDefs(data)]);
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

  const handleRowClick = (id: Faction | 'gamesPlayed') => {
    const compareColumns = (
      f1: IFactionData,
      f2: IFactionData,
      desc: boolean
    ) => {
      if (id === 'gamesPlayed')
        return (desc ? 1 : -1) * (f1.gamesPlayed - f2.gamesPlayed);
      else return (desc ? -1 : 1) * (f1.matchups[id] - f2.matchups[id]);
    };

    if (!colSorting.length || colSorting[0].id !== id) {
      setColSorting([{ id, desc: false }]);
      const sortedCols = data
        .slice()
        .sort((f1, f2) => compareColumns(f1, f2, false));
      instance.setColumnOrder([
        'name',
        ...sortedCols.map((faction) => faction.name),
      ]);
    } else {
      setColSorting((oldState) => {
        const sortedCols = data
          .slice()
          .sort((f1, f2) => compareColumns(f1, f2, !oldState[0].desc));
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
                className={`${styles.th} ${
                  header.id === 'name' ? 'sticky top-0 left-0 z-10' : ''
                }`}
                key={header.id}
                colSpan={header.colSpan}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="flex flex-col justify-center items-center">
                  {header.isPlaceholder ? null : header.renderHeader()}
                  {!['name', 'overallWinrate'].includes(header.id) ? (
                    <Image
                      src={`/logos/${header.id}.webp`}
                      alt={`${header.id} faction logo`}
                      width={40}
                      height={40}
                    />
                  ) : null}
                </div>
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
        <tfoot className="block sticky bottom-0 z-10">
          <tr className={styles.tr}>
            {instance.getFooterGroups()[0].headers.map((header) => {
              if (header.id === 'name') {
                return (
                  <th
                    className={`${styles.th} sticky left-0 z-10`}
                    key={header.id}
                    onClick={() => handleRowClick('gamesPlayed')}
                  >
                    {header.renderFooter()}
                  </th>
                );
              } else
                return (
                  <td className={styles.foot} key={header.id}>
                    {header.renderFooter()}
                  </td>
                );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
