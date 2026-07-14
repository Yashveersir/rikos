const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const img = await prisma.galleryImage.create({
      data: {
        url: 'test.jpg',
        alt: 'test',
        category: 'test'
      }
    })
    console.log('Created img:', img.id)
    
    await prisma.galleryImage.delete({ where: { id: img.id } })
    console.log('Deleted successfully')
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
