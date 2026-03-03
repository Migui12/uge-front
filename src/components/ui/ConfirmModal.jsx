import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "¿Estás seguro?",
    message = "Esta acción no se puede deshacer",
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    loading = false,
    variant = "danger"
}) {
    if (!open) return null;

    const styles = {
        danger: {
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        button: "from-red-500 to-red-700 hover:from-red-700 hover:to-red-800",
        },
        warning: {
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        button: "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
        },
        info: {
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        button: "from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-800",
        },
    };

    const current = styles[variant];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-scaleIn">
                <div className="flex flex-col items-center px-6 pt-8 text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${current.iconBg}`}>
                        <FaExclamationTriangle className={`text-3xl ${current.iconColor}`} />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-slate-800">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 max-w-xs">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 px-6 py-5">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:shadow-sm transition-all"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 rounded-lg bg-linear-to-r ${current.button} py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Procesando...
                            </>
                        ): (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}