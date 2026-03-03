import Paginacion from "./Paginacion";

export default function Table({
    columns,
    data,
    loading = false,
    emptyMessage = "No hay registros",
    renderRow,
    paginacion,
    onPageChange,
}) {
    return (
        <div className="rounded-xl p-6 border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-200">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-12 text-center text-slate-500"
                                >
                                    Cargando...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-12 text-center text-slate-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => renderRow(row, i))
                        )}
                    </tbody>
                </table>
            </div>
            {paginacion && (
                <Paginacion
                    pagina={paginacion.pagina}
                    totalPaginas={paginacion.totalPaginas}
                    onChange={onPageChange}
                />
            )}
        </div>
    );
}