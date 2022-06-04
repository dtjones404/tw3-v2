import Footer from './Footer';
import Navbar from './Navbar';

interface ILayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar
        brand="TW3 Stats"
        links={[
          ['Home', '/'],
          ['Factions', '/factions'],
          ['Profile', '/profile'],
        ]}
      />
      <main className="flex-1 container mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
