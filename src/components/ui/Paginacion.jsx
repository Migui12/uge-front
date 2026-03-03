import { DiVim } from "react-icons/di";

export default function Paginacion({
    pagina,
    totalPaginas,
    onChange,
}) {
    if (totalPaginas <= 1) return null;

    const paginas = Array.from(
        { length: totalPaginas },
        (_, i) => i + 1
    );

    return (
        <div className="flex justify-center gap-2 py-4">
            {paginas.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${
                    p === pagina
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                >
                    {p}
                </button>
            ))}
        </div>    
    );
}