import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import siteConfig from '@/config/siteConfig';
import { openMailto, CONTACT_EMAIL } from '@/lib/mailto'; // Import nécessaire

const Footer = ({ showToast }) => {
  const navigate = useNavigate();
  const { footer: footerData } = siteConfig;

  // Fonction handleLinkClick MODIFIÉE
  const handleLinkClick = (link) => {
    if (link.action === 'mailto') {
      openMailto(CONTACT_EMAIL, link.subject || 'Contact');
    } else if (link.isExternal) {
      window.open(link.path, '_blank', 'noopener,noreferrer');
    } else if (link.isPhone) {
      window.location.href = `tel:${link.path}`;
    } else if (link.path) {
      navigate(link.path);
    } else if (showToast) {
      showToast();
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="bg-gray-900/80 backdrop-brightness-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {/* ... Colonne logo et liens assurance inchangés ... */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center">
                <img  alt={footerData.logo.alt} className="h-12 w-auto" src={siteConfig.logoUrl} />
              </Link>
              <span className="text-lg font-semibold block text-gray-200">{footerData.contact.title}</span>
              <ul className="space-y-2 text-gray-400">
                <li>{footerData.contact.address}</li>
                <li>{footerData.contact.city}</li>
                <li><a href={`mailto:${footerData.contact.email}`} className="hover:text-white">{footerData.contact.email}</a></li>
                <li><a href={`tel:${footerData.contact.phone.replace(/\s/g, '')}`} className="hover:text-white">{footerData.contact.phone}</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <span className="text-lg font-semibold mb-4 block text-gray-200">{footerData.insuranceLinks.title}</span>
              <ul className="space-y-2 text-gray-400">
                {footerData.insuranceLinks.links.map(link => (
                  <li key={link.label}><Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
            
            {/* Colonne Liens Utiles - MODIFIÉE pour gérer les deux types de liens */}
            <div className="col-span-1">
              <span className="text-lg font-semibold mb-4 block text-gray-200">{footerData.usefulLinks.title}</span>
              <ul className="space-y-2 text-gray-400">
                {footerData.usefulLinks.links.map(link => (
                  <li key={link.label}>
                    {link.path ? (
                      <Link to={link.path} className="hover:text-white transition-colors text-left w-full block">
                        {link.label}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleLinkClick(link)} 
                        className="hover:text-white transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>{footerData.copyright.replace('{year}', new Date().getFullYear())}</p>
            {footerData.creatorCredit && (
              <p className="mt-2">{footerData.creatorCredit}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;