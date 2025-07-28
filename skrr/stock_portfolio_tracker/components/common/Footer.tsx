export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Stock Portfolio Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
}
