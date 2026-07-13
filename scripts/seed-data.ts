import fs from 'fs'
import path from 'path'
import { db } from '../src/lib/db'
import { uploadImage, BUCKETS, supabaseAdmin } from '../src/lib/storage'
import mime from 'mime-types'

async function processImage(imagePath: string, bucket: keyof typeof BUCKETS): Promise<string> {
  const fullPath = path.resolve(__dirname, '..', 'src', 'assets', imagePath)
  
  if (imagePath.endsWith('.asset.json')) {
    // It's a Lovable remote asset URL, just read the JSON and return the URL directly
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
    return content.url
  }

  // It's a local file, we need to upload it
  const buffer = fs.readFileSync(fullPath)
  const ext = path.extname(fullPath)
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
  const contentType = mime.lookup(ext) || 'image/jpeg'
  
  console.log(`Uploading ${imagePath} to bucket ${bucket}...`)
  return uploadImage(bucket, buffer, filename, contentType)
}

const menuSections = [
  {
    id: "rice",
    group: "Indian",
    title: "Rice",
    img: "menu-rice.jpg",
    items: [
      { name: "Sultani Polao", price: 239 },
      { name: "Kashmiri Polao", price: 289 },
      { name: "Peas Polao", price: 209 },
      { name: "Jeera Rice", price: 179 },
      { name: "Steamed Rice", price: 99 },
      { name: "Chicken Yakhni Polao", price: 259 },
      { name: "Chicken Biriyani", price: 275 },
      { name: "Mutton Biriyani", price: 325 },
    ],
  },
  {
    id: "roti",
    group: "Indian",
    title: "Roti & Naan",
    img: "menu-roti.jpg",
    items: [
      { name: "Tandoor Roti", price: 45, note: "Plain / Butter (Showing max price)" },
      { name: "Naan", price: 75, note: "Plain / Butter / Garlic (Showing max price)" },
      { name: "Keema Naan", price: 225 },
      { name: "Kashmiri Naan", price: 99 },
      { name: "Lachha Paratha", price: 89 },
      { name: "Cheesy Garlic Naan", price: 119 },
      { name: "Kulcha", price: 109, note: "Masala / Paneer" },
      { name: "Aloo Paratha", price: 95 },
    ],
  },
  {
    id: "chicken",
    group: "Indian",
    title: "Chicken",
    subtitle: "4 pcs unless mentioned",
    img: "menu-butter-chicken.jpg",
    items: [
      { name: "Chicken Kosha", price: 279 },
      { name: "Chicken Duk-Bunglow", price: 319 },
      { name: "Kadhai Chicken", price: 299 },
      { name: "Chicken Do-Pyaza", price: 289 },
      { name: "Hyderabadi Chicken", price: 319 },
      { name: "Butter Chicken", price: 329 },
      { name: "Chicken Bharta", price: 279 },
      { name: "Handi Chicken", price: 319 },
      { name: "Chicken Tikka Butter Masala", price: 329, note: "6 pcs" },
      { name: "Chicken Reshmi Butter Masala", price: 349, note: "6 pcs" },
      { name: "Chicken Lababdar", price: 329, note: "6 pcs" },
      { name: "Riko's Balti Chicken", price: 349 },
      { name: "Riko's Chicken Patiala", price: 349 },
    ],
  },
  {
    id: "mutton",
    group: "Indian",
    title: "Mutton",
    subtitle: "4 pcs",
    img: "menu-mutton.jpg",
    items: [
      { name: "Mutton Kosha", price: 399 },
      { name: "Mutton Roganjosh", price: 395 },
      { name: "Handi Mutton", price: 409 },
      { name: "Kadhai Mutton", price: 399 },
      { name: "Mutton Rarha Masala", price: 349 },
      { name: "Hyderabadi Mutton", price: 409 },
      { name: "Mutton Keema Masala", price: 349 },
      { name: "Mutton Kolhapuri", price: 409 },
      { name: "Riko's Balti Mutton", price: 409 },
      { name: "Champaran Mutton", price: 519, note: "Signature" },
      { name: "Champaran Chicken", price: 410, note: "Signature" },
    ],
  },
  {
    id: "prawn",
    group: "Indian",
    title: "Prawn & Fish",
    subtitle: "Prawn 4 pcs · Fish 2 pcs (Katla / Basa)",
    img: "menu-prawn.jpg",
    items: [
      { name: "Prawn Masala", price: 409 },
      { name: "Prawn Do-Pyaza", price: 409 },
      { name: "Prawn Malaikari", price: 419 },
      { name: "Fish Curry", price: 315 },
      { name: "Fish Masala", price: 319 },
      { name: "Fish Tikka Butter Masala", price: 519 },
    ],
  },
  {
    id: "chinese-spec",
    group: "Chinese",
    title: "Chinese Specialities",
    img: "dish-chinese.jpg",
    items: [
      { name: "Conjai Crispy", price: 329 },
      { name: "Lat Me Kai", price: 279, note: "Butter fry chicken, chilli oyster" },
      { name: "Pan Fried Fish", price: 329, note: "Shallow fried, chilli sauce" },
      { name: "Crispy Chilli Coriander", price: 329 },
      { name: "Pad Thai Kai", price: 289, note: "Thai spices & basil" },
      { name: "Gai Yong Kai", price: 279 },
      { name: "Gung Pad Thai", price: 359, note: "Prawns, Thai spices" },
    ],
  },
  {
    id: "chinese-start",
    group: "Chinese",
    title: "Chinese Starters",
    subtitle: "6 pcs · Chicken / Fish / Prawn",
    img: "menu-chinese-starter.jpg",
    items: [
      { name: "Chilly Dry", price: 359 },
      { name: "Kung Pao", price: 369 },
      { name: "Dragon", price: 379 },
      { name: "Teriyaki Dry", price: 390 },
      { name: "Mongolian Dry", price: 369 },
      { name: "Crispy", price: 359 },
      { name: "Pepper", price: 339 },
      { name: "Chicken 65", price: 310 },
      { name: "Chicken Lollipop", price: 299 },
      { name: "Crunchy Chicken", price: 299 },
      { name: "Drums of Heaven", price: 349 },
    ],
  },
  {
    id: "gravy",
    group: "Gravy",
    title: "Chinese Gravy",
    subtitle: "Fish / Chicken / Prawn",
    img: "dish-chinese.jpg",
    items: [
      { name: "Chilli", price: 359 },
      { name: "Schezwan", price: 369 },
      { name: "Hot Garlic Sauce", price: 355 },
      { name: "Sweet 'N' Sour", price: 355 },
      { name: "Manchurian", price: 359 },
      { name: "Hunan Sauce", price: 389 },
      { name: "Hong Kong", price: 379 },
      { name: "Thai Red Curry", price: 409, note: "Chicken / Prawn" },
      { name: "Japanese Grilled", price: 425, note: "Chicken / Fish, sticky rice" },
      { name: "Malaysian Curry", price: 409, note: "Chicken / Prawn" },
    ],
  },
  {
    id: "tandoor-chicken",
    group: "Tandoor",
    title: "Tandoor · Chicken",
    subtitle: "6 pcs",
    img: "dish-tandoor.jpg",
    items: [
      { name: "Tandoori Chicken", price: 469, note: "Half / Full" },
      { name: "Chicken Tikka Kebab", price: 289 },
      { name: "Reshmi Kebab", price: 329 },
      { name: "Gondhoraj Tikka", price: 299 },
      { name: "Jungli Kebab", price: 299 },
      { name: "Hariyali Kebab", price: 319 },
      { name: "Malai Kebab", price: 349 },
      { name: "Keshari Malai Kebab", price: 439 },
      { name: "Tangri Kebab", price: 409, note: "Half / Full" },
      { name: "Riko's Fire Kebab", price: 459, note: "Signature" },
      { name: "Sholay Kebab", price: 329 },
      { name: "Chicken Seekh Kebab", price: 329 },
      { name: "Mutton Seekh Kebab", price: 439 },
    ],
  },
  {
    id: "tandoor-seafood",
    group: "Tandoor",
    title: "Tandoor · Fish & Seafood",
    subtitle: "4 pcs · Basa / Vetki",
    img: "menu-fish.jpg",
    items: [
      { name: "Fish Tikka", price: 469 },
      { name: "Fish Achari Kebab", price: 479 },
      { name: "Ajwaini Fish Tikka", price: 479 },
      { name: "Gondhoraj Fish", price: 499 },
      { name: "Tandoori Prawn", price: 449, note: "6 pcs" },
      { name: "Tandoor Pomfret", price: 399, note: "1 pc" },
    ],
  },
  {
    id: "veg",
    group: "Tandoor",
    title: "Vegetarian & Platters",
    img: "menu-veg.jpg",
    items: [
      { name: "Paneer Hyderabadi", price: 299, note: "6 pcs" },
      { name: "Paneer Tikka Kebab", price: 289, note: "6 pcs" },
      { name: "Paneer Achari Tikka", price: 299, note: "6 pcs" },
      { name: "Stuffed Mushroom", price: 279 },
      { name: "Mushroom Tikka Kebab", price: 269, note: "6 pcs" },
      { name: "Stuffed Aloo", price: 299, note: "6 pcs" },
      { name: "Chili Paneer Dry", price: 309 },
      { name: "Honey Chily Potato", price: 289 },
      { name: "Crispy Veggies", price: 229 },
      { name: "Veg Manchurian Dry", price: 219 },
      { name: "Riko's Veg Platter", price: 389, note: "8 pcs" },
      { name: "Riko's Non-Veg Platter", price: 449, note: "8 pcs" },
    ],
  },
  {
    id: "drinks",
    group: "Drinks",
    title: "Drinks",
    img: "menu-drinks.jpg",
    items: [
      { name: "Masala Cold Drink", price: 90 },
      { name: "Fresh Lime Soda", price: 80 },
      { name: "Watermelon Lime Soda", price: 149 },
      { name: "Cranberry Lime Soda", price: 169 },
      { name: "Barddhaman Blueberry", price: 205 },
      { name: "Juice (as per availability)", price: 80 },
      { name: "Mineral Water", price: 28 },
    ],
  },
  {
    id: "mocktails",
    group: "Drinks",
    title: "Mocktails",
    img: "dish-mocktail.jpg",
    items: [
      { name: "Mojito", price: 219, note: "Virgin / Watermelon / Cranberry" },
      { name: "Deep Blue Sea", price: 205 },
      { name: "Blushing Bride", price: 219 },
      { name: "Watermelon Punch", price: 195 },
      { name: "Honeymoon", price: 205 },
      { name: "Virgin Colada", price: 240 },
      { name: "Rock On The Beach", price: 249 },
      { name: "Pink Lady", price: 205 },
      { name: "Strawberry Punch", price: 195 },
      { name: "Mango Blossom", price: 239 },
      { name: "Pineapple Blossom", price: 239 },
      { name: "Bee's Kiss", price: 239 },
      { name: "Sun Rise", price: 195 },
    ],
  },
]

const galleryItems = [
  { src: "rikos-main-hall.webp.asset.json", alt: "Riko's main dining hall with signature ceiling" },
  { src: "rikos-neon-green.webp.asset.json", alt: "'Let's Get Social' neon on green wall" },
  { src: "rikos-wings.webp.asset.json", alt: "Neon wings art installation" },
  { src: "rikos-panorama.webp.asset.json", alt: "Panoramic view of the restro-lounge" },
  { src: "dish-indian.jpg", alt: "Indian dish plating" },
  { src: "rikos-neon-brick.webp.asset.json", alt: "Neon quote on exposed brick wall" },
  { src: "rikos-window-seating.webp.asset.json", alt: "Window-side seating with city light" },
  { src: "dish-mocktail.jpg", alt: "Signature mocktail" },
]

async function ensureBucketsExist() {
  console.log("Checking storage buckets...")
  const { data: existingBuckets } = await supabaseAdmin.storage.listBuckets()
  const existingNames = existingBuckets?.map(b => b.name) || []
  
  for (const bucketName of Object.values(BUCKETS)) {
    if (!existingNames.includes(bucketName)) {
      console.log(`Creating missing bucket: ${bucketName}`)
      await supabaseAdmin.storage.createBucket(bucketName, { public: true })
    }
  }
}

async function seed() {
  console.log("Starting data migration...")
  await ensureBucketsExist()
  
  // 1. Process Menu Categories and Items
  for (let i = 0; i < menuSections.length; i++) {
    const section = menuSections[i]
    console.log(`Processing Menu Section: ${section.title}`)
    
    const imageUrl = await processImage(section.img, 'menu')
    
    const category = await db.menuCategory.upsert({
      where: { slug: section.id },
      update: {
        name: section.title,
        description: section.subtitle,
        imageUrl,
        sortOrder: i,
      },
      create: {
        name: section.title,
        slug: section.id,
        description: section.subtitle,
        imageUrl,
        sortOrder: i,
      }
    })

    console.log(`- Inserted Category: ${category.name}. Adding ${section.items.length} items...`)
    
    for (let j = 0; j < section.items.length; j++) {
      const item = section.items[j]
      await db.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          price: item.price,
          description: item.note,
          sortOrder: j,
          isVeg: section.group === 'Vegetarian & Platters' || item.name.includes('Paneer') || item.name.includes('Veg'),
          isChefSpecial: item.note?.includes('Signature') || false,
        }
      })
    }
  }

  // 2. Process Gallery Images
  console.log("Processing Gallery...")
  // Clean old gallery images to avoid duplicates if run multiple times
  await db.galleryImage.deleteMany()
  
  for (let i = 0; i < galleryItems.length; i++) {
    const item = galleryItems[i]
    console.log(`- Uploading gallery image: ${item.src}`)
    const url = await processImage(item.src, 'gallery')
    
    await db.galleryImage.create({
      data: {
        url,
        alt: item.alt,
        sortOrder: i,
      }
    })
  }
  
  console.log("Migration complete!")
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0))
