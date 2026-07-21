import { DarkmodeToggle } from '@/components/common/darkmode-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link as LucideLink } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Realtime POS Apps',
  description: '',
};

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-2">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <DarkmodeToggle />
      </div>

      <Card className="flex flex-col items-center p-10">
        <h1 className="text-heading-xl mb-2 drop-shadow-lg">
          Welcome To Omni POS
        </h1>
        <Button asChild variant="outline">
          <div>
            <LucideLink className="h-5 w-5" />
            <Link href="/admin">Dashboard</Link>
          </div>
        </Button>
      </Card>
    </div>
  );
}
