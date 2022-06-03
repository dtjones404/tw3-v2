import Image from 'next/image';
import { factionList } from '../constants/factionList';

export default function FactionCardList() {
  return (
    <div className="flex flex-wrap justify-center gap-2 ">
      {factionList.map((name) => (
        <div
          className="border-2 rounded-xl w-[200px] flex-grow-0 flex-shrink-0 p-6 shadow-lg"
          key={name}
        >
          <h2 className="text-xl text-center font-bold mb-6">{name}</h2>
          <Image
            src={`/logos/${name}.webp`}
            alt={`${name} faction logo`}
            width={256}
            height={256}
          />
        </div>
      ))}
    </div>
  );
}
