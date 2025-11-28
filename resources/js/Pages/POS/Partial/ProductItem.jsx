
import { useContext } from "react"
import { usePage } from "@inertiajs/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SharedContext } from "@/Context/SharedContext"
import { useSales as useCart } from "@/Context/SalesContext"
import productplaceholder from "@/Pages/Product/product-placeholder.webp"
import { ShoppingCart, Plus } from "lucide-react"

export default function ModernProductItem({ product }) {
  const return_sale = usePage().props.return_sale
  const currency_symbol = usePage().props.settings.currency_symbol

  const { name, price, image_url } = product
  const { addToCart, cartState, updateCartItem } = useCart()
  const { setCartItemModalOpen, setSelectedCartItem } = useContext(SharedContext)

  const handleAddToCart = () => {
    if (return_sale) {
      product.quantity = -1
    } else {
      product.quantity = 1
    }

    if (product.discount_percentage && Number(product.discount_percentage) !== 0) {
      const discount = (product.price * product.discount_percentage) / 100
      product.discount = discount
    }

    if (product.product_type === "reload") {
      const lastAddedIndex = cartState.length > 0 ? cartState.length : 0
      product.cart_index = lastAddedIndex
    }

    setSelectedCartItem(product)
    //updateCartItem(product);
    setCartItemModalOpen(true)
  }

  return (
    <Card
      onClick={handleAddToCart}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border-0 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] min-w-[160px] max-w-[220px]"
    >
      {/* Imagen del producto con overlay gradiente */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
        <img
          src={image_url || productplaceholder}
          alt={name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />

        {/* Precio con diseño moderno */}
        {price > 0 && (
          <Badge className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm text-gray-900 border-0 shadow-lg px-3 py-1.5 rounded-full font-semibold text-sm">
            {currency_symbol}
            {price}
          </Badge>
        )}

        {/* Botón flotante de agregar */}
        <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          onClick={(e) => {
            e.stopPropagation(); 
            product.quantity = 1;
            updateCartItem(product);
          }}
        >
          <div className="bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Contenido con mejor spacing */}
      <CardContent className="p-1">
        <div className="space-y-1">
          {/* Nombre del producto */}
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 justify-center text-center">
            {name}
          </h3>
        </div>
      </CardContent>

      {/* Borde animado */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300" />

      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
    </Card>
  )
}
