import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-surface border-t border-dark-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tight inline-block mb-4">
              <span className="text-brand-blue drop-shadow-[0_0_8px_rgba(0,85,255,0.5)]">Nyx</span>
              <span className="text-white"> </span>
              <span className="text-brand-green drop-shadow-[0_0_8px_rgba(255,183,0,0.5)]">NestWorks</span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              Building the future with uncompromising quality. Premium construction, innovative plans, and luxury homes for sale.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/construction" className="text-gray-400 hover:text-brand-blue transition-colors">Construction</Link></li>
              <li><Link to="/plans" className="text-gray-400 hover:text-brand-blue transition-colors">Plans & Designs</Link></li>
              <li><Link to="/sales" className="text-gray-400 hover:text-brand-green transition-colors">Houses for Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>info@nyxnestworks.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Builder Ave, Suite 100<br/>Metropolis, NY 10001</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nyx NestWorks. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
