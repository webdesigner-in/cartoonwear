// Cute error state component for failed data loads
"use client";

export default function ErrorState({ message = "Failed to load data.", step = 1 }) {
  const icons = [
    <svg key="1" width="64" height="64" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#FDE68A"/><text x="32" y="38" textAnchor="middle" fontSize="32" fill="#F59E42">😕</text></svg>,
    <svg key="2" width="64" height="64" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#FCA5A5"/><text x="32" y="38" textAnchor="middle" fontSize="32" fill="#EF4444">😭</text></svg>,
    <svg key="3" width="64" height="64" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#A5B4FC"/><text x="32" y="38" textAnchor="middle" fontSize="32" fill="#6366F1">🐻</text></svg>
  ];
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div>{icons[step - 1] || icons[0]}</div>
      <div className="mt-4 text-lg text-gray-700 font-semibold">{message}</div>
      <div className="mt-2 text-sm text-gray-400">Step {step} of 3</div>
    </div>
  );
}
