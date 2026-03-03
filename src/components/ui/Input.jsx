export default function InputField({ label, name, type = "text", options = [], ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      {type === "select" ? (
        <select 
          name={name}
          className="w-full rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 text-sm outline-none transition"
          {...props}
        > 
          {options.map(opt => (
            <option
              key={opt.value} 
              value={opt.value}
            >
              {opt.label}
            </option>
          ))}
        </select>
      ): type === "textarea" ? (
        <textarea 
          name={name}
          className="w-full rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 text-sm outline-none transition"
          {...props}
        />
      ) : (
        <input
          name={name}
          type={type}
          className="w-full rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 text-sm outline-none transition"
          {...props}
        />
      )}
    </div>
  );
}