import Link from 'next/link';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left">
              © Victor Santucci - 2025 Todos os direitos reservados
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="https://github.com/seu-usuario" 
              target="_blank"
              className="hover:text-indigo-400 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-6 w-6" />
            </Link>
            
            <Link
              href="https://linkedin.com/in/seu-perfil"
              target="_blank"
              className="hover:text-indigo-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-6 w-6" />
            </Link>
            
            <Link
              href="https://wa.me/+5511999999999"
              target="_blank"
              className="hover:text-indigo-400 transition-colors"
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