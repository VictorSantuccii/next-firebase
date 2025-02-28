import Link from 'next/link';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-3 md:mb-0">
            <p className="text-center md:text-left text-gray-600 text-sm font-poppins font-thin">
              © Victor Santucci - 2025 | Todos os direitos reservados
            </p>
          </div>
          
          <div className="flex space-x-5 ">
            <Link 
              href="https://github.com/VictorSantuccii" 
              target="_blank"
              className="text-gray-900 hover:text-gray-700 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-6 w-6" />
            </Link>
            
            <Link
              href="https://linkedin.com/in/victorsantuccii"
              target="_blank"
              className="text-gray-900 hover:text-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-6 w-6" />
            </Link>
            
            <Link
              href="https://wa.me/+5516991440887"
              target="_blank"
              className="text-gray-900 hover:text-gray-700 transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}