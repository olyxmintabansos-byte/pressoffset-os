import type { Metadata } from 'next';
import './globals.css';
import { PressProvider } from '@/context/PressContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'PressOffset OS — Commercial CMYK Offset Web Press System',
  description:
    'Titan #38: High-precision commercial sheet-fed offset press console, plate registration calibration, densitometer reflection telemetry, and paper yield estimation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#171514] text-[#e6dfd5]">
        <PressProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </PressProvider>
      </body>
    </html>
  );
}
