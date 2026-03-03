import { FaTimes, FaSpinner } from "react-icons/fa";

export default function Modal({
    open,
    title,
    children,
    onClose,
    onSubmit,
    submitText = "Guardar",
    cancelText = "Cancelar",
    loading = false,
    maxWidth = "max-w-2xl",
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-100 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className={`bg-white w-full ${maxWidth} rounded-xl shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-900">
                        {title}
                    </h3>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-sm text-slate-400 hover:bg-gray-200 hover:text-slate-600 transition"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-2">
                    {children}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-slate-200 rounded-md bg-slate-100 hover:bg-slate-200 text-sm hover:shadow-sm transition-all"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className="flex items-center gap-2  bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm hover:shadow-lg transition-all"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            submitText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}