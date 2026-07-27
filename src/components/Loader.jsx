import React from 'react';

const Loader = () => {
  return (
    <section className="flex items-center justify-center py-10">
      <section className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></section>
    </section>
  )
}

export default Loader;
