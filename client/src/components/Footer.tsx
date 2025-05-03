import { Link } from 'wouter';
import { Twitter, GitPullRequest, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-blue-400">
              <span className="text-white">&lt;</span>DevBlog<span className="text-white">/&gt;</span>
            </Link>
            <p className="mt-4 text-gray-400">
              A tech blog for developers, by developers. Sharing insights, tutorials, and thoughts on modern web development, programming languages, and software engineering.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <GitPullRequest className="h-5 w-5" />
                <span className="sr-only">GitPullRequest</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link href="/tags" className="text-gray-400 hover:text-white">Topics</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">Resources</Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">Newsletter</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">About</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row md:justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} DevBlog. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0 flex items-center">
            Built with <Heart className="h-4 w-4 mx-1 text-red-500" /> and modern web technologies
          </p>
        </div>
      </div>
    </footer>
  );
}
