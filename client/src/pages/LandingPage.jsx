import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 md:px-6 mx-auto"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            Your memories, <br className="hidden sm:block"/> beautifully organized.
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-10">
            Store, organize, explore and share your favorite moments in one beautiful digital gallery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/explore" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
              Explore Gallery
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8">
              Create Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 bg-muted/50 rounded-3xl mb-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Organize Your Memories</h3>
              <p className="text-muted-foreground">Keep your photos safe and beautifully sorted in albums.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Powerful Search</h3>
              <p className="text-muted-foreground">Find exactly what you're looking for with tags and categories.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Secure Storage</h3>
              <p className="text-muted-foreground">Your memories are securely backed up in the cloud.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="w-full py-12 md:py-24 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
        <Link to="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
          Start Building Your Gallery
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
