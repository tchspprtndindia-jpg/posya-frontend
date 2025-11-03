"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Loader2, Check, Minus, Plus, Package, Truck, Shield, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import BreadCumb from "./BreadCumbs";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const router = useRouter();

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 0, comment: "" });
  const [activeTab, setActiveTab] = useState("description");
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const fetchProductData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}products/${slug}`);
      const data = await res.json();
      if (data.status && data.product) {
        setProduct(data.product);
        setSelectedVariation(data.product.variations?.[0] || null);
        setMainImage(data.product.image_url || null);
        
        // Fetch reviews separately
        try {
          const reviewsRes = await fetch(`${BASE_URL}product/${data.product.id}/reviews`);
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData || []);
        } catch {
          setReviews([]);
        }
        
        // Fetch related products
        try {
          const relRes = await fetch(
            `${BASE_URL}products?category=${encodeURIComponent(
              data.product.category_name
            )}&exclude=${data.product.id}`
          );
          const relData = await relRes.json();
          if (relData.status && relData.products) setRelatedProducts(relData.products);
        } catch {
          setRelatedProducts([]);
        }
      }
    } catch {
      toast.error("Failed to load product");
    }
    setLoading(false);
  };

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.rating) {
      toast.error("Please fill in your name and select a rating.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}product/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          name: reviewForm.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setReviewForm({ name: "", rating: 0, comment: "" });
        
        // Refresh reviews after submission
        const reviewsRes = await fetch(`${BASE_URL}product/${product.id}/reviews`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData || []);
        setVisibleReviews(5);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    }
  };

  const loadMoreReviews = () => {
    setLoadingMoreReviews(true);
    setTimeout(() => {
      setVisibleReviews(prev => prev + 5);
      setLoadingMoreReviews(false);
    }, 500);
  };

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  const handleQuantity = (type: "inc" | "dec") => {
    setQuantity((q) => (type === "inc" ? q + 1 : Math.max(1, q - 1)));
  };

  const calculateAvgRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const checkDelivery = () => {
    if (!postalCode || postalCode.length < 5) {
      return toast.error("Please enter a valid postal code");
    }
    setCheckingDelivery(true);
    
    setTimeout(() => {
      const randomDays = Math.floor(Math.random() * 3) + 3;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + randomDays);
      
      setDeliveryInfo({
        available: true,
        days: randomDays,
        date: deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
      setCheckingDelivery(false);
      toast.success("Delivery available to your location!");
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomed) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0d3b2e]" size={48} />
          <p className="text-slate-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <BreadCumb/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div 
              ref={imageContainerRef}
              className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-transform duration-300"
                  style={isZoomed ? {
                    transform: `scale(2.5)`,
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}}
                  priority
                />
              )}
              
              {product.stock > 0 ? (
                <div className="absolute top-4 left-4 bg-[#0d3b2e] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Check size={14} /> In Stock
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[product.image_url, ...(product.all_images || [])].filter(Boolean).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all ${
                    mainImage === img
                      ? "ring-2 ring-[#0d3b2e] ring-offset-2 shadow-md"
                      : "ring-1 ring-slate-200 hover:ring-slate-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <button
              onClick={() => router.push(`/shop?category=${encodeURIComponent(product.category_name)}`)}
              className="inline-flex items-center px-4 py-2 bg-[#0d3b2e]/10 text-[#0d3b2e] rounded-full text-sm font-medium hover:bg-[#0d3b2e]/20 transition-colors"
            >
              {product.category_name}
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
              {selectedVariation?.name && (
                <p className="text-base text-slate-600 mt-2">
                  {selectedVariation.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(Number(calculateAvgRating())) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                  />
                ))}
              </div>
              <span className="text-slate-600 font-medium text-sm">
                {calculateAvgRating()} ({reviews.length} reviews)
              </span>
            </div>

            {product.shortDescription && (
              <p className="text-slate-600 text-base leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#0d3b2e]">
                ₹{selectedVariation?.price || 0}
              </span>
              {selectedVariation?.original_price && selectedVariation.original_price > selectedVariation.price && (
                <span className="text-xl text-slate-400 line-through">
                  ₹{selectedVariation.original_price}
                </span>
              )}
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              <Package size={16} />
              {product.stock > 0 ? `${product.stock} units available` : "Out of Stock"}
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <MapPin size={20} className="text-[#0d3b2e]" />
                <span>Check Delivery</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                  maxLength={10}
                />
                <button
                  onClick={checkDelivery}
                  disabled={checkingDelivery}
                  className="px-6 py-2.5 bg-[#0d3b2e] text-white rounded-xl hover:bg-[#0d3b2e]/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {checkingDelivery ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Check"
                  )}
                </button>
              </div>
              {deliveryInfo && (
                <div className="flex items-start gap-2 text-sm bg-green-50 text-green-700 p-3 rounded-lg">
                  <Truck size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Delivery Available</p>
                    <p>Expected delivery by <span className="font-semibold">{deliveryInfo.date}</span></p>
                  </div>
                </div>
              )}
            </div>

            {product.variations?.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedVariation?.id === v.id
                          ? "bg-[#0d3b2e] text-white shadow-lg shadow-[#0d3b2e]/20 scale-105"
                          : "bg-white text-slate-700 border-2 border-slate-200 hover:border-[#0d3b2e]/30 hover:shadow-md"
                      }`}
                    >
                      {v.formatted_quantity}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Quantity
                </label>
                <div className="flex items-center bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantity("dec")}
                    className="p-3 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    <Minus size={18} className={quantity <= 1 || isOutOfStock ? "text-slate-300" : "text-slate-700"} />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity("inc")}
                    className="p-3 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    disabled={isOutOfStock}
                  >
                    <Plus size={18} className={isOutOfStock ? "text-slate-300" : "text-slate-700"} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!selectedVariation) return toast.error("Please select a variation");
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: selectedVariation?.price || 0,
                      qty: quantity,
                      image: mainImage || product.image_url,
                      variationId: selectedVariation?.id,
                      variationName: selectedVariation?.formatted_quantity || selectedVariation?.name || "",
                      tax_rate: selectedVariation?.tax_rate || 0,
                      tax_name: selectedVariation?.tax_name || "",
                    });
                    toast.success("Added to cart!");
                  }}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#0d3b2e] text-white py-4 px-6 rounded-xl hover:bg-[#0d3b2e]/90 transition-all shadow-lg shadow-[#0d3b2e]/20 hover:shadow-xl hover:shadow-[#0d3b2e]/30 flex items-center justify-center gap-3 font-semibold text-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={() => {
                    if (!selectedVariation) return toast.error("Please select a variation");
                    addToWishlist({
                      id: product.id,
                      name: product.name,
                      price: selectedVariation?.price || 0,
                      image: mainImage || product.image_url,
                      variationId: selectedVariation?.id || null,
                      variationName: selectedVariation?.formatted_quantity || selectedVariation?.name || "",
                      tax_rate: selectedVariation?.tax_rate || 0,
                      tax_name: selectedVariation?.tax_name || "",
                    });
                    setIsWishlisted(!isWishlisted);
                    toast.success("Added to wishlist!");
                  }}
                  className={`p-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center group ${
                    isWishlisted
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
                  }`}
                >
                  <Heart
                    size={24}
                    className={`group-hover:scale-110 transition-transform ${
                      isWishlisted ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#0d3b2e]/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck size={24} className="text-[#0d3b2e]" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-700">Free Shipping</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                  <Shield size={24} className="text-blue-600" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-700">Secure Payment</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto">
                  <Package size={24} className="text-purple-600" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-700">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs
            description={product.description || ""}
            reviews={reviews}
            ingredients={product.ingredients || []}
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            submitReview={submitReview}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            visibleReviews={visibleReviews}
            loadMoreReviews={loadMoreReviews}
            loadingMoreReviews={loadingMoreReviews}
          />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/product/${item.slug}`)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-[#0d3b2e] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[#0d3b2e] font-bold text-lg">
                      ₹{item.variations?.[0]?.price || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Tabs({
  description,
  reviews,
  ingredients,
  reviewForm,
  setReviewForm,
  submitReview,
  activeTab,
  setActiveTab,
  visibleReviews,
  loadMoreReviews,
  loadingMoreReviews,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {["description", "ingredients", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-4 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#0d3b2e]/5 text-[#0d3b2e] border-b-2 border-[#0d3b2e]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {activeTab === "description" && (
          <div
            className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-[#0d3b2e]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

      {activeTab === "ingredients" && (
          <div className="space-y-8">
            {ingredients.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
                  <Package size={48} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Ingredients Listed</h3>
                <p className="text-slate-500 text-base max-w-md mx-auto">
                  Ingredient information is not available for this product at the moment.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Key Ingredients</h3>
                  <p className="text-slate-600">Discover the natural goodness in every ingredient</p>
                </div>
                
                {ingredients.map((ingredient: any, index: number) => (
                  <div
                    key={ingredient.id || index}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200/50"
                  >
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0d3b2e]/5 via-transparent to-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex flex-col md:flex-row gap-0">
                      {/* Image Section */}
                      {ingredient.featured_image && (
                        <div className="md:w-2/5 relative">
                          <div className="relative w-full h-64 md:h-full min-h-[300px]">
                            <Image
                              src={ingredient.featured_image}
                              alt={ingredient.name || "Ingredient"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Index badge */}
                            <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#0d3b2e] text-white flex items-center justify-center font-bold text-lg shadow-xl">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Content Section */}
                      <div className={`flex-1 p-8 md:p-10 ${!ingredient.featured_image ? 'md:px-12' : ''}`}>
                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-[#0d3b2e] transition-colors duration-300">
                          {ingredient.name}
                        </h3>
                        
                        {/* Divider */}
                        <div className="w-20 h-1.5 bg-gradient-to-r from-[#0d3b2e] to-green-400 rounded-full mb-6" />
                        
                        {/* Content */}
                        {ingredient.content && (
                          <div
                            className="prose prose-lg prose-slate max-w-none 
                              prose-headings:text-slate-900 prose-headings:font-bold
                              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                              prose-ul:text-slate-600 prose-ul:space-y-2
                              prose-li:marker:text-[#0d3b2e]
                              prose-strong:text-slate-900 prose-strong:font-semibold
                              prose-a:text-[#0d3b2e] prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: ingredient.content }}
                          />
                        )}
                        
                        {/* Benefits badge (optional, can be removed) */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              100% Natural
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Premium Quality
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Trusted
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom accent line */}
                  <div className="" />
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#0d3b2e]/5 to-white rounded-xl p-6 border border-[#0d3b2e]/20">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Write a Review</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={star <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Share your experience with this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all resize-none"
                  rows={5}
                />
                
                <button
                  onClick={submitReview}
                  className="w-full sm:w-auto bg-[#0d3b2e] text-white py-3 px-8 rounded-xl hover:bg-[#0d3b2e]/90 transition-all shadow-lg shadow-[#0d3b2e]/20 hover:shadow-xl font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Customer Reviews ({reviews.length})
                </h3>
                {reviews.slice(0, visibleReviews).map((r: any) => (
                  <div
                    key={r.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900 text-lg">{r.name}</p>
                        {r.date && (
                          <p className="text-sm text-slate-500">{r.date}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={18}
                            className={j < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
                
                {visibleReviews < reviews.length && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMoreReviews}
                      disabled={loadingMoreReviews}
                      className="bg-white border-2 border-[#0d3b2e] text-[#0d3b2e] py-3 px-8 rounded-xl hover:bg-[#0d3b2e] hover:text-white transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {loadingMoreReviews ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Reviews ({Math.min(5, reviews.length - visibleReviews)} more)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}