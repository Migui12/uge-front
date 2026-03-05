import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock, FaFacebookF } from 'react-icons/fa';
import { navLinks } from './navegacion';

export default function Footer({ cog }) {

    const desktopUrl =
        "https://www.google.com/maps/place/Ugel+Satipo+302/@-11.2459519,-74.6354788,127m/data=!3m1!1e3!4m12!1m5!3m4!2zMTHCsDE0JzQ1LjYiUyA3NMKwMzgnMDYuNiJX!8m2!3d-11.246!4d-74.635167!3m5!1s0x910bc0fc7ad591c9:0x467dc06216f24fb1!8m2!3d-11.2458773!4d-74.6353009!16s%2Fg%2F11b7ckp4wl";

    const mobileUrl =
        "https://www.google.com/maps/search/?api=1&query=Ugel+Satipo+302";

    const isMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const mapUrl = isMovil ? mobileUrl : desktopUrl;

    return (
        <footer className="bg-green-600 text-white">
            <div className="max-w-350 mx-auto px-6 py-8">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 mb-6">
                    {/* Logo y descripción */}
                    <div>
                        <img
                            src='UGEL.png'
                            alt="UGEL Satipo"
                            className="w-20 bg-white p-2 rounded-2xl mb-4"
                        />
                        <p className="text-sm font-semibold text-gray-800">
                            Unidad de Gestión Educativa Satipo comprometida con la calidad educativa de nuestra región.
                        </p>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h4 className="text-red-900 mb-3 font-semibold">ENLACES RÁPIDOS</h4>
                        <div className="flex flex-col gap-2">
                            {navLinks.map(l => (
                                <Link
                                    key={l.to}
                                    to={l.to}
                                    className="w-fit text-white text-[0.8rem] hover:text-gray-300"
                                >
                                    › {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="text-red-900 mb-3 font-semibold">CONTACTO</h4>
                        <div className="text-[0.8rem] leading-loose space-y-2">
                            <a 
                                href="https://www.facebook.com/ugelsatipo.oficial?ref=embed_page" 
                                target='_blank'
                                className='w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full transition-all duration-300 hover:bg-blue-700 hover:scale-110 '
                            >
                                <FaFacebookF className='w-4 h-4'/>
                            </a>

                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center gap-2 transition-all duration-300 hover:text-yellow-200"
                            >
                                <FaMapMarkerAlt className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-300" />

                                <span className="underline decoration-transparent group-hover:decoration-yellow-300 transition-all duration-300">
                                    {cog.direccion}
                                </span>

                                <span className="absolute -top-8 left-0 scale-0 group-hover:scale-100 transition-transform duration-200 bg-black text-white text-[0.65rem] px-2 py-1 rounded shadow-lg">
                                    Ver en el mapa
                                </span>
                            </a>
                            <div className="flex items-center gap-2"><FaPhone className="w-4 h-4" /> {cog.telefono}</div>
                            <div className="flex items-center gap-2"><FaEnvelope className="w-4 h-4" /> {cog.correo}</div>
                            <div className="flex items-center gap-2"><FaClock className="w-4 h-4" /> {cog.atencion}</div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/30 pt-4 text-center text-[0.75rem] font-semibold text-gray-900">
                    © {new Date().getFullYear()} Unidad de Gestión Educativa Satipo. Todos los derechos reservados. |
                    <Link to="/admin/login" className="text-gray-200 ml-1 hover:text-white">Acceso Administrativo</Link>
                </div>
            </div>
        </footer>
    );
}