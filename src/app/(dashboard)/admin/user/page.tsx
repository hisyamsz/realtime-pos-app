import { Metadata } from 'next';
import UserManagment from './_components/user';

export const metadata: Metadata = {
  title: 'User Managment | Omni POS',
};

export default function UserPage() {
  return <UserManagment />;
}
