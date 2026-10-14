export const ADULT_SIZES = [
  { size: "S", chest: "88–94", length: "74", shoulder: "44" },
  { size: "M", chest: "96–102", length: "76", shoulder: "46" },
  { size: "L", chest: "104–110", length: "78", shoulder: "48" },
  { size: "XL", chest: "112–118", length: "80", shoulder: "50" },
  { size: "XXL", chest: "120–128", length: "82", shoulder: "52" },
];

export const WOMEN_SIZES = [
  { size: "XS", bust: "78–82", waist: "60–64", hips: "86–90" },
  { size: "S", bust: "83–87", waist: "65–69", hips: "91–95" },
  { size: "M", bust: "88–93", waist: "70–75", hips: "96–101" },
  { size: "L", bust: "94–100", waist: "76–82", hips: "102–108" },
  { size: "XL", bust: "101–108", waist: "83–90", hips: "109–116" },
];

export function SizeTable({ rows, cols }: { rows: Record<string, string>[]; cols: { key: string; label: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-line">
      <table className="w-full min-w-[22rem] text-left text-sm">
        <thead className="bg-cotton-deep">
          <tr>
            {cols.map((c) => (
              <th key={c.key} scope="col" className="px-4 py-3 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-white">
          {rows.map((r) => (
            <tr key={r.size}>
              {cols.map((c, i) => (
                <td key={c.key} className={i === 0 ? "px-4 py-3 font-medium" : "px-4 py-3 tabular-nums text-ink-soft"}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
