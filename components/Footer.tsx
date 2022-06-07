import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-8 bg-stone-900 text-white py-12 shadow-xl">
      <div className="container mx-auto">
        <ul className="flex justify-center items-center gap-12">
          <li>
            <Link href="/contact">
              <a>Contact us</a>
            </Link>
          </li>
          <li>
            <Link href="/terms">
              <a>Terms of Use</a>
            </Link>
          </li>
          <li>
            <Link href="/privacy">
              <a>Privacy Policy</a>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
