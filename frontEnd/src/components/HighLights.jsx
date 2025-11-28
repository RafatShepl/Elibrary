import { Book, ShoppingCart, Tag, CreditCard } from "lucide-react";

export default function Features() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 w-full">
      
      {/* Feature 1 */}
      <div className="flex flex-col items-start gap-2 w-full bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <Book className="w-8 h-8 text-green-500" />
          <h3 className="font-bold text-lg">Wide Book Collection</h3>
        </div>
        <p className="text-sm text-gray-600">
          Thousands of books from all genres available for reading and purchase.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="flex flex-col items-start gap-2 w-full bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <ShoppingCart className="w-8 h-8 text-blue-500" />
          <h3 className="font-bold text-lg">Easy Purchase</h3>
        </div>
        <p className="text-sm text-gray-600">
          Simple and fast checkout process to get your favorite books quickly.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="flex flex-col items-start gap-2 w-full bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <Tag className="w-8 h-8 text-purple-500" />
          <h3 className="font-bold text-lg">Discount Offers</h3>
        </div>
        <p className="text-sm text-gray-600">
          Enjoy seasonal discounts and exclusive offers on popular titles.
        </p>
      </div>

      {/* Feature 4 */}
      <div className="flex flex-col items-start gap-2 w-full bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-orange-500" />
          <h3 className="font-bold text-lg">Secure Payments</h3>
        </div>
        <p className="text-sm text-gray-600">
          All transactions are safe and secure with multiple payment options.
        </p>
      </div>
      
    </div>
  );
}
