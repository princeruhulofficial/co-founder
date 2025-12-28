import { Link } from 'react-router-dom';
import { Twitter, Linkedin } from 'lucide-react';
import { useTheme } from 'next-themes';
import logo from '@/assets/logo.png';

export function Footer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <footer className="border-t border-border/30 py-12 mt-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Co Finder" className="h-8 w-8 object-contain" />
              <span className="font-heading text-xl text-foreground">Co Finder</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The platform for founders to find their perfect technical co-founder.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/profiles" className="hover:text-foreground transition-colors">
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link to="/add-profile" className="hover:text-foreground transition-colors">
                  Add Your Profile
                </Link>
              </li>
              <li>
                <Link to="/profiles?type=founder" className="hover:text-foreground transition-colors">
                  Find Founders
                </Link>
              </li>
              <li>
                <Link to="/profiles?type=developer" className="hover:text-foreground transition-colors">
                  Find Developers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Product Hunt Embed */}
        <div className="flex flex-col items-center gap-6 py-8 border-t border-border/30">
          <a 
            href="https://www.producthunt.com/products/co-finder-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-co-finder-2" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              alt="Co-finder - Find the right co-founder who actually wants to build. | Product Hunt"
              width="250"
              height="54"
              src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1054599&theme=${isDark ? 'dark' : 'light'}&t=1766732480442`}
            />
          </a>

          <div 
            className={`rounded-xl p-5 max-w-[500px] w-full shadow-sm border ${
              isDark 
                ? 'bg-card border-border text-foreground' 
                : 'bg-white border-[rgb(224,224,224)]'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <img 
                alt="Co-finder"
                src="https://ph-files.imgix.net/c2bf52f4-b9a2-4a9a-b397-ccd88f632688.png?auto=format&fit=crop&w=80&h=80"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="m-0 text-lg font-semibold">Co-finder</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find the right co-founder who actually wants to build.
                </p>
              </div>
            </div>
            <a 
              href="https://www.producthunt.com/products/co-finder-2?embed=true&utm_source=embed&utm_medium=post_embed"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center px-4 py-2 bg-[#ff6154] text-white no-underline rounded-lg text-sm font-semibold hover:bg-[#e5574b] transition-colors"
            >
              Check it out on Product Hunt →
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/30 gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Prince Ruhul all rights received.
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/NextElonPrince"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/princeruhulofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
