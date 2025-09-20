"use client";
import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setResults(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        {loading && <div className="text-lg text-gray-500">Searching...</div>}
        {error && <div className="text-lg text-red-500">{error}</div>}
        {!loading && !error && (
          <div>
            {results.length === 0 ? (
              <div className="text-lg text-gray-500">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="card p-4 flex gap-4 items-center hover:shadow-lg">
                    <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-lg border border-cream-300" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                      <div className="text-accent font-semibold">₹{product.price}</div>
                      <div className="text-gray-700">{product.category?.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
