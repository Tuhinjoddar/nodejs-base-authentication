interface DividerProps {
  text?: string;
}

export function Divider({ text = "OR" }: DividerProps) {
  return (
    <div className="flex items-center my-4">
      <hr className="flex-grow border-t-2 border-gray-400" />
      <span className="mx-2 text-gray-500">{text}</span>
      <hr className="flex-grow border-t-2 border-gray-400" />
    </div>
  );
}
