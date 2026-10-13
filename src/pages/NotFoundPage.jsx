import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import OceanBackdrop from '../components/background/OceanBackdrop';
import CompassRose from '../components/shared/CompassRose';

export default function NotFoundPage() {
  return (
    <main className="relative grid min-h-screen place-items-center px-6">
      <OceanBackdrop />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center"
      >
        <CompassRose size={190} className="animate-spinSlow" />
        <p className="mt-6 label-caps text-tide-300/80">404 · Off the charts</p>
        <h1 className="mt-2 font-display text-4xl font-black text-gold-gradient sm:text-5xl">
          UNCHARTED WATERS
        </h1>
        <p className="mt-3 max-w-md text-slate-400">
          No island is marked at this bearing. The crew suggests sailing back to port.
        </p>
        <Link to="/" className="btn-gold mt-7">
          <Compass className="h-4 w-4" />
          Return to the command center
        </Link>
      </motion.div>
    </main>
  );
}
