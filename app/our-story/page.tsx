// 'use client';

// import { useState } from 'react';
// import { ChevronDown, Flower2, Droplets, Sparkles, Award, Heart, Shield, Sun, Leaf } from 'lucide-react';

// export default function OurStory() {
//   const [expandedSection, setExpandedSection] = useState(null);

//   const values = [
//     {
//       icon: <Droplets className="w-10 h-10" />,
//       title: "Pure & Natural",
//       description: "No additives, no preservatives—just nature's goodness in its purest form"
//     },
//     {
//       icon: <Shield className="w-10 h-10" />,
//       title: "Quality Tested",
//       description: "Every batch is rigorously tested for purity, authenticity, and safety standards"
//     },
//     {
//       icon: <Flower2 className="w-10 h-10" />,
//       title: "Traditional Methods",
//       description: "Ancient techniques passed down through generations, perfected over time"
//     },
//     {
//       icon: <Heart className="w-10 h-10" />,
//       title: "Ethically Sourced",
//       description: "Supporting local communities and sustainable harvesting practices"
//     }
//   ];

//   const timeline = [
//     { 
//       year: "2015", 
//       title: "A Dream Born", 
//       desc: "Started with pure A2 ghee made from desi cow milk, reviving an age-old tradition",
//       image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80"
//     },
//     { 
//       year: "2018", 
//       title: "Sweetness Added", 
//       desc: "Partnered with beekeepers to bring raw, unprocessed honey from pristine forests",
//       image: "https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=600&q=80"
//     },
//     { 
//       year: "2021", 
//       title: "Floral Collection", 
//       desc: "Launched rose water and floral hydrosols using traditional steam distillation",
//       image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80"
//     },
//     { 
//       year: "2024", 
//       title: "Trusted Nationwide", 
//       desc: "Now serving 25,000+ families with 30+ premium natural products",
//       image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"
//     }
//   ];

//   const moreContent = [
//     {
//       id: 'ghee',
//       title: 'Our Ghee Story',
//       preview: 'From grass-fed desi cows to your kitchen...',
//       content: 'Our ghee is crafted using the traditional bilona method—milk is first curdled into curd, then hand-churned to extract butter, which is slowly simmered over wood fire. We source milk exclusively from indigenous desi cows that graze freely on organic pastures. The result is golden, aromatic A2 ghee rich in nutrients and free from any chemicals or adulterants. Each batch is small, ensuring the highest quality and authentic taste.',
//       icon: <Sun className="w-6 h-6" />
//     },
//     {
//       id: 'honey',
//       title: 'Pure Honey Promise',
//       preview: 'Raw, unfiltered, straight from the hive...',
//       content: 'Our honey is collected from remote forest areas where bees gather nectar from wildflowers, free from pesticides and pollution. We work with traditional beekeepers who harvest sustainably, never harming the colonies. The honey is raw and unprocessed—never heated or filtered—preserving all its natural enzymes, antioxidants, and healing properties. Each jar captures the essence of the flowers from which it came, with seasonal variations in color and flavor.',
//       icon: <Droplets className="w-6 h-6" />
//     },
//     {
//       id: 'floral',
//       title: 'Floral Waters & Hydrosols',
//       preview: 'Captured essence of fresh blooms...',
//       content: 'Our rose water and floral hydrosols are created through traditional steam distillation of fresh petals and flowers harvested at dawn when their fragrance is most potent. We use copper stills and slow distillation to capture the delicate aromatic compounds and therapeutic properties. No synthetic fragrances, no alcohol, no preservatives—just pure floral water. Each bottle contains the soul of hundreds of flowers, perfect for skincare, wellness, and culinary uses.',
//       icon: <Flower2 className="w-6 h-6" />
//     },
//     {
//       id: 'quality',
//       title: 'Quality & Authenticity',
//       preview: 'Tested, certified, and transparent...',
//       content: 'Every product undergoes multiple quality checks and third-party lab testing. Our ghee is tested for A2 protein content and purity. Honey is tested for adulterants and natural enzyme levels. Floral waters are tested for microbial safety and authentic composition. We maintain complete traceability—from source to bottle. Our facilities follow strict hygiene protocols and are certified by food safety authorities. We believe in complete transparency and share test reports with our customers.',
//       icon: <Award className="w-6 h-6" />
//     }
//   ];

//   const products = [
//     { name: "A2 Desi Ghee", desc: "Golden, aromatic, hand-churned" },
//     { name: "Forest Honey", desc: "Raw, unprocessed, wildflower" },
//     { name: "Rose Water", desc: "Pure steam-distilled essence" },
//     { name: "Floral Hydrosols", desc: "Jasmine, lavender, & more" }
//   ];


//   return (
//     <div className="bg-white">
//       {/* Hero Section */}
//       <section className="relative h-100 flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0">
//           <div 
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage: 'url(../images/slider-1.jpg)',
//             }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-rose-900/70 to-amber-800/80" />
//         </div>
        
//         <div className="relative z-10 text-center text-white px-4 max-w-5xl">
//           <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
//             Our Story
//           </h1>
//           <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
//             Crafting premium ghee, honey, and floral waters using time-honored methods and the finest natural ingredients
//           </p>
//         </div>

//         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
//           <ChevronDown className="w-10 h-10 text-white" />
//         </div>
//       </section>

//       {/* Introduction Story */}
//       <section className="max-w-7xl mx-auto px-4 py-24">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           <div className="space-y-6">
//             <div className="inline-block px-5 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
//               EST. 2015 • PURE & AUTHENTIC
//             </div>
//             <h2 className="text-5xl font-bold text-gray-900 leading-tight">
//               Where Ancient Wisdom Meets <span className="text-amber-600">Modern Purity</span>
//             </h2>
//             <p className="text-xl text-gray-700 leading-relaxed">
//               Posya was born from a deep reverence for traditional wellness and a commitment to bringing you nature's finest gifts in their purest form. We believe that true nourishment comes from products crafted with care, patience, and respect for ancient methods.
//             </p>
//             <p className="text-lg text-gray-600 leading-relaxed">
//               What began with our grandmother's recipe for bilona ghee has grown into a curated collection of premium natural products. Each item tells a story—of skilled artisans, sustainable practices, and unwavering dedication to quality.
//             </p>
//             <p className="text-lg text-gray-600 leading-relaxed">
//               From the golden richness of A2 ghee to the delicate essence of rose water, from raw forest honey to aromatic floral hydrosols—every product embodies our philosophy: never compromise on purity, never shortcut tradition.
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-4">
//               <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
//                 <div 
//                   className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700"
//                   style={{
//                     backgroundImage: 'url(https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80)'
//                   }}
//                 />
//               </div>
//               <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
//                 <div 
//                   className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700"
//                   style={{
//                     backgroundImage: 'url(https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=400&q=80)'
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="space-y-4 pt-12">
//               <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
//                 <div 
//                   className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700"
//                   style={{
//                     backgroundImage: 'url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80)'
//                   }}
//                 />
//               </div>
//               <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
//                 <div 
//                   className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700"
//                   style={{
//                     backgroundImage: 'url(https://images.unsplash.com/photo-1505855265981-d52719d1f7ba?w=400&q=80)'
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 py-24">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-5xl font-bold mb-4 text-gray-900">Our Promise to You</h2>
//             <p className="text-xl text-gray-600">Values that define every product we create</p>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {values.map((value, index) => (
//               <div 
//                 key={index}
//                 className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group border-2 border-transparent hover:border-amber-200"
//               >
//                 <div className="text-amber-600 mb-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
//                   {value.icon}
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3 text-gray-900">{value.title}</h3>
//                 <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Product Showcase */}
//       <section className="max-w-7xl mx-auto px-4 py-24">
//         <div className="text-center mb-16">
//           <h2 className="text-5xl font-bold mb-4 text-gray-900">Our Signature Collection</h2>
//           <p className="text-xl text-gray-600">Crafted with love, delivered with care</p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((product, index) => (
//             <div 
//               key={index}
//               className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
//             >
//               <div 
//                 className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
//                 style={{
//                   backgroundImage: index === 0 
//                     ? 'url(https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80)'
//                     : index === 1
//                     ? 'url(https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=400&q=80)'
//                     : index === 2
//                     ? 'url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80)'
//                     : 'url(https://images.unsplash.com/photo-1505855265981-d52719d1f7ba?w=400&q=80)'
//                 }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
//               <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                 <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
//                 <p className="text-amber-200">{product.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Timeline Section */}
//       <section className="bg-gradient-to-b from-white to-amber-50 py-24">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-5xl font-bold mb-4 text-gray-900">Our Journey</h2>
//             <p className="text-xl text-gray-600">Milestones in our pursuit of purity</p>
//           </div>

//           <div className="space-y-16">
//             {timeline.map((milestone, index) => (
//               <div 
//                 key={index}
//                 className={`flex flex-col lg:flex-row gap-12 items-center ${
//                   index % 2 === 1 ? 'lg:flex-row-reverse' : ''
//                 }`}
//               >
//                 <div className="lg:w-1/2">
//                   <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
//                     <div 
//                       className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
//                       style={{ backgroundImage: `url(${milestone.image})` }}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
//                   </div>
//                 </div>
//                 <div className="lg:w-1/2 space-y-4">
//                   <div className="text-7xl font-bold text-amber-600">{milestone.year}</div>
//                   <h3 className="text-4xl font-bold text-gray-900">{milestone.title}</h3>
//                   <p className="text-xl text-gray-600 leading-relaxed">{milestone.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white py-24">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid md:grid-cols-4 gap-12 text-center">
//             <div className="space-y-3">
//               <div className="text-6xl font-bold">25K+</div>
//               <div className="text-xl opacity-90">Happy Families</div>
//             </div>
//             <div className="space-y-3">
//               <div className="text-6xl font-bold">30+</div>
//               <div className="text-xl opacity-90">Premium Products</div>
//             </div>
//             <div className="space-y-3">
//               <div className="text-6xl font-bold">100%</div>
//               <div className="text-xl opacity-90">Pure & Natural</div>
//             </div>
//             <div className="space-y-3">
//               <div className="text-6xl font-bold">9+ Yrs</div>
//               <div className="text-xl opacity-90">Trust & Quality</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Expandable More Section */}
//       <section className="bg-gradient-to-br from-gray-900 via-amber-900 to-rose-900 text-white py-24">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-5xl font-bold mb-4">Discover Our Craft</h2>
//             <p className="text-xl text-amber-200">The story behind each product</p>
//           </div>

//           <div className="space-y-4">
//             {moreContent.map((item) => (
//               <div 
//                 key={item.id}
//                 className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/20 hover:border-amber-400 transition-all duration-300"
//               >
//                 <button
//                   onClick={() => setExpandedSection(expandedSection === item.id ? null : item.id)}
//                   className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
//                 >
//                   <div className="flex items-center gap-6 flex-1">
//                     <div className="text-amber-400 flex-shrink-0">
//                       {item.icon}
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
//                       <p className="text-amber-200">{item.preview}</p>
//                     </div>
//                   </div>
//                   <ChevronDown 
//                     className={`w-8 h-8 transition-transform duration-300 flex-shrink-0 ml-4 ${
//                       expandedSection === item.id ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>
                
//                 <div 
//                   className={`transition-all duration-500 overflow-hidden ${
//                     expandedSection === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                   }`}
//                 >
//                   <div className="px-8 pb-8 pt-4">
//                     <p className="text-lg text-amber-100 leading-relaxed">
//                       {item.content}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="relative py-32 overflow-hidden">
//         <div 
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage: 'url(https://images.unsplash.com/photo-1505855265981-d52719d1f7ba?w=1920&q=80)'
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 via-rose-900/90 to-orange-900/95" />
        
//         <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
//           <Sparkles className="w-20 h-20 mx-auto mb-6 animate-pulse" />
//           <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
//             Experience Nature's Finest
//           </h2>
//           <p className="text-2xl mb-10 leading-relaxed opacity-95">
//             Join thousands of families who trust Posya for pure, authentic, and traditional wellness products. Taste the difference that purity makes.
//           </p>
//           <button className="px-12 py-5 bg-white text-amber-900 rounded-full text-xl font-bold hover:bg-amber-50 transition-all hover:shadow-2xl hover:scale-105 transform">
//             Explore Our Collection
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }