import toast from 'react-hot-toast';

export const confirmDelete = (message, onConfirm) => {
  toast((t) => (
    <div className="flex flex-col gap-3 font-bold text-black">
      <p>{message}</p>
      <div className="flex justify-end gap-2 mt-2">
        <button 
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-1.5 rounded-lg border-2 border-transparent text-slate-600 hover:text-black hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="bg-[#F43F5E] text-white px-4 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    style: {
      border: '4px solid black',
      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
      borderRadius: '1rem',
      padding: '1.5rem',
      background: 'white',
      color: 'black'
    }
  });
};
