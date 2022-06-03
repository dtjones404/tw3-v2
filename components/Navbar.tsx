import Link from 'next/link';
import { useRouter } from 'next/router';

interface INavbarProps {
  brand: string;
  brandIcon?: React.ReactNode;
  links: [label: string, route: string][];
}

export default function Navbar({ brand, brandIcon, links }: INavbarProps) {
  const router = useRouter();
  console.log(router.pathname);
  return (
    <nav className="mb-8 border-b-2 px-6 py-2.5 bg-white shadow-lg rounded-lg">
      <div className="container mx-auto">
        <ul className="flex flex-wrap gap-4 font-medium justify-center items-center">
          <li className="sm:mr-auto basis-full sm:basis-auto">
            <h1>
              <Link href="/">
                <a className="text-xl font-bold flex gap-2 justify-center items-center">
                  {brandIcon}
                  {brand}
                </a>
              </Link>
            </h1>
          </li>
          {links.map(([label, route]) => (
            <li key={label}>
              <Link href={route}>
                <a
                  className={`block py-2 px-3 border-b-4 transition-colors border-transparent ${
                    router.pathname === route
                      ? 'text-blue-700 border-blue-400'
                      : ''
                  } hover:text-blue-700`}
                >
                  {label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
