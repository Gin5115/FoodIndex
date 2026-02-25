import { Plus } from 'lucide-react';

function AddItemButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
        >
            <Plus className="w-5 h-5" />
            <span>Add New Item</span>
        </button>
    );
}

export default AddItemButton;
