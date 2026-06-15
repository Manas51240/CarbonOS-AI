'use client';

interface RangeInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  icon: React.ReactNode;
}

export default function RangeInputField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  icon
}: RangeInputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </label>
        <span className="text-xs font-bold text-primary">{value} {unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-2 rounded-lg bg-secondary/80 outline-none cursor-pointer mt-3"
      />
    </div>
  );
}
