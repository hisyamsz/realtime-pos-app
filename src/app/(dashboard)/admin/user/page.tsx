import { Metadata } from 'next';
import UserManagement from './_components/user';

export const metadata: Metadata = {
  title: 'User Management | Omni POS',
};

export default function UserPage() {
  return <UserManagement />;
}
