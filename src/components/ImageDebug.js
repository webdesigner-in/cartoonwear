"use client";

export default function ImageDebug({ product }) {
  if (!product) return null;

  const images = product.images || [];
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 className="text-sm font-semibold text-yellow-800 mb-2">🐛 Image Debug Info</h4>
      <div className="text-xs space-y-1 text-yellow-700">
        <p><strong>Product:</strong> {product.name}</p>
        <p><strong>Images Type:</strong> {typeof product.images}</p>
        <p><strong>Images Array:</strong> {Array.isArray(images) ? 'Yes' : 'No'}</p>
        <p><strong>Images Count:</strong> {Array.isArray(images) ? images.length : 'N/A'}</p>
        {Array.isArray(images) && images.length > 0 && (
          <div>
            <p><strong>Image URLs:</strong></p>
            <ul className="ml-4 space-y-1">
              {images.map((img, index) => (
                <li key={index} className="break-all">
                  {index + 1}: {typeof img === 'string' ? img : JSON.stringify(img)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {product.images && typeof product.images === 'string' && (
          <p><strong>Raw Images Field:</strong> {product.images}</p>
        )}
      </div>
    </div>
  );
}