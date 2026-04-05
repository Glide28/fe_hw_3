type SearchInputProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({
  placeholder = 'Поиск',
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="search-input">
      <span className="search-input__icon">⌕</span>
      <input
        type="text"
        className="search-input__field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}