import { Metadata } from 'next';
import MenuManagement from './_components/menu';

export const metadata: Metadata = {
  title: 'Menu Management | Omni POS',
};

export default function MenuPage() {
  return <MenuManagement />;
}
