type SearchInputProps = {
    placeholder?: string;
};

export function SearchInput({
    placeholder = 'Поиск',
}: SearchInputProps) {
    return (
        <div className="search-input">
            <span className="search-input__icon">⌕</span>
            <input
                type="text"
                className="search-input__field"
                placeholder={placeholder}
            />
        </div>
    );
}